import {UrlManager} from "../utils/url-manager.js";
import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {Auth} from "../services/auth.js";

export class Result {
     constructor() {

         this.routeParams = UrlManager.getQueryParams();
         this.answersLink = document.querySelector('.result-link');
         this.init();


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
             const chosenAnswers = result.chosen_options;
             this.answersLink.onclick = function(event) {
               event.preventDefault();
               event.stopPropagation();
               location.href = '#/answers?testId=' + result.test_id + '&chosenAnswers=' + chosenAnswers;
             }
             return
           }
         } catch (error){
           console.log(error);
         }
       }
     }

 }
