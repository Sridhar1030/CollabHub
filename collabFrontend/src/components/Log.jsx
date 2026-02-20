import React, { useEffect, useState } from "react";
import api from "../api";
import RepositorySidebar from "./RepositorySidebar";
import EmptyState from "./EmptyState";
import RepositoryHeader from "./RepositoryHeader";
import LoadingState from "./LoadingState";
import RepositoryTabs from "./RepositoryTabs";

const API_BASE = ""; // base URL is handled by api.js (VITE_API_URL)

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
    <div className="flex gap-6 min-h-screen">
      <RepositorySidebar 
        repos={repos} 
        selectedRepo={selectedRepo} 
        onRepoClick={handleRepoClick} 
      />

      <div className="flex-1 min-w-0">
        {!selectedRepo ? (
          <EmptyState />
        ) : (
          <div className="space-y-6">
            <RepositoryHeader selectedRepo={selectedRepo} />

            {loading ? (
              <LoadingState />
            ) : (
              <RepositoryTabs logs={logs} files={files} selectedRepo={selectedRepo} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
