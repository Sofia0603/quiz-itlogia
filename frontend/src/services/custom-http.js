import {Auth}  from "../services/auth.js";
export class CustomHttp{
    static async request(url, method = 'GET', body = null){

      const params = {
        method: method,
        headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json',
        }
      };

      let token = localStorage.getItem(Auth.accessTokenKey);
      if(token){
        params.headers['x-access-token'] = token;
      }

      if (body) {
        params.body = JSON.stringify(body);
      }

      const response = await fetch(url, params)

      if(response.status !== 200 || response.status >= 300){
        if(response.status === 401){
          const result = await Auth.processUnauthorizedResponse();
          if(result){

          }
        }

        throw new Error(response.message);
      }

      return await response.json();

    }
}