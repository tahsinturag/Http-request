import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import {provideHttpClient} from "@angular/common/http";

// 3
bootstrapApplication(AppComponent, {
  providers: [provideHttpClient()],
}).catch((err) => console.error(err));
