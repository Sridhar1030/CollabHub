import React, { useState, useEffect } from 'react';
import api from '../api';

const getFileIcon = (filename) => {
  const ext = filename.split('.').pop().toLowerCase();
  const iconMap = {
    js: '📜', jsx: '⚛', ts: '📘', tsx: '📘', py: '🐍', java: '☕',
    css: '🎨', html: '🌐', json: '📋', md: '📝', txt: '📄',
    png: '🖼', jpg: '🖼', svg: '🎭', xml: '📰',
  };
  return iconMap[ext] || '📄';
};

const FileTree = ({ tree, onFileClick, path = '', expandedDirs, toggleDirectory, selectedFile }) => {
  const entries = Object.keys(tree);
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {entries.map(name => {
        const item = tree[name];
        const currentPath = path ? `${path}/${name}` : name;
        const isSelected = selectedFile === currentPath;

        if (item.type === 'directory') {
          const isOpen = expandedDirs.has(currentPath);
          return (
            <li key={currentPath}>
              <div
                onClick={() => toggleDirectory(currentPath)}
                className={`win-list-item${isOpen ? ' selected' : ''}`}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '4px',
                  padding: '2px 4px', cursor: 'pointer', userSelect: 'none',
                  fontSize: '11px', fontFamily: 'Tahoma, sans-serif',
                }}
              >
                <span style={{ fontSize: '9px', display: 'inline-block', width: '10px', color: '#000000' }}>
                  {isOpen ? '▼' : '▶'}
                </span>
                <span>{isOpen ? '📂' : '📁'}</span>
                <span style={{ fontWeight: isOpen ? 'bold' : 'normal' }}>{name}</span>
                {!isOpen && (
                  <span style={{ color: '#808080', fontSize: '10px' }}>
                    ({Object.keys(item.children).length})
                  </span>
                )}
              </div>
              {isOpen && (
                <div style={{ marginLeft: '16px', borderLeft: '1px dotted #808080', paddingLeft: '6px' }}>
                  <FileTree
                    tree={item.children}
                    onFileClick={onFileClick}
                    path={currentPath}
                    expandedDirs={expandedDirs}
                    toggleDirectory={toggleDirectory}
                    selectedFile={selectedFile}
                  />
                </div>
              )}
            </li>
          );
        } else {
          return (
            <li key={currentPath}>
              <div
                onClick={() => onFileClick(currentPath)}
                className={`win-list-item${isSelected ? ' selected' : ''}`}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '4px',
                  padding: '2px 4px', paddingLeft: '14px',
                  cursor: 'pointer', userSelect: 'none',
                  fontSize: '11px', fontFamily: 'Tahoma, sans-serif',
                }}
              >
                <span>{getFileIcon(name)}</span>
                <span>{name}</span>
              </div>
            </li>
          );
        }
      })}
    </ul>
  );
};

const countFiles = (tree) => {
  let count = 0;
  Object.keys(tree).forEach(key => {
    if (tree[key].type === 'directory') count += countFiles(tree[key].children);
    else count++;
  });
  return count;
};

export default function CodebaseViewer({ username, repo }) {
  const [tree, setTree] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [loadingTree, setLoadingTree] = useState(true);
  const [loadingContent, setLoadingContent] = useState(false);
  const [error, setError] = useState(null);
  const [expandedDirs, setExpandedDirs] = useState(new Set());

  const toggleDirectory = (path) => {
    setExpandedDirs(prev => {
      const s = new Set(prev);
      s.has(path) ? s.delete(path) : s.add(path);
      return s;
    });
  };

  useEffect(() => {
    const fetchFileTree = async () => {
      try {
        setLoadingTree(true);
        setError(null);
        const response = await api.get(`/codebase/${username}/${repo}`);
        const fileTree = response.data;
        if (!fileTree || typeof fileTree !== 'object' || Object.keys(fileTree).length === 0) {
          throw new Error('No files found or invalid data received.');
        }
        setTree(fileTree);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingTree(false);
      }
    };
    fetchFileTree();
  }, [username, repo]);

  const handleFileClick = async (filepath) => {
    try {
      setLoadingContent(true);
      setError(null);
      const response = await api.get(`/codebase/file/${username}/${repo}/${filepath}`);
      setSelectedFile(filepath);
      setFileContent(response.data);
    } catch (err) {
      setError(err.message);
      setFileContent(`Error fetching file content: ${err.message}`);
    } finally {
      setLoadingContent(false);
    }
  };

  if (loadingTree) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', fontSize: '11px', color: '#808080' }}>
        ⌛ Loading file tree...
      </div>
    );
  }

  if (error && !selectedFile) {
    return (
      <div style={{ padding: '16px' }}>
        <div style={{ 
          padding: '8px 12px', background: '#ffeeee', border: '1px solid #cc0000',
          fontSize: '11px', color: '#cc0000', display: 'flex', alignItems: 'center', gap: '6px'
        }}>
          ⚠️ Error: {error}
        </div>
        <button className="win-btn" style={{ marginTop: '8px' }} onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  if (!tree || Object.keys(tree).length === 0) {
    return (
      <div style={{ padding: '32px', textAlign: 'center', fontSize: '11px', color: '#808080' }}>
        <div style={{ fontSize: '24px', marginBottom: '8px' }}>📂</div>
        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>No files available</div>
        <div>The file tree is empty or not in the expected format.</div>
      </div>
    );
  }

  const totalFiles = countFiles(tree);
  const lines = fileContent ? fileContent.split('\n') : [];

  return (
    <div style={{ display: 'flex', gap: '4px', minHeight: '400px' }}>
      {/* File Tree Panel */}
      <div className="win-window" style={{ width: '260px', flexShrink: 0, overflow: 'hidden' }}>
        {/* Panel header */}
        <div style={{ 
          background: '#d4d0c8', 
          borderBottom: '1px solid #808080',
          padding: '3px 6px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 'bold' }}>
            <span>📁</span>
            <span>File Explorer</span>
          </div>
          <span style={{ fontSize: '10px', color: '#808080' }}>{totalFiles} file{totalFiles !== 1 ? 's' : ''}</span>
        </div>

        {/* Search */}
        <div style={{ padding: '4px', borderBottom: '1px solid #d4d0c8' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <input
              type="text"
              className="win-input"
              placeholder="Search files..."
              style={{ flex: 1, fontSize: '11px' }}
            />
          </div>
        </div>

        {/* Tree */}
        <div className="win-sunken" style={{ background: '#ffffff', maxHeight: '420px', overflowY: 'auto', margin: '2px', padding: '2px' }}>
          <FileTree
            tree={tree}
            onFileClick={handleFileClick}
            expandedDirs={expandedDirs}
            toggleDirectory={toggleDirectory}
            selectedFile={selectedFile}
          />
        </div>
      </div>

      {/* File Content Panel */}
      <div className="win-window" style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ 
          background: '#d4d0c8',
          borderBottom: '1px solid #808080',
          padding: '3px 6px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, fontSize: '11px' }}>
            <span style={{ flexShrink: 0 }}>{selectedFile ? getFileIcon(selectedFile.split('/').pop()) : '📄'}</span>
            <span style={{ fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {selectedFile || 'No file selected'}
            </span>
            {selectedFile && (
              <span style={{ color: '#808080', whiteSpace: 'nowrap' }}>
                — {lines.length} lines, {new Blob([fileContent]).size} bytes
              </span>
            )}
          </div>

          {selectedFile && (
            <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
              <button
                className="win-btn"
                style={{ fontSize: '11px', padding: '2px 8px' }}
                onClick={() => navigator.clipboard?.writeText(fileContent)}
              >
                📋 Copy
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loadingContent ? (
            <div style={{ padding: '32px', textAlign: 'center', fontSize: '11px', color: '#808080' }}>
              ⌛ Loading file content...
            </div>
          ) : selectedFile ? (
            <div style={{ display: 'flex', fontSize: '11px', fontFamily: 'Courier New, monospace' }}>
              {/* Line numbers */}
              <div style={{ 
                flexShrink: 0, 
                background: '#f0ece4', 
                borderRight: '1px solid #d4d0c8',
                padding: '4px 6px', 
                textAlign: 'right',
                color: '#808080',
                userSelect: 'none',
                minWidth: '36px',
              }}>
                {lines.map((_, i) => (
                  <div key={i} style={{ lineHeight: '1.5' }}>{i + 1}</div>
                ))}
              </div>
              {/* Code */}
              <pre style={{ 
                flex: 1, 
                margin: 0, 
                padding: '4px 8px', 
                background: '#ffffff',
                color: '#000000',
                fontFamily: 'Courier New, monospace',
                fontSize: '11px',
                lineHeight: '1.5',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
                overflow: 'hidden',
              }}>
                {fileContent}
              </pre>
            </div>
          ) : (
            <div style={{ 
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              height: '100%', padding: '48px 24px', textAlign: 'center',
            }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>💻</div>
              <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>Ready to Code</div>
              <div style={{ fontSize: '11px', color: '#808080' }}>
                Select a file from the explorer to view its contents.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
