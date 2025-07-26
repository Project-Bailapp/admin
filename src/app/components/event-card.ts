import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { APP_STATE } from '@bailapp/app.state';
import { BlapEvent } from '@bailapp/models/event';

@Component({
  selector: 'event-card',
  templateUrl: './event-card.html',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class EventCard {
  event = input.required<BlapEvent>();

  protected state = APP_STATE;

  protected openGMapsLink(uri: string): void {
    window.open(`https://www.google.com/maps/search/?api=1&query=${uri}`, '_blank');
  }
}
