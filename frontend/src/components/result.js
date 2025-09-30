import {UrlManager} from "../utils/url-manager.js";
import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {Auth} from "../services/auth.js";

export class Result {
     constructor() {

         this.routeParams = UrlManager.getQueryParams();

         this.init();
         // const answersLink = document.querySelector('.result-link');


         //
         //
         //
         // if (this.routeParams.id && this.routeParams.answers && this.routeParams.name && this.routeParams.lastName && this.routeParams.email) {
         //     answersLink.href = `#/answers?id=${this.routeParams.id}&answers=${this.routeParams.answers}&name=${encodeURIComponent(this.routeParams.name)}&lastName=${encodeURIComponent(this.routeParams.lastName)}&email=${encodeURIComponent(this.routeParams.email)}`;
         // } else {
         //     answersLink.style.color = 'red';
         // }
     }

     async init(){

       const userInfo = Auth.getUserInfo();
       if(!userInfo){
         location.href="#/";
       }

       if(this.routeParams.id) {
         try{
           const result = await CustomHttp.request(config.host + '/tests/' + this.routeParams.id + '/result?userId=' + userInfo.userId, 'GET')

           if(result){
             if(result.error){
               throw new Error(result.error)
             }
             document.getElementById('result-score').innerText = result.score + '/' + result.total;
             return
           }
         } catch (error){
           console.log(error);
         }
       }
     }
 }
