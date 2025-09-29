export class Form  {

    constructor(page) {

        this.agreeElement = null;
        this.processElement = null;
        this.page = page;

        this.fields = [

            {
                name: 'email',
                id: 'email',
                element: null,
                regex: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                valid: false,
            },
            {
                name: 'password',
                id: 'password',
                element: null,
                regex: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/,
                valid: false,
            },
        ]

        if(this.page === 'signup'){
            this.fields.unshift(
              {
                  name: 'name',
                  id: 'name',
                  element: null,
                  regex: /^[А-Я][а-я]+\s*$/,
                  valid: false,
              },
              {
                  name: 'lastName',
                  id: 'last-name',
                  element: null,
                  regex: /^[А-Я][а-я]+\s*$/,
                  valid: false,
              }
            )
        }

        const that = this;
        this.fields.forEach(item => {
            item.element = document.getElementById(item.id);
            item.element.onchange = function () {
                that.validateField.call(that, item, this);
            }
        });
        this.processElement = document.getElementById('process');
        this.processElement.onclick = function () {
            that.processForm()
        }
        if(this.page === 'signup'){
            this.agreeElement = document.getElementById('agree');
            this.agreeElement.onchange = function () {
                that.validateForm();
            }
        }
    }

        validateField(field,element){
            if(!element.value || !element.value.match(field.regex)){
                element.parentNode.style.borderColor = 'red';
                field.valid = false;
            } else {
                element.parentNode.removeAttribute('style');
                field.valid = true;
            }
            this.validateForm();
        }
        validateForm(){
            const validForm = this.fields.every(function(item){
                return item.valid;
            })
            const isValid = this.agreeElement ? this.agreeElement.checked && validForm : validForm;
            if (isValid){
                this.processElement.removeAttribute('disabled');
            } else {
                this.processElement.setAttribute('disabled','disabled ');
            }
            return isValid;
        }

        processForm(){
            if(this.validateForm()){
                let paramString = '';
                this.fields.forEach(item => {
                    paramString += (!paramString ? '?' : '&') + item.name  + '=' + item.element.value;
                })


                location.href = '#/choice' + paramString;

            }
        }
    }


