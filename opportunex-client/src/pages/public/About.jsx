import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const stagger = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.13, delayChildren: 0.05 } },
};

const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1.1, ease: 'easeOut' } },
};

const About = () => {
  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative min-h-[80vh] flex items-center border-b border-stone-100 overflow-hidden">

        {/* Subtle horizontal rule animation */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.4, delay: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ transformOrigin: 'left' }}
          className="absolute bottom-20 left-0 right-0 max-w-7xl mx-auto px-6 lg:px-10"
        >
          <div className="w-12 h-px bg-stone-200" />
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 w-full py-32">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            <motion.p
              variants={fadeIn}
              className="text-[10px] uppercase tracking-luxury text-stone-400 mb-10 font-medium"
            >
              Our Story
            </motion.p>

            <motion.h1
              variants={fadeUp}
              className="font-display font-light text-stone-900 leading-[1.05] max-w-4xl"
              style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', letterSpacing: '-0.03em' }}
            >
              Bridging Dreams<br />
              <em className="text-stone-500">with Opportunity</em>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-stone-500 text-lg font-light leading-relaxed mt-10 max-w-xl"
            >
              Transforming Rwanda's employment landscape through meaningful connections between talent and ambition.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── Mission & Vision ─────────────────────────────────── */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:divide-x lg:divide-stone-100"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {/* Mission */}
            <motion.div variants={fadeUp} className="lg:pr-20 pb-16 lg:pb-0">
              <p className="text-[10px] uppercase tracking-luxury text-stone-400 mb-8 font-medium">Mission</p>
              <h2
                className="font-display font-light text-stone-900 leading-tight mb-8"
                style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.75rem)', letterSpacing: '-0.019em' }}
              >
                Empowering the next generation of{' '}
                <em>Rwandan leaders</em>
              </h2>
              <p className="text-stone-500 leading-relaxed text-base font-light">
                We provide a comprehensive platform connecting education with employment through skill verification, mentorship, and intelligent job matching.
              </p>
            </motion.div>

            {/* Vision */}
            <motion.div variants={fadeUp} className="lg:pl-20 pt-16 lg:pt-10 border-t border-stone-100 lg:border-t-0">
              <p className="text-[10px] uppercase tracking-luxury text-stone-400 mb-8 font-medium">Vision</p>
              <h2
                className="font-display font-light text-stone-900 leading-tight mb-8"
                style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.75rem)', letterSpacing: '-0.019em' }}
              >
                Rwanda's leading platform for{' '}
                <em>meaningful careers</em>
              </h2>
              <p className="text-stone-500 leading-relaxed text-base font-light">
                Where every graduate finds work that matches their skills and ambitions, contributing to national economic transformation.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── The Challenge — full-width statement ─────────────── */}
      <section className="py-32 bg-stone-50">
        <motion.div
          className="max-w-4xl mx-auto px-6 lg:px-10"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.p
            variants={fadeIn}
            className="text-[10px] uppercase tracking-luxury text-stone-400 mb-16 font-medium"
          >
            The Challenge
          </motion.p>

          <motion.blockquote variants={fadeUp}>
            <p
              className="font-display font-light text-stone-900 leading-[1.2] mb-16"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 3.2rem)', letterSpacing: '-0.022em' }}
            >
              "50,000 graduates emerge each year. Only 14,500 positions await them."
            </p>
          </motion.blockquote>

          <motion.div variants={stagger} className="space-y-6 text-stone-500 text-base leading-relaxed font-light max-w-2xl">
            <motion.p variants={fadeUp}>
              The gap isn't merely numerical — it's about connection. Traditional hiring methods fail to identify the right talent, while graduates lack networks, verified credentials, and guidance.
            </motion.p>
            <motion.p variants={fadeUp}>
              OpportuneX bridges this divide through technology, creating a trusted ecosystem where skills are verified, mentorship is accessible, and opportunity finds potential.
            </motion.p>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Values ───────────────────────────────────────────── */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">

          <motion.div
            className="mb-20"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.p variants={fadeIn} className="text-[10px] uppercase tracking-luxury text-stone-400 mb-5 font-medium">
              Our Principles
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="font-display font-light text-stone-900"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.022em' }}
            >
              What We <em>Stand For</em>
            </motion.h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-stone-100"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {[
              {
                roman: 'I',
                title: 'Youth First',
                desc:  'Centering the aspirations of young Rwandans in every decision we make.',
              },
              {
                roman: 'II',
                title: 'Excellence',
                desc:  'Maintaining the highest standards in verification, vetting, and platform quality.',
              },
              {
                roman: 'III',
                title: 'Impact',
                desc:  'Measuring success by careers launched and lives meaningfully transformed.',
              },
            ].map(({ roman, title, desc }) => (
              <motion.div
                key={roman}
                variants={fadeUp}
                className="py-12 md:py-0 md:px-12 first:pl-0 last:pr-0"
              >
                <div
                  className="font-display font-light text-stone-100 mb-6 select-none"
                  style={{ fontSize: '4rem', lineHeight: 1, letterSpacing: '-0.02em' }}
                >
                  {roman}
                </div>
                <h3
                  className="font-display font-normal text-stone-900 mb-3"
                  style={{ fontSize: '1.375rem', letterSpacing: '-0.016em' }}
                >
                  {title}
                </h3>
                <p className="text-stone-500 text-sm leading-relaxed font-light">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────── */}
      <section className="py-24 bg-primary">
        <motion.div
          className="max-w-5xl mx-auto px-6 lg:px-10"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
            {[
              { number: '50,000+', label: 'Annual Graduates'  },
              { number: '1,000+',  label: 'Verified Employers'},
              { number: '10,000+', label: 'Careers Launched'  },
            ].map(({ number, label }, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="py-10 md:py-0 text-center md:px-12 first:pl-0 last:pr-0"
              >
                <p
                  className="font-display font-light text-white leading-none mb-3"
                  style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', letterSpacing: '-0.028em' }}
                >
                  {number}
                </p>
                <p className="text-[10px] uppercase tracking-luxury text-white/40 font-medium">{label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="py-32 bg-white">
        <motion.div
          className="max-w-3xl mx-auto px-6 lg:px-10 text-center"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.p variants={fadeIn} className="text-[10px] uppercase tracking-luxury text-stone-400 mb-10 font-medium">
            Join Us
          </motion.p>

          <motion.h2
            variants={fadeUp}
            className="font-display font-light text-stone-900 leading-[1.1] mb-8"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', letterSpacing: '-0.026em' }}
          >
            Build Rwanda's<br />
            <em className="text-stone-500">Tomorrow, Today</em>
          </motion.h2>

          <motion.p variants={fadeUp} className="text-stone-500 text-base leading-relaxed mb-14 max-w-md mx-auto font-light">
            Whether seeking opportunities or exceptional talent, your journey begins here.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button variant="primary" size="lg">
                Begin Your Journey
              </Button>
            </Link>
            <Link to="/jobs">
              <Button variant="outline" size="lg">
                Explore Opportunities
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

    </div>
  );
};

export default About;
