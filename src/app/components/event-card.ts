import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { APP_STATE } from '@bailapp/app.state';
import { BlapEvent } from '@bailapp/models/event';

@Component({
  selector: 'event-card',
  templateUrl: './event-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class EventCard {
  event = input.required<BlapEvent>();
  cardTap = output<void>();

  protected state = APP_STATE;

  protected openGMapsLink(uri: string): void {
    window.open(`https://www.google.com/maps/search/?api=1&query=${uri}`, '_blank');
  }
}
