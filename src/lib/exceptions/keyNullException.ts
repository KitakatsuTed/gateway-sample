/**
 * 引数NULL例外
 */
export class KeyNullException extends Error {
  /**
   * コンストラクタ
   * @param parameterName パラメータ名
   * @param message メッセージ
   */
  constructor(parameterName: string, message?: string) {
    super(message);

    this.name = 'KeyNullException';
    this.stack = (<any> new Error()).stack;
  }
}