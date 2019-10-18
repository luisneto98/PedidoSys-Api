import { ArgumentsHost, Catch, HttpException, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import * as sentry from '@sentry/node';
import { ICurrentUser } from 'interfaces/tokens/currentUser';
import { IS_DEV, NODE_ENV, SENTRY_DSN } from 'settings';

sentry.init({
  dsn: SENTRY_DSN,
  environment: NODE_ENV
  // release: VERSION
});

Error.prepareStackTrace = err => {
  return err.stack
    .split('\n')
    .filter(x => !x.includes('node_modules'))
    .join('\n');
};

@Catch()
export class ExceptionFilter extends BaseExceptionFilter {
  public catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    if (status >= 500) {
      sentry.withScope(scope => {
        scope.setExtras({
          req: {
            method: request.method,
            url: request.url,
            queryString: request.params,
            body: request.body
          }
        });

        const user: ICurrentUser = (request as any).user;
        if (user) {
          scope.setUser({ id: user.id.toString(), email: user.email, username: user.email });
        }

        scope.setTag('url', request.url);

        const error: Error = exception.originalError || exception;
        sentry.captureException(error);
      });
    }

    if (IS_DEV && !(exception instanceof HttpException)) {
      this.applicationRef.reply(host.getArgByIndex(1), exception.stack, status);
      return;
    }

    super.catch(exception, host);
  }
}
