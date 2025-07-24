/* eslint-disable @typescript-eslint/no-explicit-any */
export class HttpException extends Error {
  status: number;
  message: string;
  erros?: any;

  constructor(status: number, message: string, erros?: any) {
    super(message);
    this.status = status;
    this.message = message;

    if (erros) this.erros = erros;
  }
}
