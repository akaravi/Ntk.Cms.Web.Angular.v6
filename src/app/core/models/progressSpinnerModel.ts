import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';

export class ProgressSpinnerModel {
  display1 = false;
  message = 'Loading ... ';
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
  private processRun = new Map<string, boolean>();
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
    }    /** Display */
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
  }

}
