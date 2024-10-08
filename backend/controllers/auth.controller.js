
import { User } from "../models/User.model.js";
import bcrypt from "bcryptjs"
import crypto from "crypto"

import { generateTokenAndSetCookie } from './../utils/generateTokenAndSetCookie.js'
import { sendPasswordResetEmail, sendResetSuccesEmil, sendVerificationEmail, sendWelcomEmail } from "../mailtrap/emails.js";

export const signup = async (req , res) => {
    
    const {email , password , name } = req.body;
    try {
        if(!email || !password || !name) {
            throw new Error("all fields are required ");
        }
        const userAlreadyExist = await User.findOne({email})
        if(userAlreadyExist){
           return res.status(400).json({success:false ,message:"user already exists"})
        }
        const hashpassword = await bcrypt.hash(password,10)
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        const user = new User({email , 
            password:hashpassword, 
            name,
            verificationToken,
            verificationTokenExpireAT:Date.now()+24*60*60*1000

        });

        await user.save();

        generateTokenAndSetCookie(res , user._id);
 
        await sendVerificationEmail(user.email , verificationToken);


        res.status(200).json({
            success:"User created successfuly",
            user: {
                ...user._doc,
                password:undefined,
            }
        })

    } catch (error) {
        res.status(400).json({success:false ,message:error.message })
    }
}


export const verifyEmail = async  (req , res) => {
    const {code} = req.body;
    try {
        const user = await User.findOne({
            verificationToken:code,
            verificationTokenExpireAT:{ $gt : Date.now()}
        })

        if(!user) {
            return res.status(400).json({success:false , message:"invalide or expired verification token "})
        }
        user.isVerified = true;
        user.verificationTokenExpireAT = undefined;
        user.verificationToken = undefined ;

        await user.save();

        await sendWelcomEmail(user.email , user.name);

        res.status(200).json({
            success:true,
            message:"email veified  successfuly",
            user: {
                ...user._doc,
                password:undefined,
            }
        })
    } catch (error) {
        res.status(400).json({success:false ,message:error.message })
        
    }

}


export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Await the user retrieval from the database
        const user = await User.findOne({ email }); // Use await to resolve the promise
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        console.log('Hashed password from DB:', user.password); // This will now show the correct password from DB

        // Compare the provided password with the hashed password from the DB
        const ispassword = await bcrypt.compare(password, user.password);
        if (!ispassword) {
            return res.status(400).json({ success: false, message: "Invalid password" });
        }

        // Generate token and set it in a cookie
        generateTokenAndSetCookie(res, user._id);

        // Update the last login date
        user.lastlogin = new Date();
        await user.save(); // Save the last login date

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: {
                ...user._doc,
                password: undefined, // Do not return the password in the response
            }
        });

    } catch (error) {
        console.log("Error in login:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

export const logout = async (req , res) => {
    
    res.clearCookie("token")
    res.status(200).json({success:true ,message:"logged out successfuly" })
}



export const forgotPassword = async (req , res) => {
    const {email}  = req.body;
    try {
        const user = await User.findOne({email})
        if (!user) {
            return res.status(400).json({ success: false, message: "user not found " });
        }

        //generate a reset token 
        
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpired = Date.now() + 1 * 60 * 60 *1000 ; //hour


        user.resetPasswordExpireAt = resetTokenExpired;
        user.resetPasswordToken = resetToken;

        await user.save();

        await sendPasswordResetEmail(user.email , `${process.env.CLIENT_URL}/${resetToken}`);
        res.status(200).json({ success: true, message: "pssword reset link sent to your email " });
    } catch (error) {
        console.log("Error reset password:", error);
        res.status(400).json({ success: false, message: error.message });
        
    }

}


export const resetPassword = async (req,res) => {

    try {
        const {token} = req.params;
        const {password} = req.body;

        const user = await User.findOne({
            resetPasswordToken:token,
            resetPasswordExpireAt:{ $gt : Date.now() }
        })
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or exipred token " });
        }
        //update paassword
        const hashpassword = await bcrypt.hash(password , 10)

        user.password = hashpassword,
        user.resetPasswordExpireAt = undefined;
        user.resetPasswordToken = undefined ;
        await user.save();

        await sendResetSuccesEmil(user.email);
        res.status(200).json({ success: true, message: "pssword reset successfuly " });

    } catch (error) {
        console.log("Error reset password:", error);
        res.status(400).json({ success: false, message: error.message });
    }
}