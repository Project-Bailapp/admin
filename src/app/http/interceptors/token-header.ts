import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { APP_STATE } from '@bailapp/app.state';
import { Observable } from 'rxjs';

export function tokenHeaderInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const appStateToken = APP_STATE.token();

  if (appStateToken) {
    const newReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${appStateToken}`),
    });
    return next(newReq);
  }

  return next(req);
}
