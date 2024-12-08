import {User} from "../models/user.model.js";
import bycrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/genrateToken.js";

export const signup = async (req,res)=> {
    try {
        const {email,password,username} = req.body;

        if(!email || !password || !username){
            return res.status(400).json({success:false, message:"All fields are required"})
        }
        const emailRegex = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/gm;

        if(!emailRegex.test(email)){
            return res.status(400).json({success:false, message:"invalid email"})
        }

        if(password.length < 6){
            return res.status(400).json({success:false, message:"Password must be atleast 6 characters"})
        }
        
        const existingUserByEmail = await User.findOne({email:email})

        if(existingUserByEmail){
            return res.status(400).json({success:false, message:"Email already exists"})
        }
        const existingUserByUsername = await User.findOne({username:username})

        if(existingUserByUsername){
            return res.status(400).json({success:false, message:"Username already exists"})
        }

        const salt = await bycrypt.genSalt(10);
        const hashedPassword = await bycrypt.hash(password,salt);


        const PROFILE_PIC = ["/avatar1.png","/avatar2.png","/avatar3.png"];

        const image = PROFILE_PIC[Math.floor(Math.random()* PROFILE_PIC.length)];


        const newUser = new User({
            email,
            password: hashedPassword,
            username,
            image
        })

            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();
            res.status(201).json({success:true, user:{
                ...newUser._doc,
                password:""
            }})
        

      
    } catch (error) {
        console.log("Error in signup controller" + error.message);
        
        res.status(500).json({success:false, message:"Internal server error"})
    }
}

export const login =  (req,res)=> res.send("Login route")

export const logout =  (req,res)=> res.send("Log out route")
