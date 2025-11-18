import { useState } from 'react';
import { format } from 'date-fns';
import { useStore } from '../store/useStore';
import { X } from 'lucide-react';

interface TimeOffDialogProps {
  date: Date;
  onClose: () => void;
}

const TimeOffDialog = ({ date, onClose }: TimeOffDialogProps) => {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [endDate, setEndDate] = useState(format(date, 'yyyy-MM-dd'));
  const [reason, setReason] = useState('');
  const { users, addTimeOff, getSprintForDate } = useStore();
  const sprint = getSprintForDate(date);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !reason) return;

    addTimeOff({
      userId: selectedUserId,
      startDate: date,
      endDate: new Date(endDate),
      reason,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="premium-card max-w-md w-full mx-4 shadow-2xl border-2 border-indigo-200 dark:border-indigo-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Add Time Off</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6 p-4 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl text-white shadow-lg">
          <p className="text-sm font-semibold uppercase tracking-wider mb-1">Sprint Information</p>
          <p className="text-lg font-bold">
            Sprint {sprint.number}
          </p>
          <p className="text-sm opacity-90 mt-1">
            {format(sprint.startDate, 'MMM d')} - {format(sprint.endDate, 'MMM d, yyyy')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Team Member
            </label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="premium-input"
              required
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
              Start Date
            </label>
            <input
              type="date"
              value={format(date, 'yyyy-MM-dd')}
              disabled
              className="premium-input opacity-60 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={format(date, 'yyyy-MM-dd')}
              className="premium-input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Reason
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Thanksgiving, Vacation, Sick Leave"
              className="premium-input"
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-semibold text-gray-700 dark:text-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 premium-button"
            >
              Add Time Off
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TimeOffDialog;

