import { HttpBaseException } from './HttpBaseException';
export class UnprocessableEntityException extends HttpBaseException {
  /**
   * コンストラクタ
   * @param message メッセージ
   */
  statusCode = 422;
}
