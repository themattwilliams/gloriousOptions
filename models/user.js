var mongoose = require("mongoose");
// var Post = require("./post");     OTHER MODELS CROSS REQUIRE WILL GO HERE
// var Comment = require("./comment");
var bcrypt = require("bcrypt");
var SALT_WORK_FACTOR = 10;

var userSchema = new mongoose.Schema({
  username: String,
  password: String,
  gf: String,
  df: String,
  ef: String,
  sf: String
});




userSchema.pre('save', function (next) {

  // the keyword this refers to the INSTANCE!
  // {
  //   email: "eschoppik@gmail.com",
  //   _id: ObjectId("382192389021839021")
  // }

  var user = this;
  // if the password has not been changed, save the user and move on...
  if (!user.isModified('password')) {
    return next();
  }


  userSchema.pre('remove', function (next) {
  	var user = this
     // Post.remove({user: user._id}).exec();
     // Comment.remove({user: user._id}).exec();
     // TODO --- HOW DO WE REMOVE COMMENTS FROM MULTIPLE USERS ONCE A POST IS REMOVED
     next();
  });

  // db.User.create(req.body.user, function(){

  // });

  // when i call next()...this is what happens
  // var user = new db.User(req.body.user)
  // user.save(function(err,user){

  // })
  return bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) {
      return next(err);
    }
    return bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) {
        return next(err);
      }
      // define what the password is for the user
      user.password = hash;
      // everything looks good, let's save this!
      return next();
    });
  });
});

// THIS IS DEFINING SCHEMA
// function Person(name){
//   this.name = name
// }

// THIS IS A CLASS METHOD (statics)
// Person.sayHi = function(){
//   return "hi"
// }

// THIS IS AN INSTANCE METHOD (methods)
// Person.prototype.sayGoodbye = function(){
//   return "goodbye"
// }

// var elie = new Person("elie")
// Person.sayHi()
// elie.sayGoodbye()


 // statics === CLASS METHODS
userSchema.statics.authenticate = function (formData, callback) {
  // this refers to the model!
  console.log("RUNNING AUTHENTICATE")
  this.findOne({
      username: formData.username
    },
    function (err, user) {
      if (user === null){
        callback("Invalid username or password", null);
        console.log("USER IS NULL");
      }
      else {
        user.checkPassword(formData.password, callback);
      }

    });
};


// methods === INSTANCE METHODS!
userSchema.methods.checkPassword = function(password, callback) {
  var user = this;
  bcrypt.compare(password, user.password, function (err, isMatch) {
    if (isMatch) {
      callback(null, user);
    } else {
      callback(err, null);
    }
  });
}; 




var User = mongoose.model("User", userSchema);
module.exports = User;