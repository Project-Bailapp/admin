import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RedirectCommand, ResolveFn, Router, Routes } from '@angular/router';
import { APP_STATE } from '@bailapp/app.state';
import { EventClient, EventResponse } from '@bailapp/http/clients';

const loadEvent: ResolveFn<EventResponse> = (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const id = route.paramMap.get('id');
  if (!id) {
    return new RedirectCommand(router.parseUrl(''));
  }

  return inject(EventClient).get(id);
}

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/list').then(c => c.List),
  },
  {
    path: 'dance-types',
    canActivate: [
      () => APP_STATE.token() != null,
    ],
    loadComponent: () => import('./dance-types/dance-types').then(c => c.DanceTypes),
  },
  {
    path: 'event-types',
    canActivate: [
      () => APP_STATE.token() != null,
    ],
    loadComponent: () => import('./event-types/event-types').then(c => c.EventTypes),
  },
  {
    path: ':id',
    loadComponent: () => import('./detail/detail').then(c => c.Detail),
    resolve: { eventResponse: loadEvent },
  },
];
