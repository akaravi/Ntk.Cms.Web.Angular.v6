import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import * as L from 'leaflet';
import { Map, MapOptions, tileLayer, ZoomAnimEvent } from 'leaflet';
import { PoinModel } from 'src/app/core/models/pointModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cms-map',
  templateUrl: './cms-map.component.html',
  styleUrls: ['./cms-map.component.scss']
})
export class CmsMapComponent implements OnInit, OnDestroy, AfterViewInit {
  static nextId = 0;
  id = ++CmsMapComponent.nextId;
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
    // center: latLng(0, 0),
  };
  @Input() set optonCenter(model: PoinModel) {
    if (this.map && model && model.lat && model.lon && model.lat !== 0 && model.lon !== 0) {
      this.map.setView(new L.LatLng(model.lat, model.lon), this.zoom);
    }
  }
  @Input() set optionCurrentPoint(setPont: boolean) {
    this.onActionCurrentPoint(setPont);
  }
  public map: Map;
  public zoom: number;
  destroy = false;

  constructor(private cmsToastrService: CmsToastrService,
  ) {

  }

  ngOnInit(): void {
    const iconRetinaUrl = 'assets/leaflet/marker-icon-2x.png';
    const iconUrl = 'assets/leaflet/marker-icon.png';
    const shadowUrl = 'assets/leaflet/marker-shadow.png';
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
  ngAfterViewInit(): void {
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
  onActionCurrentPoint(setPont: boolean = true): any {
    this.getPosition().then(pos => {
      // console.log(`Positon: ${pos.lng} ${pos.lat}`);
      // L.marker([pos.lat, pos.lon]).addTo(this.map);
      this.map.setView(new L.LatLng(pos.lat, pos.lon), this.zoom);
    });
  }
  getPosition(): Promise<any> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resp => {
        resolve({ lon: resp.coords.longitude, lat: resp.coords.latitude });
        // console.log('lat', resp.coords.longitude);
        // localStorage.setItem('ln', JSON.stringify(resp.coords.longitude));
        // localStorage.setItem('lt', JSON.stringify(resp.coords.longitude));
      },
        err => {
          // reject(err);
          this.cmsToastrService.typeErrorGetPosition();
        });
    });
  }

}
