import { useState } from 'react'
import axios from 'axios'

const API_BASE = "http://localhost:5000"

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
      const response = await axios.get(`${API_BASE}/commit-diff/${username}/${selectedRepo}/${commitHash}`, {
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
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-750">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Commit History</h3>
              <p className="text-sm text-gray-400">{commits.length} commits found</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
            </svg>
            <span className="text-xs">Latest first • Click commits to view changes</span>
          </div>
        </div>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {commits.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-lg font-medium text-white mb-2">No Commits Found</h4>
            <p className="text-gray-400">This repository doesn't have any commit history yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {commits.map((commit, index) => {
              const isExpanded = expandedCommits.has(commit.hash)
              const isLoadingDiff = loadingDiffs.has(commit.hash)
              const diff = commitDiffs[commit.hash]
              
              return (
                <div key={commit.hash || index} className="hover:bg-gray-750 transition-colors duration-150">
                  {/* Commit Header */}
                  <div 
                    className="p-4 cursor-pointer"
                    onClick={() => toggleCommitExpansion(commit.hash)}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Timeline */}
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 ring-2 ring-gray-800"></div>
                        {index < commits.length - 1 && (
                          <div className="w-px h-16 bg-gray-600 mt-1"></div>
                        )}
                      </div>
                      
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getAvatarColor(commit.email)} flex items-center justify-center text-white text-xs font-semibold mt-1`}>
                        {commit.author?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      
                      {/* Commit Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-white font-medium leading-tight mb-2">
                              {commit.message || 'No commit message'}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                              <div className="flex items-center space-x-1">
                                <span className="font-medium text-gray-300">{commit.author || 'Unknown'}</span>
                              </div>
                              {commit.date && (
                                <div className="flex items-center space-x-1">
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                  </svg>
                                  <span>{getRelativeTime(commit.date)}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Commit Actions */}
                          <div className="flex items-center space-x-2 ml-4">
                            <code className="px-2 py-1 text-xs bg-gray-700 text-blue-300 rounded border border-gray-600 font-mono hover:bg-gray-600 transition-colors cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    navigator.clipboard?.writeText(commit.hash)
                                  }}
                                  title="Click to copy full hash">
                              {commit.hash?.substring(0, 7) || 'unknown'}
                            </code>
                            <button 
                              className="p-1 text-gray-400 hover:text-white rounded transition-colors"
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
                              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
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
                    <div className="px-4 pb-4 ml-12">
                      <div className="bg-gray-900 rounded-lg border border-gray-600 overflow-hidden">
                        <div className="px-4 py-3 bg-gray-750 border-b border-gray-600">
                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm font-medium text-white">Changes in this commit</span>
                          </div>
                        </div>
                        
                        <div className="p-4">
                          {isLoadingDiff ? (
                            <div className="flex items-center justify-center py-8">
                              <div className="animate-spin w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full"></div>
                              <span className="ml-2 text-gray-400">Loading diff...</span>
                            </div>
                          ) : diff ? (
                            <div className="space-y-1">
                              {formatDiff(diff).map((line, lineIndex) => (
                                <div
                                  key={lineIndex}
                                  className={`px-3 py-1 text-sm font-mono leading-relaxed ${
                                    line.type === 'addition' 
                                      ? 'bg-green-900/30 text-green-300 border-l-2 border-green-400'
                                      : line.type === 'deletion'
                                      ? 'bg-red-900/30 text-red-300 border-l-2 border-red-400'
                                      : line.type === 'file'
                                      ? 'text-blue-300 font-semibold'
                                      : line.type === 'hunk'
                                      ? 'text-purple-300 bg-purple-900/20'
                                      : 'text-gray-400'
                                  }`}
                                >
                                  {line.content}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-4 text-gray-400">
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
            <div className="bg-gray-900 rounded-lg border border-gray-600 p-4">
              <div className="flex items-center space-x-2 mb-3 text-gray-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Raw git log output:</span>
              </div>
              <pre className="text-sm text-gray-300 font-mono leading-relaxed whitespace-pre-wrap">
                {logs}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 