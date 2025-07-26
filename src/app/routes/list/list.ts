import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop'
import { APP_STATE } from '@bailapp/app.state';
import { EventClient } from '@bailapp/clients';
import { EventCard } from '@bailapp/components/event-card';
import { BlapEvent } from '@bailapp/models/event';

@Component({
  templateUrl: './list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [EventCard],
  host: { class: 'contents' },
})
export class List {
  private eventResponses = toSignal(inject(EventClient).list());
  protected state = APP_STATE;
  protected events = computed(() => this.eventResponses()?.map(ev => new BlapEvent(ev)) || []);
}
