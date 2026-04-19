import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero */}
      <div className="max-w-6xl mx-auto px-4 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
          Now live — join early and shape the platform
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Get hired based on<br />
          <span className="text-blue-600">your actual skills</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Developer Connection matches developers to jobs by skill level — not just keywords.
          Beginners, intermediates, and experienced devs all get relevant opportunities.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {user ? (
            <Link to="/feed" className="btn-primary text-base py-3 px-8">Go to Feed →</Link>
          ) : (
            <>
              <Link to="/register" className="btn-primary text-base py-3 px-8">Get Started Free</Link>
              <Link to="/login" className="btn-secondary text-base py-3 px-8">Sign In</Link>
            </>
          )}
        </div>
      </div>

      {/* How it works */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">How it works</h2>
        <div className="grid md:grid-cols-3 gap-6 text-center">
          {[
            { step: '1', icon: '👤', title: 'Build your profile', desc: 'Set your level, list your skills, add your GitHub and portfolio. Your profile is your resume.' },
            { step: '2', icon: '💼', title: 'Browse matched jobs', desc: 'Jobs are tagged by level. You see your skill match percentage on every listing — no guessing.' },
            { step: '3', icon: '📨', title: 'Apply or get invited', desc: 'Apply directly to jobs that fit, or wait for employers to find and invite you.' },
          ].map((s) => (
            <div key={s.step} className="card text-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-3">
                {s.step}
              </div>
              <div className="text-3xl mb-3">{s.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-gray-600 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Everything you need</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: '🎯',
              title: 'Skill-match indicator',
              desc: 'See exactly how many of a job\'s required skills you already have, before you apply.',
            },
            {
              icon: '💼',
              title: 'Level-matched jobs',
              desc: 'Jobs are tagged Beginner, Intermediate, or Experienced. No more mismatched applications.',
            },
            {
              icon: '📨',
              title: 'Direct invitations',
              desc: 'Employers search developers by skill and level, then send direct invitations.',
            },
            {
              icon: '🔖',
              title: 'Save jobs',
              desc: 'Bookmark interesting jobs and come back to them when you\'re ready to apply.',
            },
            {
              icon: '📝',
              title: 'Developer feed',
              desc: 'Share posts, like and comment. Build your presence in the dev community.',
            },
            {
              icon: '🔔',
              title: 'Notifications',
              desc: 'Get notified on applications, invitations, and status updates instantly.',
            },
          ].map((f, i) => (
            <div key={i} className="card text-center hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-600 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Who it's for */}
      <div className="bg-white border-t border-gray-100 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Built for two sides</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card border-2 border-blue-100">
              <div className="text-3xl mb-3">🧑‍💻</div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Developers</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span> Set your level and skills once</li>
                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span> See skill match % on every job</li>
                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span> Add GitHub and portfolio to your profile</li>
                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span> Get invited directly by employers</li>
                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span> Track all your applications in one place</li>
              </ul>
            </div>
            <div className="card border-2 border-indigo-100">
              <div className="text-3xl mb-3">🏢</div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Employers</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span> Post jobs with salary, location, and required skills</li>
                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span> Only get applications from the right level</li>
                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span> Search developers by skill and level</li>
                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span> Send direct invitations to developers you like</li>
                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span> Accept or reject applications with one click</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      {!user && (
        <div className="bg-blue-600 py-16">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
            <p className="text-blue-100 mb-8">
              Create your profile in under 2 minutes. Free, no credit card required.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link to="/register" className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-blue-50 transition-colors">
                Join as Developer
              </Link>
              <Link to="/register" className="border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors">
                Post a Job
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
