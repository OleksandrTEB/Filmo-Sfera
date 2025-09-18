import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {StartPage} from './core/features/start-page/start-page';
import {registerPage} from './core/features/auth/register-page/register-page';
import {Settings} from './core/features/home-page/settings/settings';
import {loginPage} from './core/features/auth/login-page/login-page';
import {HomePage} from './core/features/home-page/home-page';
import {FilmsPage} from './core/features/films/films-page/films-page';
import {AdminPage} from './core/admin/admin-page/admin-page';
import {AuthGuard} from './core/guard/auth-guard';
import {FilmsInfoPage} from './core/features/films/films-info-page/films-info-page';
import {AdminGuard} from './core/guard/admin-guard';
import {Profile} from './core/features/profile/profile';
import {ClassWatch} from './core/features/films/watch/watch';
import {NoAuthGuard} from './core/guard/no-auth-guard';
import {Verified} from './core/features/auth/verificted/verified.component';


const routes: Routes = [
  {
    path: '',
    component: StartPage,
    canActivate: [NoAuthGuard],
    children: [
      { path: 'login', component: loginPage },
      { path: 'register', component: registerPage },
    ]
  },

  { path: 'verification', component: Verified },



  {
    path: '',
    component: HomePage,
    canActivate: [AuthGuard],
    children: [
      {path: 'profile', component: Profile },
      {path: 'settings', component: Settings },
      {path: 'films', component: FilmsPage },
      {path: 'filminfo/:id', component: FilmsInfoPage },
      {path: 'watch/:id', component: ClassWatch },
    ]
  },


  {
    path: '', component: HomePage,
    canActivate: [AdminGuard],
    children: [
      { path: 'admin', component: AdminPage },
    ]
  },

  { path: '**', redirectTo: 'StartPage' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
