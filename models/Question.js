const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const questionSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    questions: [
      {
        questionId: {
          type: Number,
          unique: true,
        },
        question: {
          type: String,
          required: true,
          trim: true,
        },
        optionA: {
          type: String,
          required: true,
          trim: true,
        },
        optionB: {
          type: String,
          required: true,
          trim: true,
        },
        optionC: {
          type: String,
          required: true,
          trim: true,
        },
        optionD: {
          type: String,
          required: true,
          trim: true,
        },
        correctOption: {
          type: String,
          required: true,
          enum: ["A", "B", "C", "D"],
        },
        score: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Validasi untuk memastikan pilihan jawaban valid per soal
questionSchema.pre("validate", function (next) {
  // Hapus validasi duplikasi opsi
  next();
});

// Plugin Auto Increment for the subdocument field
questionSchema.plugin(AutoIncrement, {
  inc_field: "questions.questionId",
  start_seq: 1,
});

module.exports = mongoose.model("Question", questionSchema);
