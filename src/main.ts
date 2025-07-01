import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent }          from './app/app';
import { appConfig }             from './app/app.config';   // 👈 import this

bootstrapApplication(AppComponent, appConfig)              // 👈 use it
  .catch(err => console.error(err));
