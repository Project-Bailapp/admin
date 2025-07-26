import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

interface DanceType {
  id: number;
  typeName: string;
}

@Injectable({ providedIn: 'root' })
export class DanceTypesClient {
  private http = inject(HttpClient);

  list(): Observable<DanceType[]> {
    return this.http.get<DanceType[]>(`${environment.apiUrl}/dance-types`);
  }

  create(typeName: string): Observable<DanceType> {
    return this.http.post<DanceType>(`${environment.apiUrl}/dance-types`, typeName);
  }

  update({ id, typeName }: DanceType): Observable<DanceType> {
    return this.http.put<DanceType>(`${environment.apiUrl}/dance-types/${id}`, typeName);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/dance-types/${id}`);
  }
}
