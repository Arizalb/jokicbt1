const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const questionSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  questions: [
    {
      questionId: { type: Number }, // Auto Increment Field
      question: { type: String, required: true },
      optionA: { type: String, required: true },
      optionB: { type: String, required: true },
      optionC: { type: String, required: true },
      optionD: { type: String, required: true },
      correctOption: { type: String, required: true },
      score: { type: Number, required: true },
    },
  ],
  timestamps: { type: Date, default: Date.now },
});

// Plugin Auto Increment for the subdocument field
questionSchema.plugin(AutoIncrement, { inc_field: "questions.questionId" });

module.exports = mongoose.model("Question", questionSchema);
