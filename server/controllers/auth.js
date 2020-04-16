const User = require('../models/user');
const shortId = require('shortid');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');


exports.signup = async (req, res) => {

    try {
        const user = await User.findOne({email: req.body.email});
        
        if(user) {
            return res.status(400).json({
                error: `Email is taken`
            })
        }

        const {name , email, password } = req.body;
        let username = shortId.generate();
        let profile = `${process.env.CLIENT_URL}/profile/${username}`;

        let newUser = new User({name,email,password,profile,username});

        try {

           await newUser.save();
           res.json({
            message: 'Signup success! Please signin.'
         });

        }
        catch(err) {
            return res.status(400).json({
                error: err
            });
        }

    }
    catch(err) {

        return res.status(500).json({
            error: err
        });
    }
    
}    
   
exports.signin = async (req, res) => {

    try {

       const {  password } = req.body;
       const user = await User.findOne({email:req.body.email});

       if(!user) {
            return res.status(400).json({
                error: 'User with that email does not exist. Please signup.'
            });  
       }

       // authenticate
       if (!user.authenticate(password)) {
            return res.status(400).json({
                error: 'Email and password do not match.'
            });
       }

       // generate a token and send to client
       const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

       res.cookie('token', token, { expiresIn: '1d' });
       const { _id, username, name, email, role } = user;
       return res.json({
           token,
           user: { _id, username, name, email, role }
       });

    }
    catch(err) {
        return res.status(500).json({
            error: `${err.message}`
        });
    }    
};

exports.signout = (req, res) => {
    res.clearCookie('token');
    res.json({
        message: 'Signout success'
    });
};

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET
});

/*exports.authMiddleware = async (req, res, next) => {
    const authUserId = req.user._id;
    const user = User.findById({ _id: authUserId }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }
        req.profile = user;
        next();
    });
}; */

exports.adminMiddleware = async (req, res, next) => {

    const adminUserId = req.user._id;

    try {
        const user = await User.findById({ _id: adminUserId });
        if(!user) {
            return res.status(400).json({
                error: 'User not found'
            }); 
        }
        req.profile = user;
        next();
    }
    catch(err) {
        return res.status(400).json({
            error: 'User not found'
        }); 
    }
};



