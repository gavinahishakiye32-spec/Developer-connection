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
          The Developer-First Platform
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Where Developers<br />
          <span className="text-blue-600">Get Hired</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Showcase your skills, connect with top employers, and land jobs matched to your exact level. Built for developers, by developers.
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

      {/* Features */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: '🧑‍💻',
              title: 'Developer Profiles',
              desc: 'Showcase your skills, experience level, and portfolio. Let employers find you.',
            },
            {
              icon: '💼',
              title: 'Level-Matched Jobs',
              desc: 'Jobs are tagged Beginner, Intermediate, or Experienced. No more mismatched applications.',
            },
            {
              icon: '📨',
              title: 'Direct Invitations',
              desc: 'Employers can search developers and send direct invitations. No cold applying.',
            },
            {
              icon: '📝',
              title: 'Developer Feed',
              desc: 'Share posts, like and comment. Build your presence in the dev community.',
            },
            {
              icon: '🔔',
              title: 'Smart Notifications',
              desc: 'Get notified on applications, invitations, and status updates in real time.',
            },
            {
              icon: '🚀',
              title: 'Recruitment Flow',
              desc: 'Streamlined hiring: post → apply → invite → accept. Clean and simple.',
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

      {/* CTA */}
      {!user && (
        <div className="bg-blue-600 py-16">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to connect?</h2>
            <p className="text-blue-100 mb-8">Join thousands of developers and employers already on the platform.</p>
            <Link to="/register" className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-blue-50 transition-colors">
              Create Your Account
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
