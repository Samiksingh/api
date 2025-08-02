import jwt from "jsonwebtoken";

const generateToken = (UserId) => {
    // Check if JWT secret is configured
    if (!process.env.JWT_SECRETKEY) {
        throw new Error("JWT_SECRETKEY environment variable is not configured");
    }
    
    const token = jwt.sign(
        { UserId },
        process.env.JWT_SECRETKEY,
        { expiresIn: '5d' }
    );
    return token;
};

export default generateToken;