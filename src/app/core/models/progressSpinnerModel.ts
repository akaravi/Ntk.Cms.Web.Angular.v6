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
  Start(name: string): void {
    this.processRun.set(name, true);
    const retOut = [];
    for (const [key, value] of this.processRun) {
      if (value) {
        retOut.push(key);
      }
    }
    this.processRunList = retOut;
  }
  Stop(name: string): void {
    this.processRun.set(name, false);
    const retOut = [];
    for (const [key, value] of this.processRun) {
      if (value) {
        retOut.push(key);
      }
    }
    this.processRunList = retOut;
  }
  private processRun = new Map<string, boolean>();
  processRunList: string[];
  get display(): boolean {
    if (!this.processRun || this.processRun.size === 0) {
      return false;
    }
    for (const value of this.processRun.values()) {
      if (value) {
        return true;
      }
    }
    return false;
  }
}
