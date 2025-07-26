import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop'
import { Router } from '@angular/router';
import { EventClient } from '@bailapp/http/clients';
import { EventCard } from '@bailapp/components';
import { BlapEvent } from '@bailapp/models/event';

@Component({
  imports: [ EventCard ],
  templateUrl: './list.html',
  host: { class: 'contents' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class List {
  private eventResponses = toSignal(inject(EventClient).list());
  private router = inject(Router);

  protected events = computed(() => this.eventResponses()?.map(ev => new BlapEvent(ev)) || []);
  protected onCardTap = (id: number) => this.router.navigateByUrl(`${id}`);
}
