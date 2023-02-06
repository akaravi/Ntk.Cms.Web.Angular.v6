import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SplashScreenService } from './splash-screen.service';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss'],
})
export class SplashScreenComponent implements OnInit {
  static nextId = 0;
  id = ++SplashScreenComponent.nextId;
  @ViewChild('splashScreen', { static: true }) splashScreen: ElementRef;

  constructor(
    private el: ElementRef,
    private splashScreenService: SplashScreenService
  ) { }

  ngOnInit(): void {
    this.splashScreenService.init(this.splashScreen);
  }
}
