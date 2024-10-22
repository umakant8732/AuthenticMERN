import jwt from 'jsonwebtoken'
import UserSchema from '../models/user.model.js'


const protect = async (req, res, next) => {
    let token;

    token = req.cookies.access_token;

    if (token) {
        try {
            const decodeToken = jwt.verify(token, process.env.JWT_SECREAT);
            req.user = await UserSchema.findById(decodeToken.userId).select('-password');

            if (req.user.role === "user" || "admin") {
                next();
            }
            else {
                res.status(403).json({ error: "Access Forbidden, Role is Required" })
            }

        } catch (error) {
            res.status(401).json({ error: "Invalid Token" });
        }
    }
    else {
        res.status(401).json({ error: "No Token Found" });
    }
}



export { protect };