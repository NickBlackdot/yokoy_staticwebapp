import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient }    from '@angular/common/http';   // ← make sure this line exists
import { AppComponent }         from './app/app';

// 👇 providers MUST contain provideHttpClient()
bootstrapApplication(AppComponent, {
  providers: [provideHttpClient()],
}).catch(err => console.error(err));
