import { useState, useEffect } from "react";

// One colour per pod — hash pod name to pick a consistent colour
const COLOURS = [
	{ bg: "bg-blue-500", ring: "ring-blue-400", dot: "bg-blue-300" },
	{ bg: "bg-emerald-500", ring: "ring-emerald-400", dot: "bg-emerald-300" },
	{ bg: "bg-violet-500", ring: "ring-violet-400", dot: "bg-violet-300" },
	{ bg: "bg-amber-500", ring: "ring-amber-400", dot: "bg-amber-300" },
	{ bg: "bg-pink-500", ring: "ring-pink-400", dot: "bg-pink-300" },
	{ bg: "bg-cyan-500", ring: "ring-cyan-400", dot: "bg-cyan-300" },
];

function hashPod(name) {
	if (!name) return 0;
	let h = 0;
	for (const c of name) h = (c.charCodeAt(0) + ((h << 5) - h)) | 0;
	return Math.abs(h) % COLOURS.length;
}

// Keep last N pods in history
const MAX_HISTORY = 5;

export default function PodIndicator() {
	const [podName, setPodName] = useState(null);
	const [history, setHistory] = useState([]); // [{pod, time}]
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
					// Pod switched — flash the badge
					setJustChanged(true);
					setTimeout(() => setJustChanged(false), 1500);

					// Push previous into history
					setHistory((h) =>
						[
							{
								pod: prev,
								time: new Date().toLocaleTimeString(),
							},
							...h,
						].slice(0, MAX_HISTORY),
					);
				}
				return newPod;
			});
		};

		window.addEventListener("pod-name-changed", handler);
		return () => window.removeEventListener("pod-name-changed", handler);
	}, []);

	// Nothing to show until the first API call completes
	if (!podName && !offline) return null;

	// Show just the last 2 random-looking segments of the pod name:
	// "collabhub-backend-86b8964777-f5x2x" → "864777-f5x2x"
	const parts = podName ? podName.split("-") : [];
	const short = parts.length >= 2 ? parts.slice(-2).join("-") : podName;
	const colour = COLOURS[hashPod(podName)];

	return (
		<div className="fixed bottom-5 right-5 z-50 font-mono text-xs select-none">
			{/* History dropdown */}
			{showHistory && history.length > 0 && (
				<div className="mb-2 w-56 rounded-xl bg-gray-800 border border-gray-700 shadow-2xl overflow-hidden">
					<div className="px-3 py-2 text-gray-400 text-[10px] uppercase tracking-widest border-b border-gray-700">
						Recent pods
					</div>
					{history.map((h, i) => {
						const c = COLOURS[hashPod(h.pod)];
						const s = h.pod.split("-").slice(-2).join("-");
						return (
							<div
								key={i}
								className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-700/60"
							>
								<span
									className={`w-2 h-2 rounded-full flex-shrink-0 ${c.dot}`}
								/>
								<span className="text-gray-200 flex-1 truncate">
									{s}
								</span>
								<span className="text-gray-500 text-[10px]">
									{h.time}
								</span>
							</div>
						);
					})}
				</div>
			)}

			{/* Main badge */}
			<button
				onClick={() => setShowHistory((v) => !v)}
				title={`Served by: ${podName}\nClick to see history`}
				className={`
          flex items-center gap-2 px-3 py-2 rounded-full text-white shadow-lg
          transition-all duration-300 cursor-pointer
          ${offline ? "bg-red-600 ring-2 ring-red-400" : colour.bg}
          ${justChanged ? `scale-110 ring-2 ${colour.ring}` : ""}
        `}
			>
				{/* Pulse dot */}
				<span className="relative flex h-2 w-2">
					{!offline && (
						<span
							className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${colour.dot}`}
						/>
					)}
					<span
						className={`relative inline-flex rounded-full h-2 w-2 ${offline ? "bg-red-300" : colour.dot}`}
					/>
				</span>

				{offline ? (
					<span>Backend offline</span>
				) : (
					<>
						<span className="opacity-75">pod:</span>
						<span className="font-bold">{short}</span>
						{history.length > 0 && (
							<span className="opacity-60 text-[10px]">
								({history.length}↑)
							</span>
						)}
					</>
				)}
			</button>
		</div>
	);
}
