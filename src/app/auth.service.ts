import { Injectable } from '@angular/core';
import { Auth } from 'aws-amplify';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

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

  async confirmSignUp(username, code) {
    try {
      return await Auth.confirmSignUp(username, code);
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
    }catch(error){
      console.log(error)
    }
  }
}
