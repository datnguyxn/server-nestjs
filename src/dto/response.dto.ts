import { IResponse } from '../interfaces/response.interface';

export class ResponseError implements IResponse {
  constructor(infoMessage: string, data?: any) {
    this.success = false;
    this.message = infoMessage;
    this.data = data;
    console.warn(
      new Date().toString() +
        ' - [Response]: ' +
        infoMessage +
        (data ? ' - ' + JSON.stringify(data) : ''),
    );
  }

  message: string;
  errorMessage: string;
  data: any[];
  error: any;
  success: boolean;
}

export class ResponseSuccess implements IResponse {
  constructor(infoMessage: string, data?: any, notLog?: boolean) {
    this.success = true;
    this.message = infoMessage;
    this.data = data;
    if (!notLog) {
      try {
        var offuscateRequest = JSON.parse(JSON.stringify(data));
        if (offuscateRequest && offuscateRequest.token) {
          offuscateRequest.token = '*******';
        }
        console.log(
          new Date().toString() +
            ' - [Response]: ' +
            infoMessage +
            (data ? ' - ' + JSON.stringify(offuscateRequest) : ''),
        );
      } catch (e) {
        console.log(e);
      }
    }
  }

  message: string;
  errorMessage: string;
  data: any[];
  error: any;
  success: boolean;
}
