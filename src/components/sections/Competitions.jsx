/**
 * Competitions.jsx
 * Competition cards with prize, team-size, difficulty, deadline.
 * Loaded from data/competitions.json.
 */
import { motion } from 'framer-motion'
import {
  Rocket, Bot, Cpu, Satellite, Telescope, Orbit, Radar,
  Trophy, Users, Gauge, Timer,
} from 'lucide-react'
import { SectionHeading } from '../ui/SectionHeading'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import competitionsData from '../../data/competitions.json'
import { formatDate, getDifficultyColors } from '../../lib/utils'

const ICON_MAP = { Rocket, Bot, Cpu, Satellite, Telescope, Orbit, Radar }

export function Competitions() {
  return (
    <section id="competitions" className="relative py-24 sm:py-32 bg-space-bg overflow-hidden">
      {/* Top accent */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-ignition-flame/40 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[260px] bg-ignition-flame/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          overline="Mission Challenges"
          title="Competitions"
          subtitle="Put your skills to the ultimate test. Choose a mission, assemble your crew, and compete for glory."
        />

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {competitionsData.map((comp, i) => {
            const Icon = ICON_MAP[comp.icon] ?? Rocket
            const diffColors = getDifficultyColors(comp.difficulty)

            return (
              <motion.div
                key={comp.id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Card glowColor="flame" className="h-full flex flex-col">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2.5 rounded-xl bg-ignition-flame/10 border border-ignition-flame/20">
                      <Icon size={20} className="text-ignition-flame" strokeWidth={1.75} />
                    </div>
                    <Badge label={comp.difficulty} colorClasses={diffColors} />
                  </div>

                  {/* Title + Description */}
                  <h3 className="font-display text-lg font-semibold text-text-primary mb-2 leading-snug">
                    {comp.title}
                  </h3>
                  <p className="font-body text-sm text-text-muted leading-relaxed flex-1 mb-4 line-clamp-3">
                    {comp.description}
                  </p>

                  {/* Prize highlight */}
                  <div className="flex items-center gap-2 mb-4 p-3 rounded-xl bg-ignition-flame/8 border border-ignition-flame/20">
                    <Trophy size={16} className="text-ignition-flame" strokeWidth={2} />
                    <div>
                      <p className="font-body text-[10px] text-text-muted uppercase tracking-wider">Prize Pool</p>
                      <p className="font-display text-xl font-bold text-ignition-flame">{comp.prize}</p>
                    </div>
                  </div>

                  {/* Meta grid */}
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    <div className="flex flex-col items-center p-2 rounded-lg bg-space-surface/60 border border-space-border/60">
                      <Users size={13} className="text-text-faint mb-1" strokeWidth={2} />
                      <span className="font-body text-[10px] text-text-muted text-center leading-tight">{comp.teamSize}</span>
                      <span className="font-body text-[9px] text-text-faint">members</span>
                    </div>
                    <div className="flex flex-col items-center p-2 rounded-lg bg-space-surface/60 border border-space-border/60">
                      <Gauge size={13} className="text-text-faint mb-1" strokeWidth={2} />
                      <span className="font-body text-[10px] text-text-muted text-center leading-tight">{comp.difficulty}</span>
                      <span className="font-body text-[9px] text-text-faint">level</span>
                    </div>
                    <div className="flex flex-col items-center p-2 rounded-lg bg-space-surface/60 border border-space-border/60">
                      <Timer size={13} className="text-text-faint mb-1" strokeWidth={2} />
                      <span className="font-body text-[10px] text-text-muted text-center leading-tight">{formatDate(comp.deadline)}</span>
                      <span className="font-body text-[9px] text-text-faint">deadline</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <Button variant="secondary" className="w-full justify-center text-xs py-2.5">
                    Register for Mission
                  </Button>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
