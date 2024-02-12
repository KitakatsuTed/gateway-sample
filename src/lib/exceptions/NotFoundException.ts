export class NotFoundException extends Error {
  /**
   * コンストラクタ
   * @param message メッセージ
   */
  constructor(message?: string) {
    super(message);

    this.name = 'NotFoundException';
  }
}
