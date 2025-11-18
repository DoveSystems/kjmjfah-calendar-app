import { Info, Users, Lightbulb, Clock, Sparkles } from 'lucide-react';

const About = () => {
  return (
    <div className="glass-effect rounded-2xl p-8 card-hover max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Info className="w-8 h-8 text-primary-600" />
        <h2 className="text-3xl font-bold text-gray-800">About KJMJFAH</h2>
      </div>

      <div className="space-y-6">
        {/* The Name */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border-2 border-purple-200">
          <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            What's in a Name? (We're Still Figuring That Out)
          </h3>
          <p className="text-gray-700 leading-relaxed">
            So, you're probably wondering: <strong>"KJMJFAH? What does that even mean?"</strong> 
            Well, it's actually quite simple (and maybe a bit lazy, but hey, we're product people, not naming experts).
          </p>
          <p className="text-gray-700 leading-relaxed mt-3">
            <strong>KJMJFAH</strong> is just the first letters of our names smashed together:
          </p>
          <ul className="mt-4 space-y-2 text-gray-700">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              <strong>K</strong>im
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              <strong>J</strong>ose
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              <strong>M</strong>elanie
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              <strong>J</strong>urgen
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              <strong>F</strong>reda
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              <strong>A</strong>drian
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              <strong>H</strong>eather
            </li>
          </ul>
          <p className="text-gray-600 text-sm mt-4 italic">
            P.S. We're totally open to suggestions for a better name. Seriously. Please help us.
          </p>
        </div>

        {/* The Team */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200">
          <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            The Best Product Team (No, Really)
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Let's be honest here: we're not just <em>a</em> product team. We're <strong>THE</strong> product team. 
            The one that makes other product teams look like they're still figuring out how to use sticky notes.
          </p>
          <p className="text-gray-700 leading-relaxed mt-3">
            We've got the perfect mix of:
          </p>
          <ul className="mt-4 space-y-2 text-gray-700">
            <li className="flex items-center gap-2">
              <span className="text-blue-600 font-bold">✓</span>
              Strategic thinkers who can see the big picture
            </li>
            <li className="flex items-center gap-2">
              <span className="text-blue-600 font-bold">✓</span>
              Detail-oriented folks who catch the bugs before they become problems
            </li>
            <li className="flex items-center gap-2">
              <span className="text-blue-600 font-bold">✓</span>
              Global perspective (we're literally spread across the world)
            </li>
            <li className="flex items-center gap-2">
              <span className="text-blue-600 font-bold">✓</span>
              The ability to build an entire app in 15 minutes (see below)
            </li>
          </ul>
        </div>

        {/* The Origin Story */}
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-6 border-2 border-orange-200">
          <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-orange-600" />
            The Legendary Product Team Summit Meeting
          </h3>
          <p className="text-gray-700 leading-relaxed">
            It all started on <strong>November 17, 2025</strong> during our Product Team Summit Meeting. 
            You know, one of those meetings where you're supposed to discuss roadmaps and priorities, 
            but instead you end up solving actual problems.
          </p>
          <p className="text-gray-700 leading-relaxed mt-3">
            Someone (we won't name names, but it was probably Kim) said: 
            <em className="block mt-2 p-3 bg-white rounded-lg border-l-4 border-orange-500">
              "Hey, wouldn't it be cool if we had a calendar app that actually helps us plan sprints 
              around when people are out? And maybe tracks bug time too?"
            </em>
          </p>
          <p className="text-gray-700 leading-relaxed mt-3">
            And just like that, the idea was born. No lengthy planning sessions. No 47-slide PowerPoint presentations. 
            Just a simple problem and a simple solution.
          </p>
        </div>

        {/* The 15-Minute Miracle */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
          <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5 text-green-600" />
            Built in 15 Minutes (Yes, Really)
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Here's the thing: we didn't just <em>plan</em> this app. We actually <strong>built it</strong>. 
            In 15 minutes. During the meeting. While other teams were still debating whether to use 
            "sprint" or "iteration" in their documentation.
          </p>
          <p className="text-gray-700 leading-relaxed mt-3">
            <strong>15 minutes.</strong> That's less time than it takes to:
          </p>
          <ul className="mt-4 space-y-2 text-gray-700">
            <li className="flex items-center gap-2">
              <span className="text-green-600 font-bold">⏱️</span>
              Order and receive a coffee
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600 font-bold">⏱️</span>
              Have a "quick sync" that turns into a 2-hour discussion
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600 font-bold">⏱️</span>
              Write a JIRA ticket (we all know how long those take)
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600 font-bold">⏱️</span>
              Explain to stakeholders why a feature "should be easy" to build
            </li>
          </ul>
          <p className="text-gray-600 text-sm mt-4 italic">
            Disclaimer: The 15 minutes might have been slightly optimistic. But it was definitely under an hour. 
            We think. Time flies when you're building something awesome.
          </p>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-6 border-2 border-pink-200 text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-3">
            Help Us Name This Thing!
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            We're still brainstorming a better name. "KJMJFAH" works, but it's not exactly... memorable. 
            Or pronounceable. Or marketable. But hey, it's honest!
          </p>
          <p className="text-gray-600 text-sm">
            Got a better idea? We're all ears! (Well, we're a product team, so we're all eyes on Slack, 
            but you get the idea.)
          </p>
        </div>

        {/* Footer */}
        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Made with ❤️ (and maybe a little bit of caffeine) by the best product team in the universe.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Product Team Summit Meeting • November 17, 2025 • Built in approximately 15 minutes
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;



