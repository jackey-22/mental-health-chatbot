const mongoose = require('mongoose');

// PHQ-9 Depression Assessment Model
const assessmentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: false, // Optional if you don't have user authentication yet
    },
    answers: {
      type: [Number],
      required: true,
      validate: {
        validator: function(arr) {
          return arr.length === 9 && arr.every(val => val >= 0 && val <= 3);
        },
        message: 'Must have exactly 9 answers, each between 0-3'
      }
    },
    totalScore: {
      type: Number,
      required: true,
      min: 0,
      max: 27,
    },
    severity: {
      type: String,
      enum: ['Minimal', 'Mild', 'Moderate', 'Moderately Severe', 'Severe'],
      required: true,
    },
    questions: {
      type: [String],
      default: [
        'Little interest or pleasure in doing things',
        'Feeling down, depressed, or hopeless',
        'Trouble falling or staying asleep, or sleeping too much',
        'Feeling tired or having little energy',
        'Poor appetite or overeating',
        'Feeling bad about yourself or that you are a failure or have let yourself or your family down',
        'Trouble concentrating on things, such as reading the newspaper or watching television',
        'Moving or speaking so slowly that other people could have noticed. Or the opposite being so fidgety or restless that you have been moving around a lot more than usual',
        'Thoughts that you would be better off dead, or of hurting yourself'
      ]
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Assessment', assessmentSchema);
