import { signal } from '@angular/core';

// I suspect this is not scalable
class BlapState {
  eventTypes = signal<{ [id: number]: string }>({});
  danceTypes = signal<{ [id: number]: string }>({});
}

export const APP_STATE = new BlapState();
