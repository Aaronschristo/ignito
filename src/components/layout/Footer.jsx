/**
 * Footer.jsx
 * Three-column layout: logo+tagline, quick links, social icons.
 * Subtle nebula-violet gradient top border.
 */
import { Rocket, AtSign, Globe, Hash, GitBranch, Mail } from 'lucide-react'

const QUICK_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Events', href: '#events' },
  { label: 'Competitions', href: '#competitions' },
  { label: 'Contact', href: '#contact' },
]

const SOCIALS = [
  { icon: AtSign, label: 'Twitter / X', href: '#' },
  { icon: Hash, label: 'Instagram', href: '#' },
  { icon: Globe, label: 'LinkedIn', href: '#' },
  { icon: GitBranch, label: 'GitHub', href: '#' },
  { icon: Mail, label: 'Email', href: '#contact' },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative bg-space-surface border-t border-space-border/60">
      {/* Gradient top accent */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-nebula-violet to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-12">

          {/* Column 1 — Brand */}
          <div>
            <a href="#home" className="flex items-center gap-2 mb-4">
              <Rocket size={20} className="text-ignition-flame" strokeWidth={2} />
              <span className="font-display text-lg font-bold text-text-primary">IGNITO</span>
            </a>
            <p className="font-body text-sm text-text-muted leading-relaxed max-w-xs">
              Ignite the future. A premier techfest celebrating innovation, engineering, and the human drive to explore beyond limits.
            </p>
          </div>

          {/* Column 2 — Quick Links */}
          <div>
            <h3 className="font-display text-sm font-semibold text-text-primary uppercase tracking-widest mb-4">
              Mission Map
            </h3>
            <ul className="space-y-2">
              {QUICK_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="font-body text-sm text-text-muted hover:text-nebula-blue transition-colors duration-150"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Socials */}
          <div>
            <h3 className="font-display text-sm font-semibold text-text-primary uppercase tracking-widest mb-4">
              Connect
            </h3>
            <div className="flex flex-wrap gap-3">
              {SOCIALS.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="p-2.5 rounded-lg bg-space-card border border-space-border text-text-muted hover:text-nebula-violet hover:border-nebula-violet/40 transition-all duration-200"
                >
                  <Icon size={16} strokeWidth={1.75} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-space-border/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body text-xs text-text-faint">
            © {year} IGNITO Techfest. All rights reserved.
          </p>
          <p className="font-body text-xs text-text-faint">
            Built with{' '}
            <span className="text-ignition-flame">🔥</span>{' '}
            by the IGNITO team
          </p>
        </div>
      </div>
    </footer>
  )
}
