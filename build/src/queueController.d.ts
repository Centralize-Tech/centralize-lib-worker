import { Amqp } from '@centralize-lib/centralize-lib-queue';
export declare class QueueController {
    ELQInstance: Amqp;
    private config;
    private processMessageServiceInstance;
    constructor(inputOption?: any);
    setAQLInstance(ELQInstance: any): void;
    setConfig(config: any): void;
    setMessageServiceInstance(messageServiceInstance: any): void;
    consume(queueName: string, msg: any, channel: string, fullData: any): Promise<boolean>;
    sendToErrorQueue(consumeResponse: any): Promise<boolean>;
    waitTime(): Promise<any>;
    start(): Promise<void>;
}
//# sourceMappingURL=queueController.d.ts.map