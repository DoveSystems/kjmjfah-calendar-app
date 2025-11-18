import { format } from 'date-fns';
import { useStore } from '../store/useStore';
import { Calendar, Users as UsersIcon } from 'lucide-react';

const SprintView = () => {
  const { users, getSprintForDate, getTimeOffsForSprint } = useStore();
  const today = new Date();
  const currentSprint = getSprintForDate(today);
  const nextSprint = getSprintForDate(new Date(currentSprint.endDate.getTime() + 1));
  
  const sprints = [currentSprint, nextSprint];

  const getTimeOffsForSprintWithDetails = (sprintNumber: number) => {
    const sprintTimeOffs = getTimeOffsForSprint(sprintNumber);
    return sprintTimeOffs.map((to) => {
      const user = users.find((u) => u.id === to.userId);
      return { ...to, user };
    });
  };

  return (
    <div className="premium-card">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg">
          <Calendar className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Sprint Planning</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">View time-off by sprint</p>
        </div>
      </div>

      <div className="space-y-6">
        {sprints.map((sprint) => {
          const sprintTimeOffs = getTimeOffsForSprintWithDetails(sprint.number);
          
          return (
            <div key={sprint.number} className="border-2 border-purple-300 dark:border-purple-700 rounded-2xl p-6 bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 dark:from-purple-900/20 dark:via-indigo-900/20 dark:to-pink-900/20 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-purple-800 dark:text-purple-300">
                    Sprint {sprint.number}
                  </h3>
                  <p className="text-sm text-purple-600 dark:text-purple-400 mt-1 font-medium">
                    {format(sprint.startDate, 'MMM d')} - {format(sprint.endDate, 'MMM d, yyyy')}
                  </p>
                </div>
                {sprint.number === currentSprint.number && (
                  <span className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-sm font-bold shadow-lg">
                    Current
                  </span>
                )}
              </div>

              {sprintTimeOffs.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <UsersIcon className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-semibold text-purple-700">
                      Team Members Out ({sprintTimeOffs.length})
                    </span>
                  </div>
                  {sprintTimeOffs.map((to) => (
                    <div
                      key={to.id}
                      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border-2 border-purple-200 dark:border-purple-700 shadow-md hover:shadow-lg transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-gray-800 dark:text-white text-lg">
                            {to.user?.name} <span className="text-sm font-normal text-gray-600 dark:text-gray-400">({to.user?.team})</span>
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {to.user?.country}, {to.user?.location}
                          </p>
                          <p className="text-sm font-medium text-purple-700 dark:text-purple-300 mt-2">
                            {to.reason}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-700 dark:text-gray-300 bg-purple-100 dark:bg-purple-900/50 px-3 py-2 rounded-lg">
                            {format(new Date(to.startDate), 'MMM d')} - {format(new Date(to.endDate), 'MMM d')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <UsersIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="font-medium">No time off scheduled for this sprint</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SprintView;

