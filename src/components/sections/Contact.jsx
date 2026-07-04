/**
 * Contact.jsx
 * Contact form UI — fields: Name, Email, Subject, Message.
 * UI only (no backend). Framer-motion stagger reveal.
 * Green accent replacing violet.
 */
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Mail, Phone, MapPin, Rocket } from 'lucide-react'
import { SectionHeading } from '../ui/SectionHeading'
import { Button } from '../ui/Button'

const CONTACT_INFO = [
  { icon: Mail, label: 'Email', value: 'ignito@techfest.edu' },
  { icon: Phone, label: 'Phone', value: '+91 98765 43210' },
  { icon: MapPin, label: 'Venue', value: 'Mission Hub, Tech Campus' },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const inputClass = 'px-4 py-3 rounded-xl bg-space-card border border-space-border text-text-primary font-body text-sm placeholder:text-text-faint focus:outline-none focus:border-nebula-green/60 focus:ring-1 focus:ring-nebula-green/40 transition-all'

export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section id="contact" className="relative py-24 sm:py-32 bg-space-surface overflow-hidden">
      {/* Top accent */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-ignition-flame/30 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-nebula-green/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          overline="Mission Control"
          title="Get In Touch"
          subtitle="Have questions? Want to partner with us? Transmission received — we'll respond promptly."
        />

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Left — contact info */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="lg:col-span-2 flex flex-col gap-6"
          >
            <motion.div variants={itemVariants}>
              <h3 className="font-display text-xl font-semibold text-text-primary mb-2">
                Mission Briefing
              </h3>
              <p className="font-body text-sm text-text-muted leading-relaxed">
                Reach out for registration queries, sponsorship opportunities, event collaboration, or general inquiries. Our mission control team is standing by.
              </p>
            </motion.div>

            <div className="flex flex-col gap-4">
              {CONTACT_INFO.map(({ icon: Icon, label, value }) => (
                <motion.div
                  key={label}
                  variants={itemVariants}
                  className="flex items-center gap-4 p-4 rounded-xl bg-space-card border border-space-border"
                >
                  <div className="p-2.5 rounded-lg bg-nebula-green/10 border border-nebula-green/20">
                    <Icon size={18} className="text-nebula-green" strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="font-body text-[11px] text-text-faint uppercase tracking-widest">{label}</p>
                    <p className="font-body text-sm text-text-primary font-medium">{value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="lg:col-span-3"
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center gap-4 p-10 rounded-2xl bg-space-card border border-ignition-flame/30 text-center"
              >
                <div className="p-4 rounded-full bg-ignition-flame/10 border border-ignition-flame/20">
                  <Rocket size={32} className="text-ignition-flame" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-2xl font-bold text-text-primary">Transmission Sent!</h3>
                <p className="font-body text-text-muted text-sm max-w-xs">
                  Your message has been received by Mission Control. We'll respond within 48 hours.
                </p>
                <Button variant="ghost" onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }) }}>
                  Send Another
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
                    <label htmlFor="contact-name" className="font-body text-xs font-medium text-text-muted uppercase tracking-widest">Name</label>
                    <input id="contact-name" name="name" type="text" required value={form.name} onChange={handleChange} placeholder="Your name" className={inputClass} />
                  </motion.div>
                  <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
                    <label htmlFor="contact-email" className="font-body text-xs font-medium text-text-muted uppercase tracking-widest">Email</label>
                    <input id="contact-email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="you@email.com" className={inputClass} />
                  </motion.div>
                </div>

                <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
                  <label htmlFor="contact-subject" className="font-body text-xs font-medium text-text-muted uppercase tracking-widest">Subject</label>
                  <input id="contact-subject" name="subject" type="text" required value={form.subject} onChange={handleChange} placeholder="Transmission subject" className={inputClass} />
                </motion.div>

                <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
                  <label htmlFor="contact-message" className="font-body text-xs font-medium text-text-muted uppercase tracking-widest">Message</label>
                  <textarea id="contact-message" name="message" required rows={5} value={form.message} onChange={handleChange} placeholder="Your message to Mission Control…" className={`${inputClass} resize-none`} />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Button type="submit" variant="primary" className="w-full justify-center">
                    <Send size={15} strokeWidth={2} />
                    Send Transmission
                  </Button>
                </motion.div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
