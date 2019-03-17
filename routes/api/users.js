const express =  require("express");
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const User = require("../../models/User");
const passport = require('passport');
const jwt = require('jsonwebtoken');
const key = require('../../config/keys');

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
    //if the email exists in users collection -> create new user
    User.findOne({email: req.body.email})
       .then(user =>{
           if(user){
               return res.status(400).json({email: "this email already exists"});
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
                        })
               })
           }
       })
    
});


//@route    POST api/users/register
//@desc     login user, returning the token
//@access   public
router.post('/login', (req, res)=>{
    const password = req.body.password;
    const email = req.body.email;

    User.findOne({email})
        .then(user =>{
            //check if the typed email does exist
            if(!user){
                return res.status(404).json({msg: "Email not found"});
            } else{
                //if exist then check is the password correct
                bcrypt.compare(password, user.password).then((matching)=>{
                    if(!matching){
                        return res.status(400).json({msg: "password incorrect"});
                    } else {
                        const payload = {id: user.id, name: user.name, avatar: user.avatar};
                        jwt.sign(payload, key.secretOrKey,{expiresIn:3600}, (err, token)=>{
                            res.json({
                                success: true,
                                token: "Bearer " + token
                            })
                        })


                    }
                })


            }
        })
});














module.exports=  router;