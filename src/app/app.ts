import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventTypesClient, DanceTypesClient, AuthClient } from './clients';
import { APP_STATE } from './app.state';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <main class="flex flex-col max-w-[min(64rem, 100dvw)] mx-auto h-dvh">
      <section class="grow-1">
        <router-outlet />
      </section>

      <div class="bg-green-200">
        @if (!tokenState()) {
          <div class="flex gap-2 p-2 items-center justify-center">
            <label for="token">Añadir Token</label>
            <input id="token" class="grow-1 border-b-1 max-w-100 outline-none" [formControl]="keyControl" />
            <button class="cursor-pointer bg-green-700 py-1 px-2 font-bold text-white hover:bg-green-900 transition-all rounded-md"
              (click)="onSubmitToken()">
              Enviar
            </button>
          </div>
        } @else {
          <div class="flex justify-around items-center p-2">
            <a class="cursor-pointer bg-green-700 py-1 px-2 font-bold text-white hover:bg-green-900 transition-all rounded-md"
              routerLink=""
              routerLinkActive="bg-gray-500">
              Events
            </a>
            <a class="cursor-pointer bg-green-700 py-1 px-2 font-bold text-white hover:bg-green-900 transition-all rounded-md"
              routerLink="dance-types"
              routerLinkActive="bg-gray-500">
              Dance types
            </a>
            <a class="cursor-pointer bg-green-700 py-1 px-2 font-bold text-white hover:bg-green-900 transition-all rounded-md"
              routerLink="event-types"
              routerLinkActive="bg-gray-500">
              Event types
            </a>
          </div>
        }
      </div>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit {
  private eventTypesClient = inject(EventTypesClient);
  private danceTypesClient = inject(DanceTypesClient)
  private authClient = inject(AuthClient);

  protected tokenState = APP_STATE.token;
  protected keyControl = new FormControl("P1ano_M@n", Validators.required);

  ngOnInit(): void {
    this.loadDanceTypes();
    this.loadEventTypes();
  }

  protected onSubmitToken(): void {
    if (this.keyControl.invalid) {
      return alert('Empty token');
    }

    this.authClient.sendToken(this.keyControl.value!)
      .subscribe({
        next: (res) => this.tokenState.set(res.headers.get('Authorization')),
        error: (err) => alert(err.error),
      });
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
