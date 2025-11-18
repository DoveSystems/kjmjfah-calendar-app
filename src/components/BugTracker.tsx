import { useState, useEffect } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { useStore } from '../store/useStore';
import { Bug, Play, Square, Clock, List } from 'lucide-react';

const BugTracker = () => {
  const [bugNumber, setBugNumber] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const { users, activeBugTimer, bugTimeEntries, startBugTimer, stopBugTimer } = useStore();
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!activeBugTimer) {
      setElapsedTime(0);
      return;
    }

    const interval = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - activeBugTimer.startTime.getTime()) / 1000);
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeBugTimer]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (!selectedUserId || !bugNumber.trim()) return;
    startBugTimer(selectedUserId, bugNumber.trim());
    setBugNumber('');
  };

  const handleStop = () => {
    stopBugTimer();
    setElapsedTime(0);
  };

  const userEntries = bugTimeEntries
    .filter((entry) => entry.userId === selectedUserId)
    .sort((a, b) => (b.endTime?.getTime() || 0) - (a.endTime?.getTime() || 0));

  const totalTime = userEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0);

  return (
    <div className="premium-card">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl shadow-lg">
          <Bug className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Bug Time Tracker</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Track time spent on bug fixes</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Team Member
          </label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="premium-input"
            >
            <option value="">Select a team member</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.team}) - {user.country}, {user.location}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Bug Number
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={bugNumber}
              onChange={(e) => setBugNumber(e.target.value)}
              placeholder="e.g., BUG-1234"
              disabled={!!activeBugTimer}
              className="flex-1 premium-input disabled:opacity-50"
            />
            {!activeBugTimer ? (
              <button
                onClick={handleStart}
                disabled={!selectedUserId || !bugNumber.trim()}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold shadow-lg hover:shadow-xl flex items-center gap-2 transform hover:scale-105"
              >
                <Play className="w-4 h-4" />
                Start
              </button>
            ) : (
              <button
                onClick={handleStop}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:from-red-600 hover:to-pink-700 transition-all font-semibold shadow-lg hover:shadow-xl flex items-center gap-2 transform hover:scale-105"
              >
                <Square className="w-4 h-4" />
                Stop
              </button>
            )}
          </div>
        </div>

        {activeBugTimer && activeBugTimer.userId === selectedUserId && (
          <div className="p-6 bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-400 rounded-xl shadow-xl border-2 border-yellow-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                  Tracking
                </p>
                <p className="text-lg font-semibold text-white">
                  {activeBugTimer.bugNumber}
                </p>
                <p className="text-xs text-white/80 mt-1">
                  Started {formatDistanceToNow(activeBugTimer.startTime, { addSuffix: true })}
                </p>
              </div>
              <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm px-4 py-3 rounded-xl">
                <Clock className="w-6 h-6 text-white" />
                <span className="text-3xl font-bold text-white font-mono">
                  {formatTime(elapsedTime)}
                </span>
              </div>
            </div>
          </div>
        )}

        {selectedUserId && userEntries.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <List className="w-5 h-5" />
                Recent Entries
              </h3>
              <div className="text-sm text-gray-600">
                Total: <span className="font-semibold">{formatTime(totalTime * 60)}</span>
              </div>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {userEntries.slice(0, 10).map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">{entry.bugNumber}</p>
                      {entry.endTime && (
                        <p className="text-xs text-gray-500 mt-1">
                          {format(entry.endTime, 'MMM d, yyyy h:mm a')}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary-600">
                        {entry.duration ? formatTime(entry.duration * 60) : 'In progress'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BugTracker;

