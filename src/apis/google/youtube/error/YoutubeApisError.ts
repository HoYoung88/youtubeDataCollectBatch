import { GaxiosError } from 'gaxios';

export class YoutubeApisError extends Error {
  constructor(funcName: string, error: GaxiosError | Error) {
    let errorMsg = funcName;
    if (error instanceof GaxiosError) {
      errorMsg += ` [${error.response?.status}] ${error.message}`;
    } else {
      errorMsg += ` [9999] ${error.message}`;
    }
    super(errorMsg);
  }
}
