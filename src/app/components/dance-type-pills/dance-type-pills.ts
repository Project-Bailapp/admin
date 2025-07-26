import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { APP_STATE } from '@bailapp/app.state';

// todo: to be done in an actual DB
const colorByType = {
  1: '#8f1500',
  2: '#03b6fc',
  3: '#40008f',
  4: '#7a5a01',
} as { [type: number]: string };

type DanceTypePillObject = {
  id: number;
  type: string;
  color: string;
  selected: boolean;
}

@Component({
  selector: 'dance-type-pills',
  template: `
    <div dance-type-pills class="flex gap-x-2">
      @for (danceType of eventDanceTypes(); track danceType.id) {
        @let selected = danceTypeIds().includes(danceType.id);

        <div [style.--dance-type-pills__color]="selected ? danceType.color : '#3a3b40'"
          class="relative cursor-default
          w-8 h-8 rounded-full text-center font-bold text-xl
          bg-(--dance-type-pills__color)
          hover:[&>.dance-type-tooltip]:block"
          [class.cursor-pointer]="editMode()"
          (click)="typeClicked.emit(danceType.id)">
          {{ danceType.type[0] }}

          <div class="dance-type-tooltip hidden absolute
            leading-none top-6 right-6 p-1.5 rounded-md
            ring bg-(--dance-type-pills__color)">
            {{ danceType.type }}
          </div>
        </div>
      }
    </div>
  `,
  host: { class: 'contents' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DanceTypePills {
  danceTypeIds = input<number[]>([]);
  editMode = input(false);
  typeClicked = output<number>();

  private danceTypes = APP_STATE.danceTypes;

  protected eventDanceTypes = computed<DanceTypePillObject[]>(() => {
    const showAll = this.editMode();

    if (showAll) {
      return Object.keys(this.danceTypes()).map(danceTypeId => this.danceTypePillObject(+danceTypeId))
    }
    return this.danceTypeIds().map(danceTypeId => this.danceTypePillObject(danceTypeId));
  });

  private danceTypePillObject(id: number): DanceTypePillObject {
    const type = this.danceTypes()[id];
    const color = colorByType[id];
    const selected = this.danceTypeIds().includes(id);
    return { id, type, color, selected };
  }
}
