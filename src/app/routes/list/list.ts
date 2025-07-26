import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop'
import { Router } from '@angular/router';
import { EventClient } from '@bailapp/http/clients';
import { EventCard } from '@bailapp/components';
import { BlapEvent } from '@bailapp/models/event';
import { APP_STATE } from '@bailapp/app.state';

@Component({
  imports: [EventCard],
  templateUrl: './list.html',
  host: { class: 'contents' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class List {
  private router = inject(Router);
  protected tokenized = APP_STATE.token;
  protected events = toSignal(inject(EventClient).list());

  protected onCardTap = (id: number | string) => this.router.navigateByUrl(`events/${id}`);
}
