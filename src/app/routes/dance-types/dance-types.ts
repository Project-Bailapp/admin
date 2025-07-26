import { ChangeDetectionStrategy, Component, effect, inject, linkedSignal, signal } from '@angular/core';
import { Router } from '@angular/router';
import { APP_STATE } from '@bailapp/app.state';
import { ReadEditInput } from "../../components/read-edit-input/read-edit-input";
import { DanceTypesClient } from '@bailapp/http';
import { colorByType } from '@bailapp/components/dance-type-pills/dance-type-pills.colors';

@Component({
  template: `
    <h1 class="w-full text-2xl font-bold text-center py-1 bg-gray-950 sticky top-0 z-2">
      Tipos de baile
    </h1>
    <div class="flex flex-col gap-2 items-stretch">
      @for (danceType of danceTypes(); track danceType.id; let idx = $index) {
        @let eventEditing = danceType.id ? editing()[danceType.id] : true;

        <div class="flex gap-1 hover:bg-gray-900 transition rounded-sm p-2 items-center">
          <span class="text-gray-400 basis-10">[{{ danceType.id || 'new' }}]</span>
          <span class="w-4 h-4 bg-green-900 rounded-full"
            [style.background-color]="colorByType[idx]"></span>
          <read-edit-input
            class="*:grow-1"
            [editMode]="eventEditing"
            [value]="danceType.name"
            (valueChange)="danceTypeEdit({ id: danceType.id, newValue: $event })"
          />
          @if (!danceType.id) {
            <button class="rounded-full bg-cyan-800 hove:bg-cyan-800 hover:bg-cyan-600 p-1 cursor-pointer [&[disabled]]:opacity-50 [&[disabled]]:bg-gray-800"
              [disabled]="!danceType.name"
              (click)="submitChange(danceType)">
              ➕
            </button>
          } @else if (eventEditing) {
            <button class="rounded-full bg-emerald-900 hover:bg-emerald-800 p-1 cursor-pointer [&[disabled]]:opacity-50 [&[disabled]]:bg-gray-800"
              [disabled]="!danceType.name"
              (click)="submitChange(danceType)">
              ✅
            </button>
            <button class="rounded-full bg-gray-950 hover:bg-gray-700 p-1 cursor-pointer"
              (click)="cancelChanges(danceType.id)">
              ✖️
            </button>
          } @else {
            <button class="rounded-full hover:bg-yellow-800 p-1 cursor-pointer"
              (click)="toggleEdit(danceType.id)">
              ✏️
            </button>
            <button class="rounded-full bg-red-900 hover:bg-red-700 p-1 cursor-pointer"
              (click)="deleteEvent(danceType.id)">
              🗑️
            </button>
          }
        </div>
      }
    </div>
  `,
  host: { class: 'contents'},
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReadEditInput],
})
export class DanceTypes {
  private router = inject(Router);
  private danceTypeClient = inject(DanceTypesClient);
  protected danceTypes = linkedSignal(() => {
    const dTypes = APP_STATE.danceTypes();
    const danceTypes = Object.entries(dTypes).map(([id, name]) => ({ id, name }));
    danceTypes.push({ id: '', name: '' });
    return danceTypes;
  });

  protected editing = signal<{[id: string]: boolean}>({});
  protected colorByType = colorByType;

  constructor() {
    effect(() => {
      const token = APP_STATE.token();
      if (!token) {
        this.router.navigateByUrl('/events');
      }
    })
  }

  protected toggleEdit(id: string | number): void {
    this.editing.update(editMap => {
      return {
        ...editMap,
        [id]: !editMap[id],
      };
    })
  }

  protected danceTypeEdit({id, newValue}: { id: string | number, newValue: string}): void {
    this.danceTypes.update(danceTypes => danceTypes.map(danceType => {
      if (danceType.id === id) {
        return { id, name: newValue };
      }

      return danceType;
    }))
  }

  protected submitChange({ id, name }: { id: string; name: string }): void {
    if (!confirm(id ? 'Crear?' : 'Actualizar?')) return;

    const preValue = APP_STATE.danceTypes()[+id];
    if (name === preValue) {
      this.toggleEdit(id);
      return;
    }

    const clientRequest = id ? this.danceTypeClient.update({ id: +id, typeName: name }) : this.danceTypeClient.create(name);

    clientRequest.subscribe(({ id: responseId, typeName }) => {
      APP_STATE.danceTypes.update(danceTypes => {
        return {
          ...danceTypes,
          [responseId]: typeName,
        };
      });
      if (id) this.toggleEdit(id);
    });
  }

  protected cancelChanges(id: string) {
    const prevValue = APP_STATE.danceTypes()[+id];
    this.danceTypeEdit({ id, newValue: prevValue });
    this.toggleEdit(id);
  }

  protected deleteEvent(id: string) {
    if (!confirm('Borrar?')) return;
    this.danceTypeClient.delete(id).subscribe(() => {
      APP_STATE.danceTypes.update(danceTypes => {
        delete danceTypes[+id];
        return { ...danceTypes };
      });
    });
  }
}
