const express = require("express");
const app = express();
const cors = require("cors");
const mongodb = require("mongodb");
const mongoclient = mongodb.MongoClient;
const bcryptjs = require("bcryptjs");

const URL = "mongodb+srv://shaunakDas:admin123@cluster0.exlrt.mongodb.net/test"; 

app.use(express.json());
app.use(cors({
    origin: "*"
}));

app.post("/user/register", async function(req,res){
    try {
        //open the connection
        let conn = await mongoclient.connect(URL);

        //select the db
        let db= conn.db("students");

        let salt = await bcryptjs.genSalt(10);
        let hash = await bcryptjs.hash(req.body.password,salt);

        req.body.password = hash;
        //select the collection
        //do operation
        await db.collection('user').insertOne(req.body);

        //close the connection
        await conn.close();
        res.json({
            message: "User Created"
        })

    } catch (error) {
        //console.log(error);
        res.status(500).json({
            message: "Error"
        })
    }
})

app.post("/user/login", async function(req,res){
    try {
        //open the connection
        let conn = await mongoclient.connect(URL);

        //select the db
        let db= conn.db("students");

        //find user with email id
        let user = await db.collection("user").findOne({userEmail: req.body.userEmail});
        //console.log(user);
        if(user){
            let result = await bcryptjs.compare(req.body.password,user.password);

            if(result){
                res.json({
                    message: "Login Success"
                })
            }else{
                res.status(401).json({
                    message: "Password incorrect or User not found"
                })
            }

        }else{
            res.status(401).json({
                message:"Password incorrect or User not found"
            })
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:"login error"
        })
    }
})

app.listen( process.env.port || 3000,function(){
    console.log(`Server is running in PORT ${port}`);
})