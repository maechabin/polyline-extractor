import { Component, OnInit, ElementRef } from '@angular/core';
import { LLMap } from '../domains/llmap/llmap';

@Component({
  selector: 'app-map',
  template: `
    <div class="content">
      <div class="map"></div>
      <app-console
        class="console"
        [latlngs]="latlngs"
        (undoButtonClick)="handleUndoButtonClick()"
        (resetButtonClick)="handleResetButtonClick()"
      ></app-console>
    </div>
  `,
  styleUrls: ['./map.container.scss'],
})
export class MapContainerComponent implements OnInit {
  private el: HTMLElement;
  readonly map = new LLMap();

  latlngs: [number, number][] = [];

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
    this.el = this.elementRef.nativeElement;
    const mapElem = this.el.querySelector('.map') as HTMLElement;
    this.map.initMap(mapElem);

    this.handleMapClick();
  }

  handleMapClick() {
    this.map.llmap.on('click', (event: L.LeafletMouseEvent) => {
      const latlng: [number, number] = [event.latlng.lat, event.latlng.lng]
      this.latlngs = [...this.latlngs, latlng];

      const marker = this.map.putMarker(latlng);
      this.map.putPolyline(this.latlngs);
      this.handleMarkerEvent(marker);
    });
  }

  handleMarkerEvent(marker: any) {
    marker.on('click', (event: any) => {
      const index = this.map.markers.findIndex((a) => {
        return a.getLatLng().lat === event.latlng.lat && a.getLatLng().lng === event.latlng.lng;
      });

      if (index <= 0) {
        return;
      }

      const midpoint: [number, number] = [
        (this.latlngs[index][0] + this.latlngs[index - 1][0]) / 2,
        (this.latlngs[index][1] + this.latlngs[index - 1][1]) / 2,
      ]
      this.latlngs.splice(index, 0, midpoint)
      this.map.putPolyline(this.latlngs);
      const marker = this.map.putMarker(midpoint, index);
      this.handleMarkerEvent(marker);
    });

    marker.on('drag', (event: any) => {
      const index = this.map.markers.findIndex((marker) => {
        return marker.getLatLng().lat === event.latlng.lat && marker.getLatLng().lng === event.latlng.lng;
      });

      const { lat, lng } = marker.getLatLng();
      this.latlngs.splice(index, 1, [lat, lng]);
      this.map.putPolyline(this.latlngs);
    });
  }

  handleUndoButtonClick() {
    this.latlngs.pop();
    this.map.putPolyline(this.latlngs);
    const index = this.latlngs.length;
    this.map.clearMarker(index);
  }

  handleResetButtonClick() {
    this.latlngs = [];
    this.map.putPolyline(this.latlngs);
    this.map.clearPolyline();
    this.map.clearAllMarker();
  }
  }
}
