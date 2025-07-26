import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

interface EventTypeResponse {
  id: number;
  type_name: string;
}

@Injectable({ providedIn: 'root' })
export class EventTypesClient {
  private http = inject(HttpClient);

  list(): Observable<EventTypeResponse[]> {
    return this.http.get<EventTypeResponse[]>(`${environment.apiUrl}/event-types`);
  }
}
