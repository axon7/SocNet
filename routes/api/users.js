const express =  require("express");
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const key = require('../../config/keys');


//load input validator
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

//load user model
const User = require("../../models/User");

//@route    GET api/users/test
//@desc     testing users route
//@access   public
router.get("/test", (req, res) =>{
    res.json({msg: "Users test Ok!"});
});

//@route    POST api/users/register
//@desc     register user
//@access   public
router.post('/register', (req, res)=>{
    //checking validation
    const {errors, isValid} = validateRegisterInput(req.body);
    if(!isValid){
        return res.status(400).json(errors)
    }
    //if the email exists in users collection -> create new user
    User.findOne({email: req.body.email})
       .then(user =>{
           if(user){
               errors.email = "Email already exists"
               return res.status(400).json(errors);
           } else{
               const avatar = gravatar.url(req.body.email, {
                   s: '200',
                   r: 'pg',
                   d: 'mm'
               })


               const newUser = new User({
                   email: req.body.email,
                   name: req.body.name,
                   avatar,
                   password: req.body.password
               });

               bcrypt.genSalt(10, (err, salt)=>{
                        bcrypt.hash(newUser.password, salt, (err, hash)=>{
                            if(err) throw err;
                            newUser.password = hash;
                            newUser.save()
                                    .then(user=> res.json(user) )
                                    .catch(err=>console.log(err));
                        });
               })
           }
       })
    
});


//@route    POST api/users/login
//@desc     login user, returning the token
//@access   public
router.post('/login', (req, res)=>{
    const {errors, isValid} = validateLoginInput(req.body);
    if(!isValid){
        return res.status(400).json(errors)
    }

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email})
        .then(user =>{
            //check if the typed email does exist
            if(!user){
                errors.email = "User not found"
                return res.status(404).json(errors);
            } 
                //if exist then check is the password correct
                bcrypt.compare(password, user.password).then(matching=>{
                    if(matching){
                        const payload = {id: user.id, name: user.name, avatar: user.avatar};
                        jwt.sign(payload, key.secretOrKey,{expiresIn:3600000}, (err, token)=>{
                            res.json({
                                success: true,
                                token: "Bearer " + token
                            });
                        });
                    } else {
                        errors.password = "Pasword incorrect!";
                        return res.status(400).json(errors);
                    }
                })
            
        });
});



router.get("/current", passport.authenticate('jwt', {session: false}), (req,res) =>{
    res.json({msg: req.body});
})


module.exports=  router;