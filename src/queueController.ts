import { Amqp } from '@centralize-lib/centralize-lib-queue';

import { ProcessMessageService } from './processMessageService';
import Debug from './debug';
import config from '../config';

export class QueueController {

  public ELQInstance: Amqp;
  private config: any;
  private processMessageServiceInstance: ProcessMessageService;
  constructor(inputOption: any = {}) {
    const options = typeof inputOption === 'string' ? { queueName: inputOption } : inputOption;
    this.ELQInstance = new Amqp();
    this.processMessageServiceInstance = new ProcessMessageService();
    this.config = { ...config.queue, ...options };
  }

  setAQLInstance(ELQInstance: any): void {
    this.ELQInstance = new Amqp();
  }

  setConfig(config: any): void {
    this.config = { ...this.config, ...config };
  }

  setMessageServiceInstance(messageServiceInstance: any): void {
    this.processMessageServiceInstance = messageServiceInstance;
  }

  async consume(queueName: string, msg: any, channel: string, fullData: any): Promise<boolean> {
    console.time('process_time');
    let isError = false;
    let messageToError = { msg };
    try {
      Debug.log(`Wait ${this.processMessageServiceInstance.getSecondsToWait()} seconds before start`);
      await this.waitTime();
      const consumeResponse = await this.processMessageServiceInstance.processMessage(msg);
      if (consumeResponse.success === false) {
        messageToError = consumeResponse;
        isError = true;
        await this.processMessageServiceInstance.processMessageError(consumeResponse);
      }
    } catch (error: any) {
      console.error(error);
      isError = true;
      await this.processMessageServiceInstance.processGenericError(error);
    }

    if (!this.config.autoAckParam || ['false', 'FALSE'].includes(this.config.autoAckParam)) await this.ELQInstance.ack(fullData, channel);
    if (isError) {
      await this.sendToErrorQueue(messageToError);
    }

    console.timeEnd('process_time');
    return true;
  }

  async sendToErrorQueue(consumeResponse: any): Promise<boolean> {
    if (this.config.autoSendToQueueError === true || ['true', 'TRUE'].includes(this.config.autoSendToQueueError)) {
      const queueSubFix = this.config.queueName === this.config.queueName.toLowerCase() ? 'error' : 'ERROR';
      await this.ELQInstance.sendJSONMessage(consumeResponse.msg, this.config.queueNameError || `${this.config.queueName}_${queueSubFix}`);
    }

    return true;
  }

  waitTime(): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, this.processMessageServiceInstance.getSecondsToWait() * 1000);
    });
  }

  async start(): Promise<void> {
    await this.ELQInstance.consume(
      this.config.queueName,
      this.consume.bind(this),
      this.config.autoAckParam,
      this.config.prefetchParam,
    );
  }
}
