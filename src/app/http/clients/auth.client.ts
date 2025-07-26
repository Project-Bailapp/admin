import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthClient {
  private http = inject(HttpClient);

  sendToken(token: string): Observable<HttpResponse<Object>> {
    const options = { observe: 'response' } as const;
    return this.http.post(`${environment.apiUrl}/auth`, token, options);
  }
}
