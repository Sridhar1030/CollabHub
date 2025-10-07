import { useCollaborators } from '../hooks/useCollaborators';

export default function Collaborators() {
  const { collaborators, loading, error } = useCollaborators();

  if (loading) {
    return (
      <div className="mt-8">
        <div className="flex items-center space-x-2 mb-4">
          <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          <h3 className="text-lg font-semibold text-white">Collaborators</h3>
        </div>
        <div className="animate-pulse space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-gray-700 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8">
        <div className="flex items-center space-x-2 mb-4">
          <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          <h3 className="text-lg font-semibold text-white">Collaborators</h3>
        </div>
        <div className="text-red-400 text-sm">{error}</div>
      </div>
    );
  }

  // Ensure collaborators is an array
  const collaboratorsList = Array.isArray(collaborators) ? collaborators : [];

  return (
    <div className="mt-8">
      <div className="flex items-center space-x-2 mb-4">
        <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
        <h3 className="text-lg font-semibold text-white">Collaborators</h3>
      </div>
      
      <div className="space-y-2">
        {collaboratorsList.map((collaborator, index) => {
          // Extract username from the format "username <email>"
          const username = collaborator.split(' <')[0];
          const email = collaborator.match(/<(.+)>/)?.[1] || '';
          
          return (
            <div 
              key={index}
              className="bg-gray-700 border border-gray-600 rounded-lg p-3 text-gray-300 hover:bg-gray-650"
            >
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">{username[0]?.toUpperCase() || '?'}</span>
                </div>
                <div>
                  <div className="font-medium text-white">{username || 'Unknown User'}</div>
                  <div className="text-xs text-gray-400">{email}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {collaboratorsList.length === 0 && (
        <div className="text-center py-4">
          <p className="text-gray-400 text-sm">No collaborators found</p>
        </div>
      )}
    </div>
  );
}