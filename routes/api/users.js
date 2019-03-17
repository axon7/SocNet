const express =  require("express");
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
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

module.exports=  router;