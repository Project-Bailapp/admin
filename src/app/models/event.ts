import { EventResponse } from '@bailapp/clients';

export class BlapEvent {
  id: number;
  title: string;
  description: string;
  location: string;
  price: number;
  eventDate: Date;
  eventTypes: number[];
  danceTypes: number[];
  bannerUrl?: string;
  created: Date;
  updated: Date;

  constructor(eventResponse: EventResponse) {
    const { id, description, location, price, event_date, banner_url, event_type_ids, dance_type_ids, title, created, updated } = eventResponse;
    this.id = id;
    this.title = title;
    this.description = description || '';
    this.location = location;
    this.price = price || 0;
    this.eventDate = new Date(event_date);
    this.eventTypes = event_type_ids;
    this.danceTypes = dance_type_ids;
    this.bannerUrl = banner_url;
    this.created = new Date(created);
    this.updated = new Date(updated);
  }
}
