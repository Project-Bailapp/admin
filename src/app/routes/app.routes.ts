import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RedirectCommand, ResolveFn, Router, Routes } from '@angular/router';
import { EventClient, EventResponse } from '@bailapp/clients';

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
    path: ':id',
    loadComponent: () => import('./detail/detail').then(c => c.Detail),
    resolve: { eventResponse: loadEvent },
  },
];
