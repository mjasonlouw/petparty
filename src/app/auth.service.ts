import { Injectable } from '@angular/core';
import { Auth } from 'aws-amplify';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  async signUp(newUser) {
    try {
        const user = await Auth.signUp(newUser);
        return { user };
    } catch (error) {
        return error;
    }
  }
}
