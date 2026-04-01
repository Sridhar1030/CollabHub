import { useState, useEffect } from "react";

const MAX_HISTORY = 5;

export default function PodIndicator() {
  const [podName, setPodName] = useState(null);
  const [history, setHistory] = useState([]);
  const [justChanged, setJustChanged] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      const newPod = e.detail;
      if (!newPod) {
        setOffline(true);
        return;
      }
      setOffline(false);
      setPodName((prev) => {
        if (prev && prev !== newPod) {
          setJustChanged(true);
          setTimeout(() => setJustChanged(false), 1500);
          setHistory((h) =>
            [{ pod: prev, time: new Date().toLocaleTimeString() }, ...h].slice(0, MAX_HISTORY)
          );
        }
        return newPod;
      });
    };
    window.addEventListener("pod-name-changed", handler);
    return () => window.removeEventListener("pod-name-changed", handler);
  }, []);

  if (!podName && !offline) return null;

  const parts = podName ? podName.split("-") : [];
  const short = parts.length >= 2 ? parts.slice(-2).join("-") : podName;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '8px',
        right: '8px',
        zIndex: 9999,
        fontFamily: 'Tahoma, "Courier New", monospace',
        fontSize: '10px',
      }}
    >
      {/* History popup */}
      {showHistory && history.length > 0 && (
        <div
          className="win-window"
          style={{ marginBottom: '4px', width: '200px' }}
        >
          <div
            style={{
              background: 'linear-gradient(to right, #0a246a, #a6caf0)',
              padding: '2px 6px',
              color: '#ffffff',
              fontSize: '10px',
              fontWeight: 'bold',
            }}
          >
            Recent Pods
          </div>
          <div className="win-sunken" style={{ background: '#ffffff', padding: '2px' }}>
            {history.map((h, i) => {
              const s = h.pod.split("-").slice(-2).join("-");
              return (
                <div
                  key={i}
                  className="win-list-item"
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '2px 4px', fontSize: '10px' }}
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0000cc', display: 'inline-block', flexShrink: 0 }} />
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s}</span>
                  <span style={{ color: '#808080', fontSize: '9px' }}>{h.time}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main pod badge — looks like a Win2000 status bar panel */}
      <button
        onClick={() => setShowHistory(v => !v)}
        title={`Server pod: ${podName}\nClick to see history`}
        className="win-raised"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '2px 8px',
          cursor: 'pointer',
          background: offline ? '#ffcccc' : justChanged ? '#ffffcc' : '#d4d0c8',
          border: `1px solid`,
          borderColor: offline ? '#cc0000' : '#808080',
          fontFamily: 'inherit',
          fontSize: '10px',
        }}
      >
        {/* Pulse dot */}
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: offline ? '#cc0000' : '#008000',
            display: 'inline-block',
            flexShrink: 0,
          }}
        />
        {offline ? (
          <span style={{ color: '#cc0000' }}>⚠ Backend offline</span>
        ) : (
          <>
            <span style={{ color: '#808080' }}>pod:</span>
            <span style={{ fontWeight: 'bold', color: '#000080' }}>{short}</span>
            {history.length > 0 && (
              <span style={{ color: '#808080' }}>({history.length}↑)</span>
            )}
          </>
        )}
      </button>
    </div>
  );
}
