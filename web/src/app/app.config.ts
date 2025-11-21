import {
  ApplicationConfig,
  provideZonelessChangeDetection,
  isDevMode,
  importProvidersFrom,
  inject,
  provideAppInitializer,
} from "@angular/core";
import { provideRouter } from "@angular/router";
import { routes } from "./app.routes";
import { provideServiceWorker } from "@angular/service-worker";
import { BrowserModule } from "@angular/platform-browser";
import { ThemeService } from "./services/theme.service";
import { DexieService } from "./services/db.service";

export function initializeDatabase(dexieService: DexieService) {
  return () => dexieService.init();
}

export function initializeTheme(themeService: ThemeService) {
  return () => themeService.loadUserPreference();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideServiceWorker("ngsw-worker.js", {
      enabled: !isDevMode(),
      registrationStrategy: "registerWhenStable:30000",
    }),
    importProvidersFrom(BrowserModule),
    provideAppInitializer(() => {
      const initializerFn = initializeDatabase(inject(DexieService));
      return initializerFn();
    }),
    provideAppInitializer(() => {
      const initializerFn = initializeTheme(inject(ThemeService));
      return initializerFn();
    }),
  ],
};
