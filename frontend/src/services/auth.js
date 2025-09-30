import config from "../../config/config.js";

export class Auth{
  static accessTokenKey = 'accessToken';
  static refreshTokenKey = 'refreshToken';

  static async processUnauthorizedResponse (){
    const refreshToken = localStorage.getItem(this.refreshTokenKey);
    if(refreshToken){
      const response = await fetch(config.host + '/refresh',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          refreshToken: refreshToken
        })
      });
      if(response && response.status === 200) {
        const result = await response.json();
        if(result && !result.error){
          this.setToken(result.accessToken, result.refreshToken);
          return true;
        } else {
          throw new Error(result.message);
        }
      }
    }
  };


  static setToken(accessToken, refreshToken) {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
  }
}