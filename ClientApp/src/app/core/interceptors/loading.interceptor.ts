import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';

import { LoadingService } from '../services/loading.service';
import { NO_LOADING } from '../constants/api.const';

export const LoadingInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const loading = inject(LoadingService);

  const noLoading = req.context.get(NO_LOADING);

  if (!noLoading) {
    loading.show();
  }

  return next(req).pipe(
    finalize(() => {
      if (!noLoading) {
        loading.hide();
      }
    }),
  );
};
