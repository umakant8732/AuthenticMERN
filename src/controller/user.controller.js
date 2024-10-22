import UserSchema from "../models/user.model.js"
import generateJwtToken from "../utils/generateToken.js";
import { hashPassword, matchPassword } from "../utils/hashPassword.js";

// Route POST /api/users/auth
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserSchema.findOne({ email });

        if (user && (await user.isPasswordCorrect(password))) {

            await generateJwtToken(res, user._id);
            return res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            });

        } else {
            return res.status(400).json({ error: "Invalid Crendentials" });
        }
    } catch (error) {
        console.error("Login failed:", error);
        return res.status(500).json({ error: "An unexpected error occurred" });
    }
};

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await UserSchema.findOne({ email });
        if (userExists) {
            res.status(400).json({ error: "User Already Exists" });
            return;
        }

        // const hashedPassword = await hashPassword(password);

        const user = await UserSchema.create({ name, email, password });

        if (user) {
            await generateJwtToken(res, user._id)
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const logoutUser = async (req, res) => {
    try {

        res.cookie('access_token', '', {
            httpOnly: true,
            expires: new Date(0),
        })

        res.status(200).json({ message: "user logged out" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getUserProfile = async (req, res) => {
    try {
        res.status(200).json({ message: "getting user profile" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const updateFields = {};

        if (req.body.name) {
            updateFields.name = req.body.name;
        }

        if (req.body.email) {
            updateFields.email = req.body.email;
        }

        if (req.body.password) {
            updateFields.password = await hashPassword(req.body.password);
        }

        if (req.file) {
            updateFields.profilePic = req.file.filename;
        }

        const updateUser = await UserSchema.findByIdAndUpdate(
            userId,
            updateFields,
            { new: true } 
        );

        if (updateUser) {
            console.log(updateUser);
            res.status(200).json({
                _id: updateUser._id,
                name: updateUser.name,
                email: updateUser.email,
                role: updateUser.role,
                profilePic: updateUser.profilePic,
            });
        } else {
            res.status(500).json({ error: "Failed to update profile" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const testingAPI = async (req, res) => {
    return res.status(200).json(
        {
            name : "umakant",
            message : "congratulation we have successfully deployed our backend"
        }
    )
}
