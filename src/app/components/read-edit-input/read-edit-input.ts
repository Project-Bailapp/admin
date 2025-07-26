import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';

type InputType = 'text' | 'number' | 'textarea' | 'img' | 'datetime';

@Component({
  selector: 'read-edit-input',
  templateUrl: './read-edit-input.html',
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ReadEditInput<T = string | number | Date> {
  label = input('');
  editMode = input(false);
  type = input<InputType>('text');
  prefix = input('');
  value = model.required<T>();

  protected displayValue = computed(() => {
    let value = this.value() as string;
    const prefix = this.prefix();
    const type = this.type();

    if (!value) return '';
    if (type === 'datetime') {
      const pipe = new DatePipe('en-US');
      return pipe.transform(value, 'dd-MMM-yyyy @ hh:mm');
    }

    if (prefix) value = prefix + value;
    return value;
  });

  protected onTextWrite(e: Event) {
    let { value } = e.target! as unknown as { value: string };
    if (this.type() === 'datetime') {
      value += ':00';
    }

    this.value.set(value as T);
  }
}
