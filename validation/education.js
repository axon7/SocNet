const isEmpty = require('./is-empty');

const Validator = require('validator');

module.exports = function validateEducationInput(data){
    //start with empty errors
    let errors = {};
//if name isn't empty -> is stay like this otherwise its "";

//those field are required, that's why we set it to empty :)
    data.school = !isEmpty(data.school) ? data.school : "";
    data.degree = !isEmpty(data.degree) ? data.degree : "";
    data.from = !isEmpty(data.from) ? data.from : "";

    if(Validator.isEmpty(data.school)){
        errors.school = "School is empty";
    }  
    
    if(Validator.isEmpty(data.degree)){
        errors.degree = "Degree field is empty";
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