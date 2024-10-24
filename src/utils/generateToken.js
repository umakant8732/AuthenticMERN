import jwt from "jsonwebtoken";


const generateJwtToken = async (res, userId) => {
    const token = jwt.sign({userId}, process.env.JWT_SECREAT, {
        expiresIn: "30d",
    });

    res.cookie('access_token', token, { 
        httpOnly : true,
        secure : process.env.NODE_ENV != "development",
        sameSite : 'strict',
        maxAge : 30 * 24 * 60 * 60 * 1000,   
    });
}



export default generateJwtToken

