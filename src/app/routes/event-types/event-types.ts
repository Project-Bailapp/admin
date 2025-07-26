import { ChangeDetectionStrategy, Component, effect, inject, linkedSignal, signal } from '@angular/core';
import { Router } from '@angular/router';
import { APP_STATE } from '@bailapp/app.state';
import { ReadEditInput } from "../../components/read-edit-input/read-edit-input";
import { EventTypesClient } from '@bailapp/http';

@Component({
  template: `
    <h1 class="w-full text-2xl font-bold text-center py-1 bg-gray-950 sticky top-0 z-2">
      Tipos de evento
    </h1>
    <div class="flex flex-col gap-2 items-stretch">
      @for (eventType of eventTypes(); track eventType.id) {
        @let eventEditing = eventType.id ? editing()[eventType.id] : true;

        <div class="flex gap-1 hover:bg-gray-900 transition rounded-sm p-2 items-center">
          <span class="text-gray-400 basis-10">[{{ eventType.id || 'new' }}]</span>
          <read-edit-input
            class="*:grow-1"
            [editMode]="eventEditing"
            [value]="eventType.name"
            (valueChange)="eventTypeEdit({ id: eventType.id, newValue: $event })"
          />
          @if (!eventType.id) {
            <button class="rounded-full bg-cyan-800 hove:bg-cyan-800 hover:bg-cyan-600 p-1 cursor-pointer [&[disabled]]:opacity-50 [&[disabled]]:bg-gray-800"
              [disabled]="!eventType.name"
              (click)="submitChange(eventType)">
              ➕
            </button>
          } @else if (eventEditing) {
            <button class="rounded-full bg-emerald-900 hover:bg-emerald-800 p-1 cursor-pointer [&[disabled]]:opacity-50 [&[disabled]]:bg-gray-800"
              [disabled]="!eventType.name"
              (click)="submitChange(eventType)">
              ✅
            </button>
            <button class="rounded-full bg-gray-950 hover:bg-gray-700 p-1 cursor-pointer"
              (click)="cancelChanges(eventType.id)">
              ✖️
            </button>
          } @else {
            <button class="rounded-full hover:bg-yellow-800 p-1 cursor-pointer"
              (click)="toggleEdit(eventType.id)">
              ✏️
            </button>
            <button class="rounded-full bg-red-900 hover:bg-red-700 p-1 cursor-pointer"
              (click)="deleteEvent(eventType.id)">
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
export class EventTypes {
  private router = inject(Router);
  private eventTypeClient = inject(EventTypesClient);
  protected eventTypes = linkedSignal(() => {
    const dTypes = APP_STATE.eventTypes();
    const eventTypes = Object.entries(dTypes).map(([id, name]) => ({ id, name }));
    eventTypes.push({ id: '', name: '' });
    return eventTypes;
  });

  protected editing = signal<{[id: string]: boolean}>({});

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

  protected eventTypeEdit({id, newValue}: { id: string | number, newValue: string}): void {
    this.eventTypes.update(eventTypes => eventTypes.map(eventType => {
      if (eventType.id === id) {
        return { id, name: newValue };
      }

      return eventType;
    }))
  }

  protected submitChange({ id, name }: { id: string; name: string }): void {
    if (!confirm(id ? 'Crear?' : 'Actualizar?')) return;

    const preValue = APP_STATE.eventTypes()[+id];
    if (name === preValue) {
      this.toggleEdit(id);
      return;
    }

    const clientRequest = id ? this.eventTypeClient.update({ id: +id, typeName: name }) : this.eventTypeClient.create(name);

    clientRequest.subscribe(({ id: responseId, typeName }) => {
      APP_STATE.eventTypes.update(eventTypes => {
        return {
          ...eventTypes,
          [responseId]: typeName,
        };
      });
      if (id) this.toggleEdit(id);
    });
  }

  protected cancelChanges(id: string) {
    const prevValue = APP_STATE.eventTypes()[+id];
    this.eventTypeEdit({ id, newValue: prevValue });
    this.toggleEdit(id);
  }

  protected deleteEvent(id: string) {
    if (!confirm('Borrar?')) return;
    this.eventTypeClient.delete(id).subscribe(() => {
      APP_STATE.eventTypes.update(eventTypes => {
        delete eventTypes[+id];
        return { ...eventTypes };
      });
    });
  }
}
