import { useState } from 'react'
import api from '../api'

const API_BASE = "" // base URL is handled by api.js (VITE_API_URL)

export default function CommitLog({ logs, selectedRepo }) {
  console.log('logs', logs)
  const [expandedCommits, setExpandedCommits] = useState(new Set())
  const [commitDiffs, setCommitDiffs] = useState({})
  const [loadingDiffs, setLoadingDiffs] = useState(new Set())

  const username = "sridhar"
  const apiKey = "abc123"

  // Parse commit logs into individual commits (improved parsing for the specific format)
  const parseCommits = (logText) => {
    if (!logText) return []
    
    const lines = logText.split('\n')
    const commits = []
    let currentCommit = null
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      
      if (line.startsWith('commit ')) {
        // Save previous commit
        if (currentCommit) {
          commits.push(currentCommit)
        }
        // Start new commit
        currentCommit = {
          hash: line.replace('commit ', '').trim(),
          author: '',
          email: '',
          date: '',
          message: ''
        }
      } else if (line.startsWith('Author: ') && currentCommit) {
        const authorLine = line.replace('Author: ', '').trim()
        // Extract name and email
        const emailMatch = authorLine.match(/<(.+)>/)
        if (emailMatch) {
          currentCommit.email = emailMatch[1]
          currentCommit.author = authorLine.replace(emailMatch[0], '').trim()
        } else {
          currentCommit.author = authorLine
        }
      } else if (line.startsWith('Date: ') && currentCommit) {
        currentCommit.date = line.replace('Date: ', '').trim()
      } else if (currentCommit && line.trim() && line.startsWith('    ')) {
        // This is the commit message (indented with 4 spaces)
        currentCommit.message = line.trim()
      }
    }
    
    // Don't forget the last commit
    if (currentCommit) {
      commits.push(currentCommit)
    }
    
    return commits
  }

  // Fetch commit diff
  const fetchCommitDiff = async (commitHash) => {
    if (commitDiffs[commitHash] || loadingDiffs.has(commitHash) || !selectedRepo) return

    setLoadingDiffs(prev => new Set([...prev, commitHash]))
    
    try {
      const response = await api.get(`/commit-diff/${username}/${selectedRepo}/${commitHash}`, {
        headers: { "x-api-key": apiKey }
      })
      
      setCommitDiffs(prev => ({
        ...prev,
        [commitHash]: response.data
      }))
    } catch (error) {
      console.error('Error fetching commit diff:', error)
      setCommitDiffs(prev => ({
        ...prev,
        [commitHash]: 'Error loading diff'
      }))
    } finally {
      setLoadingDiffs(prev => {
        const newSet = new Set(prev)
        newSet.delete(commitHash)
        return newSet
      })
    }
  }

  // Toggle commit expansion
  const toggleCommitExpansion = (commitHash) => {
    if (expandedCommits.has(commitHash)) {
      setExpandedCommits(prev => {
        const newSet = new Set(prev)
        newSet.delete(commitHash)
        return newSet
      })
    } else {
      setExpandedCommits(prev => new Set([...prev, commitHash]))
      fetchCommitDiff(commitHash)
    }
  }

  // Parse and format diff
  const formatDiff = (diffText) => {
    if (!diffText) return []
    
    const lines = diffText.split('\n')
    const formattedLines = []
    
    for (const line of lines) {
      if (line.startsWith('+++') || line.startsWith('---')) {
        formattedLines.push({ type: 'file', content: line })
      } else if (line.startsWith('@@')) {
        formattedLines.push({ type: 'hunk', content: line })
      } else if (line.startsWith('+') && !line.startsWith('+++')) {
        formattedLines.push({ type: 'addition', content: line })
      } else if (line.startsWith('-') && !line.startsWith('---')) {
        formattedLines.push({ type: 'deletion', content: line })
      } else {
        formattedLines.push({ type: 'context', content: line })
      }
    }
    
    return formattedLines
  }

  const commits = parseCommits(logs)

  // Helper function to format relative time
  const getRelativeTime = (dateString) => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffInSeconds = Math.floor((now - date) / 1000)
      
      if (diffInSeconds < 60) return 'just now'
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
      if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`
      if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`
      return `${Math.floor(diffInSeconds / 31536000)} years ago`
    } catch {
      return dateString
    }
  }

  // Helper function to get user avatar placeholder
  const getAvatarColor = (email) => {
    const colors = [
      'from-blue-400 to-blue-600',
      'from-green-400 to-green-600', 
      'from-purple-400 to-purple-600',
      'from-pink-400 to-pink-600',
      'from-yellow-400 to-yellow-600',
      'from-red-400 to-red-600'
    ]
    const hash = email?.split('').reduce((a, b) => a + b.charCodeAt(0), 0) || 0
    return colors[hash % colors.length]
  }

  return (
    <div className="overflow-hidden">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Commit History</h3>
              <p className="text-sm text-gray-400">{commits.length} {commits.length === 1 ? 'commit' : 'commits'} • Latest first</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-400 glass rounded-lg px-3 py-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>Click commits to view changes</span>
          </div>
        </div>
      </div>
      
      <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
        {commits.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 glass-dark rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">No Commits Found</h4>
            <p className="text-gray-400">This repository doesn't have any commit history yet</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {commits.map((commit, index) => {
              const isExpanded = expandedCommits.has(commit.hash)
              const isLoadingDiff = loadingDiffs.has(commit.hash)
              const diff = commitDiffs[commit.hash]
              
              return (
                <div key={commit.hash || index} className="hover:bg-white/5 transition-colors duration-150">
                  {/* Commit Header */}
                  <div 
                    className="p-5 cursor-pointer group"
                    onClick={() => toggleCommitExpansion(commit.hash)}
                  >
                    <div className="flex items-start space-x-4">
                      {/* Timeline */}
                      <div className="flex flex-col items-center pt-1">
                        <div className="w-3 h-3 bg-blue-500 rounded-full ring-4 ring-gray-800 group-hover:ring-blue-500/20 transition-all"></div>
                        {index < commits.length - 1 && (
                          <div className="w-0.5 h-20 bg-white/10 mt-2"></div>
                        )}
                      </div>
                      
                      {/* Avatar */}
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarColor(commit.email)} flex items-center justify-center text-white text-sm font-bold shadow-lg group-hover:scale-110 transition-transform`}>
                        {commit.author?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      
                      {/* Commit Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium leading-tight mb-2 group-hover:text-blue-500 transition-colors">
                              {commit.message || 'No commit message'}
                            </p>
                            <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-200">{commit.author || 'Unknown'}</span>
                                <span>committed</span>
                              </div>
                              {commit.date && (
                                <div className="flex items-center space-x-1">
                                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                  </svg>
                                  <span>{getRelativeTime(commit.date)}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Commit Actions */}
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            <code className="px-2.5 py-1 text-xs glass hover-glass text-blue-500 rounded-md font-mono cursor-pointer transition-all hover:scale-105"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    navigator.clipboard?.writeText(commit.hash)
                                  }}
                                  title="Click to copy full hash">
                              {commit.hash?.substring(0, 7) || 'unknown'}
                            </code>
                            <button 
                              className="w-7 h-7 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-colors flex items-center justify-center"
                              onClick={(e) => {
                                e.stopPropagation()
                                navigator.clipboard?.writeText(commit.hash)
                              }}
                              title="Copy commit hash"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </button>
                            <svg 
                              className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-blue-500' : ''}`} 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expandable Diff Section */}
                  {isExpanded && (
                    <div className="px-5 pb-5 ml-16 animate-slide-down">
                      <div className="glass-dark rounded-lg overflow-hidden shadow-glass">
                        <div className="px-4 py-3 border-b border-white/10">
                          <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm font-semibold text-white">Changes in this commit</span>
                          </div>
                        </div>
                        
                        <div className="p-4 max-h-96 overflow-y-auto custom-scrollbar">
                          {isLoadingDiff ? (
                            <div className="flex items-center justify-center py-8">
                              <div className="animate-spin w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full"></div>
                              <span className="ml-3 text-gray-400">Loading diff...</span>
                            </div>
                          ) : diff ? (
                            <div className="space-y-0.5 rounded-lg overflow-hidden">
                              {formatDiff(diff).map((line, lineIndex) => (
                                <div
                                  key={lineIndex}
                                  className={`px-4 py-1.5 text-sm font-mono leading-relaxed ${
                                    line.type === 'addition' 
                                      ? 'bg-green-500/10 text-green-300 border-l-2 border-green-400'
                                      : line.type === 'deletion'
                                      ? 'bg-red-500/10 text-red-300 border-l-2 border-red-400'
                                      : line.type === 'file'
                                      ? 'text-blue-500 font-semibold bg-blue-500/10'
                                      : line.type === 'hunk'
                                      ? 'text-purple-300 bg-purple-500/10'
                                      : 'text-gray-400'
                                  }`}
                                >
                                  {line.content}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 text-gray-400">
                              <svg className="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                              </svg>
                              <span>No diff available</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
        
        {/* Fallback for unparsed logs */}
        {commits.length === 0 && logs && (
          <div className="p-6">
            <div className="glass-dark rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3 text-gray-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">Raw git log output:</span>
              </div>
              <pre className="text-sm text-gray-200 font-mono leading-relaxed whitespace-pre-wrap bg-black/30 p-4 rounded-lg overflow-x-auto custom-scrollbar">
                {logs}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 