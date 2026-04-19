export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-10 mt-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-white font-bold text-lg mb-2">Developer Connection</h3>
            <p className="text-sm">Matching developers to jobs by skill level — not just keywords.</p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span>📧</span>
                <a href="mailto:gavinahishakiye32@gmail.com" className="hover:text-white transition-colors">
                  gavinahishakiye32@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* WhatsApp */}
          <div>
            <h4 className="text-white font-semibold mb-3">WhatsApp</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span>💬</span>
                <a
                  href="https://wa.me/250795868642"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  +250 795 868 642
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span>💬</span>
                <a
                  href="https://wa.me/256779603281"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  +256 779 603 281
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-center text-xs text-gray-600">
          © {new Date().getFullYear()} Developer Connection. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
