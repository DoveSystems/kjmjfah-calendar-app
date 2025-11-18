import { useState, useEffect } from 'react';
import { useStore } from './store/useStore';
import Calendar from './components/Calendar';
import BugTracker from './components/BugTracker';
import SprintView from './components/SprintView';
import UserProfile from './components/UserProfile';
import Onboarding from './components/Onboarding';
import ThemeSelector from './components/ThemeSelector';
import { Calendar as CalendarIcon, Bug, BarChart3, User, Info, Users } from 'lucide-react';
import About from './components/About';

function App() {
  const { hasOnboarded, theme, users } = useStore();
  const [activeTab, setActiveTab] = useState<'calendar' | 'bug-tracker' | 'sprint' | 'profile' | 'about' | 'users'>('calendar');

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  if (!hasOnboarded || users.length === 0) {
    return <Onboarding />;
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold gradient-text mb-2">
                KJMJFAH
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">Teams Calendar & Time Tracker</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Kim • Jose • Melanie • Jurgen • Freda • Adrian • Heather</p>
            </div>
            <ThemeSelector />
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="mb-6 flex gap-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-6 py-3 font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'calendar'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <CalendarIcon className="w-5 h-5" />
            Calendar
          </button>
          <button
            onClick={() => setActiveTab('bug-tracker')}
            className={`px-6 py-3 font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'bug-tracker'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <Bug className="w-5 h-5" />
            Bug Tracker
          </button>
          <button
            onClick={() => setActiveTab('sprint')}
            className={`px-6 py-3 font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'sprint'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            Sprint View
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'users'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <Users className="w-5 h-5" />
            Team
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'profile'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <User className="w-5 h-5" />
            Profile
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`px-6 py-3 font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'about'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <Info className="w-5 h-5" />
            About
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {activeTab === 'calendar' && (
            <>
              <div className="lg:col-span-2">
                <Calendar />
              </div>
            </>
          )}
          
          {activeTab === 'bug-tracker' && (
            <div className="lg:col-span-2">
              <BugTracker />
            </div>
          )}
          
          {activeTab === 'sprint' && (
            <div className="lg:col-span-2">
              <SprintView />
            </div>
          )}
          
          {activeTab === 'users' && (
            <div className="lg:col-span-2">
              <UserProfile />
            </div>
          )}
          
          {activeTab === 'profile' && (
            <div className="lg:col-span-2">
              <UserProfile />
            </div>
          )}
          
          {activeTab === 'about' && (
            <div className="lg:col-span-2">
              <About />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

