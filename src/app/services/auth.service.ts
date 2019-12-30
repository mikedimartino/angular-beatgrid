import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs/index';
import { ApiService } from './api.service';
import { tap } from 'rxjs/internal/operators/tap';
import { LoginResponse } from '../shared/api-types';
import { StoreService } from './store.service';

import * as moment from 'moment';

const EXPIRES_AT_KEY = 'expires_at';
const TOKEN_KEY = 'token';
const USERNAME_KEY = 'username';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private api: ApiService,
              private store: StoreService) {
  }

  // https://blog.angular-university.io/angular-jwt-authentication/
  logIn(username: string, password: string): Observable<LoginResponse> { // TODO: Rename to login
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

  private setSession(loginResponse: LoginResponse): void {
    const expiresAt = moment.utc().add(loginResponse.expiresIn, 'second').valueOf();
    this.store.setExpiresAt(expiresAt);
    this.store.setToken(loginResponse.token);
    this.store.setUsername(loginResponse.username);
  }
}
