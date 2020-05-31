import { Injectable } from '@angular/core';
import { Auth } from 'aws-amplify';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private username:string = "";
  private password: string = "";

  constructor(
    private router: Router
  ) {
 
   }

  async signUp(newUser) {
    try {
        const user = await Auth.signUp(newUser);
        return { user };
    } catch (error) {
        return error;
    }
  }

  async confirmSignUp(code) {

    console.log(this.username,"----", code)
    try {
      return await Auth.confirmSignUp(this.username, code);
    } catch (error) {
      return error;
    }
  }

  async signIn(username, password){
    try{
      return await Auth.signIn(username, password);
    }catch(error){
      return error;
    }
  }

  async autoSignIn(){
    try{
      let x =  await Auth.signIn(this.username, this.password);
      
      return x;
    }catch(error){
      return error;
    }
  }

  async currentSession(){
    try{
      let userSession = await Auth.currentSession();
      return true;
    }catch{
      return false;
    }
  }

  async logout(){
    try{
      await Auth.signOut();
      this.router.navigate(['/signIn']);
    }catch(error){
      console.log(error)
    }
  }

  async setUsername(username: string){
    this.username = username;
  }

  async setPassword(password: string){
    this.password = password;
  }
}
