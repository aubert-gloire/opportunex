import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const stagger = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1.1, ease: 'easeOut' } },
};

const Landing = () => {
  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="min-h-[90vh] flex items-center border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full py-24 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center">

          {/* Left — editorial heading */}
          <motion.div
            className="lg:col-span-7"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            <motion.p variants={fadeUp} className="text-[10px] uppercase tracking-luxury text-stone-400 mb-8 font-medium">
              Rwanda's Career Platform
            </motion.p>

            <motion.h1
              variants={fadeUp}
              className="font-display font-light text-stone-900 leading-[1.05] mb-0"
              style={{ fontSize: 'clamp(3.2rem, 7vw, 6.5rem)', letterSpacing: '-0.03em' }}
            >
              Bridge Rwanda's<br />
              <em className="text-primary">Employment Gap.</em>
            </motion.h1>

            {/* Thin accent line */}
            <motion.div
              variants={fadeIn}
              className="mt-10 w-12 h-px bg-stone-300"
            />
          </motion.div>

          {/* Right — context + CTA + stats */}
          <motion.div
            className="lg:col-span-5 lg:pt-16"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            <motion.p variants={fadeUp} className="text-stone-500 text-lg leading-relaxed font-light mb-10 max-w-sm">
              Connect with opportunities through mentorship, skill verification, and intelligent job matching.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 mb-14">
              <Link to="/register">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  Get Started
                </Button>
              </Link>
              <Link to="/jobs">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Browse Jobs
                </Button>
              </Link>
            </motion.div>

            {/* Inline stats */}
            <motion.div variants={fadeUp} className="grid grid-cols-3 gap-0 border-t border-stone-100 pt-8">
              {[
                { n: '50K+',   l: 'Graduates / Year' },
                { n: '14.5K+', l: 'Open Positions'   },
                { n: '1,000+', l: 'Verified Employers'},
              ].map(({ n, l }, i) => (
                <div key={i} className={`pr-6 ${i > 0 ? 'pl-6 border-l border-stone-100' : ''}`}>
                  <div className="font-display text-2xl font-light text-stone-900" style={{ letterSpacing: '-0.02em' }}>{n}</div>
                  <div className="text-[10px] uppercase tracking-label text-stone-400 mt-1">{l}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Trusted by ────────────────────────────────────────── */}
      <section className="py-10 border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-0">
            <p className="text-[10px] uppercase tracking-luxury text-stone-300 font-medium whitespace-nowrap sm:pr-12 sm:border-r sm:border-stone-100">
              Trusted by students from
            </p>
            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-8 sm:pl-12 opacity-40">
              {['University of Rwanda', 'ALU', 'AUCA', 'INES Ruhengeri', 'Mount Kenya University'].map((name) => (
                <span key={name} className="font-display text-lg text-stone-700">{name}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section className="py-32 bg-stone-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">

          <motion.div
            className="mb-20"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <motion.p variants={fadeUp} className="text-[10px] uppercase tracking-luxury text-stone-400 mb-5">
              The Process
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="font-display font-light text-stone-900"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.022em' }}
            >
              Three steps to your next role
            </motion.h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-stone-200"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {[
              {
                n:     '01',
                title: 'Create Your Profile',
                desc:  'Build your professional presence with skills, education, and experience in minutes.',
              },
              {
                n:     '02',
                title: 'Verify Your Skills',
                desc:  'Take targeted assessments to earn verified badges that prove your capabilities to employers.',
              },
              {
                n:     '03',
                title: 'Get Matched & Apply',
                desc:  "Receive curated job recommendations and connect directly with Rwanda's top employers.",
              },
            ].map(({ n, title, desc }) => (
              <motion.div
                key={n}
                variants={fadeUp}
                className="py-12 md:py-0 md:px-12 first:pl-0 last:pr-0"
              >
                <div
                  className="font-display font-light text-stone-100 mb-6 select-none"
                  style={{ fontSize: '5rem', lineHeight: 1, letterSpacing: '-0.04em' }}
                >
                  {n}
                </div>
                <h3 className="font-display text-xl font-normal text-stone-900 mb-3" style={{ letterSpacing: '-0.016em' }}>
                  {title}
                </h3>
                <p className="text-stone-500 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Why OpportuneX ───────────────────────────────────── */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

            {/* Feature list */}
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
            >
              <motion.p variants={fadeUp} className="text-[10px] uppercase tracking-luxury text-stone-400 mb-5">
                Why OpportuneX
              </motion.p>
              <motion.h2
                variants={fadeUp}
                className="font-display font-light text-stone-900 mb-14"
                style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.022em' }}
              >
                Built for Rwanda's<br /><em>next generation</em>
              </motion.h2>

              <div className="space-y-0">
                {[
                  {
                    title: 'Verified Employers',
                    desc:  'Every company is vetted to ensure you only see legitimate, quality opportunities.',
                  },
                  {
                    title: 'Skill Certification',
                    desc:  'Earn badges through curated assessments that objectively prove your capabilities.',
                  },
                  {
                    title: 'Mentorship Network',
                    desc:  'Connect with industry professionals for structured career guidance and support.',
                  },
                  {
                    title: 'Intelligent Matching',
                    desc:  'Our algorithm surfaces roles aligned to your skills, experience, and ambitions.',
                  },
                ].map(({ title, desc }, i) => (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    className="border-t border-stone-100 py-7"
                  >
                    <h4 className="text-sm font-medium text-stone-900 mb-1.5">{title}</h4>
                    <p className="text-sm text-stone-500 leading-relaxed">{desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right dark panel */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              className="bg-primary p-12 lg:p-16 flex flex-col justify-between min-h-[480px]"
            >
              <div>
                <div
                  className="font-display font-light text-white leading-none mb-3"
                  style={{ fontSize: 'clamp(3.5rem, 6vw, 5rem)', letterSpacing: '-0.03em' }}
                >
                  10,000<span className="text-white/30">+</span>
                </div>
                <div className="text-[10px] uppercase tracking-luxury text-white/40 mb-10">
                  Students & Graduates
                </div>
                <p className="text-white/60 text-sm leading-relaxed font-light max-w-[260px]">
                  From University of Rwanda, ALU, AUCA, and Rwanda's other leading institutions — all finding their path.
                </p>
              </div>

              <div className="mt-12">
                <Link to="/register">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/30 text-white hover:bg-white hover:text-primary w-full"
                  >
                    Start Your Journey
                  </Button>
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="py-32 bg-primary">
        <motion.div
          className="max-w-4xl mx-auto px-6 lg:px-10 text-center"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.p variants={fadeIn} className="text-[10px] uppercase tracking-luxury text-white/40 mb-8">
            Join OpportuneX
          </motion.p>

          <motion.h2
            variants={fadeUp}
            className="font-display font-light text-white leading-[1.1] mb-8"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-0.026em' }}
          >
            Ready to Transform<br />
            <em>Your Career?</em>
          </motion.h2>

          <motion.p variants={fadeUp} className="text-white/50 text-base leading-relaxed mb-14 max-w-lg mx-auto font-light">
            Whether you're seeking opportunity or exceptional talent, your journey starts here.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register?role=youth">
              <Button
                variant="accent"
                size="lg"
                className="w-full sm:w-auto"
              >
                I'm Looking for Jobs
              </Button>
            </Link>
            <Link to="/register?role=employer">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-white/30 text-white hover:bg-white hover:text-primary"
              >
                I'm Hiring Talent
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

    </div>
  );
};

export default Landing;
