import React, { useEffect, useState } from "react";
import api from "../api";
import RepositorySidebar from "./RepositorySidebar";
import EmptyState from "./EmptyState";
import RepositoryHeader from "./RepositoryHeader";
import LoadingState from "./LoadingState";
import RepositoryTabs from "./RepositoryTabs";

export default function Log() {
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [logs, setLogs] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const username = "sridhar";
  const apiKey = "abc123";

  useEffect(() => {
    api
      .get(`/repositories/${username}`, {
        headers: { "x-api-key": apiKey },
      })
      .then((res) => setRepos(res.data))
      .catch(console.error);
  }, []);

  const handleRepoClick = async (repo) => {
    setSelectedRepo(repo);
    setLoading(true);
    try {
      const logRes = await api.get(`/log/${username}/${repo}`, {
        headers: { "x-api-key": apiKey },
      });
      setLogs(logRes.data);

      const codeRes = await api.get(`/codebase/${username}/${repo}`, {
        headers: { "x-api-key": apiKey },
      });
      setFiles(codeRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-start', minHeight: 'calc(100vh - 120px)' }}>
      {/* Left Panel — Repositories */}
      <div className="win-window" style={{ flexShrink: 0 }}>
        <RepositorySidebar
          repos={repos}
          selectedRepo={selectedRepo}
          onRepoClick={handleRepoClick}
        />
      </div>

      {/* Right Panel — Main content area */}
      <div className="win-window" style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
        {/* Explorer-style title bar */}
        <div
          style={{
            background: 'linear-gradient(to right, #0a246a, #a6caf0)',
            padding: '3px 6px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            minHeight: '20px',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="#ffff00">
            <path fillRule="evenodd" d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8z"/>
          </svg>
          <span style={{ color: '#ffffff', fontSize: '11px', fontWeight: 'bold', fontFamily: 'Tahoma, sans-serif' }}>
            {selectedRepo ? selectedRepo : 'No Repository Selected'}
          </span>
        </div>

        <div style={{ padding: '4px' }}>
          {!selectedRepo ? (
            <EmptyState />
          ) : (
            <div>
              <RepositoryHeader selectedRepo={selectedRepo} />
              {loading ? (
                <LoadingState />
              ) : (
                <RepositoryTabs logs={logs} files={files} selectedRepo={selectedRepo} />
              )}
            </div>
          )}
        </div>

        {/* Status bar */}
        <div className="win-statusbar">
          <div className="win-statusbar-panel" style={{ flex: 1 }}>
            {selectedRepo ? `Repository: ${selectedRepo}` : 'Ready'}
          </div>
          <div className="win-statusbar-panel">
            User: sridhar
          </div>
          <div className="win-statusbar-panel">
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      </div>
    </div>
  );
}
