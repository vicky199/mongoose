const mongoose=require('mongoose');
//model declaration
var user=mongoose.model('User',{
    name:{
        type:String,
        required:true,
        trim:true,
        minlength:4
    },
    userName:{
        type:String,
        required:true,
        unique: true,
        trim:true,
        minlength:4
    },
    password:{
        type:String,
        required:true,
        minlength:6,
        trim:true
        
    }
  });
  module.exports={user};