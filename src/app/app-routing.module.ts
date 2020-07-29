import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router, NavigationStart } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { AuthService } from './auth.service';
import { HomeComponent } from './home/home.component';


const routes: Routes = [
  {path: 'register', component: RegisterComponent},
  {path: 'signIn', component: SignInComponent},
  {path: 'home', component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
  originalURL= "";
  constructor(
    private authService: AuthService,
    private router: Router){

    router.setUpLocationChangeListener
   
    router.events.subscribe(data => {
      if(data instanceof NavigationStart) {
        authService.currentSession().then(hasSession => {
          if(hasSession){
            
            this.router.navigate(['/home']);
          }else{
            
            if(data.url != '/register'){
              this.router.navigate(['/signIn']);
            }
          }
        })
      }
    });
  }
}
