import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Beat } from '../shared/models/beat.model';
import { Observable } from 'rxjs/index';
import { map } from 'rxjs/internal/operators';
import { Api } from '../shared/api-types';
import { MapService } from './map.service';

const OLD_API_URL = 'https://xudngyebm8.execute-api.us-west-2.amazonaws.com/dev';
const BASE_API_URL = 'https://localhost:44391/v1';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient,
              private mapper: MapService) {
  }

  readBeats(): Observable<Beat[]> {
    return this.http.get<Api.GetBeatsResponse>(BASE_API_URL + '/beat').pipe(
      map(beatsResponse => beatsResponse.beats.map(apiBeat => this.mapper.mapApiBeatToGridBeat(apiBeat)))
    );
  }

  createBeat(beat: Beat): Observable<Beat> {
    const apiBeat = this.mapper.mapGridBeatToApiBeat(beat);
    return this.http.post<Beat>(BASE_API_URL + '/beat', apiBeat);
  }

  updateBeat(gridBeat: Beat): Observable<Beat> {
    const apiBeat = this.mapper.mapGridBeatToApiBeat(gridBeat);
    return this.http.put<Beat>(BASE_API_URL + '/beat', apiBeat);
  }

  deleteBeat(id: string): Observable<any> {
    return this.http.delete(`${BASE_API_URL}/beat/${id}`);
  }

  readSoundsByFolder(folder: string): Observable<any> {
    return this.http.get(`${OLD_API_URL}/sounds?folder=${folder}`);
  }

  downloadSound(key: string): Observable<any> {
    return this.http.get(`${OLD_API_URL}/sound?key=${key}`);
  }

  login(username: string, password: string): Observable<Api.LoginResponse> {
    const body: Api.LoginRequest = { username, password };
    return this.http.post<Api.LoginResponse>(BASE_API_URL + '/auth/login', body);
  }
}
