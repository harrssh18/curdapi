const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const validator = require("validator");

const usersSchema = new mongoose.Schema({
    name : { 
        type: String,
        required : true
    },
    email : { 
        type : String , 
        required : true ,
        unique : true,
        validate(val)
        { if(!validator.isEmail(val)){
        throw new Error("Invalid Error");
    }
}
},
    password : {
        type : String,
        required : true,
        minlength : 8

    },
    cpassword : {
        type : String,
        required : true,
        minlength : 8
    },
    tokens : [{
        token : {
            type : String
        }
    }]
});

usersSchema.methods.generateAuthToken = async function(){
    try {
        const tk = jwt.sign({_id:this._id.toString()},"thisisacrudoperationproject");
        this.tokens = this.tokens.concat({token:tk});
        await this.save();
        return tk;
    } catch (error) {
        console.log(error);
    }

}

usersSchema.pre("save",async function(next){
    const passhash =await bcrypt.hash(this.password,10);
    this.password = passhash;
    this.cpassword = passhash;
    next();
});

const Users = new mongoose.model("CRUD",usersSchema);

module.exports = Users;