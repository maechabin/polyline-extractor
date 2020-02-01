import * as L from 'leaflet';

import * as Constants from './constants';

export class LLMap {
  /** Layers */
  private readonly streetsLayer = this.createTileLayer(Constants.LayerId.MapboxStreets);
  private readonly satelliteLayer = this.createTileLayer(Constants.LayerId.MapboxSatellite);

  llmap!: L.Map;
  markers: L.Marker[] = [];
  polyline: L.Polyline;

  initMap(elem: any) {
    this.llmap = L.map(elem)
      .setView(Constants.DefaultCenteringPosition as L.LatLngExpression, Constants.DefaultZoomSize)
      .addLayer(this.streetsLayer);

    this.addLayerToControl();
  }

  private addLayerToControl(): void {
    L.control
      .layers(
        {
          street: this.streetsLayer,
          satellite: this.satelliteLayer,
        },
        {},
        { position: 'bottomright' },
      )
      .addTo(this.llmap);
  }

  private createTileLayer(layerId: Constants.LayerId): L.Layer {
    let layerUrl: string;
    switch (layerId) {
      case Constants.LayerId.MapboxStreets:
        layerUrl = Constants.StreetLayer;
        break;
      case Constants.LayerId.MapboxSatellite:
        layerUrl = Constants.SatelliteLayer;
        break;
    }
    return L.tileLayer(layerUrl, {
      attribution: Constants.Attribution,
      maxZoom: Constants.LayerMaxZoomSize,
      id: layerId,
      accessToken: Constants.Token,
    });
  }

  putMarker(latlng: [number, number], index?: number) {
    const [lat, lng] = latlng;
    const color = this.markers.length === 0 ? '#3f51b5' : '#f50057';
    /** Icon */
    const markerHtmlStyles1 = `
        position: absolute;
        left: -7px;
        top: -7px;
        border: 3px solid ${color};
        width: 8px;
        height: 8px;
      `;
    const icon = L.divIcon({
      className: 'marker-icon',
      iconAnchor: [0, 0],
      html: `
        <span style="${markerHtmlStyles1}" />
      `,
    });

    const marker = L.marker([lat, lng], {
      icon,
      draggable: true,
    }).addTo(this.llmap);

    if (index) {
      this.markers.splice(index, 0, marker);
    } else {
      this.markers = [...this.markers, marker];
    }
    return marker;
  }

  reverseMarker() {
    this.markers.reverse();
  }

  clearMarker(index: number) {
    this.llmap.removeLayer(this.markers[index]);
    this.markers.splice(index, 1);
  }

  clearAllMarker() {
    this.markers.forEach(marker => {
      this.llmap.removeLayer(marker);
    });
    this.markers = [];
  }

  putPolyline(latlngs: [number, number][], isFilled = false) {
    if (!this.polyline) {
      this.polyline = L.polyline([latlngs], {
        color: '#f50057',
        weight: 6,
        opacity: 0.5,
        fill: isFilled,
        fillColor: '#f50057',
      }).addTo(this.llmap);
    }

    this.polyline.setLatLngs([latlngs]);
  }

  setPolylineStyle(isFilled: boolean) {
    if (this.polyline) {
      this.polyline.setStyle({
        fill: isFilled,
      });
    }
  }

  clearPolyline() {
    // this.llmap.removeLayer(this.polyline);
    this.polyline = null;
  }

  fitBounds(latlngs: [number, number][]) {
    this.llmap.fitBounds(latlngs);
  }
}
