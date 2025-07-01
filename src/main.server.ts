import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient }    from '@angular/common/http';
import { AppComponent }         from './app/app';      // ✅ same symbol
import { config }               from './app/app.config.server';

const bootstrap = () => bootstrapApplication(AppComponent, {
  providers: [provideHttpClient(), ...config.providers ?? []],
});

export default bootstrap;
