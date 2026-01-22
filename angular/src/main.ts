import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config'; // Ta ścieżka musi być poprawna
import { App } from './app/app'; // Lub AppComponent zależnie od Twojej nazwy

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));