export declare class ProcessMessageService {
    processMessage(msg: any): Promise<any>;
    processMessageData(msgData: any): Promise<any>;
    processMessageError(consumeResponse: any): Promise<any>;
    processGenericError(genericError: any): Promise<any>;
    validateMessageData(msgData: any): any;
    parseMessage(msg: any): any;
    checkEmptyMessage(msg: any): boolean;
    getSecondsToWait(): number;
}
//# sourceMappingURL=processMessageService.d.ts.map