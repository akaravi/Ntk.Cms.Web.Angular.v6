import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import * as L from 'leaflet';
import { Map, ZoomAnimEvent, MapOptions, tileLayer } from 'leaflet';
import { PoinModel } from 'src/app/core/models/pointModel';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cms-map',
  templateUrl: './cmsMap.component.html',
  styleUrls: ['./cmsMap.component.scss']
})
export class CmsMapComponent implements OnInit, OnDestroy {
  @Output() map$: EventEmitter<Map> = new EventEmitter<Map>();
  @Output() zoom$: EventEmitter<number> = new EventEmitter<number>();
  @Input() options: MapOptions = {
    layers: [tileLayer(environment.leafletUrl, {
      opacity: 0.7,
      maxZoom: 19,
      detectRetina: true,
      // attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })],
    zoom: 16,
    center: [32.684985, 51.6359425],
    // center: latLng(0, 0)
  };
  @Input() set optonCenter(model: PoinModel) {
    if (this.map && model && model.lat && model.lon && model.lat !== 0 && model.lon !== 0) {
      this.map.setView(new L.LatLng(model.lat, model.lon), this.zoom);
    }
  }
  public map: Map;
  public zoom: number;
  destroy = false;

  constructor() {
  }

  ngOnInit(): void {
    const iconRetinaUrl = 'leaflet/marker-icon-2x.png';
    const iconUrl = 'leaflet/marker-icon.png';
    const shadowUrl = 'leaflet/marker-shadow.png';
    const iconDefault = L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = iconDefault;
  }
  ngOnDestroy(): void {
    if (this.map) {
      this.map.clearAllEventListeners();
      // this.map.remove();
      this.destroy = true;
    }
  }

  onMapReady(map: Map): void {
    setTimeout(() => {
      if (this.map && !this.destroy) {
        map.invalidateSize();
      }
    }, 500);
    this.map = map;
    this.map$.emit(map);
    this.zoom = map.getZoom();
    this.zoom$.emit(this.zoom);
  }

  onMapZoomEnd(e: ZoomAnimEvent): void {
    this.zoom = e.target.getZoom();
    this.zoom$.emit(this.zoom);
  }
}
