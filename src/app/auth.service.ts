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
      email,
      profilePicture: "",
      parties: [],
      images: [],
    })
    console.log("creating user", y)
  }

  // export type UpdateUserInput = {
  //   id: string;
  //   username?: string | null;
  //   name?: string | null;
  //   surname?: string | null;
  //   email?: string | null;
  //   location?: LocationInput | null;
  //   parties?: Array<string | null> | null;
  //   images?: Array<string | null> | null;
  //   profilePicture?: string | null;
  // };

  async updateUser(user){
    let x = {
      id:user.id, 
      name: user.name, 
      username: user.username, 
      location: {
        latitude: user.location.latitude,
        longitude: user.location.longitude
      }, 
      email: user.email,
      surname: user.surname,
      parties: user.parties,
      images: user.images,
      profilePicture: user.profilePicture
    }

    console.log("TRYING TO UPDATE USER")
    let updateP = await this.apiService.UpdateUser(x);
    console.log("update User:", updateP)
  }
}
