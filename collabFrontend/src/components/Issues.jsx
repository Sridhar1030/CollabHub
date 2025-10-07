import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Issues({ username, repo, collaborators = [] }) {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [filter, setFilter] = useState('all'); // all, open, in-progress, closed
  const [stats, setStats] = useState(null);

  // Fetch issues
  useEffect(() => {
    fetchIssues();
    fetchStats();
  }, [username, repo, filter]);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await axios.get(`http://localhost:5000/issues/${username}/${repo}`, { params });
      setIssues(response.data.issues || []);
    } catch (error) {
      console.error('Error fetching issues:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/issues/${username}/${repo}/stats`);
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'in-progress': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'closed': return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'text-red-500 bg-red-500/10';
      case 'high': return 'text-orange-500 bg-orange-500/10';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10';
      case 'low': return 'text-blue-500 bg-blue-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'critical': return '🔴';
      case 'high': return '🟠';
      case 'medium': return '🟡';
      case 'low': return '🔵';
      default: return '⚪';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 bg-blue-500/30 blur-xl rounded-full animate-pulse"></div>
            <div className="relative animate-spin w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full"></div>
          </div>
          <p className="text-gray-200 font-semibold">Loading issues...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/30 blur-xl rounded-full"></div>
            <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-xl">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Issues</h2>
            <p className="text-sm text-gray-400">Track and manage repository issues</p>
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium shadow-lg hover:shadow-blue-500/50 transition-all hover:scale-105 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Issue
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-4 gap-4">
          <div className="glass-dark rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 mb-1">Open</p>
                <p className="text-2xl font-bold text-green-400">
                  {stats.byStatus.find(s => s._id === 'open')?.count || 0}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="glass-dark rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 mb-1">In Progress</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {stats.byStatus.find(s => s._id === 'in-progress')?.count || 0}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="glass-dark rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 mb-1">Closed</p>
                <p className="text-2xl font-bold text-gray-400">
                  {stats.byStatus.find(s => s._id === 'closed')?.count || 0}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-gray-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="glass-dark rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 mb-1">Total</p>
                <p className="text-2xl font-bold text-blue-400">{issues.length}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 glass-dark rounded-xl p-2 border border-white/10 w-fit">
        {['all', 'open', 'in-progress', 'closed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === status
                ? 'bg-blue-500 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Issues List */}
      <div className="space-y-3">
        {issues.length === 0 ? (
          <div className="glass-dark rounded-xl p-12 text-center border border-white/10">
            <div className="relative inline-block mb-4">
              <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center border border-blue-500/30">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No issues found</h3>
            <p className="text-gray-400 mb-6">
              {filter === 'all' 
                ? 'Create your first issue to start tracking work' 
                : `No ${filter.replace('-', ' ')} issues at the moment`}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create First Issue
            </button>
          </div>
        ) : (
          issues.map((issue) => (
            <div
              key={issue._id}
              onClick={() => setSelectedIssue(issue)}
              className="glass-dark rounded-xl p-5 border border-white/10 hover:border-blue-500/30 transition-all cursor-pointer group"
            >
              <div className="flex items-start gap-4">
                {/* Priority Icon */}
                <div className={`w-10 h-10 rounded-lg ${getPriorityColor(issue.priority)} flex items-center justify-center text-xl flex-shrink-0`}>
                  {getPriorityIcon(issue.priority)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {issue.title}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(issue.status)} whitespace-nowrap`}>
                      {issue.status.replace('-', ' ')}
                    </span>
                  </div>

                  <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                    {issue.description}
                  </p>

                  <div className="flex items-center flex-wrap gap-4 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {issue.createdBy.name}
                    </div>

                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {new Date(issue.createdAt).toLocaleDateString()}
                    </div>

                    {issue.assignees.length > 0 && (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <div className="flex -space-x-2">
                          {issue.assignees.slice(0, 3).map((assignee, idx) => (
                            <div
                              key={idx}
                              className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-gray-900 flex items-center justify-center text-white text-[10px] font-semibold"
                              title={assignee.name || assignee.email || 'Unknown'}
                            >
                              {assignee.name ? assignee.name.charAt(0).toUpperCase() : assignee.email ? assignee.email.charAt(0).toUpperCase() : '?'}
                            </div>
                          ))}
                          {issue.assignees.length > 3 && (
                            <div className="w-6 h-6 rounded-full bg-gray-700 border-2 border-gray-900 flex items-center justify-center text-white text-[10px]">
                              +{issue.assignees.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {issue.comments.length > 0 && (
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {issue.comments.length}
                      </div>
                    )}
                  </div>

                  {/* Labels */}
                  {issue.labels && issue.labels.length > 0 && (
                    <div className="flex items-center gap-2 mt-3">
                      {issue.labels.map((label, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 rounded-md text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30"
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Issue Modal */}
      {showCreateModal && (
        <CreateIssueModal
          username={username}
          repo={repo}
          collaborators={collaborators}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            fetchIssues();
            fetchStats();
            setShowCreateModal(false);
          }}
        />
      )}

      {/* Issue Detail Modal */}
      {selectedIssue && (
        <IssueDetailModal
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
          onUpdate={() => {
            fetchIssues();
            fetchStats();
            setSelectedIssue(null);
          }}
        />
      )}
    </div>
  );
}

// Create Issue Modal Component
function CreateIssueModal({ username, repo, collaborators, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    assignees: [],
    labels: [],
    createdBy: { name: 'Current User', email: 'user@example.com' } // Replace with actual user
  });
  const [labelInput, setLabelInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const token = localStorage.getItem('token') || ''; // Get token from localStorage
        console.log('🔑 Fetching users with token:', token ? 'Token exists' : 'No token found');
        console.log('📡 API Call: GET http://localhost:5000/getUsers');
        console.log('📤 Headers:', { Authorization: `Bearer ${token}` });
        
        const response = await axios.get('http://localhost:5000/getUsers', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log('✅ Users API Response:', response.data);
        
        // Parse the response - handle both formats:
        // Format 1: ["Name <email>", "Name2 <email2>"]
        // Format 2: [{name: "Name", email: "email"}, ...]
        let fetchedUsers = response.data.users || response.data || [];
        
        // Check if first item is a string (Format 1)
        if (fetchedUsers.length > 0 && typeof fetchedUsers[0] === 'string') {
          console.log('📝 Parsing string format: "Name <email>"');
          fetchedUsers = fetchedUsers.map(userString => {
            // Parse "Name <email>" format
            const match = userString.match(/^(.+?)\s*<(.+?)>$/);
            if (match) {
              return {
                name: match[1].trim(),
                email: match[2].trim()
              };
            }
            // Fallback if format doesn't match
            return {
              name: userString,
              email: userString
            };
          });
          console.log('✅ Parsed users:', fetchedUsers);
        }
        
        console.log('👥 Fetched users count:', fetchedUsers.length);
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('❌ Error fetching users:', error);
        console.error('Error details:', error.response?.data || error.message);
        // Fallback to collaborators if API fails
        console.log('🔄 Falling back to collaborators prop');
        setUsers(collaborators || []);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, [collaborators]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await axios.post(`http://localhost:5000/issues/${username}/${repo}`, formData);
      onSuccess();
    } catch (error) {
      console.error('Error creating issue:', error);
      alert('Failed to create issue');
    } finally {
      setSubmitting(false);
    }
  };

  const addLabel = () => {
    if (labelInput.trim() && !formData.labels.includes(labelInput.trim())) {
      setFormData({
        ...formData,
        labels: [...formData.labels, labelInput.trim()]
      });
      setLabelInput('');
    }
  };

  const removeLabel = (label) => {
    setFormData({
      ...formData,
      labels: formData.labels.filter(l => l !== label)
    });
  };

  const toggleAssignee = (collaborator) => {
    const exists = formData.assignees.find(a => a.email === collaborator.email);
    if (exists) {
      setFormData({
        ...formData,
        assignees: formData.assignees.filter(a => a.email !== collaborator.email)
      });
    } else {
      setFormData({
        ...formData,
        assignees: [...formData.assignees, { name: collaborator.name, email: collaborator.email }]
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-modal" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div 
        className="glass-dark rounded-2xl border border-white/10 shadow-2xl w-full max-w-2xl" 
        style={{
          maxHeight: '90vh', 
          display: 'flex', 
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Fixed at top */}
        <div className="px-6 py-4 border-b border-white/10 bg-black/40 backdrop-blur-sm flex items-center justify-between" style={{flexShrink: 0, zIndex: 10}}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Create New Issue</h3>
              <p className="text-xs text-gray-400">Fill in the details below</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all flex items-center justify-center"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div 
          className="overflow-y-auto custom-scrollbar" 
          style={{
            flex: '1 1 auto',
            minHeight: 0,
            overflowY: 'scroll',
            WebkitOverflowScrolling: 'touch',
            position: 'relative'
          }}
        >
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
              placeholder="Brief description of the issue"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={5}
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all resize-none custom-scrollbar"
              placeholder="Provide detailed information about the issue..."
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Priority</label>
            <div className="grid grid-cols-4 gap-2">
              {['low', 'medium', 'high', 'critical'].map((priority) => (
                <button
                  key={priority}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority })}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    formData.priority === priority
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                  }`}
                >
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Assignees */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Assign to ({formData.assignees.length} selected)
            </label>
            {loadingUsers ? (
              <div className="glass-dark rounded-lg p-4 border border-white/10 text-center">
                <div className="animate-spin w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full mx-auto mb-2"></div>
                <p className="text-xs text-gray-400">Loading users...</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar glass-dark rounded-lg p-3 border border-white/10">
                {users && users.length > 0 ? (
                  users.map((collab) => (
                    <label
                      key={collab.email || collab.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={formData.assignees.some(a => a.email === collab.email)}
                        onChange={() => toggleAssignee(collab)}
                        className="w-4 h-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-800"
                      />
                      <div className="flex items-center gap-2 flex-1">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-semibold">
                          {collab.name ? collab.name.charAt(0).toUpperCase() : collab.email ? collab.email.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-white">{collab.name || collab.email || 'Unknown'}</div>
                          <div className="text-xs text-gray-400">{collab.email || 'No email'}</div>
                        </div>
                      </div>
                    </label>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 text-center py-4">No users available</p>
                )}
              </div>
            )}
          </div>

          {/* Labels */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Labels</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLabel())}
                className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
                placeholder="Add a label..."
              />
              <button
                type="button"
                onClick={addLabel}
                className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-all"
              >
                Add
              </button>
            </div>
            {formData.labels.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.labels.map((label, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-md text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-2"
                  >
                    {label}
                    <button
                      type="button"
                      onClick={() => removeLabel(label)}
                      className="hover:text-white transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Actions Buttons */}
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium shadow-lg hover:shadow-blue-500/50 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {submitting ? 'Creating...' : 'Create Issue'}
            </button>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Issue Detail Modal Component (simplified)
function IssueDetailModal({ issue, onClose, onUpdate }) {
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState(issue.status);

  const handleStatusChange = async (newStatus) => {
    try {
      await axios.put(`http://localhost:5000/issues/issue/${issue._id}`, { status: newStatus });
      setStatus(newStatus);
      onUpdate();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;

    try {
      await axios.post(`http://localhost:5000/issues/issue/${issue._id}/comment`, {
        author: { name: 'Current User', email: 'user@example.com' },
        text: comment
      });
      setComment('');
      onUpdate();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-modal">
      <div className="glass-dark rounded-2xl border border-white/10 shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="sticky top-0 px-6 py-4 border-b border-white/10 bg-black/40 backdrop-blur-sm flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">{issue.title}</h3>
            <p className="text-xs text-gray-400">
              Created by {issue.createdBy.name} on {new Date(issue.createdAt).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all flex items-center justify-center"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status selector */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Status</label>
            <div className="flex gap-2">
              {['open', 'in-progress', 'closed'].map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    status === s
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {s.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-sm font-medium text-gray-200 mb-2">Description</h4>
            <p className="text-gray-300 leading-relaxed glass-dark p-4 rounded-lg border border-white/10">
              {issue.description}
            </p>
          </div>

          {/* Assignees */}
          {issue.assignees.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-200 mb-2">Assignees</h4>
              <div className="flex flex-wrap gap-2">
                {issue.assignees.map((assignee, idx) => (
                  <div key={idx} className="flex items-center gap-2 px-3 py-2 glass-dark rounded-lg border border-white/10">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-semibold">
                      {assignee.name ? assignee.name.charAt(0).toUpperCase() : assignee.email ? assignee.email.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{assignee.name || assignee.email || 'Unknown'}</div>
                      <div className="text-xs text-gray-400">{assignee.email || 'No email'}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comments */}
          <div>
            <h4 className="text-sm font-medium text-gray-200 mb-3">
              Comments ({issue.comments?.length || 0})
            </h4>
            <div className="space-y-3 mb-4">
              {issue.comments && issue.comments.length > 0 ? (
                issue.comments.map((c, idx) => (
                  <div key={idx} className="glass-dark p-4 rounded-lg border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                        {c.author.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-white">{c.author.name}</div>
                        <div className="text-xs text-gray-400">
                          {new Date(c.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed">{c.text}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 text-center py-4">No comments yet</p>
              )}
            </div>

            {/* Add comment */}
            <div className="flex gap-2">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
                placeholder="Add a comment..."
              />
              <button
                onClick={handleAddComment}
                className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-all"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
