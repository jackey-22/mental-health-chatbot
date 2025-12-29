const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    userMessage: {
      type: String,
      required: true,
    },
    botReply: {
      type: String,
      required: true,
    },
    isCrisis: {
      type: Boolean,
      default: false,
    },
    sentiment: {
      score: {
        type: Number,
        default: 0,
      },
      comparative: {
        type: Number,
        default: 0,
      },
      label: {
        type: String,
        enum: ['positive', 'negative', 'neutral'],
        default: 'neutral',
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Chat', chatSchema);

