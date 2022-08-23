import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@libs/nc-interceptors';

import type { IExceptionProps } from '@libs/nc-interceptors';

interface IErrorsProps {
  unauthorized: IExceptionProps;
}

export class AuthException extends BaseException {
  private static errors: IErrorsProps = {
    unauthorized: {
      code: 10_001,
      message: 'Unauthorized',
      status: HttpStatus.UNAUTHORIZED,
    },
  };

  constructor(exceptionName: keyof IErrorsProps) {
    super(AuthException.errors[exceptionName]);
  }
}
