import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { APP_STATE } from '@bailapp/app.state';
import { openLink } from '@bailapp/helpers/g-maps';
import { BlapEvent } from '@bailapp/models/event';
import { DanceTypePills } from "../dance-type-pills/dance-type-pills";
import { EventTypeTags } from "../event-type-tags/event-type-tags";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'event-card',
  templateUrl: './event-card.html',
  imports: [DatePipe, DanceTypePills, EventTypeTags],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class EventCard {
  event = input.required<BlapEvent>();
  cardTap = output<void>();
  protected state = APP_STATE;
  protected openGMapsLink = openLink;
}
