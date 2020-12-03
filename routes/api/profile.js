const express = require('express');

const router = express.Router();

const request = require('request');

const config = require('config');

const auth = require('../../middeware/auth');

const Profile = require('../../models/Profile');

const User = require('../../models/User')

const Post = require('../../models/Post')

const { check, validationResult } = require('express-validator');
const { compare } = require('bcryptjs');


//@ router  -  /api/profile/me
//@ details -  get current user profile
//@ make    -  private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await (Profile.findOne({ user: req.user.id })).populate('user',
            ['name', 'avator']);
        if (!profile) {
            return res.status(401).json({ msg: 'profile is empty' })
        }
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('SERVER ERROR');
    }
})
//@ router  -  /api/profile
//@ details -  post current user profile
//@ make    -  private
router.post('/', [auth,
    check('status', 'your status').not().isEmpty(),
    check('skills', 'mention your skills').not().isEmpty()],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin
        } = req.body;

        //build profile object
        const profilefields = {}; // firstly let make it empty then start filling it by comparing
        profilefields.user = req.user.id;
        if (company) profilefields.company = company;
        if (website) profilefields.website = website;
        if (location) profilefields.location = location;
        if (bio) profilefields.bio = bio;
        if (status) profilefields.status = status;
        if (githubusername) profilefields.githubusername = githubusername;
        if (skills) {
            profilefields.skills = skills.split(',').map(skill => skill.trim());
            //build social objects
            profilefields.social = {}
            if (youtube) profilefields.social.youtube = youtube
            if (facebook) profilefields.social.facebook = facebook
            if (twitter) profilefields.social.twitter = twitter
            if (instagram) profilefields.social.instagram = instagram
            if (linkedin) profilefields.social.linkedin = linkedin

            try {
                let profile = await Profile.findOne({ user: req.user.id });
                if (profile) {
                    //update
                    profile = await Profile.findOneAndUpdate(
                        { user: req.user.id },
                        { $set: profilefields },
                        { new: true })
                    return res.json(profilefields);
                };
                //creating a new user
                profile = new Profile(profilefields);
                await profile.save();
                return res.json(profile);
            } catch (err) {
                console.log(err.message);
                res.status(500).send("SERVER ERROR");
            }
        }
    })
//@ router  -  /api/profile
//@ details -  get all user profile
//@ make    -  this is going to be public

router.get('/' , async (req , res) =>{
    try{
        const profiles = await Profile.find().populate('user',
        ['name' , 'avator']);
        res.json(profiles);
    }catch(err){
        console.log(err.message);
        res.status(500).send("SERVER ERROR")
    }
})

//@ router  -  /api/profile/user/:user_id(we use ":" for fixed place)
//@ details -  get searching user profile through user_id
//@ make    -  this is going to be public
 	

// req.params

// An object containing properties mapped to the named route “parameters”. 
// For example, if you have the route /user/:name, then the "name" property is available
//  as req.params.name. This object defaults to {}.
router.get('/user/:user_id' , async (req , res) =>{
    try{
        const profile = await Profile.find({user : req.params.user_id}).populate('user',
        ['name' , 'avator']);
        if(!profile)
           return res.status(400).json({msg : 'NO profile found'})
        res.json(profile);
    }catch(err){
        console.log(err.message);
        if(err.kind == 'ObjectId'){
            return res.status(400).json({msg : 'No profile found'})
        }
        res.status(500).send("SERVER ERROR")
    }
})

//@ router  -  /api/profile
//@ details -  to delete user and profile
//@ make    -  private
 	
router.delete('/' , auth , async (req , res) =>{
    try{
        //delete all post
        await Post.deleteMany({user:req.user.id});
        // delete profile
        await Profile.findOneAndDelete({user : req.user.id});  //user is the field of profile
        // delete user
        await User.findOneAndDelete({_id : req.user.id});   //_id is the field of User

        res.json({msg : 'Profile deleted'});
    }catch(err){
        console.log(err.message);
        res.status(500).send("SERVER ERROR")
    }
})


//@ router  -  /api/profile/experience
//@ details -  to add experience
//@ make    -  private
 	
router.put('/experience' , [auth ,
    [check('title' , 'title is required').not().isEmpty(),
     check('company' , 'company is required').not().isEmpty(),
     check('from' , 'from date is required').not().isEmpty()
    ]
     ] , async (req , res) =>{
         const errors = validationResult(req);
         if(!errors.isEmpty()){
            return res.status(400).json({errors : errors.array()});
         }
    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }
    try{
        const profile = await Profile.findOne({user : req.user.id});
        profile.experience.unshift(newExp);
        await profile.save();
        return res.json(profile);
    }catch(err){
        console.log(err.message);
        res.status(500).send("SERVER ERROR")
    }
})

//@ router  -  /api/profile/experience/:exp_id
//@ details -  to delete experience
//@ make    -  private

router.delete('/experience/:exp_id' , auth , async (req , res) =>{
    try{
        const profile = await Profile.findOne({user : req.user.id});
        const removeindex = profile.experience
        .map(item => item.id)
        .indexOf(req.params.exp_id);
        profile.experience.splice(removeindex , 1);
        await profile.save();
        res.json(profile);
    }catch(err){
        console.log(err.message);
        res.status(500).send('SERVER ERROR')
    }
})

//@ router  -  /api/profile/education
//@ details -  to add education
//@ make    -  private
 	
router.put('/education' , [auth ,
    [check('school' , 'school is required').not().isEmpty(),
     check('degree' , 'degree is required').not().isEmpty(),
     check('fieldofstudy' , 'fiels are required').not().isEmpty(),
     check('from' , 'from date is required').not().isEmpty()
    ]
     ] , async (req , res) =>{
         const errors = validationResult(req);
         if(!errors.isEmpty()){
            return res.status(400).json({errors : errors.array()});
         }
    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body;

    const newExp = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }
    try{
        const profile = await Profile.findOne({user : req.user.id});
        profile.education.unshift(newExp);
        await profile.save();
        return res.json(profile);
    }catch(err){
        console.log(err.message);
        res.status(500).send("SERVER ERROR")
    }
})

//@ router  -  /api/profile/education/:edu_id
//@ details -  to delete education
//@ make    -  private

router.delete('/education/:edu_id' , auth , async (req , res) =>{
    try{
        const profile = await Profile.findOne({user : req.user.id});
        const removeindex = profile.experience
        .map(item => item.id)
        .indexOf(req.params.exp_id);
        profile.education.splice(removeindex , 1);
        await profile.save();
        res.json(profile);
    }catch(err){
        console.log(err.message);
        res.status(500).send('SERVER ERROR')
    }
})

//@ router  -  /api/profile/github/:username
//@ details -  to get user repo
//@ make    -  public

router.get('/github/:username' , (req , res) =>{
    try{
        const options ={
            uri : `https://api.github.com/users/${
                req.params.username
            }/repos?per_page=5&sort=created:asc&client_id=${config.get(
                'githubClientId'
                )}&client_secret=${config.get('githubSecret')}`,
                method : 'GET',
                headers: {'user-agent' : 'node.js'}
        };

        request(options, (error , response , body) =>{
            if(error) console.error(error);
            if(response.statusCode != 200){
               return res.status(404).json({msg : 'user not found'});
            }
            res.json(JSON.parse(body));
        })

    }catch(error){
        console.log(err.message);
        res.status(500).send('SERVER ERROR');
    }
})

module.exports = router;