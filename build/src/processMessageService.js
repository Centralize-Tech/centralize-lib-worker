"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessMessageService = void 0;
const debug_1 = __importDefault(require("./debug"));
const config_1 = __importDefault(require("../config"));
class ProcessMessageService {
    async processMessage(msg) {
        const result = {
            success: false,
            message: '',
            msg,
            msgData: null,
        };
        if (!this.checkEmptyMessage(msg)) {
            const msgData = this.parseMessage(msg);
            if (msgData !== false) {
                result.msgData = msgData;
                if (this.validateMessageData(msgData)) {
                    try {
                        await this.processMessageData(msgData);
                        result.success = true;
                    }
                    catch (error) {
                        debug_1.default.error(error);
                        result.message = error.message;
                    }
                }
                else {
                    result.message = config_1.default.messages.invalidMessage;
                }
            }
            else {
                result.message = config_1.default.messages.badMessage;
            }
        }
        else {
            result.message = config_1.default.messages.emptyMessage;
        }
        return result;
    }
    async processMessageData(msgData) {
        debug_1.default.log(`Called processMessageData with ${JSON.stringify(msgData)}`);
        return true;
    }
    async processMessageError(consumeResponse) {
        debug_1.default.log(`Called processMessageError with ${JSON.stringify(consumeResponse)}`);
        return true;
    }
    async processGenericError(genericError) {
        debug_1.default.error(genericError);
        return true;
    }
    validateMessageData(msgData) {
        debug_1.default.log('Called validateMessageData with', msgData);
        return true;
    }
    parseMessage(msg) {
        try {
            return JSON.parse(msg);
        }
        catch (e) {
            return false;
        }
    }
    checkEmptyMessage(msg) {
        return !msg;
    }
    getSecondsToWait() {
        return 0;
    }
}
exports.ProcessMessageService = ProcessMessageService;
