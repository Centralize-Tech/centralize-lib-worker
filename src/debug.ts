import { Console } from 'console';

import config from '../config';

export class Debug {

  private config: any;
  private debugger: any
  constructor() {
    this.config = config;
    this.debugger = new Console({ stdout: process.stdout, stderr: process.stderr });
  }

  setConfig(newConfig: any): void {
    this.config = newConfig;
  }

  setDebugger(instance: any): void {
    this.debugger = instance;
  }

  allowDebug(): boolean {
    return this.config.debug === true || ['true', 'TRUE'].includes(this.config.debug);
  }

  log(...args: any): void {
    if (this.allowDebug()) {
      this.debugger.log(...args);
    }
  }

  error(...args: any): void {
    if (this.allowDebug()) {
      this.debugger.error(...args);
    }
  }
}

export default new Debug();
