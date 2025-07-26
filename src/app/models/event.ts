import { EventResponse } from '@bailapp/http/clients';

export class BlapEvent {
  title: string;
  location: string;
  price: number;
  eventDate: string;
  eventTypes: number[];
  danceTypes: number[];
  created: string;
  updated: string;

  id?: number;
  description?: string;
  bannerUrl?: string;

  constructor(eventResponse: EventResponse) {
    const { id, description, location, price, event_date, banner_url, event_type_ids, dance_type_ids, title, created, updated } = eventResponse;
    this.id = id;
    this.title = title;
    this.description = description || '';
    this.location = location;
    this.price = price || 0;
    this.eventDate = event_date;
    this.eventTypes = event_type_ids;
    this.danceTypes = dance_type_ids;
    this.bannerUrl = banner_url;
    this.created = created;
    this.updated = updated;
  }

  asEventResponse(): EventResponse {
    if (!this.id) {
      throw Error('Trying to create an EvenResponse without an id');
    }

    return {
      id: this.id,
      title: this.title,
      description: this.description,
      location: this.location,
      price: this.price,
      event_date: this.eventDate,
      event_type_ids: this.eventTypes,
      dance_type_ids: this.danceTypes,
      banner_url: this.bannerUrl,
      created: this.created,
      updated: this.updated,
    }
  }
}
