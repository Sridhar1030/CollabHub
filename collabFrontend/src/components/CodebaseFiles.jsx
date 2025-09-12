import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Helper function to recursively render the file tree
const FileTree = ({ tree, onFileClick, path = '', expandedDirs, toggleDirectory }) => {
  return (
    <ul className="pl-3 space-y-1">
      {Object.keys(tree).map(name => {
        const item = tree[name];
        const currentPath = path ? `${path}/${name}` : name;
        if (item.type === 'directory') {
          const isOpen = expandedDirs.has(currentPath);
          return (
            <li key={currentPath}>
              <span
                onClick={() => toggleDirectory(currentPath)}
                className={`flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer transition-colors select-none ${isOpen ? 'bg-gray-700/60 text-blue-400' : 'hover:bg-gray-700/40 text-gray-300 hover:text-blue-300'}`}
              >
                <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-90 text-blue-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <svg className={`w-4 h-4 ${isOpen ? 'text-yellow-400' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h5l2 2h4a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                </svg>
                <span className="font-medium">{name}</span>
              </span>
              {isOpen && (
                <div className="ml-4 border-l border-gray-700 pl-2">
                  <FileTree
                    tree={item.children}
                    onFileClick={onFileClick}
                    path={currentPath}
                    expandedDirs={expandedDirs}
                    toggleDirectory={toggleDirectory}
                  />
                </div>
              )}
            </li>
          );
        } else {
          return (
            <li
              key={currentPath}
              onClick={() => onFileClick(currentPath)}
              className="flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer transition-colors text-gray-300 hover:bg-gray-700/40 hover:text-green-300 select-none"
            >
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"></path>
              </svg>
              <span className="truncate">{name}</span>
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
      <div className="flex items-center justify-center h-64 text-blue-300 animate-pulse">
        <svg className="w-6 h-6 mr-2 animate-spin" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.2" strokeWidth="4" fill="none" />
          <path d="M4 12a8 8 0 018-8" strokeLinecap="round" />
        </svg>
        Loading file tree...
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-400">
        <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.2" strokeWidth="4" fill="none" />
          <path d="M12 8v4m0 4h.01" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="mb-2 font-semibold">Error: {error}</span>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
        >
          Retry
        </button>
      </div>
    );

  // Check if tree is empty or invalid
  if (!tree || Object.keys(tree).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.2" strokeWidth="4" fill="none" />
          <path d="M8 12h8" strokeLinecap="round" />
        </svg>
        <p className="font-semibold">No files available</p>
        <p className="text-sm">The file tree is empty or not in the expected format.</p>
      </div>
    );
  }

  return (
    <div className="flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden min-h-[500px]">
      {/* File Tree Panel */}
      <div className="w-1/3 p-6 border-r border-gray-700 bg-gray-800/80">
        <h3 className="text-xl font-bold text-blue-300 mb-6 tracking-wide flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M3 7a2 2 0 012-2h3.5l1.5 2H19a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
          </svg>
          File Tree
        </h3>
        <div className="max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
          <FileTree
            tree={tree}
            onFileClick={handleFileClick}
            expandedDirs={expandedDirs}
            toggleDirectory={toggleDirectory}
          />
        </div>
      </div>

      {/* File Content Viewer Panel */}
      <div className="w-2/3 p-6 bg-gray-900/80">
        <div className="bg-gray-900 rounded-xl border border-gray-700 shadow-lg overflow-hidden h-full flex flex-col">
          <div className="bg-gray-800 px-5 py-3 border-b border-gray-700 flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M4 4h16v16H4z" />
            </svg>
            <span className="font-semibold text-white text-base">
              {selectedFile || 'Select a file to view'}
            </span>
          </div>
          <div className="p-4 flex-1 overflow-auto bg-gray-950">
            {loadingContent ? (
              <div className="flex items-center justify-center h-full text-blue-300 animate-pulse">
                <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.2" strokeWidth="4" fill="none" />
                  <path d="M4 12a8 8 0 018-8" strokeLinecap="round" />
                </svg>
                Loading content...
              </div>
            ) : (
              <pre className="text-sm text-gray-200 font-mono leading-relaxed whitespace-pre-wrap overflow-x-auto custom-scrollbar">
                {fileContent}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}