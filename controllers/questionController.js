const Question = require("../models/Question");

const createQuestionSet = async (req, res) => {
  try {
    const { subject, code, questions } = req.body;

    const questionSet = await Question.create({
      subject,
      code,
      createdBy: req.user.id,
      questions,
    });

    res.status(201).json(questionSet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getQuestionsByCode = async (req, res) => {
  try {
    const { code } = req.params;

    const questionSet = await Question.findOne({ code });
    if (!questionSet)
      return res.status(404).json({ message: "Question set not found" });

    res.status(200).json(questionSet.questions); // Kirim array `questions` ke user
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllQuestion = async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json({ questions });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching users" });
  }
};

// Update and delete functions omitted for brevity
const updateQuestionSet = async (req, res) => {
  try {
    const { code } = req.params;
    const { subject, questions } = req.body;

    const updatedQuestionSet = await Question.findOneAndUpdate(
      { code },
      { subject, questions },
      { new: true }
    );

    if (!updatedQuestionSet)
      return res.status(404).json({ message: "Question set not found" });

    res.status(200).json(updatedQuestionSet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteQuestionSet = async (req, res) => {
  try {
    const { code } = req.params;

    const deletedQuestionSet = await Question.findOneAndDelete({ code });
    if (!deletedQuestionSet)
      return res.status(404).json({ message: "Question set not found" });

    res.status(200).json({ message: "Question set deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createQuestionSet,
  getQuestionsByCode,
  getAllQuestion,
  updateQuestionSet,
  deleteQuestionSet,
};
