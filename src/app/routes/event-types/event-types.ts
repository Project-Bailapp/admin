import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  template: `
    Event types
  `,
  host: { class: 'contents'},
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventTypes {}
