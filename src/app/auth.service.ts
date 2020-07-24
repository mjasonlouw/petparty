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

    let num = Math.floor(Math.random() * 16) + 1;
    let pfp = num + ".PNG"

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
      profilePicture: pfp,
      parties: [],
      images: [],
    })
    console.log("creating user", y)
  }

 async randomizePFP(){
  let num = Math.floor(Math.random() * 16) + 1;
  let pfp = num + ".PNG"
  this.currentUser.profilePicture = pfp;
  this.updateUser(this.currentUser);
 }

  async updateUser(user){
    let pfp = "";
    if(user.profilePicture == ""){
      let num = Math.floor(Math.random() * 16) + 1;
      pfp = num + ".PNG"
    }else{
      pfp = user.profilePicture;
    }

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
      profilePicture: pfp
    }

    console.log("TRYING TO UPDATE USER")
    let updateP = await this.apiService.UpdateUser(x);
    console.log("update User:", updateP)
    this.currentUser = updateP;
  }
}
