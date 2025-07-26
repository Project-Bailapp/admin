import { DatePipe, Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, linkedSignal, signal, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { APP_STATE } from '@bailapp/app.state';
import { EventClient, EventResponse } from '@bailapp/http/clients';
import { ReadEditInput } from '@bailapp/components';
import { BlapEvent } from '@bailapp/models/event';
import { EventCard } from "../../components/event-card/event-card";
import { openLink } from '@bailapp/helpers/g-maps';
import { DanceTypePills } from "@bailapp/components/dance-type-pills/dance-type-pills";
import { EventTypeTags } from "@bailapp/components/event-type-tags/event-type-tags";

@Component({
  templateUrl: './detail.html',
  imports: [DatePipe, ReadEditInput, EventCard, DanceTypePills, EventTypeTags],
  host: { class: 'contents' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Detail {
  private routeData = toSignal(inject(ActivatedRoute).data) as Signal<{ eventResponse: EventResponse }>;
  private location = inject(Location);
  private eventClient = inject(EventClient);

  protected editing = signal(false);
  protected state = APP_STATE;
  protected event = linkedSignal(() => {
    const { eventResponse } = this.routeData();

    if (eventResponse) {
      return new BlapEvent(eventResponse);
    }
    return null;
  });
  protected showAdminCardPreview = linkedSignal(() => this.state.token() != null);

  protected goBack = (): void => this.location.back();
  protected openGMapsLink = openLink;

  protected editDanceTypes(id: number) {
    if (!this.editing()) return;

    const types = this.event()!.danceTypes;
    if (types.includes(id)) {
      this.event()!.danceTypes = types.filter(typeId => typeId !== id);
    } else {
      this.event()!.danceTypes.push(id);
    }
  }

  protected editEventType(id: number) {
    if (!this.editing()) return;

    const types = this.event()!.eventTypes;
    if (types.includes(id)) {
      this.event()!.eventTypes = types.filter(typeId => typeId !== id);
    } else {
      this.event()!.eventTypes = types.concat(id);
    }
  }

  protected updateEvent(): void {
    if (confirm('Seguro?')) {
      const event = this.event();
      if (event) {
        this.eventClient.update(event).subscribe((updatedEvent) => {
          this.editing.set(!this.editing());
          this.event.set(new BlapEvent(event.asEventResponse()));
        });
      }
    }
  }
}
