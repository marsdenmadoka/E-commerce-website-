var mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
 mongoose.connect('mongodb://localhost:27017/Ecommerce',{ useNewUrlParser: true,useUnifiedTopology: true});
 var db=mongoose.connection;

 //schema
 var UserSchema=mongoose.Schema({

username:{
type:String

},
password:{
type:String
}
 });
 
 var User=module.exports=mongoose.model('User',UserSchema);
 //login
 module.exports.getUserById=function(id,callback){
 User.findById(id,callback);
 }
module.exports.getUserByUsername=function(username,callback){
    var query={username:username};
    User.findOne(query,callback);
}
module.exports.comparePassword=function(canditatePassword,hash,callback){
bcrypt.compare(canditatePassword,hash,function(err,isMatch){

    callback(null,isMatch)
     
})
}
//sigunp/register
 module.exports.createUser=function(newUser,callback){
    bcrypt.genSalt(10,function(err,salt){
        bcrypt.hash(newUser.password,salt,function(err,hash){
            newUser.password=hash;
            newUser.save(callback);
        });
    });

 }