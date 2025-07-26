import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  template: `
    Dance types
  `,
  host: { class: 'contents'},
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DanceTypes {}
