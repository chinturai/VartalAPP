import User from './../models/user.model.js';
import { generateToken } from '../lib/utils.js';
import bcrypt from "bcryptjs";
import cloudinary from './../lib/cloudinary.js';


export const signup = async (req, res) => {
        const { fullName, email, password } = req.body;
        try {
                //All fields are must 
                if (!fullName || !email || !password) {
                        return res.status(400).json({ message: "All fields are required to be filled !" })
                }

                //Min Pass length is 6
                if (password.length < 6) {
                        return res.status(400).json({ message: "Password must be atleast 6 characters" })
                }

                //Checking if the user already exists
                const user = await User.findOne({ email })
                if (user) return res.status(400).json({ message: "Email already exists !" })

                //Hashing the Password
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

                //Creating a new user 
                const newUser = new User({
                        fullName: fullName,
                        email: email,
                        password: hashedPassword,
                })

                //Checks after user creation
                if (newUser) {
                        //Create JWT
                        generateToken(newUser._id, res);
                        await newUser.save();

                        res.status(201).json({
                                _id: newUser._id,
                                fullName: newUser.fullName,
                                email: newUser.email,
                                profilePic: newUser.profilePic,
                        })

                } else {
                        return res.status(400).json({ message: "An unexpected error has occured" })
                }

        } catch (error) {
                console.log("Error in sign up controller: ", error.message);
                res.status(500).json({ message: "Internal Server Error" });
        }
};

export const login = async (req, res) => {
        //Fetching email and pass from frontend
        const { email, password } = req.body;
        try {
                //Checking if user with this email exists or not
                const user = await User.findOne({ email });
                if (!user) {
                        return res.status(400).json({ message: "Invalid Credentials" });
                }

                //Comparing hashed password with User's entered password
                const isPasswordCorrect = await bcrypt.compare(password, user.password);

                //Checking if password is correct
                if (!isPasswordCorrect) {
                        return res.status(400).json({ message: "Invalid Credentials" });
                }

                //If password is correct , generate Cookie token
                generateToken(user._id, res);

                res.status(200).json({
                        _id: user._id,
                        fullName: user.fullName,
                        email: user.email,
                        profilePic: user.profilePic,
                })

        } catch (error) {
                console.log("Error in the controller: ", error.message);
                return res.status(500).json({ message: "Internal Server Error " });
        }
};

export const logout = (req, res) => {
        try {
                res.cookie("jwt", "", { maxAge: 0 });
                res.status(200).json({ message: "Logged Out Successfully !! Hope to see you soon :) " })
        } catch (error) {
                console.log("Error in Logout controller: ", error.message);
                res.status(500).json({ message: "Internal Server error" });

        }
};

export const updateProfile = async (req, res) => {
        try {
                const { profilePic } = req.body;
                const userId = req.user._id;

                if (!profilePic) {
                        return res.status(400).json({ message: "Profile pic is required" });
                }

                const uploadResponse = await cloudinary.uploader.upload(profilePic);
                const updatedUser = await User.findByIdAndUpdate(
                        userId,
                        { profilePic: uploadResponse.secure_url },
                        { new: true }
                );

                res.status(200).json(updatedUser);
        } catch (error) {
                console.log("error in update profile:", error);
                res.status(500).json({ message: "Internal server error" });
        }
};

// export const updateProfile = async (req,res) => {
//          try {
//                 //Get the Profile Pic
//                 const {profilePic} = req.body;
//                 const userId = req.user._id;

//                 //If profile pic is not uploaded
//                 if(!profilePic){
//                         return res.status(400).json({message:"Profile Pic is rquired"});
//                 }

//                 //Upload the pic on to cloudinary
//                 const uploadResponse = await cloudinary.uploader.upload(profilePic);

//                 //Update the "profilePic" field in our DataBase
//                 const updatedUser = await User.findByIdAndUpdate(userId, {profilePic: uploadResponse.secure_url}, {new:true})

//                 //Return upon Success...
//                 res.status(200).json(updatedUser);

//          } catch (error) {
//                 console.log("Error in updating profilePic", error.message);
//                 res.status(500).json({message:"Internal Server Error : "});
//          }
// }

export const checkAuth = (req, res) => {
        try {
                res.status(200).json(req.user);
        } catch (error) {
                console.log("Error in checkAuth Route : ", error.message);
                res.status(501).json({ message: "Internal server error" });
        }
}