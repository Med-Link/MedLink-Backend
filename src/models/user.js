const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;
const UserSchema = new Schema({
      firstName:{
            type:String,
            required:true,
            trim:true,
            min:3,
            max:25,

      },

      lastName:{
            type:String,
            required:true,
            trim:true,
            min:3,
            max:25,

      },

      userName:{
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
            enum: ['user','admin','pharmacy'],
            default:'user'
      },

      contactNumber:{
            type:String,
            required:true,
            trim:true,
            // min:10,
            // max:10,
      },

      profilepic:{
            type:String,
      }


},
{timestamps:true}
);

UserSchema.virtual('password')
.set(function(password){
     this.hash_password=bcrypt.hashSync(password, 10);

});

UserSchema.virtual('fullName')
.get(function(){
     return `${this.firstName} ${this.lastName}`;
});

UserSchema.methods ={
      authenticate:function(password){
            return bcrypt.compareSync(password, this.hash_password);
      }
}

UserSchema.virtual('password');
module.exports = mongoose.model('User', UserSchema);