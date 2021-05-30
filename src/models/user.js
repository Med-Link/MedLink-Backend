const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const UserSchema = new mongoose.Schema({
      firstname:{
            type:String,
            required:true,
            trim:true,
            min:3,
            max:25,

      },

      lastname:{
            type:String,
            required:true,
            trim:true,
            min:3,
            max:25,

      },

      username:{
            type:String,
            required:true,
            trim:true,
            unique:true,
            index:true,
            lowercase:true,
            


      },

      email:{
            type:String,
            required:true,
            trim:true,
            unique:true,
            lowercase:true,

      },
      hash_password:{
             type: String,
             required:true,
      },

      role:{
            type:String,
            enum: ['user','admin'],
            default:'user'
      },

      contactNumber:{
            type:String,
      },

      profilepic:{
            type:String,
      }


},{timestamps:true});

UserSchema.virtual('password')
.set(function(password){
     this.hash_password=bcrypt.hashSync(password, 8);
});

UserSchema.methods ={
      authenticate:function(){
            return bcrypt.compare(password, this.hash_password);
      }
}

UserSchema.virtual('password');
module.exports = mongoose.model('User', UserSchema);