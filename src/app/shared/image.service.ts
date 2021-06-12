import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import {map} from 'rxjs/operators';
//import { Image } from "./image.model";

const ENV_URL="https://peaceful-headland-81111.herokuapp.com";
const BACKEND_URL=ENV_URL+"/files";

@Injectable()
export class ImageService {
  private fileName: string = "";
  private imagesUpdated = new Subject<{fileName:string}>();

  constructor(private httpClient: HttpClient, private router: Router) { }


  getImageUpdateListener() {
    return this.imagesUpdated.asObservable();
  }


   addImage(secretCode:string, image:File) {
    
    //const image: Image = { _id: null, imageName: imageName, imageSellingPrice: imageSellingPrice,imageCostPrice:imageCostPrice,imageQuantity:imageQuantity };
    const postData=new FormData();
    postData.append("secretCode",secretCode);
    postData.append("file",image);
	  // let data:any={secretCode:secretCode, file:image}
    // console.log(postData);
    this.httpClient
      .post<{ message: string; fileName: string }>(
       ENV_URL+"/upload",
        postData
      )
      .subscribe(responseData => {
        
        // console.log(responseData);
        const image_fileName=responseData.fileName;
		this.fileName=image_fileName;
		this.imagesUpdated.next({fileName:this.fileName});
        
      });
  }

  
  updateImage(fileName:string) {
    const image = "";
    this.httpClient
      .put(BACKEND_URL+"/" + fileName, image)
      .subscribe(response => {
      // console.log(response);
      });
  }
  
  deleteImage(secretCode:string,fileName:string) {
    return this.httpClient
      .delete(BACKEND_URL+"/" + secretCode+"/"+fileName);
  }

}