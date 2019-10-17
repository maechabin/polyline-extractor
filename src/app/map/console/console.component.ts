import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.scss'],
})
export class ConsoleComponent {
  @Input() latlngs: [number, number][];
  @Output() undoButtonClick = new EventEmitter<never>();
  @Output() resetButtonClick = new EventEmitter<never>();

  get polyline() {
    return JSON.stringify(this.latlngs);
  }

  handleUndoButtonClick() {
    this.undoButtonClick.emit();
  }

  handleResetButtonClick() {
    this.resetButtonClick.emit();
  }
}
