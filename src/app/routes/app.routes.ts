import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RedirectCommand, ResolveFn, Router, Routes } from '@angular/router';
import { APP_STATE } from '@bailapp/app.state';
import { EventClient } from '@bailapp/http/clients';
import { BlapEvent } from '@bailapp/models/event';
import { catchError, of } from 'rxjs';

const loadEvent: ResolveFn<BlapEvent> = (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const id = route.paramMap.get('id')!;
  const tokenized = APP_STATE.token();
  const redirectResponse = of(new RedirectCommand(router.parseUrl('')));

  if (id === 'new') {
    if (tokenized) return of(new BlapEvent());
    return redirectResponse;
  }
  
  return inject(EventClient).get(id).pipe(
    catchError(() => {
      alert(`Algo salió mal cargando evento de id: ${id}`);
      return redirectResponse;
    })
  );
}

export const routes: Routes = [
  {
    path: 'events',
    loadComponent: () => import('./list/list').then(c => c.List),
  },
  {
    path: 'events/:id',
    loadComponent: () => import('./detail/detail').then(c => c.Detail),
    resolve: { event: loadEvent },
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
    path: '**',
    pathMatch: 'full',
    redirectTo: 'events',
  }
];
