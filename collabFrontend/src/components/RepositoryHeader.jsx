import { useState, useEffect } from 'react';
import api from '../api';

export default function RepositoryHeader({ selectedRepo }) {
  const [collaborators, setCollaborators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch collaborators directly in the component
  useEffect(() => {
    const fetchCollaborators = async () => {
      try {
        const response = await api.get('/getUsers');
        console.log('API Response:', response.data);
        setCollaborators(Array.isArray(response.data) ? response.data : []);
        setError(null);
      } catch (err) {
        console.error('Error fetching collaborators:', err);
        setError('Failed to fetch collaborators');
      } finally {
        setLoading(false);
      }
    };

    fetchCollaborators();
  }, []);

  // Simple modal component
  function CollaboratorsModal() {
    if (!showModal) return null;

    return (
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-modal" 
        onClick={() => setShowModal(false)}
      >
        <div 
          className="glass-dark rounded-xl w-full max-w-md mx-4 shadow-glass-lg animate-slide-down overflow-hidden" 
          onClick={e => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex justify-between items-center p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Collaborators</h2>
                <p className="text-xs text-gray-400">{collaborators.length} team members</p>
              </div>
            </div>
            <button 
              onClick={() => setShowModal(false)}
              className="w-8 h-8 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Modal Content */}
          <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar">
            {collaborators.map((collaborator, index) => {
              const username = collaborator.split(' <')[0];
              const email = collaborator.match(/<(.+)>/)?.[1] || '';
              
              const colors = [
                'from-blue-500 to-cyan-500',
                'from-purple-500 to-pink-500',
                'from-green-500 to-emerald-500',
                'from-orange-500 to-red-500',
                'from-yellow-500 to-orange-500',
                'from-indigo-500 to-purple-500',
              ];
              const colorClass = colors[index % colors.length];
              
              return (
                <div 
                  key={index} 
                  className="glass hover-glass rounded-lg p-4 flex items-center space-x-3 group cursor-pointer"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${colorClass} rounded-full flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                    <span className="text-white text-lg font-bold">
                      {username[0]?.toUpperCase() || '?'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white group-hover:text-blue-500 transition-colors truncate">
                      {username}
                    </div>
                    <div className="text-sm text-gray-400 truncate">{email}</div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="glass-dark rounded-xl p-6 shadow-glass-lg animate-slide-down">
        <div className="flex justify-between items-center">
          {/* Left side - Repository info */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/30 blur-xl rounded-lg"></div>
              <div className="relative w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-xl">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8z"/>
                </svg>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">{selectedRepo}</h2>
              <div className="flex items-center space-x-3 text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>Public</span>
                </div>
                <span>•</span>
                <span>Updated recently</span>
              </div>
            </div>
          </div>

          {/* Right side - Collaborators */}
          <div>
            {loading ? (
              <div className="flex items-center space-x-2 text-gray-400">
                <div className="animate-spin w-4 h-4 border-2 border-blue-500/30 border-t-blue-500 rounded-full"></div>
                <span>Loading...</span>
              </div>
            ) : error ? (
              <div className="text-red-600 text-sm">{error}</div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  console.log('Opening modal');
                  setShowModal(true);
                }}
                className="btn-github flex items-center space-x-3 group"
              >
                <div className="flex -space-x-3">
                  {collaborators.slice(0, 3).map((collaborator, index) => {
                    const colors = ['from-blue-500 to-cyan-500', 'from-purple-500 to-pink-500', 'from-green-500 to-emerald-500'];
                    return (
                      <div
                        key={index}
                        className={`w-8 h-8 bg-gradient-to-br ${colors[index % colors.length]} rounded-full flex items-center justify-center ring-2 ring-gray-800 group-hover:ring-gray-700 transition-all`}
                      >
                        <span className="text-white text-xs font-semibold">
                          {collaborator.split(' <')[0][0]?.toUpperCase()}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">
                    {collaborators.length} Collaborator{collaborators.length !== 1 ? 's' : ''}
                  </span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Render modal */}
      <CollaboratorsModal />
    </>
  );
}