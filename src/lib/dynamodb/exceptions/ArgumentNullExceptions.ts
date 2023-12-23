import { BaseException } from "./BaseException";

export class ArgumentNullException extends BaseException {
  constructor(message?: string) {
    super(message);
  }

  getMessageByError(): string {
    return 'Condition is must be needed.'
  }
}