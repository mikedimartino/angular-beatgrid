import { Injectable } from '@angular/core';

const USERNAME_KEY = 'beatgrid_username';
const TOKEN_KEY = 'beatgrid_token';
const EXPIRES_AT_KEY = 'beatgrid_expires_at';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor() {}

  setUsername(value: string): void {
    value ? localStorage.setItem(USERNAME_KEY, value) : localStorage.removeItem(USERNAME_KEY);
  }
  getUsername(): string {
    return localStorage.getItem(USERNAME_KEY);
  }

  setToken(value: string): void {
    this.setOrRemove(TOKEN_KEY, value);
    value ? localStorage.setItem(TOKEN_KEY, value) : localStorage.removeItem(TOKEN_KEY);
  }
  getToken(): string {
    return localStorage.getItem(TOKEN_KEY);
  }

  setExpiresAt(value: number): void {
    this.setOrRemove(EXPIRES_AT_KEY, value ? String(value) : null);
  } 
  getExpiresAt(): number {
    return +localStorage.getItem(EXPIRES_AT_KEY);
  }

  private setOrRemove(key: string, value: string) {
    value ? localStorage.setItem(key, String(value)) : localStorage.removeItem(key);
  }

}
