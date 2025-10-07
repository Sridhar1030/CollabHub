import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Get file extension for icon styling
const getFileIcon = (filename) => {
  const ext = filename.split('.').pop().toLowerCase();
  const iconMap = {
    js: { icon: '⚡', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    jsx: { icon: '⚛️', color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
    ts: { icon: '🔷', color: 'text-blue-400', bg: 'bg-blue-400/10' },
    tsx: { icon: '🔷', color: 'text-blue-400', bg: 'bg-blue-400/10' },
    py: { icon: '🐍', color: 'text-green-400', bg: 'bg-green-400/10' },
    java: { icon: '☕', color: 'text-orange-400', bg: 'bg-orange-400/10' },
    css: { icon: '🎨', color: 'text-pink-400', bg: 'bg-pink-400/10' },
    html: { icon: '🌐', color: 'text-orange-400', bg: 'bg-orange-400/10' },
    json: { icon: '📋', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    md: { icon: '📝', color: 'text-blue-400', bg: 'bg-blue-400/10' },
    txt: { icon: '📄', color: 'text-gray-400', bg: 'bg-gray-400/10' },
    png: { icon: '🖼️', color: 'text-purple-400', bg: 'bg-purple-400/10' },
    jpg: { icon: '🖼️', color: 'text-purple-400', bg: 'bg-purple-400/10' },
    svg: { icon: '🎭', color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
    xml: { icon: '📰', color: 'text-orange-400', bg: 'bg-orange-400/10' },
  };
  return iconMap[ext] || { icon: '📄', color: 'text-gray-400', bg: 'bg-gray-400/10' };
};

// Helper function to recursively render the file tree
const FileTree = ({ tree, onFileClick, path = '', expandedDirs, toggleDirectory, selectedFile }) => {
  return (
    <ul className="space-y-1">
      {Object.keys(tree).map(name => {
        const item = tree[name];
        const currentPath = path ? `${path}/${name}` : name;
        const isSelected = selectedFile === currentPath;
        
        if (item.type === 'directory') {
          const isOpen = expandedDirs.has(currentPath);
          return (
            <li key={currentPath} className="group">
              <div
                onClick={() => toggleDirectory(currentPath)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-all select-none relative overflow-hidden ${
                  isOpen 
                    ? 'bg-white/10 border border-white/20 shadow-lg' 
                    : 'hover:bg-white/5 border border-transparent hover:border-white/10'
                }`}
              >
                {/* Animated background effect */}
                {isOpen && (
                  <div className="absolute inset-0 bg-white/5 animate-pulse"></div>
                )}
                
                <svg 
                  className={`w-4 h-4 transition-all duration-300 relative z-10 ${
                    isOpen ? 'rotate-90 text-white' : 'text-gray-400 group-hover:text-white group-hover:rotate-45'
                  }`} 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  viewBox="0 0 24 24"
                >
                  <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                
                <div className={`text-lg relative z-10 transition-transform ${isOpen ? 'scale-110' : 'group-hover:scale-110'}`}>
                  {isOpen ? '📂' : '📁'}
                </div>
                
                <span className={`font-semibold text-sm relative z-10 ${
                  isOpen ? 'text-white' : 'text-gray-200 group-hover:text-white'
                }`}>
                  {name}
                </span>
                
                {!isOpen && (
                  <div className="ml-auto text-xs text-gray-400 group-hover:text-blue-500 relative z-10">
                    {Object.keys(item.children).length}
                  </div>
                )}
              </div>
              
              {isOpen && (
                <div className="ml-4 mt-1 border-l-2 border-white/20 pl-3 relative">
                  {/* Glowing line effect */}
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-white/30 blur-sm"></div>
                  
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
          const fileInfo = getFileIcon(name);
          return (
            <li key={currentPath}>
              <div
                onClick={() => onFileClick(currentPath)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all select-none group relative overflow-hidden ${
                  isSelected
                    ? 'bg-gradient-to-r from-blue-500/20 to-blue-500/10 border border-blue-500/40 shadow-lg shadow-blue-500/20'
                    : 'hover:bg-gradient-to-r hover:from-white/5 hover:to-white/10 border border-transparent hover:border-white/10 hover:scale-[1.02]'
                }`}
              >
                {/* Selected indicator */}
                {isSelected && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent animate-pulse"></div>
                )}
                
                <div className={`text-lg relative z-10 transition-transform group-hover:scale-110 ${
                  isSelected ? 'scale-110' : ''
                }`}>
                  {fileInfo.icon}
                </div>
                
                <span className={`truncate text-sm font-medium relative z-10 flex-1 ${
                  isSelected ? 'text-white font-semibold' : 'text-gray-200 group-hover:text-white'
                }`}>
                  {name}
                </span>
                
                <div className={`w-2 h-2 rounded-full relative z-10 transition-all ${
                  isSelected 
                    ? 'bg-blue-500 shadow-lg shadow-blue-500/50' 
                    : 'bg-transparent group-hover:bg-gray-400'
                }`}></div>
              </div>
            </li>
          );
        }
      })}
    </ul>
  );
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
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  // Effect to fetch the file tree when the component mounts or repo changes
  useEffect(() => {
    const fetchFileTree = async () => {
      try {
        setLoadingTree(true);
        setError(null);
        console.log("username", username)
        console.log("repo", repo)
        const response = await axios.get(`http://localhost:5000/codebase/${username}/${repo}`);
        
        // Add this line to see the actual response data
        console.log("API response data:", response.data);

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


  // Function to handle file clicks and fetch content
  const handleFileClick = async (filepath) => {
    try {
      setLoadingContent(true);
      setError(null);
      const response = await axios.get(`http://localhost:5000/codebase/file/${username}/${repo}/${filepath}`);
      setSelectedFile(filepath);
      setFileContent(response.data);
    } catch (err) {
      setError(err.message);
      setFileContent(`Error fetching file content: ${err.message}`);
    } finally {
      setLoadingContent(false);
    }
  };

  if (loadingTree)
    return (
      <div className="flex items-center justify-center h-64 text-blue-500">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-3 border-blue-500/30 border-t-blue-500 rounded-full mx-auto mb-3"></div>
          <p className="text-gray-200 font-medium">Loading file tree...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="glass-dark rounded-xl p-8 text-center">
          <svg className="w-12 h-12 mb-4 mx-auto text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="text-red-400 font-semibold mb-4 block">Error: {error}</span>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );

  // Check if tree is empty or invalid
  if (!tree || Object.keys(tree).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="glass-dark rounded-xl p-8 text-center">
          <svg className="w-12 h-12 mb-4 mx-auto text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="font-semibold text-white mb-2">No files available</p>
          <p className="text-sm text-gray-400">The file tree is empty or not in the expected format.</p>
        </div>
      </div>
    );
  }

  // Count total files
  const countFiles = (tree) => {
    let count = 0;
    Object.keys(tree).forEach(key => {
      if (tree[key].type === 'directory') {
        count += countFiles(tree[key].children);
      } else {
        count++;
      }
    });
    return count;
  };

  const totalFiles = countFiles(tree);
  const fileInfo = selectedFile ? getFileIcon(selectedFile.split('/').pop()) : null;

  return (
    <div className="flex gap-5 min-h-[550px]">
      {/* File Tree Panel - Enhanced Design */}
      <div className="w-[380px] relative group">
        {/* Glowing border effect */}
        <div className="absolute -inset-0.5 bg-white/20 rounded-2xl opacity-30 blur group-hover:opacity-40 transition-opacity"></div>
        
        <div className="relative glass-dark rounded-2xl p-5 shadow-glass-lg border border-white/10">
          {/* Header with stats */}
          <div className="mb-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 blur-xl rounded-full"></div>
                <div className="relative w-10 h-10 bg-gradient-to-br from-white/20 to-white/10 rounded-xl flex items-center justify-center shadow-lg border border-white/20">
                  <span className="text-2xl">📁</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  File Explorer
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-200 font-normal border border-white/20">
                    {totalFiles} files
                  </span>
                </h3>
                <p className="text-xs text-gray-400">Click to navigate</p>
              </div>
            </div>
            
            {/* Search bar placeholder */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search files..."
                className="w-full px-3 py-2 pl-9 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
              />
              <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          {/* File tree with custom scrollbar */}
          <div className="max-h-[480px] overflow-y-auto pr-2 custom-scrollbar">
            <FileTree
              tree={tree}
              onFileClick={handleFileClick}
              expandedDirs={expandedDirs}
              toggleDirectory={toggleDirectory}
              selectedFile={selectedFile}
            />
          </div>
        </div>
      </div>

      {/* File Content Viewer Panel - Enhanced Design */}
      <div className="flex-1 relative group">
        {/* Glowing border effect */}
        <div className="absolute -inset-0.5 bg-white/20 rounded-2xl opacity-30 blur group-hover:opacity-40 transition-opacity"></div>
        
        <div className="relative glass-dark rounded-2xl overflow-hidden shadow-glass-lg border border-white/10 flex flex-col h-full">
          {/* Enhanced Header */}
          <div className="relative px-5 py-4 border-b border-white/10 bg-gradient-to-r from-black/40 via-black/20 to-black/40">
            <div className="flex items-center gap-3">
              {/* File type indicator */}
              {fileInfo && (
                <div className={`w-10 h-10 rounded-lg ${fileInfo.bg} flex items-center justify-center text-xl shadow-lg`}>
                  {fileInfo.icon}
                </div>
              )}
              {!fileInfo && (
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
              )}
              
              {/* File path */}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white text-sm truncate">
                  {selectedFile || 'No file selected'}
                </div>
                {selectedFile && (
                  <div className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                    <span>{fileContent.split('\n').length} lines</span>
                    <span>•</span>
                    <span>{new Blob([fileContent]).size} bytes</span>
                  </div>
                )}
              </div>
              
              {/* Action buttons */}
              {selectedFile && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigator.clipboard?.writeText(fileContent)}
                    className="px-3 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-500/80 hover:to-blue-500 text-white text-xs font-medium shadow-lg hover:shadow-blue-500/50 transition-all hover:scale-105 flex items-center gap-2"
                    title="Copy content"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </button>
                  <button
                    className="w-9 h-9 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all flex items-center justify-center"
                    title="Download"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Content Area */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {loadingContent ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    <div className="absolute inset-0 bg-blue-500/30 blur-2xl rounded-full animate-pulse"></div>
                    <div className="relative animate-spin w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full"></div>
                  </div>
                  <p className="text-gray-200 font-semibold">Loading content...</p>
                  <p className="text-xs text-gray-400 mt-1">Please wait</p>
                </div>
              </div>
            ) : selectedFile ? (
              <div className="flex-1 overflow-auto custom-scrollbar">
                {/* Line numbers and content */}
                <div className="flex text-sm font-mono">
                  {/* Line numbers */}
                  <div className="flex-shrink-0 px-4 py-4 bg-black/40 text-gray-400 text-right select-none border-r border-white/5">
                    {fileContent.split('\n').map((_, i) => (
                      <div key={i} className="leading-relaxed hover:text-blue-500 transition-colors">
                        {i + 1}
                      </div>
                    ))}
                  </div>
                  
                  {/* Code content */}
                  <pre className="flex-1 px-5 py-4 text-gray-200 leading-relaxed whitespace-pre-wrap overflow-x-auto bg-gradient-to-br from-black/20 to-black/40">
                    {fileContent}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center max-w-md">
                  <div className="relative inline-block mb-6">
                    <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"></div>
                    <div className="relative w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl animate-pulse-glow">
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Ready to Code</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Select a file from the explorer to view its contents and start exploring your codebase
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}