import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

interface DanceTypeResponse {
  id: number;
  type_name: string;
}

@Injectable({ providedIn: 'root' })
export class DanceTypesClient {
  private http = inject(HttpClient);

  list(): Observable<DanceTypeResponse[]> {
    return this.http.get<DanceTypeResponse[]>(`${environment.apiUrl}/dance-types`);
  }
}
