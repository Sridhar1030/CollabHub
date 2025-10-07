const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  repository: {
    type: String,
    required: true,
    index: true
  },
  username: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'closed'],
    default: 'open'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  assignees: [{
    name: String,
    email: String
  }],
  createdBy: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },
  labels: [{
    type: String,
    trim: true
  }],
  comments: [{
    author: {
      name: String,
      email: String
    },
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Compound index for faster queries
issueSchema.index({ username: 1, repository: 1 });

module.exports = mongoose.model('Issue', issueSchema);
