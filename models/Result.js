const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    answers: [
      {
        questionId: { type: String, required: true }, // ID dari soal dalam array questions
        userAnswer: { type: String, required: true }, // Jawaban yang dipilih oleh user
        isCorrect: { type: Boolean, required: true }, // Menentukan apakah jawaban benar
        score: { type: Number, required: true }, // Nilai yang diberikan untuk soal ini
      },
    ],
    totalScore: { type: Number, default: 0 }, // Menyimpan total skor
  },
  { timestamps: true }
);

// Middleware untuk menghitung totalScore sebelum menyimpan hasil
resultSchema.pre("save", function (next) {
  // Menghitung totalScore dari semua answers
  this.totalScore = this.answers.reduce(
    (total, answer) => total + answer.score,
    0
  );
  next();
});

module.exports = mongoose.model("Result", resultSchema);
