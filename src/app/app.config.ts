import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { rateLimitInterceptor } from './Interceptors/rate-limit.interceptor';







export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([rateLimitInterceptor])),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideAnimationsAsync(),
        providePrimeNG({ 
            theme: {
                preset: Aura,
                options: {
                    darkModeSelector: false // מבטל מצב כהה אוטומטי
                }
            }
        })
  ]
};
