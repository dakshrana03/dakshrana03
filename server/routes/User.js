const express = require("express");
const {sign} = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {User} = require("../models/databaseInitializer");
const {authenticateUser} = require("../authentication/userAuthentication");

const router = express.Router();

// Get all users (excluding password)
router.get("/", authenticateUser, async (request, response) => {
    try {
        const users = await User.findAll({
            attributes: {exclude: ["password"]},
        });
        response.status(200).json(users);
    } catch (error) {
        response.status(500).json({error: "Failed to fetch users."});
    }
});

// Create a new user
router.post("/", async (request, response) => {
    try {
        const {firstName, lastName, email, password} = request.body;
        const hash = await bcrypt.hash(password, 10);

        await User.create({
            firstName,
            lastName,
            email,
            password: hash,
        });

        response.status(201).json({message: "User created successfully."});
    } catch (error) {
        response.status(500).json({error: "Failed to create a new user."});
    }
});

// User login
router.post("/login", async (request, response) => {
    try {
        const {email, password} = request.body;
        const user = await User.findOne({where: {email: email}});
        console.log(user)
        if (!user) return response.status(404).json({error: "User doesn't exist."});

        const match = await bcrypt.compare(password, user.password);

        if (!match) return response.status(401).json({error: "Incorrect email and password combination."});

        const accessToken = sign(
            {email: user.email, id: user.id},
            "importantsecret"
        );

        response.status(200).json({token: accessToken, email: user.email, id: user.id});
    } catch (error) {
        response.status(500).json({error: "Failed to log in."});
    }
});

// Get authenticated user's details
router.get("/user-auth", authenticateUser, (request, response) => {
    response.status(200).json(request.user);
});

// Change user's password
router.put("/change-password", authenticateUser, async (request, response) => {
    try {
        const {oldPassword, newPassword} = request.body;
        const user = await User.findOne({where: {email: request.user.email}});

        const match = await bcrypt.compare(oldPassword, user.password);

        if (!match) return response.status(401).json({error: "Wrong password entered."});

        const hash = await bcrypt.hash(newPassword, 10);
        await User.update({password: hash}, {where: {email: request.user.email}});

        response.status(200).json({message: "Password changed successfully."});
    } catch (error) {
        response.status(500).json({error: "Failed to change password."});
    }
});

// Get basic info of a user by ID
router.get("/basic-info/:id", async (request, response) => {
    try {
        const userId = request.params.id;
        const basicInfo = await User.findByPk(userId, {
            attributes: {exclude: ["password"]},
        });

        if (!basicInfo) return response.status(404).json({error: "User not found."});

        response.status(200).json(basicInfo);
    } catch (error) {
        response.status(500).json({error: "Failed to fetch user's basic info."});
    }
});

// Delete a user by ID
router.delete("/:id", authenticateUser, async (request, response) => {
    try {
        const userId = request.params.id;
        await User.destroy({where: {id: userId}});

        response.status(200).json({message: "User deleted successfully."});
    } catch (error) {
        response.status(500).json({error: "Failed to delete user."});
    }
});

module.exports = router;
