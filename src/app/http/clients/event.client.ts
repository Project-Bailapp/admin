import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BlapEvent } from '@bailapp/models/event';

@Injectable({ providedIn: 'root' })
export class EventClient {
  private http = inject(HttpClient);

  get(id: string): Observable<BlapEvent> {
    return this.http.get<BlapEvent>(`${environment.apiUrl}/events/${id}`);
  }

  list(): Observable<BlapEvent[]> {
    return this.http.get<BlapEvent[]>(`${environment.apiUrl}/events`);
  }

  create(event: BlapEvent): Observable<BlapEvent> {
    return this.http.post<BlapEvent>(`${environment.apiUrl}/events`, event);
  }

  update(event: BlapEvent): Observable<BlapEvent> {
    return this.http.put<BlapEvent>(`${environment.apiUrl}/events/${event.id}`, event);
  }

  delete(eventId: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/events/${eventId}`);
  }
}
