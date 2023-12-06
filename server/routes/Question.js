const express = require("express");
const {Question} = require("../models/databaseInitializer");
const {authenticateUser} = require("../authentication/userAuthentication");

const router = express.Router();

// CREATE a new question in a channel
router.post("/:id", authenticateUser, async (request, response) => {
    try {
        console.log(request.body)
        const question = request.body;
        question.email = request.user.email;
        question.UserId = request.user.id;
        question.ChannelId = request.params.id;
        await Question.create(question);
        response.status(201).json(question);
    } catch (error) {
        response.status(500).json({error: "Failed to create a new question."});
    }
});

// GET all questions
router.get("/", authenticateUser, async (request, response) => {
    try {
        const questions = await Question.findAll();
        response.status(200).json({questions: questions});
    } catch (error) {
        response.status(500).json({error: "Failed to fetch questions."});
    }
});

// GET all questions by channel id
router.get("/by-channel-id/:id", authenticateUser, async (request, response) => {
    try {
        const channelId = request.params.id;
        const questions = await Question.findAll({
            where: {ChannelId: channelId},
        });

        response.status(200).json({questions: questions});
    } catch (error) {
        response.status(500).json({error: "Failed to fetch questions by channel."});
    }
});

// GET all questions by user id
router.get("/by-user-id/:id", async (request, response) => {
    try {
        const userId = request.params.id;
        const questions = await Question.findAll({
            where: {UserId: userId},
        });

        response.status(200).json(questions);
    } catch (error) {
        response.status(500).json({error: "Failed to fetch questions by user."});
    }
});

// GET a question by id
router.get("/by-id/:id", async (request, response) => {
    try {
        const id = request.params.id;
        const question = await Question.findByPk(id);

        response.status(200).json(question);
    } catch (error) {
        response.status(500).json({error: "Failed to fetch the question."});
    }
});

// UPDATE a question's topic
router.put("/topic", authenticateUser, async (request, response) => {
    try {
        const {newTopic: newTopic, id} = request.body;
        await Question.update({topic: newTopic}, {where: {id: id}});

        response.status(200).json(newTopic);
    } catch (error) {
        response.status(500).json({error: "Failed to update question topic."});
    }
});

// UPDATE a question's text
router.put("/question", authenticateUser, async (request, response) => {
    try {
        const {newText, id} = request.body;
        await Question.update({question: newText}, {where: {id: id}});

        response.status(200).json(newText);
    } catch (error) {
        response.status(500).json({error: "Failed to update question text."});
    }
});

// DELETE a question by id
router.delete("/:id", authenticateUser, async (request, response) => {
    try {
        const questionId = request.params.id;
        await Question.destroy({
            where: {id: questionId},
        });

        response.status(200).json({message: "Question deleted successfully."});
    } catch (error) {
        response.status(500).json({error: "Failed to delete the question."});
    }
});

module.exports = router;
