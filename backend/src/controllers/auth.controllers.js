import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { genrateToken } from "../lib/utills.js";
import cloudinary from "../lib/cloudinary.js";

export const signUp = async (req, res) => {
    const { fullname, password, email } = req.body; // backend expects fullname, password, email
    try {
        if (!fullname || !password || !email) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullname,  // stored as fullname
            email,
            password: hashPassword,
        });

        if (newUser) {
            genrateToken(newUser._id, res);
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const signIn = async (req, res) => {
    const { password, email } = req.body;
    try {
        const Exister = await User.findOne({ email });
        if (!Exister) {
            return res.status(400).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, Exister.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        genrateToken(Exister._id, res);
        res.status(200).json({
            _id: Exister._id,
            fullname: Exister.fullname,
            email: Exister.email,
            profilePic: Exister.profilePic,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const Logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logout successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;
        const userResponse = await cloudinary.uploader.upload(profilePic);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                profilePic: userResponse.secure_url,
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(400).json({ message: "User not found" });
        }

        res.status(200).json({ updatedUser });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
