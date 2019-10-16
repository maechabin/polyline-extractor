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
      console.log(event.layerPoint);
      this.latlngs = [...this.latlngs, latlng];

      console.log(this.latlngs);
      const [marker, index] = this.map.putMarker(latlng);
      this.map.putPolyline(this.latlngs);
      this.handleMarkerDrop(marker, index);
    });
  }
  handleMarkerDrop(marker, index) {
    marker.on('dragend', (event: any) => {
      const { lat, lng } = marker.getLatLng();
      this.latlngs.splice(index, 1, [lat, lng]);
      this.map.putPolyline(this.latlngs);
    });
  }

  handleResetButtonClick() {
    console.log('aaaa');
    this.latlngs = [];
    this.map.putPolyline(this.latlngs);
    this.map.clearMarker();
  }
}
