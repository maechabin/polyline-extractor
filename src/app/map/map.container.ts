import { Component, OnInit, ElementRef } from '@angular/core';

import { LLMap } from '../../domains/llmap/llmap';

@Component({
  selector: 'app-map',
  template: `
    <div class="content">
      <div class="map"></div>
      <app-console
        class="console"
        [latlngs]="latlngs"
        (textInput)="handleTextInput($event)"
        (isFilledChange)="handleIsFilledChange($event)"
        (undoButtonClick)="handleUndoButtonClick()"
        (connectButtonClick)="handleConnectButtonClick()"
        (resetButtonClick)="handleResetButtonClick()"
        (reverseButtonClick)="handleReverseButtonClick()"
        (fitBoundsButtonClick)="handleFitBoundsButtonClick()"
      ></app-console>
    </div>
  `,
  styleUrls: ['./map.container.scss'],
})
export class MapContainerComponent implements OnInit {
  private el: HTMLElement;
  readonly map = new LLMap();
  isFilled = false;

  latlngs: [number, number][] = [];

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.el = this.elementRef.nativeElement;
    const mapElem = this.el.querySelector('.map') as HTMLElement;
    this.map.initMap(mapElem);

    this.handleMapEvent();
  }

  handleMapEvent() {
    this.map.llmap.on('click', (event: L.LeafletMouseEvent) => {
      const latlng: [number, number] = [event.latlng.lat, event.latlng.lng];
      this.latlngs = [...this.latlngs, latlng];

      const marker = this.map.putMarker(latlng);
      this.map.putPolyline(this.latlngs, this.isFilled);
      this.handleMarkerEvent(marker);
    });
  }

  handleMarkerEvent(marker: any) {
    marker.on('click', (event: any) => {
      const index = this.getMarkerIndex(event.latlng);

      if (index <= 0) {
        return;
      }

      const midpoint: [number, number] = [
        (this.latlngs[index][0] + this.latlngs[index - 1][0]) / 2,
        (this.latlngs[index][1] + this.latlngs[index - 1][1]) / 2,
      ];
      this.latlngs.splice(index, 0, midpoint);
      this.latlngs = [].concat(this.latlngs);
      this.map.putPolyline(this.latlngs, this.isFilled);
      const m = this.map.putMarker(midpoint, index);
      this.handleMarkerEvent(m);
    });

    marker.on('drag', (event: any) => {
      const index = this.getMarkerIndex(event.latlng);

      const { lat, lng } = marker.getLatLng();
      this.latlngs.splice(index, 1, [lat, lng]);
      this.latlngs = [].concat(this.latlngs);
      this.map.putPolyline(this.latlngs, this.isFilled);
    });

    marker.on('contextmenu', (event: any) => {
      const index = this.getMarkerIndex(event.latlng);

      if (index <= 0) {
        return;
      }

      this.latlngs.splice(index, 1);
      this.latlngs = [].concat(this.latlngs);
      this.map.putPolyline(this.latlngs, this.isFilled);
      this.map.clearMarker(index);
    });
  }

  private getMarkerIndex(latlng: { lat: number; lng: number }) {
    return this.map.markers.findIndex(marker => {
      const markerLatlng = marker.getLatLng();
      return markerLatlng.lat === latlng.lat && markerLatlng.lng === latlng.lng;
    });
  }

  handleTextInput(latlngs: string) {
    try {
      this.latlngs = JSON.parse(latlngs);
      this.map.putPolyline(this.latlngs, this.isFilled);
      this.map.clearAllMarker();
      this.latlngs.forEach((latlng: [number, number]) => {
        const marker = this.map.putMarker(latlng);
        this.handleMarkerEvent(marker);
      });
    } catch {}
  }

  handleIsFilledChange(isFilled: boolean) {
    this.isFilled = isFilled;
    this.map.setPolylineStyle(isFilled);
  }

  handleConnectButtonClick() {
    const latlng = this.latlngs[0];
    this.latlngs = [...this.latlngs, latlng];
    this.latlngs = [].concat(this.latlngs);
    this.map.putPolyline(this.latlngs, this.isFilled);
    const index = this.latlngs.length;
    const marker = this.map.putMarker(latlng, index);
    this.handleMarkerEvent(marker);
  }

  handleUndoButtonClick() {
    if (this.latlngs.length > 0) {
      this.latlngs.pop();
      this.latlngs = [].concat(this.latlngs);
      this.map.putPolyline(this.latlngs, this.isFilled);
      const index = this.latlngs.length;
      this.map.clearMarker(index);
    }
  }

  handleResetButtonClick() {
    this.latlngs = [];
    this.map.putPolyline(this.latlngs, this.isFilled);
    this.map.clearPolyline();
    this.map.clearAllMarker();
  }

  /** todo: 不具合があるためまだボタンは実装していない */
  handleReverseButtonClick() {
    this.latlngs.reverse();
    this.map.reverseMarker();
  }

  handleFitBoundsButtonClick() {
    if (this.latlngs.length > 0) {
      this.map.fitBounds(this.latlngs);
    }
  }
}
