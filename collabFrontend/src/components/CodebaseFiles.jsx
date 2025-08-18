import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Helper function to recursively render the file tree
const FileTree = ({ tree, onFileClick, path = '', expandedDirs, toggleDirectory }) => {
  return (
    <ul className="list-disc pl-5 space-y-1">
      {Object.keys(tree).map(name => {
        const item = tree[name];
        const currentPath = path ? `${path}/${name}` : name;
        if (item.type === 'directory') {
          return (
            <li key={currentPath}>
              <span onClick={() => toggleDirectory(currentPath)} className="flex items-center space-x-2 cursor-pointer text-gray-400 hover:text-white">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h5l2 2h4a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path>
                </svg>
                <span>{name}</span>
              </span>
              {expandedDirs.has(currentPath) && (
                <FileTree 
                  tree={item.children} 
                  onFileClick={onFileClick} 
                  path={currentPath}
                  expandedDirs={expandedDirs}
                  toggleDirectory={toggleDirectory}
                />
              )}
            </li>
          );
        } else {
          return (
            <li key={currentPath} onClick={() => onFileClick(currentPath)} className="flex items-center space-x-2 cursor-pointer text-gray-400 hover:text-white">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"></path>
              </svg>
              <span>{name}</span>
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

  if (loadingTree) return <div className="text-center text-gray-400">Loading file tree...</div>;
  if (error) return (
    <div className="text-center text-red-400">
      Error: {error}
      <button onClick={() => fetchFileTree()} className="ml-2 text-blue-400">Retry</button>
    </div>
  );

  // Check if tree is empty or invalid
  if (!tree || Object.keys(tree).length === 0) {
    return (
      <div className="text-center text-gray-400">
        <p>No files available</p>
        <p>The file tree is empty or not in the expected format.</p>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
      {/* File Tree Panel */}
      <div className="w-1/3 p-6 border-r border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">File Tree</h3>
        <FileTree 
          tree={tree} 
          onFileClick={handleFileClick} 
          expandedDirs={expandedDirs}
          toggleDirectory={toggleDirectory}
        />
      </div>

      {/* File Content Viewer Panel */}
      <div className="w-2/3 p-6">
        <div className="bg-gray-900 rounded-lg border border-gray-600 overflow-hidden">
          <div className="bg-gray-750 px-4 py-3 border-b border-gray-600">
            <span className="font-medium text-white text-sm">
              {selectedFile || 'Select a file to view'}
            </span>
          </div>
          <div className="p-4">
            {loadingContent ? (
              <div className="text-center text-gray-400">Loading content...</div>
            ) : (
              <pre className="text-sm text-gray-300 font-mono leading-relaxed whitespace-pre-wrap overflow-x-auto">
                {fileContent}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}