import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, addMonths, subMonths, isToday } from 'date-fns';
import { useStore } from '../store/useStore';
import { Calendar as CalendarIcon } from 'lucide-react';
import TimeOffDialog from './TimeOffDialog';

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showTimeOffDialog, setShowTimeOffDialog] = useState(false);
  const { timeOffs, users, getSprintForDate } = useStore();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getTimeOffsForDate = (date: Date) => {
    return timeOffs.filter((to) => {
      const start = new Date(to.startDate);
      const end = new Date(to.endDate);
      return date >= start && date <= end;
    });
  };

  const getSprintInfo = (date: Date) => {
    const sprint = getSprintForDate(date);
    return sprint;
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setShowTimeOffDialog(true);
  };

  return (
    <div className="premium-card">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
            <CalendarIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Calendar</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">View and manage time-off</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all font-medium shadow-sm"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentMonth(new Date())}
            className="px-4 py-2 premium-button text-sm"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all font-medium shadow-sm"
          >
            Next
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center font-bold text-gray-700 dark:text-gray-300 py-3 text-sm uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {daysInMonth.map((day) => {
          const dayTimeOffs = getTimeOffsForDate(day);
          const sprint = getSprintInfo(day);
          const isCurrentDay = isToday(day);
          const isCurrentMonth = isSameMonth(day, currentMonth);

          return (
            <div
              key={day.toString()}
              onClick={() => handleDateClick(day)}
              className={`
                min-h-[120px] p-3 rounded-xl border-2 cursor-pointer transition-all
                ${isCurrentDay 
                  ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 shadow-lg' 
                  : 'border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50'}
                ${!isCurrentMonth ? 'opacity-40' : ''}
                hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg hover:scale-[1.02]
              `}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-base font-bold ${isCurrentDay ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-800 dark:text-gray-200'}`}>
                  {format(day, 'd')}
                </span>
                {sprint && (
                  <span className="text-xs bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-2 py-1 rounded-lg font-semibold shadow-sm">
                    S{sprint.number}
                  </span>
                )}
              </div>
              <div className="space-y-1.5">
                {dayTimeOffs.slice(0, 2).map((to) => {
                  const user = users.find((u) => u.id === to.userId);
                  return (
                    <div
                      key={to.id}
                      className="text-xs bg-gradient-to-r from-orange-400 to-pink-400 text-white px-2 py-1 rounded-lg truncate font-medium shadow-sm"
                      title={`${user?.name}: ${to.reason}`}
                    >
                      {user?.name} 🏖️
                    </div>
                  );
                })}
                {dayTimeOffs.length > 2 && (
                  <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                    +{dayTimeOffs.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showTimeOffDialog && selectedDate && (
        <TimeOffDialog
          date={selectedDate}
          onClose={() => {
            setShowTimeOffDialog(false);
            setSelectedDate(null);
          }}
        />
      )}
    </div>
  );
};

export default Calendar;

