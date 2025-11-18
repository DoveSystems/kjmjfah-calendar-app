import { useState } from 'react';
import { useStore } from '../store/useStore';
import { UserPlus, ArrowRight, Users, Globe, MapPin } from 'lucide-react';

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

const Onboarding = () => {
  const { addUser, setCurrentUser, setOnboarded } = useStore();
  const [name, setName] = useState('');
  const [team, setTeam] = useState('');
  const [country, setCountry] = useState('');
  const [location, setLocation] = useState('');
  const [customLocation, setCustomLocation] = useState('');

  const availableLocations = country ? (locations[country] || []) : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !team || !country || (!location && !customLocation)) return;

    const finalLocation = location === 'Other' ? customLocation : location;
    const timezone = timezones[country] || 'UTC';

    const newUser = {
      id: Date.now().toString(),
      name,
      team,
      country,
      location: finalLocation,
      timezone,
    };

    addUser(newUser);
    setCurrentUser(newUser.id);
    setOnboarded(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
      {/* Pixel team background */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='20' y='100' width='40' height='40' fill='%23ffffff'/%3E%3Crect x='30' y='140' width='20' height='40' fill='%23e5e7eb'/%3E%3Crect x='25' y='90' width='30' height='20' fill='%23fbbf24'/%3E%3Crect x='35' y='70' width='10' height='20' fill='%231f2937'/%3E%3Crect x='100' y='80' width='40' height='40' fill='%23ffffff'/%3E%3Crect x='110' y='120' width='20' height='40' fill='%23e5e7eb'/%3E%3Crect x='105' y='70' width='30' height='20' fill='%23f59e0b'/%3E%3Crect x='115' y='50' width='10' height='20' fill='%231f2937'/%3E%3Crect x='180' y='100' width='40' height='40' fill='%23ffffff'/%3E%3Crect x='190' y='140' width='20' height='40' fill='%23e5e7eb'/%3E%3Crect x='185' y='90' width='30' height='20' fill='%23fbbf24'/%3E%3Crect x='195' y='70' width='10' height='20' fill='%231f2937'/%3E%3Crect x='260' y='90' width='40' height='40' fill='%23ffffff'/%3E%3Crect x='270' y='130' width='20' height='40' fill='%23e5e7eb'/%3E%3Crect x='265' y='80' width='30' height='20' fill='%23f59e0b'/%3E%3Crect x='275' y='60' width='10' height='20' fill='%231f2937'/%3E%3Crect x='340' y='100' width='40' height='40' fill='%23ffffff'/%3E%3Crect x='350' y='140' width='20' height='40' fill='%23e5e7eb'/%3E%3Crect x='345' y='90' width='30' height='20' fill='%23fbbf24'/%3E%3Crect x='355' y='70' width='10' height='20' fill='%231f2937'/%3E%3Crect x='60' y='180' width='40' height='40' fill='%23ffffff'/%3E%3Crect x='70' y='220' width='20' height='40' fill='%23e5e7eb'/%3E%3Crect x='65' y='170' width='30' height='20' fill='%23fbbf24'/%3E%3Crect x='75' y='150' width='10' height='20' fill='%231f2937'/%3E%3Crect x='140' y='200' width='40' height='40' fill='%23ffffff'/%3E%3Crect x='150' y='240' width='20' height='40' fill='%23e5e7eb'/%3E%3Crect x='145' y='190' width='30' height='20' fill='%23f59e0b'/%3E%3Crect x='155' y='170' width='10' height='20' fill='%231f2937'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '200px 150px',
            imageRendering: 'pixelated'
          }}
        />
      </div>
      
      {/* Animated gradient orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="w-full max-w-2xl relative z-10">
        <div className="bg-white/95 backdrop-blur-2xl rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 mb-6 shadow-2xl transform hover:scale-110 transition-transform duration-300">
              <Users className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Welcome to KJMJFAH
            </h1>
            <p className="text-gray-600 text-xl font-medium mb-2">
              Join your global team
            </p>
            <p className="text-gray-500 text-base">
              Let's get you set up in just a moment
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative group">
              <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-indigo-600" />
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-5 py-4 bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-lg hover:shadow-xl group-hover:border-indigo-300"
                required
              />
            </div>

            <div className="relative group">
              <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600" />
                Team
              </label>
              <select
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                className="w-full px-5 py-4 bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 text-gray-900 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-lg hover:shadow-xl group-hover:border-purple-300 appearance-none cursor-pointer"
                required
              >
                <option value="">Select your team</option>
                {teams.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative group">
              <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                <Globe className="w-4 h-4 text-pink-600" />
                Country
              </label>
              <select
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                  setLocation('');
                  setCustomLocation('');
                }}
                className="w-full px-5 py-4 bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 text-gray-900 rounded-2xl focus:outline-none focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 transition-all shadow-lg hover:shadow-xl group-hover:border-pink-300 appearance-none cursor-pointer"
                required
              >
                <option value="">Select your country</option>
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {country && availableLocations.length > 0 && (
              <div className="relative group">
                <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-indigo-600" />
                  Location/City
                </label>
                <select
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    if (e.target.value !== 'Other') {
                      setCustomLocation('');
                    }
                  }}
                  className="w-full px-5 py-4 bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 text-gray-900 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-lg hover:shadow-xl group-hover:border-indigo-300 appearance-none cursor-pointer"
                  required
                >
                  <option value="">Select your location</option>
                  {availableLocations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {location === 'Other' && (
              <div className="relative group">
                <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-indigo-600" />
                  Custom Location
                </label>
                <input
                  type="text"
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                  placeholder="Enter your location"
                  className="w-full px-5 py-4 bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-lg hover:shadow-xl group-hover:border-indigo-300"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={!name || !team || !country || (!location && !customLocation)}
              className="w-full py-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3 transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center gap-3">
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;



