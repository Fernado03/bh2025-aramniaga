const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    // Auth Fields
    username: {
      type: String,
      required: [true, 'Please add a username'],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false, // Don't return password by default
    },

    // Business Profile
    businessName: {
      type: String,
      default: '',
    },
    niche: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },

    // Gamification Engine
    currentDay: {
      type: Number,
      default: 0,
    },
    completedDays: {
      type: [Number],
      default: [],
    },
    stats: {
      followers: {
        type: Number,
        default: 0,
      },
      views: {
        type: Number,
        default: 0,
      },
      likes: {
        type: Number,
        default: 0,
      },
    },
    badges: {
      type: [String],
      default: [],
    },

    // Content History (The Notebook)
    generatedBios: {
      type: [String],
      default: [],
    },
    generatedHashtags: {
      type: [String],
      default: [],
    },
    savedCaptions: {
      type: [
        {
          captions: [String],
          feedback: String,
          imageUrl: String,
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [],
    },
    day4Result: {
      grade: String,
      feedback: String,
      tips: String,
    },
    day6Result: {
      grade: String,
      feedback: String,
      tips: String,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
