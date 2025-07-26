import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
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
  id = input<number>();
  title = input<string>();
  bannerUrl = input<string>();
  description = input<string>();
  price = input<number>();
  location = input<string>('');
  danceTypeIds = input<number[]>([]);
  eventTypeIds = input<number[]>([]);
  eventDate = input<string>();
  updated = input<string>();
  event = input<BlapEvent>();
  cardTap = output<void>();

  protected openGMapsLink = openLink;
}
