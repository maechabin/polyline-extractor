import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.scss'],
})
export class ConsoleComponent {
  @Input() latlngs: [number, number][];
  @Output() resetButtonClick = new EventEmitter<never>();

  get polyline() {
    return JSON.stringify(this.latlngs);
  }

  handleResetButtonClick() {
    this.resetButtonClick.emit();
  }
}
