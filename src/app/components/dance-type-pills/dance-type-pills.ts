import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { APP_STATE } from '@bailapp/app.state';
import { colorByType } from './dance-type-pills.colors';

type DanceTypePillObject = {
  id: number;
  type: string;
  color: string;
  selected: boolean;
}

@Component({
  selector: 'dance-type-pills',
  template: `
    <div dance-type-pills class="flex gap-x-2 flex-wrap">
      @for (danceType of eventDanceTypes(); track danceType.id) {
        @let selected = danceTypeIds().includes(danceType.id);

        <div [style.--dance-type-pills__color]="selected ? danceType.color : '#3a3b40'"
          class="relative cursor-default
          w-6 h-6 rounded-full text-center font-bold
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
