import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AmplifyUIAngularModule } from '@aws-amplify/ui-angular';
import { RegisterComponent } from './register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignInComponent } from './sign-in/sign-in.component';
import { ConfirmUserComponent } from './confirm-user/confirm-user.component';
import { HomeComponent } from './home/home.component';
import { MapComponent } from './map/map.component';
import { CreatePartyComponent } from './create-party/create-party.component';
import { ListPartiesComponent } from './list-parties/list-parties.component';
import { ChatComponent } from './chat/chat.component';
import { PhotoUploadComponent } from './photo-upload/photo-upload.component';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// import Amplify from 'aws-amplify';
// import awsconfig from '../aws-exports';

// Amplify.configure(awsconfig);

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    SignInComponent,
    ConfirmUserComponent,
    HomeComponent,
    MapComponent,
    CreatePartyComponent,
    ListPartiesComponent,
    ChatComponent,
    PhotoUploadComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AmplifyUIAngularModule,
    FormsModule, 
    ReactiveFormsModule,
    HttpClientModule,
    MatIconModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
