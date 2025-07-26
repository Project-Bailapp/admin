import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

interface EventType {
  id: number;
  typeName: string;
}

@Injectable({ providedIn: 'root' })
export class EventTypesClient {
  private http = inject(HttpClient);

  list(): Observable<EventType[]> {
    return this.http.get<EventType[]>(`${environment.apiUrl}/event-types`);
  }

  create(typeName: string): Observable<EventType> {
    return this.http.post<EventType>(`${environment.apiUrl}/event-types`, typeName);
  }

  update({ id, typeName }: EventType): Observable<EventType> {
    return this.http.put<EventType>(`${environment.apiUrl}/event-types/${id}`, typeName);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/event-types/${id}`);
  }
}
