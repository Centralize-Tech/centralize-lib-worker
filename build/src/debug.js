"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Debug = void 0;
const console_1 = require("console");
const config_1 = __importDefault(require("../config"));
class Debug {
    constructor() {
        this.config = config_1.default;
        this.debugger = new console_1.Console({ stdout: process.stdout, stderr: process.stderr });
    }
    setConfig(newConfig) {
        this.config = newConfig;
    }
    setDebugger(instance) {
        this.debugger = instance;
    }
    allowDebug() {
        return this.config.debug === true || ['true', 'TRUE'].includes(this.config.debug);
    }
    log(...args) {
        if (this.allowDebug()) {
            this.debugger.log(...args);
        }
    }
    error(...args) {
        if (this.allowDebug()) {
            this.debugger.error(...args);
        }
    }
}
exports.Debug = Debug;
exports.default = new Debug();
