import { useCollaborators } from '../hooks/useCollaborators';

export default function Collaborators() {
  const { collaborators, loading, error } = useCollaborators();

  if (loading) {
    return (
      <div className="mt-8">
        <div className="flex items-center space-x-2 mb-4">
          <svg className="w-5 h-5 text-[#58a6ff]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          <h3 className="text-lg font-semibold text-[#e6edf3]">Collaborators</h3>
        </div>
        <div className="animate-pulse space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-[#21262d] border border-[#30363d] rounded-md"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8">
        <div className="flex items-center space-x-2 mb-4">
          <svg className="w-5 h-5 text-[#58a6ff]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          <h3 className="text-lg font-semibold text-[#e6edf3]">Collaborators</h3>
        </div>
        <div className="text-[#f85149] text-sm">{error}</div>
      </div>
    );
  }

  // Ensure collaborators is an array
  const collaboratorsList = Array.isArray(collaborators) ? collaborators : [];

  return (
    <div className="mt-8">
      <div className="flex items-center space-x-2 mb-4">
        <svg className="w-5 h-5 text-[#58a6ff]" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
        <h3 className="text-lg font-semibold text-[#e6edf3]">Collaborators</h3>
      </div>
      
      <div className="space-y-2">
        {collaboratorsList.map((collaborator, index) => {
          // Extract username from the format "username <email>"
          const username = collaborator.split(' <')[0];
          const email = collaborator.match(/<(.+)>/)?.[1] || '';
          
          return (
            <div 
              key={index}
              className="bg-[#161b22] border border-[#30363d] rounded-md p-3 text-[#7d8590] hover:bg-[#21262d]"
            >
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-[#21262d] border border-[#30363d] rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">{username[0]?.toUpperCase() || '?'}</span>
                </div>
                <div>
                  <div className="font-medium text-[#e6edf3]">{username || 'Unknown User'}</div>
                  <div className="text-xs text-[#7d8590]">{email}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {collaboratorsList.length === 0 && (
        <div className="text-center py-4">
          <p className="text-[#7d8590] text-sm">No collaborators found</p>
        </div>
      )}
    </div>
  );
}