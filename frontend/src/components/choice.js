import {UrlManager} from "../utils/url-manager.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class Choice {

    constructor() {
        this.quizzes = [];
        this.routeParams = UrlManager.getQueryParams();


        this.init();
    }


    async init(){
        try {
            const result = await CustomHttp.request(config.host + '/tests')
            if(result){
                if(result.error){
                    throw new Error(result.message);
                }
                this.quizzes = result;
                this.processQuizzes();
            }
        } catch (error) {
            console.log(error);
        }
    }

    processQuizzes() {
        const choiceOptionsElement = document.getElementById('choiceOptions');
        if (this.quizzes && this.quizzes.length > 0) {
            this.quizzes.forEach(quiz => {
                const choiceOptionElement = document.createElement('div');
                const that = this;
                choiceOptionElement.className = 'choice-option';
                choiceOptionElement.setAttribute('data-id', quiz.id);
                choiceOptionElement.onclick = function () {
                    that.chooseQuiz(this)
                }


                const choiceOptionTextElement = document.createElement('div');
                choiceOptionTextElement.className = 'choice-option-text';
                choiceOptionTextElement.innerText = quiz.name;

                const choiceOptionArrowElement = document.createElement('div');
                choiceOptionArrowElement.className = 'choice-option-arrow';

                const choiceOptionImageElement = document.createElement('img');
                choiceOptionImageElement.setAttribute('src', '/images/arrow.png');
                choiceOptionImageElement.setAttribute('alt', 'стрелка');

                choiceOptionArrowElement.appendChild(choiceOptionImageElement);
                choiceOptionElement.appendChild(choiceOptionTextElement);
                choiceOptionElement.appendChild(choiceOptionArrowElement);

                choiceOptionsElement.appendChild(choiceOptionElement);
            })
        }
    }
    chooseQuiz(element) {
        const dataId = element.getAttribute('data-id');
        if (dataId) {
            location.href = '#/test?name=' + this.routeParams.name + '&lastName=' + this.routeParams.lastName +
              '&email=' + this.routeParams.email  +'&id=' + dataId;
        }
    }
}
