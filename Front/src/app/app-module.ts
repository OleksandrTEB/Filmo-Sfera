import { NgModule, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { App } from './app';
import { StartPage } from './core/features/start-page/start-page';
import { registerPage } from './core/features/auth/register-page/register-page';
import {HomePage} from './core/features/home-page/home-page';
import { FilmsPage } from './core/features/films/films-page/films-page';
import {HashLocationStrategy, LocationStrategy, NgOptimizedImage} from '@angular/common';
import { FilmsInfoPage } from './core/features/films/films-info-page/films-info-page';
import { AdminPage } from './core/admin/admin-page/admin-page';
import {FormsModule} from '@angular/forms';
import {provideHttpClient, withFetch} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import { Comments } from './core/features/films/films-info-page/comments/comments';
import { ClassWatch } from './core/features/films/watch/watch';
import { Profile } from './core/features/profile/profile';
import { Review } from './core/features/films/watch/review/review';
import { RouterModule } from '@angular/router';
import { EventFilm } from './core/features/profile/eventfilm/eventfilm';
import { Verified } from './core/features/auth/verificted/verified.component';
import {PreloaderComponent} from './core/features/preloader/preloader';
import { Settings } from './core/features/home-page/settings/settings';


@NgModule({
  declarations: [
    App,
    HomePage,
    FilmsInfoPage,
    AdminPage,
    Comments,
    ClassWatch,
    Profile,
    Review,
    Verified,
    Settings,
  ],
  imports: [
    PreloaderComponent,
    BrowserModule,
    AppRoutingModule,
    StartPage,
    registerPage,
    NgOptimizedImage,
    FormsModule,
    FilmsPage,
    RouterModule,
    EventFilm
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(withFetch()),
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [App]
})
export class AppModule {}
