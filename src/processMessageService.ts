import Debug from './debug';
import config from '../config';

export class ProcessMessageService {

  async processMessage(msg: any): Promise<any> {
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
          } catch (error: any) {
            Debug.error(error);
            result.message = error.message;
          }
        } else {
          result.message = config.messages.invalidMessage;
        }
      } else {
        result.message = config.messages.badMessage;
      }
    } else {
      result.message = config.messages.emptyMessage;
    }

    return result;
  }

  async processMessageData(msgData: any): Promise<any> {
    Debug.log(`Called processMessageData with ${JSON.stringify(msgData)}`);
    return true;
  }

  async processMessageError(consumeResponse: any): Promise<any> {
    Debug.log(`Called processMessageError with ${JSON.stringify(consumeResponse)}`);
    return true;
  }

  async processGenericError(genericError: any): Promise<any> {
    Debug.error(genericError);
    return true;
  }

  validateMessageData(msgData: any): any {
    Debug.log('Called validateMessageData with', msgData);
    return true;
  }

  parseMessage(msg: any): any {
    try {
      return JSON.parse(msg);
    } catch (e) {
      return false;
    }
  }

  checkEmptyMessage(msg: any): boolean {
    return !msg;
  }

  getSecondsToWait(): number {
    return 0;
  }
}
