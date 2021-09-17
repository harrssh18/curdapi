const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/crud")
.then(()=>{
    console.log("Connected DB!!");
})
.catch((e)=>{
    console.log(e);
});