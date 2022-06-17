import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
})
export class ToolbarComponent implements OnInit {
  constructor(private router: Router) { }
  env = environment;

  ngOnInit(): void { }
  navigateToBuilder() {
    this.router.navigate(['/builder']);

  }
}
