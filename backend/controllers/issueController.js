const Issue = require('../models/Issue');

// Get all issues for a repository
exports.getIssues = async (req, res) => {
  try {
    const { username, repo } = req.params;
    const { status, priority, assignee } = req.query;

    // Build query
    const query = { username, repository: repo };
    
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (assignee) query['assignees.email'] = assignee;

    const issues = await Issue.find(query)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: issues.length,
      issues
    });
  } catch (error) {
    console.error('Error fetching issues:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch issues',
      error: error.message
    });
  }
};

// Get a single issue by ID
exports.getIssueById = async (req, res) => {
  try {
    const { id } = req.params;

    const issue = await Issue.findById(id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    res.json({
      success: true,
      issue
    });
  } catch (error) {
    console.error('Error fetching issue:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch issue',
      error: error.message
    });
  }
};

// Create a new issue
exports.createIssue = async (req, res) => {
  try {
    const { username, repo } = req.params;
    const { title, description, priority, assignees, labels, createdBy } = req.body;

    // Validate required fields
    if (!title || !description || !createdBy) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and createdBy are required'
      });
    }

    const issue = new Issue({
      username,
      repository: repo,
      title,
      description,
      priority: priority || 'medium',
      assignees: assignees || [],
      labels: labels || [],
      createdBy,
      status: 'open'
    });

    await issue.save();

    res.status(201).json({
      success: true,
      message: 'Issue created successfully',
      issue
    });
  } catch (error) {
    console.error('Error creating issue:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create issue',
      error: error.message
    });
  }
};

// Update an issue
exports.updateIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    const issue = await Issue.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    res.json({
      success: true,
      message: 'Issue updated successfully',
      issue
    });
  } catch (error) {
    console.error('Error updating issue:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update issue',
      error: error.message
    });
  }
};

// Add a comment to an issue
exports.addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { author, text } = req.body;

    if (!author || !text) {
      return res.status(400).json({
        success: false,
        message: 'Author and text are required'
      });
    }

    const issue = await Issue.findById(id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    issue.comments.push({
      author,
      text,
      createdAt: new Date()
    });

    await issue.save();

    res.json({
      success: true,
      message: 'Comment added successfully',
      issue
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add comment',
      error: error.message
    });
  }
};

// Delete an issue
exports.deleteIssue = async (req, res) => {
  try {
    const { id } = req.params;

    const issue = await Issue.findByIdAndDelete(id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    res.json({
      success: true,
      message: 'Issue deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting issue:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete issue',
      error: error.message
    });
  }
};

// Get issue statistics
exports.getIssueStats = async (req, res) => {
  try {
    const { username, repo } = req.params;

    const stats = await Issue.aggregate([
      {
        $match: { username, repository: repo }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const priorityStats = await Issue.aggregate([
      {
        $match: { username, repository: repo }
      },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      stats: {
        byStatus: stats,
        byPriority: priorityStats
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
};
