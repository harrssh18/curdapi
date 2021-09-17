const express = require("express");
const Users = require("./models/crud");
const app = express();
require("./db/conn");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

app.use(express.json());

app.get("/users",async (req,res)=>{
    try {
        const tk = req.headers.token;
        const checktk = await jwt.verify(tk,"thisisacrudoperationproject");
        if (checktk){
            const data = await Users.find();
            if (data == []){
                res.send(data);
            }else{
                res.send("No Users Available!!");
            }
        }else{
            res.send("Not Valid Token!!")
        }
    } catch (error) {
        res.status(401).send(error)
    }
});

app.post("/login",async (req,res)=>{
    try {
        const data = await Users.findOne({email:req.body.email});
        const check = await bcrypt.compare(req.body.password,data.password);
        if (check){
            const token = await data.generateAuthToken();
            res.send(data);
        }
        else{
            res.send("invalid login details!!");
        }
    } catch (error) {
        res.status(404).send(error);
        
    }
});

app.post("/register", async (req,res)=> {
    try {
        const data = await Users.findOne({email:req.email});
        const newUser = new Users(req.body);
        const result = await newUser.save();
        res.send(result);
       
    } catch (error) {
        res.status(401).send("Error \n" + error);
    }
})

app.patch("/update/:id",async (req,res)=>{
    try {
        const _id = req.params.id;
        const updateinfo = await Users.findByIdAndUpdate(_id,req.body,{new:true});
        res.send(updateinfo);
    } catch (error) {
        res.status(404).send("User Not Found!!\n" + error);
        
    }
});

app.delete("/delete/:id",async (req,res)=>{
    try {
        const _id = req.params.id;
        const del = await Users.findByIdAndDelete(_id);
        res.send(del);
    } catch (error) {
        res.status(404).send("User Not Found!!\n" + error);
    }
});

app.listen(8000,()=>{
    console.log("Serving Port 8000");
});
