const express =  require("express");
const router = express.Router();
const passport = require('passport');

//load User model
const User = require("../../models/User");
//load Profile model
const Profile = require("../../models/Profile");



router.get("/test", (req, res) =>  res.send("profile page"));

//@route    GET api/profile/
//@desc     get current users profile
//@access   private
router.get("/", passport.authenticate('jwt', {session:false}), (req, res)=>{
    const errors = {};
    Profile.findOne({user: req.body.id})
        .then(profile =>{
            if(!profile){
                errors.noprofile = "there is no profile for this user";
                return res.status(404).json(errors);
            } 
            res.json(profile);
        })
        .catch(err =>  res.status(404).json(err))
})


//@route    POST api/profile/
//@desc     route to create new profile
//@access   private
router.post("/", passport.authenticate('jwt', {session:false}), (req, res)=>{
    const profileFields = {}
    profileFields.user = req.body.id;
    if(req.body.handle) profileFields.handle = req.body.handle;
    if(req.body.company) profileFields.company = req.body.company;
    if(req.body.website) profileFields.website = req.body.website;
    if(req.body.location) profileFields.location = req.body.location;
    if(req.body.status) profileFields.status = req.body.status;
    if(req.body.bio) profileFields.bio = req.body.bio;
    //split skills into array
    if(typeof req.body.skills !== "undefined"){
        profileFields.skills = req.body.skills.split(",");
    } 

    profileFields.social = {};
    if(req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if(req.body.instagram) profileFields.social.instagram = req.body.instagram;
    if(req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if(req.body.facebook) profileFields.social.facebook = req.body.facebook;

    





    Profile.findOne({user: req.body.id}).then(profile => {
        //if the profile already exists => update
            if(profile){
                
                Profile.findOneAndUpdate(
                    {user: req.user.id},
                    {$set: profileFields},
                    {new: true}
                ).then(profle => res.json(profile))
            } else{
                //if not exist -> create new profile
                //check if handle exists

                Profile.findOne({handle: profileFields.handle}).then(profile=>{
                    if(profile){
                        errors.handle = "That handle already exists"
                       return res.status(400).json(errors)
                    } 

                    new Profile(profileFields).save().then(profile=> res.json(profile));
                })


               
                //
            
                
            }
        })




});
module.exports =  router;