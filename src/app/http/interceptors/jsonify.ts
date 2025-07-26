import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

export function jsonify(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const newReq = req.clone({
    headers: req.headers.set('Content-Type', 'application/json'),
    body: JSON.stringify(req.body),
  });
  return next(newReq);
}
