import {UrlManager} from "../utils/url-manager.js";

export class Result {
     constructor() {

         this.routeParams = UrlManager.getQueryParams();

         const answersLink = document.querySelector('.result-link');

         document.getElementById('result-score').innerText = this.routeParams.score + '/' +
             this.routeParams.total;



         if (this.routeParams.id && this.routeParams.answers && this.routeParams.name && this.routeParams.lastName && this.routeParams.email) {
             answersLink.href = `#/answers?id=${this.routeParams.id}&answers=${this.routeParams.answers}&name=${encodeURIComponent(this.routeParams.name)}&lastName=${encodeURIComponent(this.routeParams.lastName)}&email=${encodeURIComponent(this.routeParams.email)}`;
         } else {
             answersLink.style.color = 'red';
         }
     }
 }
