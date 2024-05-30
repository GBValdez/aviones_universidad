import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { InterceptorService } from '@utils/interceptor.service';
import { APP_DATE_FORMATS_PROVIDER } from '@utils/formatDate';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),

    importProvidersFrom(HttpClientModule, MatMomentDateModule),
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    APP_DATE_FORMATS_PROVIDER,
  ],
};
