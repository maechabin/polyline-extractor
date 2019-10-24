import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.scss'],
})
export class ConsoleComponent implements OnInit, OnChanges {
  @Input() latlngs: [number, number][];
  @Output() textInput = new EventEmitter<string>();
  @Output() isFilledChange = new EventEmitter<boolean>();
  @Output() connectButtonClick = new EventEmitter<never>();
  @Output() undoButtonClick = new EventEmitter<never>();
  @Output() resetButtonClick = new EventEmitter<never>();
  @Output() reverseButtonClick = new EventEmitter<never>();
  @Output() fitBoundsButtonClick = new EventEmitter<never>();

  textForm: FormGroup;

  get polyline() {
    return JSON.stringify(this.latlngs);
  }

  constructor(
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.createForm();
  }

  ngOnChanges() {
    if (this.textForm) {
      try {
        this.textForm.get('latlngs').setValue(this.polyline);
      } catch { }
    }
  }

  createForm(): void {
    this.textForm = this.formBuilder.group({
      latlngs: [this.polyline],
      isFilled: [false],
    });
  }

  handleConnectButtonClick() {
    this.connectButtonClick.emit();
  }

  handleTextInput() {
    this.textInput.emit(this.textForm.get('latlngs').value);
  }

  handleIsFilledChange() {
    this.isFilledChange.emit(this.textForm.get('isFilled').value);
  }

  handleUndoButtonClick() {
    this.undoButtonClick.emit();
  }

  handleResetButtonClick() {
    this.resetButtonClick.emit();
  }

  handleFitBoundsButtonClick() {
    this.fitBoundsButtonClick.emit();
  }
}
