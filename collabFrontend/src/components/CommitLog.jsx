import { useState } from 'react'
import api from '../api'

export default function CommitLog({ logs, selectedRepo }) {
  const [expandedCommits, setExpandedCommits] = useState(new Set())
  const [commitDiffs, setCommitDiffs] = useState({})
  const [loadingDiffs, setLoadingDiffs] = useState(new Set())

  const username = "sridhar"
  const apiKey = "abc123"

  const parseCommits = (logText) => {
    if (!logText) return []
    const lines = logText.split('\n')
    const commits = []
    let currentCommit = null
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (line.startsWith('commit ')) {
        if (currentCommit) commits.push(currentCommit)
        currentCommit = { hash: line.replace('commit ', '').trim(), author: '', email: '', date: '', message: '' }
      } else if (line.startsWith('Author: ') && currentCommit) {
        const authorLine = line.replace('Author: ', '').trim()
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
        currentCommit.message = line.trim()
      }
    }
    if (currentCommit) commits.push(currentCommit)
    return commits
  }

  const fetchCommitDiff = async (commitHash) => {
    if (commitDiffs[commitHash] || loadingDiffs.has(commitHash) || !selectedRepo) return
    setLoadingDiffs(prev => new Set([...prev, commitHash]))
    try {
      const response = await api.get(`/commit-diff/${username}/${selectedRepo}/${commitHash}`, {
        headers: { "x-api-key": apiKey }
      })
      setCommitDiffs(prev => ({ ...prev, [commitHash]: response.data }))
    } catch (error) {
      console.error('Error fetching commit diff:', error)
      setCommitDiffs(prev => ({ ...prev, [commitHash]: 'Error loading diff' }))
    } finally {
      setLoadingDiffs(prev => { const s = new Set(prev); s.delete(commitHash); return s })
    }
  }

  const toggleCommitExpansion = (commitHash) => {
    if (expandedCommits.has(commitHash)) {
      setExpandedCommits(prev => { const s = new Set(prev); s.delete(commitHash); return s })
    } else {
      setExpandedCommits(prev => new Set([...prev, commitHash]))
      fetchCommitDiff(commitHash)
    }
  }

  const formatDiff = (diffText) => {
    if (!diffText) return []
    return diffText.split('\n').map(line => {
      if (line.startsWith('+++') || line.startsWith('---')) return { type: 'file', content: line }
      if (line.startsWith('@@')) return { type: 'hunk', content: line }
      if (line.startsWith('+') && !line.startsWith('+++')) return { type: 'addition', content: line }
      if (line.startsWith('-') && !line.startsWith('---')) return { type: 'deletion', content: line }
      return { type: 'context', content: line }
    })
  }

  const getRelativeTime = (dateString) => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diff = Math.floor((now - date) / 1000)
      if (diff < 60) return 'just now'
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
      if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
      if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`
      return `${Math.floor(diff / 2592000)}mo ago`
    } catch { return dateString }
  }

  const commits = parseCommits(logs)

  return (
    <div>
      {/* Header */}
      <div style={{ 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '4px 6px', marginBottom: '4px', borderBottom: '1px solid #808080'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <svg width="14" height="14" viewBox="0 0 20 20" fill="#000080">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Commit History</span>
          <span style={{ fontSize: '11px', color: '#808080' }}>({commits.length} commit{commits.length !== 1 ? 's' : ''})</span>
        </div>
        <div style={{ 
          fontSize: '11px', color: '#808080', 
          padding: '2px 6px',
          border: '1px solid #808080',
          background: '#ffffcc'
        }}>
          💡 Click a commit to view diff
        </div>
      </div>

      {/* Commits list */}
      <div className="win-sunken" style={{ background: '#ffffff', maxHeight: '500px', overflowY: 'auto' }}>
        {commits.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', fontSize: '11px', color: '#808080' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📭</div>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>No Commits Found</div>
            <div>This repository does not have any commit history yet.</div>
          </div>
        ) : (
          commits.map((commit, index) => {
            const isExpanded = expandedCommits.has(commit.hash)
            const isLoadingDiff = loadingDiffs.has(commit.hash)
            const diff = commitDiffs[commit.hash]

            return (
              <div key={commit.hash || index} style={{ borderBottom: '1px solid #d4d0c8' }}>
                {/* Commit row */}
                <div
                  onClick={() => toggleCommitExpansion(commit.hash)}
                  className="win-list-item"
                  style={{ 
                    display: 'flex', alignItems: 'flex-start', gap: '8px',
                    padding: '4px 6px', cursor: 'pointer', fontSize: '11px',
                    background: isExpanded ? '#e8e4dc' : undefined
                  }}
                >
                  {/* Expand arrow */}
                  <span style={{ 
                    display: 'inline-block', 
                    transform: isExpanded ? 'rotate(90deg)' : 'none',
                    fontSize: '10px', 
                    color: '#000000',
                    lineHeight: '16px',
                    flexShrink: 0,
                    userSelect: 'none',
                    width: '12px',
                  }}>▶</span>

                  {/* Commit icon */}
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="#0000cc" style={{ flexShrink: 0, marginTop: '1px' }}>
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 'bold', color: '#000080', marginBottom: '2px' }}>
                      {commit.message || 'No commit message'}
                    </div>
                    <div style={{ color: '#444444', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <span>👤 {commit.author || 'Unknown'}</span>
                      {commit.date && <span>🕐 {getRelativeTime(commit.date)}</span>}
                    </div>
                  </div>

                  {/* Hash */}
                  <code
                    style={{ 
                      fontSize: '10px', 
                      background: '#e8e4dc', 
                      border: '1px solid #808080',
                      padding: '1px 4px',
                      fontFamily: 'Courier New, monospace',
                      color: '#000080',
                      flexShrink: 0,
                      cursor: 'pointer',
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      navigator.clipboard?.writeText(commit.hash)
                    }}
                    title="Click to copy hash"
                  >
                    {commit.hash?.substring(0, 7) || 'unknown'}
                  </code>
                </div>

                {/* Diff expansion */}
                {isExpanded && (
                  <div style={{ 
                    margin: '0 4px 4px 24px',
                    border: '1px solid #808080',
                  }}>
                    {/* Diff header */}
                    <div style={{ 
                      background: '#d4d0c8',
                      borderBottom: '1px solid #808080',
                      padding: '2px 6px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      display: 'flex', alignItems: 'center', gap: '4px'
                    }}>
                      <svg width="12" height="12" viewBox="0 0 20 20" fill="#008000">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Changes in commit {commit.hash?.substring(0, 7)}
                    </div>

                    <div style={{ maxHeight: '300px', overflowY: 'auto', background: '#ffffff' }}>
                      {isLoadingDiff ? (
                        <div style={{ padding: '16px', textAlign: 'center', fontSize: '11px', color: '#808080' }}>
                          ⌛ Loading diff...
                        </div>
                      ) : diff ? (
                        <div style={{ fontFamily: 'Courier New, monospace', fontSize: '11px' }}>
                          {formatDiff(diff).map((line, i) => (
                            <div
                              key={i}
                              className={
                                line.type === 'addition' ? 'diff-add' :
                                line.type === 'deletion' ? 'diff-del' :
                                line.type === 'file' ? 'diff-file' :
                                line.type === 'hunk' ? 'diff-hunk' : 'diff-ctx'
                              }
                              style={{ padding: '0 6px', whiteSpace: 'pre', lineHeight: '1.4' }}
                            >
                              {line.content || '\u00a0'}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ padding: '16px', textAlign: 'center', fontSize: '11px', color: '#808080' }}>
                          No diff available
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Fallback raw log */}
      {commits.length === 0 && logs && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}>Raw git log output:</div>
          <pre className="win-sunken" style={{ 
            background: '#ffffff', 
            padding: '6px', 
            fontFamily: 'Courier New, monospace', 
            fontSize: '11px',
            whiteSpace: 'pre-wrap',
            maxHeight: '300px',
            overflowY: 'auto'
          }}>
            {logs}
          </pre>
        </div>
      )}
    </div>
  )
}
