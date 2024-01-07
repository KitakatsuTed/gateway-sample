import { HttpBaseException } from './HttpBaseException';
export class UnprocessableEntityException extends HttpBaseException {
  statusCode = 422;
}
