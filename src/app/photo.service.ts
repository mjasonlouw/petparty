import { Injectable } from '@angular/core';
const aws = require('aws-sdk');
import { environment } from '../environments/environment';
import { APIService } from './API.service';
import { AuthService } from './auth.service';
import { v4 as uuidv4 } from 'uuid';





@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  config: any;
  albumBucketName = "BUCKET_NAME";
  bucketRegion = "REGION";
  IdentityPoolId = "eu-west-1";

  constructor(
    private apiService:APIService,
    private authService: AuthService
  ) { 
    console.log("this service is up and running my dude")

    this.config = new aws.Config({
      accessKeyId: environment.aws.AccessKeyID, 
      secretAccessKey: environment.aws.SecretAccessKey, 
      region: 'us-east-1',
    });

  aws.config.update({
      accessKeyId: environment.aws.AccessKeyID, 
      secretAccessKey: environment.aws.SecretAccessKey, 
      region: 'eu-west-1',
    });

  }

  async uploadPhotoToDynamo(data){
    //create image in db
    let y = await this.apiService.CreateImages({
      owner: this.authService.currentUser.id,
      key: data.key}
      //upload image to user profile

      //upload image to chat profile
    )

  }


  addPhoto(file):string {
    
    var files = [file];
    if (!files.length) {
       alert("Please choose a file to upload first.");
    }
    var file = files[0];
    var fileName = file.name;
    console.log("file", file)
    var splitName = fileName.split(".")
    var photoKey = uuidv4() +"."+ splitName[splitName.length-1];
  
    // Use S3 ManagedUpload class as it supports multipart uploads
    var upload = new aws.S3.ManagedUpload({
      params: {
        Bucket: 'petparty-bucket',
        Key: photoKey,
        Body: file,
        ACL: "public-read"
      }
    });
  
    var promise = upload.promise();
  
    promise.then(
      function(data) {
        console.log("data", data)
        // alert("Successfully uploaded photo.");
      },
      function(err) {
       alert("There was an error uploading your photo: "+ err.message);
      }
    );


    return photoKey;
    
  }


}
