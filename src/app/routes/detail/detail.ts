import { DatePipe, Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, linkedSignal, signal, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { APP_STATE } from '@bailapp/app.state';
import { EventClient } from '@bailapp/http/clients';
import { ReadEditInput } from '@bailapp/components';
import { BlapEvent } from '@bailapp/models/event';
import { EventCard } from "../../components/event-card/event-card";
import { openLink } from '@bailapp/helpers/g-maps';
import { DanceTypePills } from "@bailapp/components/dance-type-pills/dance-type-pills";
import { EventTypeTags } from "@bailapp/components/event-type-tags/event-type-tags";
import { of } from 'rxjs';

@Component({
  templateUrl: './detail.html',
  imports: [DatePipe, ReadEditInput, EventCard, DanceTypePills, EventTypeTags],
  host: { class: 'contents' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Detail {
  private router = inject(Router);
  private routeData = toSignal(inject(ActivatedRoute).data) as Signal<{ event: BlapEvent }>;
  private location = inject(Location);
  private eventClient = inject(EventClient);
  protected state = APP_STATE;

  protected editing = linkedSignal(() => {
    const tokenized = this.state.token();
    const event = this.event();
    return tokenized != null && !event.id;
  });
  protected event = linkedSignal(() => {
    const { event } = this.routeData();

    if (!event && this.state.token()) {
      return new BlapEvent();
    }

    return event;
  });
  protected showAdminCardPreview = linkedSignal(() => this.state.token() != null);

  protected goBack = (): void => this.location.back();
  protected openGMapsLink = openLink;

  protected editDanceTypes(id: number) {
    if (!this.editing()) return;

    const types = this.event()!.danceTypeIds;
    if (types.includes(id)) {
      this.event()!.danceTypeIds = types.filter(typeId => typeId !== id);
    } else {
      this.event()!.danceTypeIds = types.concat([id]);
    }
  }

  protected editEventType(id: number) {
    if (!this.editing()) return;

    const types = this.event()!.eventTypeIds;
    if (types.includes(id)) {
      this.event()!.eventTypeIds = types.filter(typeId => typeId !== id);
    } else {
      this.event()!.eventTypeIds = types.concat(id);
    }
  }

  protected sendEvent(): void {
    if (confirm('Seguro?')) {
      const event = this.event();
      const createOrUpdateRequest = event.id ? this.eventClient.update(event) : this.eventClient.create(event);
      if (event) {
        createOrUpdateRequest.subscribe((updatedEvent) => {
          this.editing.set(!this.editing());
          this.event.set(updatedEvent);
        });
      }
    }
  }

  protected onCancelEdit() {
    const event = this.event();
    if (!event.id) {
      this.router.navigateByUrl('events');
      return;
    }
    this.editing.set(!this.editing());
  }

  protected deleteEvent(): void {
    if (confirm('Seguro quieres borrar? para revertir hay que hablar con los desarrolladores')) {
      const eventId = this.event().id;
      const deleteRequest = eventId ? this.eventClient.delete(eventId) : of(undefined);
      deleteRequest.subscribe(() => {
        confirm(`Evento ${eventId || 'nuevo'} borrado`);
        this.router.navigateByUrl('events');
      });
    }
  }
}
