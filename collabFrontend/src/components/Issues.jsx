import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import api from '../api';

export default function Issues({ username, repo, collaborators = [] }) {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchIssues();
    fetchStats();
  }, [username, repo, filter]);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await api.get(`/issues/${username}/${repo}`, { params });
      setIssues(response.data.issues || []);
    } catch (error) {
      console.error('Error fetching issues:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get(`/issues/${username}/${repo}/stats`);
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'open': return { text: 'Open', color: '#008000', bg: '#ccffcc' };
      case 'in-progress': return { text: 'In Progress', color: '#806000', bg: '#ffffcc' };
      case 'closed': return { text: 'Closed', color: '#808080', bg: '#e8e4dc' };
      default: return { text: status, color: '#808080', bg: '#e8e4dc' };
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'critical': return { icon: '🔴', label: 'Critical' };
      case 'high': return { icon: '🟠', label: 'High' };
      case 'medium': return { icon: '🟡', label: 'Medium' };
      case 'low': return { icon: '🔵', label: 'Low' };
      default: return { icon: '⚪', label: 'Unknown' };
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', fontSize: '11px', color: '#808080' }}>
        ⌛ Loading issues...
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Tahoma, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', paddingBottom: '6px', borderBottom: '1px solid #808080' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <svg width="14" height="14" viewBox="0 0 20 20" fill="#000080">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Issues</span>
          <span style={{ fontSize: '11px', color: '#808080' }}>— Track and manage repository issues</span>
        </div>
        <button
          className="win-btn"
          onClick={() => setShowCreateModal(true)}
          style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          ➕ New Issue
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div style={{ display: 'flex', gap: '4px', marginBottom: '8px', flexWrap: 'wrap' }}>
          {[
            { label: 'Open', count: stats.byStatus.find(s => s._id === 'open')?.count || 0, color: '#008000', bg: '#ccffcc' },
            { label: 'In Progress', count: stats.byStatus.find(s => s._id === 'in-progress')?.count || 0, color: '#806000', bg: '#ffffcc' },
            { label: 'Closed', count: stats.byStatus.find(s => s._id === 'closed')?.count || 0, color: '#808080', bg: '#e8e4dc' },
            { label: 'Total', count: issues.length, color: '#000080', bg: '#cce0ff' },
          ].map(stat => (
            <div
              key={stat.label}
              className="win-raised"
              style={{ padding: '4px 10px', background: stat.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '70px' }}
            >
              <span style={{ fontSize: '16px', fontWeight: 'bold', color: stat.color }}>{stat.count}</span>
              <span style={{ fontSize: '10px', color: stat.color }}>{stat.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Filter buttons */}
      <div style={{ display: 'flex', gap: '2px', marginBottom: '8px' }}>
        {['all', 'open', 'in-progress', 'closed'].map(status => (
          <button
            key={status}
            className={`win-tab${filter === status ? ' active' : ''}`}
            onClick={() => setFilter(status)}
            style={{ fontFamily: 'Tahoma, sans-serif', cursor: 'pointer' }}
          >
            {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Issues list */}
      <div className="win-sunken" style={{ background: '#ffffff', maxHeight: '400px', overflowY: 'auto' }}>
        {issues.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', fontSize: '11px', color: '#808080' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📭</div>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>No issues found</div>
            <div>
              {filter === 'all'
                ? 'Create your first issue to start tracking work.'
                : `No ${filter.replace('-', ' ')} issues at the moment.`}
            </div>
          </div>
        ) : (
          issues.map((issue, index) => {
            const statusInfo = getStatusLabel(issue.status);
            const priorityInfo = getPriorityLabel(issue.priority);
            return (
              <div
                key={issue._id}
                className="win-list-item"
                onClick={() => setSelectedIssue(issue)}
                style={{ 
                  padding: '4px 6px', borderBottom: '1px solid #e8e4dc',
                  display: 'flex', alignItems: 'flex-start', gap: '8px',
                  cursor: 'pointer', fontSize: '11px',
                }}
              >
                {/* Priority icon */}
                <span style={{ fontSize: '14px', flexShrink: 0, marginTop: '1px' }}>{priorityInfo.icon}</span>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <span style={{ fontWeight: 'bold', color: '#000080', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {issue.title}
                    </span>
                    {/* Status badge */}
                    <span style={{ 
                      fontSize: '10px', padding: '1px 5px', flexShrink: 0,
                      background: statusInfo.bg, color: statusInfo.color,
                      border: `1px solid ${statusInfo.color}`,
                    }}>
                      {statusInfo.text}
                    </span>
                  </div>
                  <div style={{ color: '#444444', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {issue.description}
                  </div>
                  <div style={{ color: '#808080', marginTop: '2px', display: 'flex', gap: '10px' }}>
                    <span>👤 {issue.createdBy.name}</span>
                    <span>📅 {new Date(issue.createdAt).toLocaleDateString()}</span>
                    {issue.comments.length > 0 && <span>💬 {issue.comments.length}</span>}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modals */}
      {showCreateModal && createPortal(
        <CreateIssueModal
          username={username}
          repo={repo}
          collaborators={collaborators}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => { fetchIssues(); fetchStats(); setShowCreateModal(false); }}
        />,
        document.body
      )}

      {selectedIssue && createPortal(
        <IssueDetailModal
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
          onUpdate={() => { fetchIssues(); fetchStats(); setSelectedIssue(null); }}
        />,
        document.body
      )}
    </div>
  );
}

function CreateIssueModal({ username, repo, collaborators, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '', description: '', priority: 'medium', assignees: [], labels: [],
    createdBy: { name: 'Current User', email: 'user@example.com' }
  });
  const [labelInput, setLabelInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const token = localStorage.getItem('token') || '';
        const response = await api.get('/getUsers', { headers: { 'Authorization': `Bearer ${token}` } });
        let fetchedUsers = response.data.users || response.data || [];
        if (fetchedUsers.length > 0 && typeof fetchedUsers[0] === 'string') {
          fetchedUsers = fetchedUsers.map(userString => {
            const match = userString.match(/^(.+?)\s*<(.+?)>$/);
            if (match) return { name: match[1].trim(), email: match[2].trim() };
            return { name: userString, email: userString };
          });
        }
        setUsers(fetchedUsers);
      } catch (error) {
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
      await api.post(`/issues/${username}/${repo}`, formData);
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
      setFormData({ ...formData, labels: [...formData.labels, labelInput.trim()] });
      setLabelInput('');
    }
  };

  const removeLabel = (label) => {
    setFormData({ ...formData, labels: formData.labels.filter(l => l !== label) });
  };

  const toggleAssignee = (collaborator) => {
    const exists = formData.assignees.find(a => a.email === collaborator.email);
    if (exists) {
      setFormData({ ...formData, assignees: formData.assignees.filter(a => a.email !== collaborator.email) });
    } else {
      setFormData({ ...formData, assignees: [...formData.assignees, { name: collaborator.name, email: collaborator.email }] });
    }
  };

  return (
    <div className="win-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="win-window" style={{ width: '520px', maxWidth: '95vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        {/* Title bar */}
        <div className="win-titlebar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            ➕ Create New Issue — {repo}
          </div>
          <button className="win-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          <div style={{ overflowY: 'auto', flex: 1, padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>

            {/* Title */}
            <div>
              <div style={{ fontSize: '11px', marginBottom: '3px' }}>Title: <span style={{ color: '#cc0000' }}>*</span></div>
              <input
                type="text" required className="win-input" style={{ width: '100%' }}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Brief description of the issue"
              />
            </div>

            {/* Description */}
            <div>
              <div style={{ fontSize: '11px', marginBottom: '3px' }}>Description: <span style={{ color: '#cc0000' }}>*</span></div>
              <textarea
                required className="win-input" style={{ width: '100%', minHeight: '80px', resize: 'vertical', fontFamily: 'Tahoma, sans-serif' }}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed description of the issue..."
              />
            </div>

            {/* Priority */}
            <div>
              <div style={{ fontSize: '11px', marginBottom: '3px' }}>Priority:</div>
              <div style={{ display: 'flex', gap: '4px' }}>
                {['low', 'medium', 'high', 'critical'].map(p => (
                  <button
                    key={p} type="button"
                    onClick={() => setFormData({ ...formData, priority: p })}
                    className="win-btn"
                    style={{ 
                      fontFamily: 'Tahoma, sans-serif',
                      background: formData.priority === p ? '#0a246a' : '#d4d0c8',
                      color: formData.priority === p ? '#ffffff' : '#000000',
                    }}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Assignees */}
            <div>
              <div style={{ fontSize: '11px', marginBottom: '3px' }}>
                Assign to: ({formData.assignees.length} selected)
              </div>
              <div className="win-sunken" style={{ background: '#ffffff', maxHeight: '120px', overflowY: 'auto' }}>
                {loadingUsers ? (
                  <div style={{ padding: '12px', textAlign: 'center', fontSize: '11px', color: '#808080' }}>⌛ Loading users...</div>
                ) : users.length > 0 ? (
                  users.map((collab) => (
                    <label
                      key={collab.email || collab.id}
                      className="win-list-item"
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '3px 6px', cursor: 'pointer' }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.assignees.some(a => a.email === collab.email)}
                        onChange={() => toggleAssignee(collab)}
                        style={{ cursor: 'pointer' }}
                      />
                      <svg width="12" height="12" viewBox="0 0 20 20" fill="#000080">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      <span style={{ flex: 1 }}>{collab.name || collab.email}</span>
                      <span style={{ color: '#0000cc', fontSize: '10px' }}>{collab.email}</span>
                    </label>
                  ))
                ) : (
                  <div style={{ padding: '8px', color: '#808080', fontSize: '11px' }}>No users available</div>
                )}
              </div>
            </div>

            {/* Labels */}
            <div>
              <div style={{ fontSize: '11px', marginBottom: '3px' }}>Labels:</div>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                <input
                  type="text" className="win-input" style={{ flex: 1 }}
                  value={labelInput}
                  onChange={(e) => setLabelInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLabel())}
                  placeholder="Type label and press Add..."
                />
                <button type="button" className="win-btn" onClick={addLabel} style={{ fontFamily: 'Tahoma, sans-serif' }}>Add</button>
              </div>
              {formData.labels.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                  {formData.labels.map((label, idx) => (
                    <span
                      key={idx}
                      style={{ 
                        fontSize: '11px', padding: '1px 6px', 
                        background: '#cce0ff', border: '1px solid #0000cc', color: '#000080',
                        display: 'flex', alignItems: 'center', gap: '4px'
                      }}
                    >
                      {label}
                      <button
                        type="button"
                        onClick={() => removeLabel(label)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '11px', color: '#cc0000', lineHeight: 1 }}
                      >×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer buttons */}
          <div style={{ 
            borderTop: '1px solid #808080', padding: '8px 12px',
            display: 'flex', justifyContent: 'flex-end', gap: '4px',
            background: '#d4d0c8'
          }}>
            <button type="submit" disabled={submitting} className="win-btn win-btn-primary" style={{ fontFamily: 'Tahoma, sans-serif', minWidth: '80px' }}>
              {submitting ? '⌛ Creating...' : 'Create Issue'}
            </button>
            <button type="button" className="win-btn" onClick={onClose} style={{ fontFamily: 'Tahoma, sans-serif' }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function IssueDetailModal({ issue, onClose, onUpdate }) {
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState(issue.status);

  const handleStatusChange = async (newStatus) => {
    try {
      await api.put(`/issues/issue/${issue._id}`, { status: newStatus });
      setStatus(newStatus);
      onUpdate();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    try {
      await api.post(`/issues/issue/${issue._id}/comment`, {
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
    <div className="win-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="win-window" style={{ width: '600px', maxWidth: '95vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        {/* Title bar */}
        <div className="win-titlebar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, overflow: 'hidden' }}>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="#ffff00">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              Issue: {issue.title}
            </span>
          </div>
          <button className="win-close-btn" onClick={onClose}>✕</button>
        </div>

        <div style={{ overflowY: 'auto', flex: 1, padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Header info */}
          <div style={{ fontSize: '11px', color: '#808080', borderBottom: '1px solid #d4d0c8', paddingBottom: '6px' }}>
            Created by <strong>{issue.createdBy.name}</strong> on {new Date(issue.createdAt).toLocaleDateString()}
          </div>

          {/* Status */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}>Status:</div>
            <div style={{ display: 'flex', gap: '3px' }}>
              {['open', 'in-progress', 'closed'].map(s => (
                <button
                  key={s}
                  className="win-btn"
                  onClick={() => handleStatusChange(s)}
                  style={{ 
                    fontFamily: 'Tahoma, sans-serif',
                    background: status === s ? '#0a246a' : '#d4d0c8',
                    color: status === s ? '#ffffff' : '#000000',
                  }}
                >
                  {s.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}>Description:</div>
            <div className="win-sunken" style={{ background: '#ffffff', padding: '6px 8px', fontSize: '11px', lineHeight: '1.5' }}>
              {issue.description}
            </div>
          </div>

          {/* Assignees */}
          {issue.assignees.length > 0 && (
            <div>
              <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}>Assignees:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {issue.assignees.map((assignee, idx) => (
                  <div
                    key={idx}
                    className="win-raised"
                    style={{ padding: '2px 8px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}
                  >
                    <svg width="12" height="12" viewBox="0 0 20 20" fill="#000080">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    {assignee.name || assignee.email}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comments */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}>
              Comments ({issue.comments?.length || 0}):
            </div>
            <div className="win-sunken" style={{ background: '#ffffff', maxHeight: '200px', overflowY: 'auto' }}>
              {issue.comments && issue.comments.length > 0 ? (
                issue.comments.map((c, idx) => (
                  <div key={idx} style={{ borderBottom: '1px solid #e8e4dc', padding: '6px 8px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#000080', marginBottom: '2px' }}>
                      👤 {c.author.name} — <span style={{ color: '#808080', fontWeight: 'normal' }}>{new Date(c.createdAt).toLocaleString()}</span>
                    </div>
                    <div style={{ fontSize: '11px' }}>{c.text}</div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '12px', textAlign: 'center', fontSize: '11px', color: '#808080' }}>
                  No comments yet.
                </div>
              )}
            </div>
          </div>

          {/* Add comment */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}>Add Comment:</div>
            <div style={{ display: 'flex', gap: '4px' }}>
              <input
                type="text"
                className="win-input"
                style={{ flex: 1 }}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                placeholder="Type your comment..."
              />
              <button className="win-btn" onClick={handleAddComment} style={{ fontFamily: 'Tahoma, sans-serif' }}>Post</button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ 
          borderTop: '1px solid #808080', padding: '8px 12px',
          display: 'flex', justifyContent: 'flex-end', gap: '4px',
          background: '#d4d0c8'
        }}>
          <button className="win-btn win-btn-primary" onClick={onClose} style={{ fontFamily: 'Tahoma, sans-serif' }}>OK</button>
          <button className="win-btn" onClick={onClose} style={{ fontFamily: 'Tahoma, sans-serif' }}>Close</button>
        </div>
      </div>
    </div>
  );
}
