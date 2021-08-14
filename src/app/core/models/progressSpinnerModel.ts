import { ChangeDetectorRef } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';

export class ProgressSpinnerModel {
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
  consoleLog = false;
  private processRun = new Map<string, boolean>();
  constructor() {
    /** GUID */
    this.guid = this.newGuid();
    /** GUID */
  }
  /** GUID */
  private guid = '';
  private S4(): string {
    const ran = (1 + Math.random()) * 0x10000;
    return (ran | 0).toString(16).substring(1);
  }
  newGuid(): string {
    const isString = `${this.S4()}${this.S4()}-${this.S4()}-${this.S4()}-${this.S4()}-${this.S4()}${this.S4()}${this.S4()}`;
    return isString;
  }
  /** GUID */

  displayItem(name: string): boolean {
    if (!this.processRun) {
      return false;
    }
    for (const [key, value] of this.processRun) {
      if (key === name) {
        return value;
      }
    }
    return false;
  }
  Start(name: string): void {

    this.processRun.set(name, true);
    const retOut = [];
    for (const [key, value] of this.processRun) {
      if (value && value === true) {
        retOut.push(key);
      }
    }
    this.processRunList = retOut;
    /** Display */
    if (retOut && retOut.length > 0) {
      this.display = true;
    }
    else {
      this.display = false;
    }
    /** Display */
    if (this.consoleLog) {
      console.log(this.guid, 'Start:', name, 'Display:', this.display, 'processRunList:', this.processRunList);
    }
  }
  Stop(name: string): void {

    this.processRun.set(name, false);
    const retOut = [];
    for (const [key, value] of this.processRun) {
      if (value && value === true) {
        retOut.push(key);
      }
    }
    this.processRunList = retOut;
    /** Display */
    if (retOut && retOut.length > 0) {
      this.display = true;
    }
    else {
      this.display = false;
    }
    /** Display */
    if (this.consoleLog) {
      console.log(this.guid, 'Stop:', name, 'Display:', this.display, 'processRunList:', this.processRunList);
    }
    if (this.cdr && !this.display) {
      this.cdr.detectChanges();
    }
  }

}
