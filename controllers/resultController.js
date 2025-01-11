const Result = require("../models/Result");
const Question = require("../models/Question"); // Sesuaikan path sesuai struktur folder Anda

const submitAnswer = async (req, res) => {
  try {
    const { userId, answers } = req.body;

    // Ambil pertanyaan yang relevan untuk soal yang dijawab oleh user
    const questionIds = answers.map((answer) => answer.questionId);
    const questions = await Question.find({
      "questions.id": { $in: questionIds },
    });

    const updatedAnswers = answers.map((answer) => {
      // Temukan soal yang sesuai dengan questionId
      const question = questions
        .map((q) => q.questions.find((qs) => qs.id === answer.questionId))
        .find((qs) => qs);

      if (!question) {
        throw new Error(`Soal dengan ID ${answer.questionId} tidak ditemukan.`);
      }

      // Periksa apakah jawaban yang dipilih benar
      const isCorrect = question.correctOption === answer.userAnswer;
      const score = isCorrect ? question.score : 0;

      return {
        questionId: answer.questionId,
        userAnswer: answer.userAnswer,
        isCorrect: isCorrect,
        score: score,
      };
    });

    // Buat result baru dengan jawaban yang telah diperiksa
    const result = new Result({
      userId,
      answers: updatedAnswers,
    });

    // Simpan result ke database
    await result.save();

    res.status(200).json({ message: "Hasil ujian berhasil disimpan", result });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Terjadi kesalahan saat menyimpan hasil",
      error: error.message,
    });
  }
};

const getResult = async (req, res) => {
  try {
    const { userId } = req.params;

    const results = await Result.find({ userId });
    if (results.length === 0)
      return res.status(404).json({ message: "No results found" });

    res.status(200).json({ results });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllResults = async (req, res) => {
  try {
    const results = await Result.find().populate("userId", "username email");
    if (results.length === 0)
      return res.status(404).json({ message: "No results found" });

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { submitAnswer, getResult, getAllResults };
