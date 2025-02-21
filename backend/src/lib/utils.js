import jwt from "jsonwebtoken"

export const generateToken = (userId, res)=>{

        const token = jwt.sign( {userId}, process.env.SECRET_KEY, {expiresIn:"7d"} );

        res.cookie("jwt", token,{
                maxAge: 7*24*60*60*1000, //7 days in MilliSeconds
                httpOnly: true, // For security
                sameSite: "strict",
                secure: process.env.NODE_ENV !== "development" // True or False [https(prod) or http(dev)] 

        });

        return token;
}