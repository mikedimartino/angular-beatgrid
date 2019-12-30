import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Beat } from '../shared/models/beat.model';
import { Observable } from 'rxjs/index';
import { BeatDbRow } from '../shared/interfaces';
import { map } from 'rxjs/internal/operators';
import { LoginResponse, LoginRequest } from '../shared/api-types';
import { StoreService } from './store.service';

const OLD_API_URL = 'https://xudngyebm8.execute-api.us-west-2.amazonaws.com/dev';
const BASE_API_URL = 'https://localhost:44391/v1';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient,
              private store: StoreService) {
  }

  readBeats(): Observable<Beat[]> {
    return this.http.get<BeatDbRow[]>(OLD_API_URL + '/beats').pipe(
      map(rows => {
        const beats: Beat[] = [];
        rows.forEach(row => {
          try {
            let beat = JSON.parse(row.json);
            beat = Beat.decompressFromStorage(beat);
            beat.id = row.id;
            beats.push(beat);
          } catch (e) {
            console.error('Failed to parse beat: ', row);
            this.deleteBeat(row.id).subscribe(() => {
              console.log('Deleted invalid beat ' + row.id);
            });
          }
        });
        return beats;
      })
    );
  }

  createBeat(beat: Beat): Observable<Beat> {
    const headers = new HttpHeaders().set('Authorization', this.store.getToken());
    const options = { headers: headers };
    const body = {
      name: beat.name,
      json: JSON.stringify(Beat.compressForStorage(beat))
    };

    return this.http.post<Beat>(OLD_API_URL + '/beats', body, options);
  }

  updateBeat(beat: Beat): Observable<Beat> {
    const headers = new HttpHeaders().set('Authorization', this.store.getToken());
    const options = { headers: headers };
    const body = {
      id: beat.id,
      name: beat.name,
      json: JSON.stringify(Beat.compressForStorage(beat))
    };

    return this.http.put<Beat>(OLD_API_URL + '/beats', body, options);
  }

  deleteBeat(id: number): Observable<any> { // What is the response type actually?
    const headers = new HttpHeaders().set('Authorization', this.store.getToken());
    const options = { headers: headers };
    return this.http.delete(`${OLD_API_URL}/beats?id=${id}`, options);
  }

  readSoundsByFolder(folder: string): Observable<any> {
    return this.http.get(`${OLD_API_URL}/sounds?folder=${folder}`);
  }

  downloadSound(key: string): Observable<any> {
    return this.http.get(`${OLD_API_URL}/sound?key=${key}`);
  }

  login(username: string, password: string): Observable<LoginResponse> {
    const body: LoginRequest = { username, password };
    return this.http.post<LoginResponse>(BASE_API_URL + '/auth/login', body);
  }
}
