import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { login } from "../controllers/auth.controller.js";

export const protectRoute = async (req, res, next) => {
        try {
                // Checking if cookie is present (means its LoggedIn)
                const token = req.cookies.jwt;
                if (!token) {
                        return res.status(401).json({ message: "UnAuthorized - No token Provided" })
                }

                // Decoding the Cookie using the secret key 
                const decoded = jwt.verify(token, process.env.SECRET_KEY);

                if (!decoded) {
                        return res.status(401).json({ message: "UnAuthorized - Token is invalid" })
                }

                // Call everything from DB except the password
                const user = await User.findById(decoded.userId).select("-password"); 

                if(!user){
                        return res.status(404).json({ message: "User not found" });
                }

                //If all the above code runs successfully it means User is authenticated
                //So transfer the flow to next function

                req.user = user;
                next();

        } catch (error) {
                console.log("Error in protected route handling : ", error.message);
                res.status(500).json({ message: "Internal Server error" });
        }
}

