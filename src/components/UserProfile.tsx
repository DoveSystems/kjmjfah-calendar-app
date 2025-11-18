import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Settings, UserPlus, Trash2, Edit2, Check, X } from 'lucide-react';

const countries = [
  'United States',
  'India',
  'Germany',
  'United Kingdom',
  'Canada',
  'Australia',
  'France',
  'Spain',
  'Netherlands',
  'Poland',
  'Brazil',
  'Mexico',
  'Japan',
  'China',
  'Singapore',
  'Other',
];

const locations: Record<string, string[]> = {
  'United States': ['New York', 'San Francisco', 'Seattle', 'Austin', 'Boston', 'Chicago', 'Los Angeles', 'Other'],
  'India': ['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Chennai', 'Other'],
  'Germany': ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Stuttgart', 'Other'],
  'United Kingdom': ['London', 'Manchester', 'Edinburgh', 'Birmingham', 'Other'],
  'Canada': ['Toronto', 'Vancouver', 'Montreal', 'Ottawa', 'Other'],
  'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Other'],
  'France': ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Other'],
  'Spain': ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Other'],
  'Netherlands': ['Amsterdam', 'Rotterdam', 'Utrecht', 'The Hague', 'Other'],
  'Poland': ['Warsaw', 'Krakow', 'Wroclaw', 'Gdansk', 'Other'],
  'Brazil': ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Belo Horizonte', 'Other'],
  'Mexico': ['Mexico City', 'Guadalajara', 'Monterrey', 'Puebla', 'Other'],
  'Japan': ['Tokyo', 'Osaka', 'Kyoto', 'Yokohama', 'Other'],
  'China': ['Beijing', 'Shanghai', 'Shenzhen', 'Guangzhou', 'Other'],
  'Singapore': ['Singapore'],
  'Other': ['Other'],
};

const timezones: Record<string, string> = {
  'United States': 'America/New_York',
  'India': 'Asia/Kolkata',
  'Germany': 'Europe/Berlin',
  'United Kingdom': 'Europe/London',
  'Canada': 'America/Toronto',
  'Australia': 'Australia/Sydney',
  'France': 'Europe/Paris',
  'Spain': 'Europe/Madrid',
  'Netherlands': 'Europe/Amsterdam',
  'Poland': 'Europe/Warsaw',
  'Brazil': 'America/Sao_Paulo',
  'Mexico': 'America/Mexico_City',
  'Japan': 'Asia/Tokyo',
  'China': 'Asia/Shanghai',
  'Singapore': 'Asia/Singapore',
};

const teams = ['US', 'EU', 'India', 'APAC', 'LATAM', 'Other'];

const UserProfile = () => {
  const { users, addUser, updateUser, removeUser, currentUserId, setCurrentUser } = useStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    team: '',
    country: '',
    location: '',
    customLocation: '',
  });

  const availableLocations = formData.country ? (locations[formData.country] || []) : [];

  const resetForm = () => {
    setFormData({
      name: '',
      team: '',
      country: '',
      location: '',
      customLocation: '',
    });
    setShowAddForm(false);
    setEditingUserId(null);
  };

  const handleEdit = (user: typeof users[0]) => {
    setEditingUserId(user.id);
    setFormData({
      name: user.name,
      team: user.team,
      country: user.country,
      location: user.location,
      customLocation: '',
    });
    setShowAddForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.team || !formData.country || (!formData.location && !formData.customLocation)) return;

    const finalLocation = formData.location === 'Other' ? formData.customLocation : formData.location;
    const timezone = timezones[formData.country] || 'UTC';

    if (editingUserId) {
      updateUser(editingUserId, {
        name: formData.name,
        team: formData.team,
        country: formData.country,
        location: finalLocation,
        timezone,
      });
    } else {
      const newUser = {
        id: Date.now().toString(),
        name: formData.name,
        team: formData.team,
        country: formData.country,
        location: finalLocation,
        timezone,
      };
      addUser(newUser);
    }

    resetForm();
  };

  const handleDelete = (userId: string) => {
    if (confirm('Are you sure you want to remove this team member?')) {
      removeUser(userId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="premium-card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Team Management</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Manage your team members</p>
            </div>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowAddForm(true);
            }}
            className="premium-button flex items-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Add Member
          </button>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="mb-6 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border-2 border-indigo-200 dark:border-indigo-800">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              {editingUserId ? 'Edit Team Member' : 'Add New Team Member'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="premium-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Team</label>
                  <select
                    value={formData.team}
                    onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                    className="premium-input"
                    required
                  >
                    <option value="">Select team</option>
                    {teams.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Country</label>
                  <select
                    value={formData.country}
                    onChange={(e) => {
                      setFormData({ ...formData, country: e.target.value, location: '', customLocation: '' });
                    }}
                    className="premium-input"
                    required
                  >
                    <option value="">Select country</option>
                    {countries.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                {formData.country && availableLocations.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Location</label>
                    <select
                      value={formData.location}
                      onChange={(e) => {
                        setFormData({ ...formData, location: e.target.value, customLocation: e.target.value === 'Other' ? formData.customLocation : '' });
                      }}
                      className="premium-input"
                      required
                    >
                      <option value="">Select location</option>
                      {availableLocations.map((loc) => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {formData.location === 'Other' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Custom Location</label>
                  <input
                    type="text"
                    value={formData.customLocation}
                    onChange={(e) => setFormData({ ...formData, customLocation: e.target.value })}
                    className="premium-input"
                    required
                  />
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button type="submit" className="premium-button flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  {editingUserId ? 'Update' : 'Add'} Member
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Users List */}
        <div className="space-y-3">
          {users.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <UserPlus className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No team members yet</p>
              <p className="text-sm">Click "Add Member" to get started</p>
            </div>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                className={`p-4 rounded-xl border-2 transition-all ${
                  currentUserId === user.id
                    ? 'bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 border-indigo-300 dark:border-indigo-700'
                    : 'bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {user.name[0].toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-800 dark:text-white">{user.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {user.team} • {user.country}, {user.location}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentUser(user.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        currentUserId === user.id
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {currentUserId === user.id ? 'Active' : 'Set Active'}
                    </button>
                    <button
                      onClick={() => handleEdit(user)}
                      className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
