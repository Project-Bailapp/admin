import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EventTypesClient } from './clients/event-types.client';
import { APP_STATE } from './app.state';
import { DanceTypesClient } from './clients/dance-types.client';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <main class="max-w-[min(64rem, 100dvw)] mx-auto h-dvh">
      <router-outlet />
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit {
  private eventTypesClient = inject(EventTypesClient);
  private danceTypesClient = inject(DanceTypesClient)

  ngOnInit(): void {
    this.loadDanceTypes();
    this.loadEventTypes();
  }

  private loadEventTypes(): void {
    this.eventTypesClient.list().subscribe(eventTypes => {
      const types = eventTypes.reduce((acc, eventType) => {
        acc[eventType.id] = eventType.type_name;
        return acc;
      }, {} as ReturnType<typeof APP_STATE['eventTypes']>);

      APP_STATE.eventTypes.set(types);
    });
  }

  private loadDanceTypes(): void {
    this.danceTypesClient.list().subscribe(danceTypes => {
      const types = danceTypes.reduce((acc, danceType) => {
        acc[danceType.id] = danceType.type_name;
        return acc;
      }, {} as ReturnType<typeof APP_STATE['danceTypes']>);

      APP_STATE.danceTypes.set(types);
    });
  }
}
