const mongoose = require("mongoose");

const promptSchema = new mongoose.Schema({
  prompt: { type: String, required: [true, "Prompt is required"] },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Corrected ref
}, {
  versionKey: false,
  timestamps: true,
});

const PromptModel = mongoose.model("Prompt", promptSchema);

module.exports = PromptModel;
