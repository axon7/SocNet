const isEmpty = require('./is-empty');

const Validator = require('validator');

module.exports = function validateProfileInput(data){
    //start with empty errors
    let errors = {};
//if name isn't empty -> is stay like this otherwise its "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";

    
    if(!Validator.isEmail(data.email)){
        errors.email = "The email is invalid";
    }

    

    if(Validator.isEmpty(data.email)){
        errors.email = "The email field is required";

        
    }

    if(Validator.isEmpty(data.password)){
        errors.password = "The password field is required";
    }

    
    //if there are some errors it will add properties to object
    return {
        errors,
        //if errors are empty -> isEmpty is true so it is valid
        isValid: isEmpty(errors)
    }
};