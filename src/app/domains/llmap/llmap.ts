import * as L from 'leaflet';

export class LLMap {
  llmap!: L.Map;
  markers: L.Marker[] = [];
  polyline: L.Polyline;

  initMap(elem: any) {
    const token =
      'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
    /** Layer */
    const streetsLayer = L.tileLayer(
      `
    https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${token}
    `,
      {
        attribution: `
          Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors,
          <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,
          Imagery © <a href="https://www.mapbox.com/">Mapbox</a>
        `,
        maxZoom: 16,
        id: 'mapbox.streets', // mapbox.streets | mapbox.satellite
        accessToken: 'your.mapbox.access.token',
      },
    );

    const satelliteLayer = L.tileLayer(
      `
    https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${token}
    `,
      {
        attribution: `
          Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors,
          <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,
          Imagery © <a href="https://www.mapbox.com/">Mapbox</a>
        `,
        maxZoom: 16,
        id: 'mapbox.satellite', // mapbox.streets | mapbox.satellite
        accessToken: 'your.mapbox.access.token',
      },
    );

    this.llmap = L.map(elem)
      .setView([35.69432984468491, 139.74267643565133], 12)
      .addLayer(streetsLayer);

    L.control
      .layers(
        {
          street: streetsLayer,
          satellite: satelliteLayer,
        },
        {},
        { position: 'bottomright' },
      )
      .addTo(this.llmap);
  }

  putMarker(latlng: [number, number]) {
    const [lat, lng] = latlng;
    /** Icon */
    const markerHtmlStyles1 = `
        position: absolute;
        left: -7px;
        top: -7px;
        border-radius: 50%;
        background-color: #FF0000;
        width: 14px;
        height: 14px;
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

    this.markers = [...this.markers, marker];
    return [marker, this.markers.length - 1];
  }

  putPolyline(latlngs: [number, number][]) {
    if (!this.polyline) {
      this.polyline = L.polyline([latlngs],
        {
          color: '#FF0000',
          weight: 8,
          opacity: 0.6,
        }).addTo(this.llmap);
    }

    this.polyline.setLatLngs([latlngs]);
  }
}
