import { Component, OnInit } from '@angular/core';
import { APIService } from './API.service';
import { Auth } from 'aws-amplify';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  todos = [];

  constructor(private apiService: APIService) {}

  async ngOnInit() {

    let x = await this.apiService.ListTodos();
    this.todos = x.items;
    this.apiService.OnCreateTodoListener.subscribe((evt) => {
      const data = (evt as any).value.data.onCreateTodo;
      this.todos = [...this.todos, data];
    });

    this.listAllTodos();

    this.signUp();

    this.apiService.CreateDog({
      name: "blob"
    })
   
  }

  createTodo() {
    this.apiService.CreateDog({
      name: "bob"
    })
    
    this.apiService.CreateTodo({
        name: 'Angular',
        description: 'testing'
    });
  }

  async listAllTodos(){
    let x = await this.apiService.ListTodos();
    console.log(x);
  }

  async signUp() {
    try {
        const user = await Auth.signUp({
            username:"jasecoin",
            password:"Cornwall967!",
            attributes: {
                email:"mjasonlouw@gmail.com"
            }
        });
        console.log({ user });
    } catch (error) {
        console.log('error signing up:', error);
    }
  }
}
