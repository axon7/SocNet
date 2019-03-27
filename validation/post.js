const isEmpty = require('./is-empty');

const Validator = require('validator');

module.exports = function validatePostInput(data){
    //start with empty errors
    let errors = {};
//if name isn't empty -> is stay like this otherwise its "";

//those field are required, that's why we set it to empty :)
    data.text = !isEmpty(data.text) ? data.text : "";
    data.company = !isEmpty(data.company) ? data.company : "";
    data.from = !isEmpty(data.from) ? data.from : "";

    if(Validator.isLength(data.text, {min: 10, max: 250})){
        errors.title = "Please enter text between 10 and 250 characters";
    }  
    
    
    if(Validator.isEmpty(data.text)){
        errors.text = "Text field is empty";
    }

    
    //if there are some errors it will add properties to object
    return {
        errors,
        //if errors are empty -> isEmpty is true so it is valid
        isValid: isEmpty(errors)
    }
};