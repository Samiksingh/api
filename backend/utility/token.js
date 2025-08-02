import jwt from "jsonwebtoken";

const generateToken = (UserId, res)=>{
    const Token = jwt.sign()({

    }, process.env.JWT_SECRETKEY,{
        expiresIN: '5d'
    }) 
    res.cookie("session", Token , {
        maxAge : 5*24*60*60*1000,
        httpOnly: true,
        secure: true,
        sameSite: "strict",
    });

}


export default generateToken;