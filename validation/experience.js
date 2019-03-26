const isEmpty = require('./is-empty');

const Validator = require('validator');

module.exports = function validateExperienceInput(data){
    //start with empty errors
    let errors = {};
//if name isn't empty -> is stay like this otherwise its "";

//those field are required, that's why we set it to empty :)
    data.title = !isEmpty(data.title) ? data.title : "";
    data.company = !isEmpty(data.company) ? data.company : "";
    data.from = !isEmpty(data.from) ? data.from : "";

    if(Validator.isEmpty(data.title)){
        errors.title = "Title is empty";
    }  
    
    if(Validator.isEmpty(data.company)){
        errors.company = "Company field is empty";
    }
        
    if(Validator.isEmpty(data.from)){
        errors.from = "Date 'from' field is empty";
    }

    
    //if there are some errors it will add properties to object
    return {
        errors,
        //if errors are empty -> isEmpty is true so it is valid
        isValid: isEmpty(errors)
    }
};