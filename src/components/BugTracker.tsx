import { useState, useEffect } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { useStore } from '../store/useStore';
import { Bug, Play, Square, Clock, List, Download, FileText, CheckCircle2, Plus } from 'lucide-react';
import { BugType } from '../types';
import jsPDF from 'jspdf';

const BugTracker = () => {
  const [bugNumber, setBugNumber] = useState('');
  const [bugType, setBugType] = useState<BugType>('bug');
  const [bugTitle, setBugTitle] = useState('');
  const [bugDescription, setBugDescription] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [newSubtask, setNewSubtask] = useState('');
  
  const { 
    users, 
    activeBugTimer, 
    bugTimeEntries, 
    startBugTimer, 
    stopBugTimer,
    updateBugEntry,
    addBugSubtask,
    updateBugSubtask,
    markBugFinished
  } = useStore();
  
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

  const formatTimeMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getBugTypeLabel = (type: BugType) => {
    const labels: Record<BugType, string> = {
      'bug': '🐛 Bug',
      'not-a-bug': '❌ Not a Bug',
      'regression': '🔄 Regression',
      'enhancement': '✨ Enhancement',
      'feature': '🚀 Feature'
    };
    return labels[type];
  };

  const getBugTypeColor = (type: BugType) => {
    const colors: Record<BugType, string> = {
      'bug': 'from-red-500 to-pink-600',
      'not-a-bug': 'from-gray-500 to-gray-600',
      'regression': 'from-orange-500 to-red-600',
      'enhancement': 'from-blue-500 to-cyan-600',
      'feature': 'from-green-500 to-emerald-600'
    };
    return colors[type];
  };

  const handleStart = () => {
    if (!selectedUserId || !bugNumber.trim()) return;
    startBugTimer(selectedUserId, bugNumber.trim(), bugType, bugTitle.trim() || undefined, bugDescription.trim() || undefined);
    setBugNumber('');
    setBugTitle('');
    setBugDescription('');
  };

  const handleStop = () => {
    stopBugTimer();
    setElapsedTime(0);
  };

  const handleAddSubtask = () => {
    if (!newSubtask.trim() || !activeBugTimer) return;
    addBugSubtask(activeBugTimer.id, {
      description: newSubtask.trim(),
      completed: false,
    });
    setNewSubtask('');
  };

  const handleToggleSubtask = (subtaskId: string) => {
    if (!activeBugTimer) return;
    const subtask = activeBugTimer.subtasks.find(st => st.id === subtaskId);
    if (subtask) {
      updateBugSubtask(activeBugTimer.id, subtaskId, { completed: !subtask.completed });
    }
  };

  const handleUpdateActiveEntry = (updates: Partial<{ title: string; description: string }>) => {
    if (!activeBugTimer) return;
    updateBugEntry(activeBugTimer.id, updates);
  };

  const allEntries = [...bugTimeEntries, ...(activeBugTimer ? [activeBugTimer] : [])]
    .filter((entry) => entry.userId === selectedUserId)
    .sort((a, b) => (b.endTime?.getTime() || b.startTime.getTime()) - (a.endTime?.getTime() || a.startTime.getTime()));

  const finishedEntries = allEntries.filter(e => e.isFinished);
  const activeEntries = allEntries.filter(e => !e.isFinished && e.endTime);
  const totalTime = allEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0);

  const exportToCSV = () => {
    if (!selectedUserId) return;
    
    const user = users.find(u => u.id === selectedUserId);
    const headers = ['Bug Number', 'Type', 'Title', 'Description', 'Start Time', 'End Time', 'Duration (min)', 'Status', 'Subtasks', 'Finished Date'];
    const rows = allEntries.map(entry => {
      const subtasksText = entry.subtasks.map(st => `${st.description}${st.completed ? ' ✓' : ''}`).join('; ');
      return [
        entry.bugNumber,
        getBugTypeLabel(entry.bugType),
        entry.title || '',
        entry.description || '',
        format(entry.startTime, 'yyyy-MM-dd HH:mm'),
        entry.endTime ? format(entry.endTime, 'yyyy-MM-dd HH:mm') : 'In Progress',
        entry.duration?.toString() || '0',
        entry.isFinished ? 'Finished' : (entry.endTime ? 'Completed' : 'Active'),
        subtasksText,
        entry.finishedDate ? format(entry.finishedDate, 'yyyy-MM-dd') : ''
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `bug-tracker-${user?.name || 'export'}-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    if (!selectedUserId) return;
    
    const user = users.find(u => u.id === selectedUserId);
    const doc = new jsPDF('portrait', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;

    // Title
    doc.setFontSize(20);
    doc.setTextColor(99, 102, 241);
    doc.text('Bug Tracker Report', margin, margin + 10);
    
    // User info
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Team Member: ${user?.name || 'Unknown'} (${user?.team || 'N/A'})`, margin, margin + 20);
    doc.text(`Generated: ${format(new Date(), 'MMM d, yyyy h:mm a')}`, margin, margin + 27);
    
    // Summary
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Summary', margin, margin + 40);
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    doc.text(`Total Time: ${formatTimeMinutes(totalTime)}`, margin, margin + 48);
    doc.text(`Total Entries: ${allEntries.length}`, margin, margin + 55);
    doc.text(`Finished: ${finishedEntries.length}`, margin, margin + 62);
    doc.text(`Active: ${activeEntries.length}`, margin, margin + 69);

    let yPos = margin + 80;
    const entryHeight = 30;

    allEntries.forEach((entry) => {
      if (yPos + entryHeight > pageHeight - margin) {
        doc.addPage();
        yPos = margin + 10;
      }

      // Entry header
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text(`${entry.bugNumber} - ${getBugTypeLabel(entry.bugType)}`, margin, yPos);
      
      if (entry.title) {
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text(entry.title, margin + 5, yPos + 7);
      }

      // Details
      doc.setFontSize(9);
      doc.text(`Start: ${format(entry.startTime, 'MMM d, yyyy h:mm a')}`, margin + 5, yPos + 12);
      if (entry.endTime) {
        doc.text(`End: ${format(entry.endTime, 'MMM d, yyyy h:mm a')}`, margin + 5, yPos + 17);
      }
      doc.text(`Duration: ${entry.duration ? formatTimeMinutes(entry.duration) : 'In Progress'}`, margin + 5, yPos + 22);
      
      if (entry.isFinished) {
        doc.setTextColor(34, 197, 94);
        doc.text('✓ Finished', margin + 80, yPos + 12);
        doc.setTextColor(0, 0, 0);
      }

      // Subtasks
      if (entry.subtasks.length > 0) {
        doc.setFontSize(8);
        entry.subtasks.forEach((st, i) => {
          doc.text(`${st.completed ? '✓' : '○'} ${st.description}`, margin + 10, yPos + 27 + (i * 4));
        });
        yPos += entry.subtasks.length * 4;
      }

      yPos += entryHeight;
    });

    // Footer
    const totalPages = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 5, { align: 'center' });
    }

    const fileName = `bug-tracker-${user?.name || 'export'}-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
    doc.save(fileName);
  };

  return (
    <div className="premium-card">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl shadow-lg">
            <Bug className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Bug Time Tracker</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Track time spent on bugs, features, and enhancements</p>
          </div>
        </div>
        {selectedUserId && allEntries.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl hover:from-blue-600 hover:to-cyan-700 transition-all font-semibold shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Export CSV
            </button>
            <button
              onClick={exportToPDF}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all font-semibold shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        )}
      </div>

      <div className="space-y-6">
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

        {!activeBugTimer && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Bug/Issue Number
                </label>
                <input
                  type="text"
                  value={bugNumber}
                  onChange={(e) => setBugNumber(e.target.value)}
                  placeholder="e.g., BUG-1234, FEAT-567"
                  className="premium-input"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Type
                </label>
                <select
                  value={bugType}
                  onChange={(e) => setBugType(e.target.value as BugType)}
                  className="premium-input"
                >
                  <option value="bug">🐛 Bug</option>
                  <option value="not-a-bug">❌ Not a Bug</option>
                  <option value="regression">🔄 Regression</option>
                  <option value="enhancement">✨ Enhancement</option>
                  <option value="feature">🚀 Feature</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Title (Optional)
              </label>
              <input
                type="text"
                value={bugTitle}
                onChange={(e) => setBugTitle(e.target.value)}
                placeholder="Brief title or summary"
                className="premium-input"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={bugDescription}
                onChange={(e) => setBugDescription(e.target.value)}
                placeholder="Detailed description of the bug/feature"
                rows={3}
                className="premium-input"
              />
            </div>

            <button
              onClick={handleStart}
              disabled={!selectedUserId || !bugNumber.trim()}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transform hover:scale-105"
            >
              <Play className="w-5 h-5" />
              Start Tracking
            </button>
          </>
        )}

        {activeBugTimer && activeBugTimer.userId === selectedUserId && (
          <div className="space-y-4">
            <div className={`p-6 bg-gradient-to-br ${getBugTypeColor(activeBugTimer.bugType)} rounded-xl shadow-xl border-2`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                    {getBugTypeLabel(activeBugTimer.bugType)}
                  </p>
                  <p className="text-xl font-semibold text-white">
                    {activeBugTimer.bugNumber}
                  </p>
                  {activeBugTimer.title && (
                    <p className="text-sm text-white/90 mt-1">{activeBugTimer.title}</p>
                  )}
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
              <button
                onClick={handleStop}
                className="w-full py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all font-semibold flex items-center justify-center gap-2"
              >
                <Square className="w-5 h-5" />
                Stop Timer
              </button>
            </div>

            {/* Subtasks */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border-2 border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                <List className="w-5 h-5" />
                Subtasks
              </h3>
              <div className="space-y-2 mb-3">
                {activeBugTimer.subtasks.map((subtask) => (
                  <div
                    key={subtask.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 ${
                      subtask.completed
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    <button
                      onClick={() => handleToggleSubtask(subtask.id)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        subtask.completed
                          ? 'bg-green-500 border-green-600 text-white'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      {subtask.completed && <CheckCircle2 className="w-4 h-4" />}
                    </button>
                    <span
                      className={`flex-1 ${
                        subtask.completed
                          ? 'line-through text-gray-500 dark:text-gray-400'
                          : 'text-gray-800 dark:text-white'
                      }`}
                    >
                      {subtask.description}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSubtask()}
                  placeholder="Add a subtask..."
                  className="flex-1 premium-input"
                />
                <button
                  onClick={handleAddSubtask}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all font-semibold flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
            </div>

            {/* Update title and description */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Update Title
                </label>
                <input
                  type="text"
                  value={activeBugTimer.title || ''}
                  onChange={(e) => handleUpdateActiveEntry({ title: e.target.value })}
                  placeholder="Update title"
                  className="premium-input"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Update Description
                </label>
                <textarea
                  value={activeBugTimer.description || ''}
                  onChange={(e) => handleUpdateActiveEntry({ description: e.target.value })}
                  placeholder="Update description"
                  rows={3}
                  className="premium-input"
                />
              </div>
            </div>
          </div>
        )}

        {selectedUserId && allEntries.length > 0 && (
          <div className="mt-8 space-y-6">
            {/* Statistics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-4 border-2 border-blue-200 dark:border-blue-800">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Time</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{formatTimeMinutes(totalTime)}</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border-2 border-green-200 dark:border-green-800">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Finished</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{finishedEntries.length}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border-2 border-purple-200 dark:border-purple-800">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Entries</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{allEntries.length}</p>
              </div>
            </div>

            {/* Finished Features Section */}
            {finishedEntries.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  Finished Features & Bugs ({finishedEntries.length})
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {finishedEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border-2 border-green-200 dark:border-green-800 hover:shadow-lg transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-1 rounded text-xs font-semibold bg-gradient-to-r ${getBugTypeColor(entry.bugType)} text-white`}>
                              {getBugTypeLabel(entry.bugType)}
                            </span>
                            <p className="font-bold text-gray-800 dark:text-white">{entry.bugNumber}</p>
                            {entry.title && (
                              <p className="text-sm text-gray-600 dark:text-gray-400">- {entry.title}</p>
                            )}
                          </div>
                          {entry.endTime && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {format(entry.endTime, 'MMM d, yyyy h:mm a')} • {entry.duration ? formatTimeMinutes(entry.duration) : 'N/A'}
                            </p>
                          )}
                          {entry.subtasks.length > 0 && (
                            <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                              Subtasks: {entry.subtasks.filter(st => st.completed).length}/{entry.subtasks.length} completed
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Entries */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <List className="w-5 h-5" />
                  All Entries ({allEntries.length})
                </h3>
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {allEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className={`p-4 rounded-xl border-2 hover:shadow-lg transition-all ${
                      entry.isFinished
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800'
                        : entry.endTime
                        ? 'bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 border-gray-200 dark:border-gray-600'
                        : 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-1 rounded text-xs font-semibold bg-gradient-to-r ${getBugTypeColor(entry.bugType)} text-white`}>
                            {getBugTypeLabel(entry.bugType)}
                          </span>
                          <p className="font-bold text-gray-800 dark:text-white">{entry.bugNumber}</p>
                          {entry.title && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">- {entry.title}</p>
                          )}
                        </div>
                        {entry.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{entry.description}</p>
                        )}
                        {entry.endTime && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {format(entry.endTime, 'MMM d, yyyy h:mm a')} • {entry.duration ? formatTimeMinutes(entry.duration) : 'N/A'}
                          </p>
                        )}
                        {entry.subtasks.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {entry.subtasks.map((st) => (
                              <div key={st.id} className="text-xs flex items-center gap-2">
                                <span>{st.completed ? '✓' : '○'}</span>
                                <span className={st.completed ? 'line-through text-gray-500' : 'text-gray-700 dark:text-gray-300'}>
                                  {st.description}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {entry.duration && (
                          <div className="text-right">
                            <p className="font-semibold text-primary-600 dark:text-primary-400">
                              {formatTimeMinutes(entry.duration)}
                            </p>
                          </div>
                        )}
                        {entry.endTime && !entry.isFinished && (
                          <button
                            onClick={() => markBugFinished(entry.id)}
                            className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all text-sm font-semibold flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Mark Finished
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BugTracker;
