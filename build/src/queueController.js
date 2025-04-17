"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueController = void 0;
const centralize_lib_queue_1 = require("@centralize-lib/centralize-lib-queue");
const processMessageService_1 = require("./processMessageService");
const debug_1 = __importDefault(require("./debug"));
const config_1 = __importDefault(require("../config"));
class QueueController {
    constructor(inputOption = {}) {
        const options = typeof inputOption === 'string' ? { queueName: inputOption } : inputOption;
        this.ELQInstance = new centralize_lib_queue_1.Amqp();
        this.processMessageServiceInstance = new processMessageService_1.ProcessMessageService();
        this.config = { ...config_1.default.queue, ...options };
    }
    setAQLInstance(ELQInstance) {
        this.ELQInstance = new centralize_lib_queue_1.Amqp();
    }
    setConfig(config) {
        this.config = { ...this.config, ...config };
    }
    setMessageServiceInstance(messageServiceInstance) {
        this.processMessageServiceInstance = messageServiceInstance;
    }
    async consume(queueName, msg, channel, fullData) {
        console.time('process_time');
        let isError = false;
        let messageToError = { msg };
        try {
            debug_1.default.log(`Wait ${this.processMessageServiceInstance.getSecondsToWait()} seconds before start`);
            await this.waitTime();
            const consumeResponse = await this.processMessageServiceInstance.processMessage(msg);
            if (consumeResponse.success === false) {
                messageToError = consumeResponse;
                isError = true;
                await this.processMessageServiceInstance.processMessageError(consumeResponse);
            }
        }
        catch (error) {
            console.error(error);
            isError = true;
            await this.processMessageServiceInstance.processGenericError(error);
        }
        if (!this.config.autoAckParam || ['false', 'FALSE'].includes(this.config.autoAckParam))
            await this.ELQInstance.ack(fullData, channel);
        if (isError) {
            await this.sendToErrorQueue(messageToError);
        }
        console.timeEnd('process_time');
        return true;
    }
    async sendToErrorQueue(consumeResponse) {
        if (this.config.autoSendToQueueError === true || ['true', 'TRUE'].includes(this.config.autoSendToQueueError)) {
            const queueSubFix = this.config.queueName === this.config.queueName.toLowerCase() ? 'error' : 'ERROR';
            await this.ELQInstance.sendJSONMessage(consumeResponse.msg, this.config.queueNameError || `${this.config.queueName}_${queueSubFix}`);
        }
        return true;
    }
    waitTime() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, this.processMessageServiceInstance.getSecondsToWait() * 1000);
        });
    }
    async start() {
        await this.ELQInstance.consume(this.config.queueName, this.consume.bind(this), this.config.autoAckParam, this.config.prefetchParam);
    }
}
exports.QueueController = QueueController;
