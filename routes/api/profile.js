const express =  require("express");
const router = express.Router();
const passport = require('passport');
const validateProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
const User = require("../../models/User");
const Profile = require("../../models/Profile");

//###ROUTES###

router.get("/test", (req, res) =>  res.send("profile page"));




//@route    GET api/profile/
//@desc     get current users profile
//@access   private
router.get("/", passport.authenticate('jwt', {session:false}), (req, res)=>{
    const errors = {};
    Profile.findOne({user: req.user.id})
    .populate('user', ['name', 'avatar'])
        .then(profile =>{
            if(!profile){
                errors.noprofile = "there is no profile for this user";
                return res.status(404).json(errors);
            } 
            res.json(profile);
        })
        .catch(err =>  res.status(404).json(err))
})



//@route    GET api/profile/handle/:handle
//@desc     to get a profile by handle name (params) 
//@access   public

router.get("/handle/:handle", (req, res) =>{
    const errors = {};
    Profile.findOne({handle: req.params.handle})
    .populate('user', ['name', 'avatar'])

    .then(profile =>{
        if(!profile){
            errors.noprofile = "Handle not found";
            return res.status(404).json(errors)
        } else{
            res.status(200).json(profile)
        }
    })
    .catch((err)=> res.status(404).json(err));
})






//@route    GET api/profile/user/:user_id
//@desc     to get a profile by user ID name (params) 
//@access   public
router.get("/user/:user_id", (req, res) =>{
    const errors = {};
    Profile.findOne({user: req.params.user_id})
    .populate('user', ['name', 'avatar'])

    .then(profile =>{
        if(!profile){
            errors.noprofile = "Handle not found";
            return res.status(404).json(errors)
        } else{
            res.status(200).json(profile)
        }
    })
    .catch((err)=> res.status(404).json({profile: 'There is not profile for this user'}));
})




//@route    GET api/profile/all
//@desc     to get all profiles 
//@access   public
router.get("/all", (req, res) =>{
    const errors = {};
    Profile.find()
        .then(profiles=>{
            if(!profiles){
                errors.noprofiles = "No profiles found, please create one"
                return res.status(404).json(errors);
            } else {
                res.json(profiles);
            }
        })
        .catch(err=> res.json(err));
    
});



//@route    POST api/profile/
//@desc     to create new profile
//@access   private (after login is possible)
router.post("/", passport.authenticate('jwt', {session:false}), (req, res)=>{
    const {errors, isValid} = validateProfileInput(req.body);
//check validation
    if(!isValid){
        return res.status(400).json(errors)
    }
    const profileFields = {};
    profileFields.user = req.user.id;
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
  
    Profile.findOne({user: req.user.id})
        .then(profile => {
        //if the profile already exists => update
            if(profile){
                Profile.findOneAndUpdate(
                    {user: req.user.id}, 
                    {$set: profileFields},
                    {new: true})
                .then(profile => res.json(profile))
            } else{
                //if not exist -> create new profile
                //check if handle exists
                Profile.findOne({handle: profileFields.handle}).then(profile=>{
                    if(profile){
                        errors.handle = "That handle already exists"
                       res.status(400).json(errors)
                    } 
                    new Profile(profileFields).save().then(profile=> res.json(profile));
                })
            }
        })
    });


        

//@route    POST api/profile/experience
//@desc     to add experience to profile
//@access   private (after login is possible)
router.post("/experience", passport.authenticate('jwt', {session: false}), (req, res)=>{
    const {errors, isValid} = validateExperienceInput(req.body);
    if(!isValid){
        return res.status(400).json(errors)
    }


    Profile.findOne({user :req.user.id})
            .then(profile => {
            const newExp = {
                title: req.body.title,
                company: req.body.company,
                location: req.body.location,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            }

         profile.experience.unshift(newExp);
         profile.save()
            .then(profile => res.json(profile))
            .catch(err=> res.json({error: "oops error"}))

      })

});



//@route    POST api/profile/education
//@desc     to add education to profile
//@access   private (possible after login)
router.post("/education", passport.authenticate('jwt', {session: false}), (req, res)=>{
    const {errors, isValid} = validateEducationInput(req.body);
    if(!isValid){
        return res.status(400).json(errors)
    }


    Profile.findOne({user :req.user.id})
            .then(profile => {
            const newExp = {
                title: req.body.title,
                company: req.body.company,
                location: req.body.location,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            }

         profile.experience.unshift(newExp);
         profile.save()
            .then(profile => res.json(profile))
            .catch(err=> res.json({error: "oops error"}))

      })

});







module.exports =  router;