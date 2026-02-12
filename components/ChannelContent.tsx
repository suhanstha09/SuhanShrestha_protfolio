'use client';

/**
 * ═══════════════════════════════════════════════════
 * Channel Content Component
 * Renders the content for each of the 8 TV channels.
 * Each channel is a self-contained view with its own
 * layout and animations, unified by the CRT aesthetic.
 * ═══════════════════════════════════════════════════
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  personalInfo,
  experiences,
  technicalSkills,
  softSkills,
  quotes,
} from '@/lib/channelData';
import {
  fetchPinnedRepos,
  fetchContributionData,
  languageColors,
  type PinnedRepo,
  type ContributionWeek,
  type ContributionData,
} from '@/lib/githubApi';

interface ChannelContentProps {
  channel: number;
  greenMode: boolean;
}

/** Shared animation variants for content entry */
const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, staggerChildren: 0.1 },
  },
  exit: { opacity: 0, y: -10, transition: { duration: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};

export default function ChannelContent({
  channel,
  greenMode,
}: ChannelContentProps) {
  const accentColor = greenMode ? '#33ff33' : '#ff9f43';
  const dimColor = greenMode ? '#22aa22' : '#cc7722';

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={channel}
        className="h-full w-full overflow-y-auto scrollbar-hide p-4 md:p-6 lg:p-8"
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {channel === 1 && (
          <AboutChannel accent={accentColor} dim={dimColor} />
        )}
        {channel === 2 && (
          <ExperienceChannel accent={accentColor} dim={dimColor} />
        )}
        {channel === 3 && (
          <SkillsChannel
            accent={accentColor}
            dim={dimColor}
            greenMode={greenMode}
          />
        )}
        {channel === 4 && (
          <ProjectsChannel accent={accentColor} dim={dimColor} />
        )}
        {channel === 5 && (
          <ProofOfWorkChannel
            accent={accentColor}
            dim={dimColor}
            greenMode={greenMode}
          />
        )}
        {channel === 6 && (
          <QuotesChannel accent={accentColor} dim={dimColor} />
        )}
        {channel === 7 && (
          <BlogChannel accent={accentColor} dim={dimColor} />
        )}
        {channel === 8 && (
          <ContactChannel accent={accentColor} dim={dimColor} />
        )}
      </motion.div>
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════
   CHANNEL 1 — About Me
   ═══════════════════════════════════════════════════ */
function AboutChannel({
  accent,
  dim,
}: {
  accent: string;
  dim: string;
}) {
  const [displayedText, setDisplayedText] = useState('');
  const fullText = personalInfo.bio;

  // Typewriter effect for bio text
  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const timer = setInterval(() => {
      if (i < fullText.length) {
        setDisplayedText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 20);
    return () => clearInterval(timer);
  }, [fullText]);

  return (
    <motion.div className="flex flex-col gap-6" variants={contentVariants}>
      {/* Header */}
      <motion.div variants={itemVariants}>
        <p className="text-xs uppercase tracking-[0.3em] mb-1" style={{ color: dim }}>
          Channel 01
        </p>
        <h1
          className="font-display text-2xl md:text-3xl lg:text-4xl font-bold crt-text"
          style={{ color: accent }}
        >
          {personalInfo.name}
        </h1>
        <p
          className="font-display text-sm md:text-base mt-1 tracking-wider"
          style={{ color: dim }}
        >
          {personalInfo.title}
        </p>
      </motion.div>

      {/* Separator line */}
      <motion.div
        className="h-px w-full"
        style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
        variants={itemVariants}
      />

      {/* Bio with typewriter effect */}
      <motion.div variants={itemVariants}>
        <p className="text-sm md:text-base leading-relaxed crt-text" style={{ color: accent }}>
          {displayedText}
          {displayedText.length < fullText.length && (
            <span className="typewriter-cursor" />
          )}
        </p>
      </motion.div>

      {/* Status */}
      <motion.div
        className="mt-4"
        variants={itemVariants}
      >
        <div
          className="flex items-center gap-3 rounded-lg p-4 w-fit"
          style={{ background: 'rgba(255,159,67,0.05)', border: `1px solid ${accent}22` }}
        >
          <span className="text-xl">🟢</span>
          <div>
            <p className="text-xs uppercase tracking-wider" style={{ color: dim }}>
              Status
            </p>
            <p className="text-sm crt-text" style={{ color: accent }}>
              Open to opportunities
            </p>
          </div>
        </div>
      </motion.div>

      {/* ASCII art decoration */}
      <motion.pre
        className="text-[8px] md:text-[10px] leading-tight mt-4 opacity-30"
        style={{ color: accent }}
        variants={itemVariants}
      >
        {`
  ╔══════════════════════════════════════╗
  ║  System Status: ONLINE              ║
  ║  Signal: STRONG ████████████░░ 85%  ║
  ║  Broadcast: Portfolio v2.0          ║
  ╚══════════════════════════════════════╝`}
      </motion.pre>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   CHANNEL 2 — Experience
   ═══════════════════════════════════════════════════ */
function ExperienceChannel({
  accent,
  dim,
}: {
  accent: string;
  dim: string;
}) {
  return (
    <motion.div className="flex flex-col gap-6" variants={contentVariants}>
      <motion.div variants={itemVariants}>
        <p className="text-xs uppercase tracking-[0.3em] mb-1" style={{ color: dim }}>
          Channel 02
        </p>
        <h2
          className="font-display text-xl md:text-2xl font-bold crt-text"
          style={{ color: accent }}
        >
          Work Experience
        </h2>
      </motion.div>

      <motion.div
        className="h-px w-full"
        style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
        variants={itemVariants}
      />

      {experiences.map((exp, index) => (
        <motion.div
          key={index}
          className="rounded-lg p-4 md:p-6"
          style={{
            background: 'rgba(255,159,67,0.03)',
            border: `1px solid ${accent}22`,
          }}
          variants={itemVariants}
        >
          {/* Title & Company */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
            <div>
              <h3
                className="font-display text-base md:text-lg font-semibold crt-text"
                style={{ color: accent }}
              >
                {exp.title}
              </h3>
              <p className="text-sm" style={{ color: dim }}>
                @ {exp.company}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="rounded-full px-3 py-1 text-xs font-display"
                style={{
                  background: `${accent}15`,
                  color: accent,
                  border: `1px solid ${accent}33`,
                }}
              >
                {exp.duration}
              </span>
              {exp.current && (
                <span
                  className="rounded-full px-2 py-0.5 text-[10px]"
                  style={{ background: '#22c55e22', color: '#22c55e' }}
                >
                  Current
                </span>
              )}
            </div>
          </div>

          {/* Responsibilities */}
          <ul className="space-y-3">
            {exp.responsibilities.map((resp, i) => (
              <motion.li
                key={i}
                className="flex gap-3 text-xs md:text-sm leading-relaxed"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.15 }}
              >
                <span style={{ color: accent }} className="mt-0.5 flex-shrink-0">
                  ▸
                </span>
                <span className="crt-text" style={{ color: accent }}>
                  {resp}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      ))}

      {/* Terminal-style footer */}
      <motion.div
        className="text-[10px] mt-2 opacity-50"
        style={{ color: accent }}
        variants={itemVariants}
      >
        <p>$ cat /var/log/career.log</p>
        <p>{'>'} Total Experience: 1 year</p>
        <p>{'>'} Specialization: Frontend Development</p>
        <p>{'>'} Growth Vector: Full Stack ↑</p>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   CHANNEL 3 — Skills
   ═══════════════════════════════════════════════════ */
function SkillsChannel({
  accent,
  dim,
  greenMode,
}: {
  accent: string;
  dim: string;
  greenMode: boolean;
}) {
  return (
    <motion.div className="flex flex-col gap-6" variants={contentVariants}>
      <motion.div variants={itemVariants}>
        <p className="text-xs uppercase tracking-[0.3em] mb-1" style={{ color: dim }}>
          Channel 03
        </p>
        <h2
          className="font-display text-xl md:text-2xl font-bold crt-text"
          style={{ color: accent }}
        >
          Technical Skills
        </h2>
      </motion.div>

      <motion.div
        className="h-px w-full"
        style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
        variants={itemVariants}
      />

      {/* Skills with animated bars */}
      <motion.div className="space-y-3" variants={contentVariants}>
        {technicalSkills.map((skill, index) => (
          <motion.div
            key={skill.name}
            className="group"
            variants={itemVariants}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs md:text-sm crt-text" style={{ color: accent }}>
                {skill.name}
              </span>
              <span className="text-[10px] font-display" style={{ color: dim }}>
                {skill.level}%
              </span>
            </div>
            <div
              className="h-2 w-full rounded-full overflow-hidden"
              style={{ background: `${accent}11` }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${dim}, ${accent})`,
                  boxShadow: `0 0 8px ${accent}66`,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${skill.level}%` }}
                transition={{ duration: 1, delay: index * 0.1, ease: 'easeOut' }}
              />
            </div>
            <div className="flex justify-between mt-0.5">
              <span className="text-[9px] uppercase tracking-wider" style={{ color: `${accent}55` }}>
                {skill.category}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Non-technical skills */}
      <motion.div variants={itemVariants} className="mt-4">
        <h3
          className="font-display text-sm mb-3 uppercase tracking-wider"
          style={{ color: dim }}
        >
          Beyond The Code
        </h3>
        <div className="flex flex-wrap gap-3">
          {softSkills.map((skill) => (
            <motion.div
              key={skill.name}
              className="flex items-center gap-2 rounded-lg px-4 py-2"
              style={{
                background: `${accent}08`,
                border: `1px solid ${accent}22`,
              }}
              whileHover={{ scale: 1.05, borderColor: `${accent}55` }}
            >
              <span className="text-base">{skill.icon}</span>
              <span className="text-xs crt-text" style={{ color: accent }}>
                {skill.name}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ASCII skill radar */}
      <motion.pre
        className="text-[8px] md:text-[10px] leading-tight mt-2 opacity-30"
        style={{ color: accent }}
        variants={itemVariants}
      >
        {`
  ┌─ Skill Matrix ──────────────┐
  │ Frontend  ██████████░  95%  │
  │ Backend   ██████░░░░░  60%  │
  │ Design    ████████░░░  80%  │
  │ Creative  ███████░░░░  70%  │
  └─────────────────────────────┘`}
      </motion.pre>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   CHANNEL 4 — Projects (GitHub)
   ═══════════════════════════════════════════════════ */
function ProjectsChannel({
  accent,
  dim,
}: {
  accent: string;
  dim: string;
}) {
  const [repos, setRepos] = useState<PinnedRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPinnedRepos()
      .then((data) => {
        setRepos(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch repositories');
        setLoading(false);
      });
  }, []);

  return (
    <motion.div className="flex flex-col gap-6" variants={contentVariants}>
      <motion.div variants={itemVariants}>
        <p className="text-xs uppercase tracking-[0.3em] mb-1" style={{ color: dim }}>
          Channel 04
        </p>
        <h2
          className="font-display text-xl md:text-2xl font-bold crt-text"
          style={{ color: accent }}
        >
          Projects
        </h2>
        <p className="text-xs mt-1" style={{ color: dim }}>
          Pinned on github.com/{personalInfo.github}
        </p>
      </motion.div>

      <motion.div
        className="h-px w-full"
        style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
        variants={itemVariants}
      />

      {loading && (
        <motion.div
          className="flex flex-col items-center justify-center py-12 gap-3"
          variants={itemVariants}
        >
          <motion.div
            className="h-6 w-6 rounded-full border-2"
            style={{ borderColor: `${accent}33`, borderTopColor: accent }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <p className="text-xs crt-text" style={{ color: accent }}>
            Fetching repositories...
          </p>
        </motion.div>
      )}

      {error && (
        <motion.div
          className="text-center py-12"
          variants={itemVariants}
        >
          <p className="text-sm" style={{ color: '#ff6b6b' }}>
            ⚠ {error}
          </p>
          <p className="text-xs mt-2" style={{ color: dim }}>
            Check connection and try again
          </p>
        </motion.div>
      )}

      {!loading && !error && (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
          variants={contentVariants}
        >
          {repos.map((repo) => (
            <motion.a
              key={repo.fullName}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="repo-card rounded-lg p-4 block"
              style={{ background: `${accent}05` }}
              variants={itemVariants}
              whileHover={{ y: -2 }}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-semibold crt-text" style={{ color: accent }}>
                  📂 {repo.name}
                </h3>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={dim}
                  strokeWidth="2"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </div>

              {repo.owner !== 'suhanstha09' && (
                <p
                  className="text-[10px] mb-1 opacity-60"
                  style={{ color: dim }}
                >
                  {repo.owner}/{repo.name}
                </p>
              )}

              <p
                className="text-[11px] leading-relaxed mb-3 line-clamp-2"
                style={{ color: `${accent}99` }}
              >
                {repo.description || 'No description available'}
              </p>

              <div className="flex items-center gap-4 text-[10px]" style={{ color: dim }}>
                {repo.language && (
                  <span className="flex items-center gap-1">
                    <span
                      className="inline-block h-2 w-2 rounded-full"
                      style={{
                        background:
                          languageColors[repo.language] || accent,
                      }}
                    />
                    {repo.language}
                  </span>
                )}
                <span className="flex items-center gap-1">⭐ {repo.stars}</span>
                <span className="flex items-center gap-1">🔱 {repo.forks}</span>
              </div>
            </motion.a>
          ))}
        </motion.div>
      )}

      {!loading && !error && repos.length === 0 && (
        <motion.p
          className="text-center py-8 text-sm"
          style={{ color: dim }}
          variants={itemVariants}
        >
          No repositories found
        </motion.p>
      )}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   CHANNEL 5 — Proof of Work (Commit Activity)
   ═══════════════════════════════════════════════════ */
function ProofOfWorkChannel({
  accent,
  dim,
  greenMode,
}: {
  accent: string;
  dim: string;
  greenMode: boolean;
}) {
  const [weeks, setWeeks] = useState<ContributionWeek[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalContributions, setTotalContributions] = useState(0);

  useEffect(() => {
    fetchContributionData().then((data: ContributionData) => {
      setWeeks(data.weeks);
      setTotalContributions(data.totalContributions);
      setLoading(false);
    });
  }, []);

  /** Get color for contribution level (0-4) */
  const getLevelColor = useCallback(
    (level: number): string => {
      if (greenMode) {
        const colors = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];
        return colors[level] || colors[0];
      }
      const colors = [
        '#161b22',
        `${accent}33`,
        `${accent}66`,
        `${accent}99`,
        accent,
      ];
      return colors[level] || colors[0];
    },
    [accent, greenMode]
  );

  return (
    <motion.div className="flex flex-col gap-6" variants={contentVariants}>
      <motion.div variants={itemVariants}>
        <p className="text-xs uppercase tracking-[0.3em] mb-1" style={{ color: dim }}>
          Channel 05
        </p>
        <h2
          className="font-display text-xl md:text-2xl font-bold crt-text"
          style={{ color: accent }}
        >
          Proof of Work
        </h2>
        <p className="text-xs mt-1" style={{ color: dim }}>
          GitHub Activity &mdash; @{personalInfo.github} &mdash; {new Date().getFullYear()}
        </p>
      </motion.div>

      <motion.div
        className="h-px w-full"
        style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
        variants={itemVariants}
      />

      {loading ? (
        <motion.div className="flex items-center justify-center py-12" variants={itemVariants}>
          <motion.div
            className="h-6 w-6 rounded-full border-2"
            style={{ borderColor: `${accent}33`, borderTopColor: accent }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      ) : (
        <>
          {/* Stats */}
          <motion.div className="flex gap-6" variants={itemVariants}>
            <div>
              <p
                className="font-display text-2xl font-bold crt-text"
                style={{ color: accent }}
              >
                {totalContributions}
              </p>
              <p className="text-[10px] uppercase tracking-wider" style={{ color: dim }}>
                Contributions ({new Date().getFullYear()})
              </p>
            </div>
          </motion.div>

          {/* Contribution Calendar Grid */}
          <motion.div
            className="overflow-x-auto"
            variants={itemVariants}
          >
            <div className="min-w-[700px]">
              {/* Month labels — dynamically computed from data */}
              <div className="flex mb-1 ml-8">
                {(() => {
                  if (weeks.length === 0) return null;
                  const monthLabels: { label: string; position: number }[] = [];
                  const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                  const currentYear = new Date().getFullYear();
                  let lastMonth = -1;
                  weeks.forEach((week, wi) => {
                    if (week.days.length > 0) {
                      const d = new Date(week.days[0].date);
                      const m = d.getMonth();
                      // Only show months from the current year
                      if (m !== lastMonth && d.getFullYear() === currentYear) {
                        monthLabels.push({ label: allMonths[m], position: wi });
                        lastMonth = m;
                      }
                    }
                  });
                  return monthLabels.map((ml, i) => {
                    const nextPos = i < monthLabels.length - 1 ? monthLabels[i + 1].position : weeks.length;
                    const span = nextPos - ml.position;
                    return (
                      <span
                        key={`${ml.label}-${i}`}
                        className="text-[9px]"
                        style={{ color: dim, flex: span }}
                      >
                        {ml.label}
                      </span>
                    );
                  });
                })()}
              </div>

              <div className="flex gap-0.5">
                {/* Day labels */}
                <div className="flex flex-col gap-0.5 mr-1 justify-between py-0.5">
                  {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((day, i) => (
                    <span key={i} className="text-[8px] h-[10px] leading-[10px]" style={{ color: dim }}>
                      {day}
                    </span>
                  ))}
                </div>

                {/* Grid of contribution cells */}
                {weeks.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-0.5">
                    {week.days.map((day, di) => (
                      <motion.div
                        key={`${wi}-${di}`}
                        className="commit-cell rounded-[2px]"
                        style={{
                          width: 10,
                          height: 10,
                          background: getLevelColor(day.level),
                          border:
                            day.level > 0
                              ? 'none'
                              : '1px solid rgba(255,255,255,0.03)',
                        }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          delay: (wi * 7 + di) * 0.002,
                          duration: 0.2,
                        }}
                        title={`${day.date}: ${day.count} contributions`}
                      />
                    ))}
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-1 mt-3 justify-end">
                <span className="text-[9px] mr-1" style={{ color: dim }}>
                  Less
                </span>
                {[0, 1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className="h-[10px] w-[10px] rounded-[2px]"
                    style={{ background: getLevelColor(level) }}
                  />
                ))}
                <span className="text-[9px] ml-1" style={{ color: dim }}>
                  More
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}

      {/* Terminal-style summary */}
      <motion.pre
        className="text-[9px] md:text-[10px] opacity-40 mt-2"
        style={{ color: accent }}
        variants={itemVariants}
      >
        {`$ git log --oneline --since="${new Date().getFullYear()}-01-01" | wc -l
> ${totalContributions} contributions in ${new Date().getFullYear()}
> Consistency is key. Ship daily.`}
      </motion.pre>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   CHANNEL 6 — Quotes Carousel
   ═══════════════════════════════════════════════════ */
function QuotesChannel({
  accent,
  dim,
}: {
  accent: string;
  dim: string;
}) {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [displayedText, setDisplayedText] = useState('');

  // Auto-advance quotes every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Typewriter effect for each quote
  useEffect(() => {
    setDisplayedText('');
    const text = quotes[currentQuote].text;
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [currentQuote]);

  return (
    <motion.div className="flex flex-col gap-6" variants={contentVariants}>
      <motion.div variants={itemVariants}>
        <p className="text-xs uppercase tracking-[0.3em] mb-1" style={{ color: dim }}>
          Channel 06
        </p>
        <h2
          className="font-display text-xl md:text-2xl font-bold crt-text"
          style={{ color: accent }}
        >
          Quotes
        </h2>
      </motion.div>

      <motion.div
        className="h-px w-full"
        style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
        variants={itemVariants}
      />

      {/* Main quote display */}
      <motion.div
        className="flex flex-col items-center justify-center py-8 md:py-16 text-center"
        variants={itemVariants}
      >
        <div
          className="quote-card max-w-lg"
          style={{ borderColor: accent }}
        >
          <p
            className="text-lg md:text-xl lg:text-2xl crt-text leading-relaxed"
            style={{ color: accent }}
          >
            &ldquo;{displayedText}
            {displayedText.length < quotes[currentQuote].text.length && (
              <span className="typewriter-cursor" />
            )}
            &rdquo;
          </p>
          <p className="text-xs mt-4" style={{ color: dim }}>
            — {quotes[currentQuote].context}
          </p>
        </div>
      </motion.div>

      {/* Quote navigation dots */}
      <motion.div
        className="flex items-center justify-center gap-2"
        variants={itemVariants}
      >
        {quotes.map((_, i) => (
          <button
            key={i}
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: i === currentQuote ? 24 : 8,
              background: i === currentQuote ? accent : `${accent}33`,
              boxShadow:
                i === currentQuote ? `0 0 8px ${accent}66` : 'none',
            }}
            onClick={() => setCurrentQuote(i)}
            aria-label={`Quote ${i + 1}`}
          />
        ))}
      </motion.div>

      <motion.p
        className="text-center text-[10px] mt-2 opacity-40"
        style={{ color: accent }}
        variants={itemVariants}
      >
        Auto-cycling every 6 seconds • Click dots to navigate
      </motion.p>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   CHANNEL 7 — Blog/Writing (Coming Soon)
   ═══════════════════════════════════════════════════ */
function BlogChannel({
  accent,
  dim,
}: {
  accent: string;
  dim: string;
}) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center gap-6 h-full text-center"
      variants={contentVariants}
    >
      <motion.div variants={itemVariants}>
        <p className="text-xs uppercase tracking-[0.3em] mb-4" style={{ color: dim }}>
          Channel 07
        </p>

        {/* Large "Coming Soon" display */}
        <motion.div
          className="relative"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <h2
            className="font-display text-3xl md:text-4xl font-bold crt-text"
            style={{ color: accent }}
          >
            COMING SOON
          </h2>
        </motion.div>

        <motion.div
          className="mt-6 max-w-md mx-auto"
          variants={itemVariants}
        >
          <div
            className="rounded-lg p-6"
            style={{
              background: `${accent}05`,
              border: `1px dashed ${accent}33`,
            }}
          >
            <p className="text-2xl mb-3">✍️</p>
            <h3
              className="font-display text-sm mb-2"
              style={{ color: accent }}
            >
              Blog / Writing
            </h3>
            <p className="text-xs leading-relaxed" style={{ color: dim }}>
              I&apos;m preparing thoughtful articles on web development,
              frontend architecture, and my journey from frontend specialist
              to full-stack developer. Stay tuned.
            </p>
          </div>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          className="mt-8 flex items-center gap-2 justify-center"
          variants={itemVariants}
        >
          <div className="h-px w-8" style={{ background: `${accent}33` }} />
          <span className="text-[10px]" style={{ color: dim }}>
            SIGNAL PENDING
          </span>
          <div className="h-px w-8" style={{ background: `${accent}33` }} />
        </motion.div>

        {/* Blinking broadcast indicator */}
        <motion.div
          className="mt-4 flex items-center gap-2 justify-center"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div
            className="h-2 w-2 rounded-full"
            style={{ background: accent }}
          />
          <span className="text-[10px]" style={{ color: accent }}>
            Preparing transmission...
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   CHANNEL 8 — Contact
   ═══════════════════════════════════════════════════ */
function ContactChannel({
  accent,
  dim,
}: {
  accent: string;
  dim: string;
}) {
  const links = [
    {
      label: 'Email',
      value: personalInfo.email,
      href: `mailto:${personalInfo.email}`,
      icon: '📧',
    },
    {
      label: 'LinkedIn',
      value: 'Suhan Shrestha',
      href: personalInfo.linkedin,
      icon: '💼',
    },
    {
      label: 'GitHub',
      value: `@${personalInfo.github}`,
      href: personalInfo.githubUrl,
      icon: '💻',
    },
    {
      label: 'Location',
      value: personalInfo.location,
      href: `https://maps.google.com/?q=${encodeURIComponent(personalInfo.location)}`,
      icon: '📍',
    },
  ];

  return (
    <motion.div className="flex flex-col gap-6" variants={contentVariants}>
      <motion.div variants={itemVariants}>
        <p className="text-xs uppercase tracking-[0.3em] mb-1" style={{ color: dim }}>
          Channel 08
        </p>
        <h2
          className="font-display text-xl md:text-2xl font-bold crt-text"
          style={{ color: accent }}
        >
          Contact
        </h2>
        <p className="text-xs mt-1" style={{ color: dim }}>
          Let&apos;s connect and build something great
        </p>
      </motion.div>

      <motion.div
        className="h-px w-full"
        style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
        variants={itemVariants}
      />

      {/* Contact links */}
      <motion.div className="space-y-3" variants={contentVariants}>
        {links.map((link, index) => (
          <motion.a
            key={link.label}
            href={link.href}
            target={link.label !== 'Email' ? '_blank' : undefined}
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-lg p-4 transition-all duration-300"
            style={{
              background: `${accent}05`,
              border: `1px solid ${accent}22`,
            }}
            variants={itemVariants}
            whileHover={{
              x: 4,
              borderColor: `${accent}55`,
              background: `${accent}10`,
            }}
          >
            <span className="text-xl flex-shrink-0">{link.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-wider" style={{ color: dim }}>
                {link.label}
              </p>
              <p className="text-sm crt-text truncate" style={{ color: accent }}>
                {link.value}
              </p>
            </div>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke={dim}
              strokeWidth="2"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </motion.a>
        ))}
      </motion.div>

      {/* Call to action */}
      <motion.div
        className="mt-4 rounded-lg p-6 text-center"
        style={{
          background: `${accent}08`,
          border: `1px solid ${accent}22`,
        }}
        variants={itemVariants}
      >
        <p className="text-sm crt-text leading-relaxed" style={{ color: accent }}>
          Open to freelance projects, collaborations, and full-time
          opportunities. Let&apos;s build something remarkable together.
        </p>
        <motion.a
          href={`mailto:${personalInfo.email}`}
          className="inline-flex items-center gap-2 mt-4 rounded-full px-6 py-2 text-xs font-display"
          style={{
            background: accent,
            color: '#0a0a0a',
          }}
          whileHover={{ scale: 1.05, boxShadow: `0 0 20px ${accent}66` }}
          whileTap={{ scale: 0.95 }}
        >
          📡 Send Transmission
        </motion.a>
      </motion.div>

      {/* Terminal footer */}
      <motion.pre
        className="text-[9px] opacity-40 mt-2"
        style={{ color: accent }}
        variants={itemVariants}
      >
        {`$ ping suhan.dev
> Reply from Butwal, Nepal
> Latency: Available for hire
> Status: 🟢 Online`}
      </motion.pre>
    </motion.div>
  );
}
