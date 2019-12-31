import * as moment from 'moment';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs/index';
import { ApiService } from './api.service';
import { tap } from 'rxjs/internal/operators/tap';
import { StoreService } from './store.service';
import { Api } from '../shared/api-types';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private api: ApiService,
              private store: StoreService) {
  }

  // https://blog.angular-university.io/angular-jwt-authentication/
  logIn(username: string, password: string): Observable<Api.LoginResponse> {
    return this.api.login(username, password).pipe(
      tap(result => {
        this.setSession(result);
      })
    );
  }

  isLoggedIn(): boolean {
    const expiration = this.store.getExpiresAt();
    const now = moment.utc().valueOf();
    return now < expiration;
  }

  logOut(): void {
    this.store.setToken(null);
    this.store.setExpiresAt(null);
    this.store.setUsername(null);
  }

  private setSession(loginResponse: Api.LoginResponse): void {
    const expiresAt = moment.utc().add(loginResponse.expiresIn, 'second').valueOf();
    this.store.setExpiresAt(expiresAt);
    this.store.setToken(loginResponse.token);
    this.store.setUsername(loginResponse.username);
  }
}
