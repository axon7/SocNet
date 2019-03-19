const isEmpty = require('./is-empty');

const Validator = require('validator');

module.exports = function validateRegisterInput(data){
    //start with empty errors
    let errors = {};
//if name isn't empty -> is stay like this otherwise its "";
    data.name = !isEmpty(data.name) ? data.name : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.password2 = !isEmpty(data.password2) ? data.password2 : "";


    if(!Validator.isLength(data.name, {min: 2, max: 30})){
    errors.name = "Name must be between 2 and 30 characters";
    }

    if(Validator.isEmpty(data.name)){
        errors.name = "The name field is required";
    }

    if(Validator.isEmpty(data.email)){
        errors.email = "The email field is required";
    }
    if(!Validator.isEmail(data.email)){
        errors.email = "The email is invalid";
    }

    if(Validator.isEmpty(data.password)){
        errors.password = "The password field is required";
    }

    if(!Validator.isLength(data.password, {min: 6, max: 30})){
        errors.password = "Password must be at least 6 characters";
    }

    if(Validator.isEmpty(data.password2)){
        errors.password2 = "Confirm password filed is required";
    }


    if(!Validator.equals(data.password, data.password2)){
        errors.password2 ="Passwords must match";
    }



    //if there are some errors it will add properties to object
    return {
        errors,
        //if errors are empty -> isEmpty is true so it is valid
        isValid: isEmpty(errors)
    }
};