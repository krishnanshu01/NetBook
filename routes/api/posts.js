const express = require('express');

const { check, validationresult, validationResult } = require('express-validator');

const router = express.Router();

const auth = require('../../middeware/auth');

const User = require('../../models/User');

const Profile = require('../../models/Profile');

const Post = require('../../models/Post');
const { route } = require('./users');


//@ router  -  /api/post
//@ details -  post the posts
//@ make    -  private
router.post('/', [auth,
    [
        check('text', 'text is required').not().isEmpty()
    ]
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });

        }
        try {
            const user = await User.findById(req.user.id).select('-password');

            const newPost = new Post({
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            });
            const post = await newPost.save();
            res.status(200).send(post);
        } catch (err) {
            console.error(err.message),
                res.status(500).send("SERVER ERROR");
        }
    });

//@ router  -  /api/post
//@ details -  to get all the posts
//@ make    -  private    

router.get('/' , auth , async (req , res) =>{
   try{
        const posts = await Post.find().sort({Date:-1});
        res.json(posts);
   }catch(err){
       console.log(err.message);
       res.status(500).send('SERVER ERROR');
   }
})

//@ router  -  /api/post/:id
//@ details -  GET post by id
//@ make    -  private 

router.get('/:id' , auth , async (req , res) =>{
    try{
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({msg : 'Post Not found'});
        }
        res.json(post);
    }catch(err){
        if(err.kind === 'ObjectId'){
            return res.status(404).json({msg : 'Post Not found'});
        }
        console.log(err.message);
        res.status(500).send('SERVER ERROR');
    }
})

//@ router  -  /api/post/:id
//@ details -  delete post by id
//@ make    -  private 

router.delete('/:id' , auth , async (req , res) =>{
    try{
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(401).json({msg : 'Post not found'})
        }
        if(post.user.toString() != req.user.id){
            return res.status(404).json({msg : 'User Unauthorized'});
        }
        await post.remove();
        res.json({msg : 'Post removed'});
    }catch(err){
        console.log(err.message);
        res.status(500).send('SERVER ERROR');
    }
})

//@ router  -  /api/post/like/:id
//@ details -  Put request in  post by liking id
//@ make    -  private 

router.put('/like/:id' , auth , async (req , res) => {
    try{
        const post = await Post.findById(req.params.id);
        //check if the like already exist in the database or not

        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
           return res.status(400).json({msg : 'already liked'})
        }

        post.likes.unshift({user : req.user.id});

        await post.save();
        res.json(post.likes);

    }catch(err){
        console.log(err.message);
        res.status(500).send('SERVER ERROR');
    }
})

//@ router  -  /api/post/unlike/:id
//@ details -  Put request in  post by liking id
//@ make    -  private 

router.put('/unlike/:id' , auth , async (req , res) => {
    try{
        const post = await Post.findById(req.params.id);
        //check if the like already exist in the database or not

        if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
           return res.status(400).json({msg : 'not liked yet'})
        }

        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);
        post.likes.splice(removeIndex , 1);

        await post.save();
        res.json(post.likes);

    }catch(err){
        console.log(err.message);
        res.status(500).send('SERVER ERROR');
    }
})

//@ router  -  /api/post/comment/:id
//@ details -  post comments on the posts
//@ make    -  private
router.post('/comment/:id', [auth,
    [
        check('text', 'text is required').not().isEmpty()
    ]
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });

        }
        try {
            const user = await User.findById(req.user.id).select('-password');
            const post = await Post.findById(req.params.id);

            const newComment = {
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            };
            post.comments.unshift(newComment);

            await post.save();
            res.json(post.comments);
        } catch (err) {
            console.error(err.message),
                res.status(500).send("SERVER ERROR");
        }
    });


//@ router  -  /api/post/comment/:id/:comment_id
//@ details -  delete comments on the posts
//@ make    -  private
router.delete('/comment/:id/:comment_id', auth,
    async (req, res) => {
        try {
            const post = await Post.findById(req.params.id);

            //pull out the comments from the post

            const comment = post.comments.find(comment => comment.id === req.params.comment_id);

            if(!comment){
                res.status(400).json({msg : 'Comment does not exist'})
            }
            
            if(comment.user.toString() != req.user.id){
                res.status(401).json({msg : 'you are not authorized'})
            }
            //get remove index
            const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id);

            post.comments.splice(removeIndex , 1);
            await post.save();
            res.json(post.commests);
        } catch (err) {
            console.error(err.message),
                res.status(500).send("SERVER ERROR");
        }
    });

module.exports = router;