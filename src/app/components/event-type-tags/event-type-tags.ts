import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { APP_STATE } from '@bailapp/app.state';

type EventTypeObject = {
  id: number;
  type: string;
  selected: boolean;
}

@Component({
  selector: 'event-type-tags',
  template: `
    <div event-type-tags class="flex gap-x-1">
      @for (eventType of eventEventTypes(); track eventType.id) {
        <span
          [style.--event-type-tags__bg-color]="eventType.selected ? '#464646' : 'none'"
          class="bg-(--event-type-tags__bg-color) px-1 rounded-md"
          [class.cursor-pointer]="editMode()"
          (click)="tagClicked.emit(eventType.id)"
        >
          {{ eventType.type }}
        </span>
      }
    </div>
  `,
  host: { class: 'contents' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventTypeTags {
  eventTypeIds = input<number[]>([]);
  editMode = input(false);
  tagClicked = output<number>();

  private eventTypes = APP_STATE.eventTypes;

  protected eventEventTypes = computed(() => {
    const showAll = this.editMode();

    if (showAll) {
      return Object.keys(this.eventTypes()).map(eventTypeId => this.eventTypeObject(+eventTypeId));
    }
    return this.eventTypeIds().map(eventTypeId => this.eventTypeObject(eventTypeId));
  });

  private eventTypeObject(id: number): EventTypeObject {
    const type = this.eventTypes()[id];
    const selected = this.eventTypeIds()?.includes(id);
    return { id, type, selected };
  }
}
