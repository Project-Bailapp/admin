import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BlapEvent } from '@bailapp/models/event';

export interface EventResponse {
  id: number;
  title: string;
  event_date: string;
  location: string;
  created: string;
  updated: string;
  event_type_ids: number[];
  dance_type_ids: number[];
  price?: number;
  description?: string;
  banner_url?: string;
  deleted?: string;
}

@Injectable({ providedIn: 'root' })
export class EventClient {
  private http = inject(HttpClient);

  get(id: string): Observable<EventResponse> {
    return this.http.get<EventResponse>(`${environment.apiUrl}/events/${id}`);
  }

  list(): Observable<EventResponse[]> {
    return this.http.get<EventResponse[]>(`${environment.apiUrl}/events`);
  }

  update(event: BlapEvent): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/events/${event.id}`, event.asEventResponse());
  }
}
