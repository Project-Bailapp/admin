import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventTypesClient, DanceTypesClient, AuthClient } from './http/clients';
import { APP_STATE } from './app.state';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <main class="flex flex-col w-full h-dvh bg-gray-950 text-white">
      <section class="grow-1 w-full max-w-[min(42rem,_100dvw)] mx-auto overflow-auto">
        <router-outlet />
      </section>

      <div [class.bg-green-900]="tokenState()">
        @if (!tokenState()) {
          <div class="flex gap-2 p-2 items-center justify-center">
            <label for="token">Admin</label>
            <input id="token" class="grow-1 border-b-1 max-w-100 outline-none" [formControl]="keyControl" />
            <button class="cursor-pointer bg-green-950 py-1 px-2 font-bold text-white hover:bg-emerald-950 transition-all rounded-md"
              (click)="onSubmitToken()">
              Enviar
            </button>
          </div>
        } @else {
          @let linkTW = "cursor-pointer bg-emerald-950 border-emerald-950 border-2 py-1 px-2 font-bold text-white hover:bg-green-900 transition-all rounded-md";
          <div class="flex justify-center items-center p-2 gap-2">
            <a [class]="linkTW"
              routerLink=""
              routerLinkActive="[&]:bg-green-900"
              [routerLinkActiveOptions]="{exact: true}">
              Events
            </a>
            <a [class]="linkTW"
              routerLink="dance-types"
              routerLinkActive="[&]:bg-green-900"
              [routerLinkActiveOptions]="{exact: true}">
              Dance types
            </a>
            <a [class]="linkTW"
              routerLink="event-types"
              routerLinkActive="[&]:bg-green-900"
              [routerLinkActiveOptions]="{exact: true}">
              Event types
            </a>
            <a class="cursor-pointer bg-red-950 border-red-950 border-2 py-1 px-2 font-bold text-white hover:bg-amber-950 transition-all rounded-md"
              (click)="tokenState.set(null)">
              Log out
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
  protected keyControl = new FormControl("", Validators.required);

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
