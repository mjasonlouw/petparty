import { Injectable } from '@angular/core';
import { Auth } from 'aws-amplify';
import { Router } from '@angular/router';
import { APIService } from './API.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private username:string = "";
  private password: string = "";
  public currentUser: any = null;

  constructor(
    private router: Router,
    private apiService: APIService
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
      var userSession = await Auth.currentSession();
      console.log("userseeeession",userSession)
      console.log("Current session", userSession['accessToken'].payload.username)
      this.getCurrentSessionUserBy(userSession['accessToken'].payload.username);
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

  async getCurrentSessionUserBy(username){
    this.currentUser = await this.apiService.GetUser(username);
    console.log("CUrrent user dynamo:", this.currentUser)
  }

  async createUserInDynamo(username, name, surname, email){
    let y = await this.apiService.CreateUser({
      location:{
        longitude: 0,
        latitude: 0
      },
      id: username,
      username,
      name,
      surname,
      email
    })
    console.log("creating user", y)
  }
}
