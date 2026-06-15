import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timeout } from 'rxjs';
import { environment } from '../../../environments/environment';

const REQUEST_TIMEOUT_MS = 15000;

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  readonly baseUrl = environment.apiUrl;

  get<T>(path: string) {
    return this.http.get<T>(`${this.baseUrl}${path}`).pipe(timeout(REQUEST_TIMEOUT_MS));
  }

  post<T>(path: string, body: unknown) {
    return this.http.post<T>(`${this.baseUrl}${path}`, body).pipe(timeout(REQUEST_TIMEOUT_MS));
  }

  put<T>(path: string, body: unknown) {
    return this.http.put<T>(`${this.baseUrl}${path}`, body).pipe(timeout(REQUEST_TIMEOUT_MS));
  }

  patch<T>(path: string, body: unknown) {
    return this.http.patch<T>(`${this.baseUrl}${path}`, body).pipe(timeout(REQUEST_TIMEOUT_MS));
  }

  delete<T>(path: string) {
    return this.http.delete<T>(`${this.baseUrl}${path}`).pipe(timeout(REQUEST_TIMEOUT_MS));
  }
}
