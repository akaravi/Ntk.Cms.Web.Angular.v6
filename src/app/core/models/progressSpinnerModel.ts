import { ChangeDetectorRef } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { environment } from 'src/environments/environment';

export class ProcessInfoModel {
  inRun = false;
  title = '';
}
export class ProgressSpinnerModel {
  constructor() {
    /** GUID */
    this.guid = `${this.S4()}${this.S4()}-${this.S4()}-${this.S4()}-${this.S4()}-${this.S4()}${this.S4()}${this.S4()}`;
    /** GUID */
    this.consoleLog = environment.ProgressConsoleLog;
    this.mode = "indeterminate";
  }
  /** GUID */
  private S4(): string {
    const ran = (1 + Math.random()) * 0x10000;
    return (ran | 0).toString(16).substring(1);
  }
  /** GUID */
  cdr: ChangeDetectorRef;
  message = 'در حال دریافت اطلاعات';
  color?: ThemePalette;
  diameter = 20;
  mode?: ProgressSpinnerMode;
  strokeWidth = 50;
  value?: number;
  backdropEnabled = true;
  Globally = true;
  positionGloballyCenter = true;
  processRunList: string[];
  display = false;
  consoleLog = true;
  guid = '';
  processInfo = new Map<string, ProcessInfoModel>();

  displayItem(name: string): boolean {
    if (!this.processInfo) {
      return false;
    }
    for (const [key, value] of this.processInfo) {
      if (key === name) {
        return value.inRun;
      }
    }
    return false;
  }

  Start(key: string, title: string = ' '): void {
    let model = new ProcessInfoModel();
    model.inRun = true;
    model.title = title;
    this.processInfo.set(key, model);
    const retOut = [];
    for (const [key, value] of this.processInfo) {
      if (value && value.inRun === true) {
        retOut.push(key);
      }
    }
    this.processRunList = retOut;
    /** Display */
    if (retOut && retOut.length > 0) {
      this.display = true;
    }
    else {
      this.processInfo = new Map<string, ProcessInfoModel>();
      this.display = false;
    }

    /** Display */
    if (this.consoleLog) {
      console.log(this.guid, 'Start:', name, 'Globally:', this.Globally, 'Display:', this.display, 'key:', key, 'title:', model.title, 'processRunList:', this.processRunList);
    }
    if (this.cdr && !this.display) {
      this.cdr.detectChanges();
    }
  }
  Stop(key: string): void {

    let model = this.processInfo.get(key);
    if (!model) {
      model = new ProcessInfoModel();
    }
    model.inRun = false;
    this.processInfo.set(key, model);
    const retOut = [];
    for (const [key, value] of this.processInfo) {
      if (value && value.inRun === true) {
        retOut.push(key);
      }
    }
    this.processRunList = retOut;
    /** Display */
    if (retOut && retOut.length > 0) {
      this.display = true;
    }
    else {
      this.processInfo = new Map<string, ProcessInfoModel>();
      this.display = false;
    }

    /** Display */
    if (this.consoleLog) {
      console.log(this.guid, 'Stop:', name, 'Globally:', this.Globally, 'Display:', 'Display:', this.display, 'key:', key, 'title:', model.title, 'processRunList:', this.processRunList);
    }

    if (this.cdr && !this.display) {
      this.cdr.detectChanges();
    }
  }
}