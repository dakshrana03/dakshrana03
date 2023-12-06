const express = require("express");
const {Reply} = require("../models/databaseInitializer");
const {authenticateUser} = require("../authentication/userAuthentication");

const router = express.Router();

// CREATE a new comment
router.post("/", authenticateUser, async (request, response) => {
    try {
        const newReply = request.body;
        newReply.email = request.user.email;
        if (newReply.parentId) {
            const parentReply = await Reply.findByPk(newReply.parentId);

            if (!parentReply) {
                return response.status(404).json({error: "Parent reply not found."});
            }

            await Reply.create(newReply);
            return response.status(201).json(newReply);
        } else {
            await Reply.create(newReply);
            return response.status(201).json(newReply);
        }
    } catch (error) {
        response.status(500).json({error: "Failed to create a new reply."});
    }
});

// GET all comments for a post
router.get("/:id", async (request, response) => {
    try {
        console.log(request.params.id)
        const questionId = request.params.id;
        const postComments = await Reply.findAll({
            where: {QuestionId: questionId, parentId: null},
            include: [{model: Reply, as: 'nestedReplies'}],
        });
        response.status(200).json(postComments);
    } catch (error) {
        response.status(500).json({error: "Failed to fetch replies."});
    }
});

// DELETE a comment by id
router.delete("/:id", authenticateUser, async (request, response) => {
    try {
        const replyIdToDelete = request.params.id;

        const deletedReplyCount = await Reply.destroy({
            where: {id: replyIdToDelete},
        });

        if (deletedReplyCount === 0) {
            return response.status(404).json({error: "Reply not found for deletion."});
        }

        response.status(200).json({message: "Reply deleted successfully."});
    } catch (error) {
        response.status(500).json({error: "Failed to delete the reply."});
    }
});

module.exports = router;
