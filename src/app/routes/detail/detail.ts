import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { APP_STATE } from '@bailapp/app.state';
import { EventResponse } from '@bailapp/clients';
import { BlapEvent } from '@bailapp/models/event';

@Component({
  template: `
    @if (event(); as event) {
      <div>
        <p>{{event.id}}</p>
        <p>{{event.bannerUrl}}</p>
        <p>{{event.created.toLocaleString()}}</p>
        <p>{{event.description}}</p>
        <p>{{event.eventDate.toLocaleString()}}</p>
        <p>{{event.location}}</p>
        <p>{{event.price}}</p>
        <p>{{event.title}}</p>
        <p>{{event.updated.toLocaleString()}}</p>
        <p>
          @for (eType of event.eventTypes; track eType) {
            <span>{{ state.eventTypes()[eType] }}, </span>
          }
        </p>
        <p>
          @for (dType of event.danceTypes; track dType) {
            <span>{{ state.danceTypes()[dType] }}, </span>
          }
        </p>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'content' },
})
export class Detail {
  private routeData = toSignal(inject(ActivatedRoute).data) as Signal<{ eventResponse: EventResponse }>;

  protected state = APP_STATE;
  protected event = computed(() => {
    const { eventResponse } = this.routeData();

    if (eventResponse) {
      return new BlapEvent(eventResponse);
    }

    return null;
  })
}
