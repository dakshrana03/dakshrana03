const express = require("express");
const {Channel} = require("../models/databaseInitializer");
const {authenticateUser} = require("../authentication/userAuthentication");

const router = express.Router();

// CREATE a new channel
router.post("/", authenticateUser, async (request, response) => {
    try {
        const newChannel = request.body;
        await Channel.create(newChannel);
        response.status(200).json(newChannel);
    } catch (error) {
        response.status(500).json({error: "Failed to create a new channel."});
    }
});

// GET a channel by id
router.get("/:id", async (request, response) => {
    try {
        const channelId = request.params.id;
        const channel = await Channel.findByPk(channelId);

        if (!channel) {
            return response.status(404).json({error: "Channel not found."});
        }

        response.status(200).json(channel);
    } catch (error) {
        response.status(500).json({error: "Failed to fetch the channel."});
    }
});

// GET all channels
router.get("/", authenticateUser, async (request, response) => {
    try {
        const channels = await Channel.findAll();
        response.status(200).json(channels);
    } catch (error) {
        response.status(500).json({error: "Failed to fetch channels."});
    }
});

// DELETE a channel by id
router.delete("/:id", authenticateUser, async (request, response) => {
    try {
        const channelId = request.params.id;

        const deletedChannelCount = await Channel.destroy({
            where: {id: channelId},
        });

        if (deletedChannelCount === 0) {
            return response.status(404).json({error: "Channel not found for deletion."});
        }

        response.status(200).json({message: "Channel deleted successfully."});
    } catch (error) {
        response.status(500).json({error: "Failed to delete the channel."});
    }
});

module.exports = router;
