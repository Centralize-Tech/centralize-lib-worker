export class ProcessMessageService {
  processMessage(msg: any, aqlInstance: any, fullData:any, channel: any):Promise<any>
  processMessageData(msg: any, aqlInstance: any, fullData:any, channel: any):Promise<boolean>
  processMessageError(msg: any):Promise<boolean>
  processGenericError(msg: any):Promise<boolean>
  validateMessageData(msgData: any):boolean
  parseMessage(msg: any):object|boolean
  checkEmptyMessage(msg: any):boolean
  getSecondsToWait():number
}

export class QueueController {
  consume(queueName: string, msg: any, channel: any, fullData: any):Promise<boolean>
  sendToErrorQueue(consumeResponse: any):Promise<boolean>
  setMessageServiceInstance(instance: ProcessMessageService):void
  waitTime(): Promise<boolean>
  start(): Promise<void>
}
