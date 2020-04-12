var express=require('express');
var flash=require("connect-flash");
var app=express.Router();
var passport=require('passport');
var User =require('../models/user');//fetching the mongodb
//app.use('/user',User);//using them
const LocalStrategy=require('passport-local').Strategy;
var expressValidator=require('express-validator');
app.get('/register',function(req,res){ 
res.render('admin') //supposed to render the register form

})
 app.get('/admin',function(req,res,next){
     res.render('admin') //login
 });
app.post('/admin', 
passport.authenticate('local',{failureRedirect:'/admin/admin',failureFlash:'invalid user name or password'}),
function(req,res){
//req.flash('sucess','your now login');
res.redirect('/')//redirecting to homepage

});
passport.serializeUser(function(user,done){
done(null,user.id)
});
passport.deserializeUser(function(id,done){
    User.getUserById(id,function(err,user){
        done(err,user)
    })
})
passport.use(new LocalStrategy({passReqToCallback : true}
    ,function(username,password,done){
User.getUserByUsername(username,function(err,user){
    if(err) throw err;
    if(!user){
        return done(null,false,{message:'unkown User'});
    }
    User.comparePassword(password,user.password,function(err, isMatch){
if(err)return done(err);
if(isMatch){
    return done(null,user);

}else{

    return done(null,false,{message:'invalid Password'})
}

    })
})
}));
//end of login authentication


//validation install Epressvalidator and bodyparser
app.post('/register',function(req,res){ //refer to the post method in the admin.ejs
    var email=req.body.username;
    var password=req.body.password;
     req.checkBody('username','username is required').notEmpty();
    // req.checkBody('email','invalid email').isEmail();
     req.checkBody('password','password required').isEmpty();
     //req.checkBody('password2','password dont match ').equals(req.body.password);
    var errors=req.validationErrors();
    if(errors){
res.render('admin.ejs',{ //if erros give back the page again
    errors:errors
});

    }else{
    var newUser=new User({
email:email,
password:password
    })
    User.createUser(newUser,function(err, user){
        if(err) throw err;
        console.log(user);


    });
//req.flash('sucsess','your are now reistered') //flash messages

    res.location('/') //redirect to home page after a sucess signup
    res.redirect('/')
    }
    });
 module.exports=app;