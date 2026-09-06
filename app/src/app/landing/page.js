'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { Manrope, Cabin, Instrument_Serif, Inter } from 'next/font/google';

const manrope = Manrope({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });
const cabin = Cabin({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });
const instrumentSerif = Instrument_Serif({ subsets: ['latin'], weight: '400' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600'] });

// Reusable smooth scroll-reveal wrapper component
function Reveal({ children, delay = 0, className = "" }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    const current = ref.current;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${delay}ms`,
        transitionDuration: '700ms',
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className={`transition-all transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {children}
    </div>
  );
}

// Smooth Animated Number Counter Component
function AnimatedCounter({ end, decimals = 0, prefix = "", suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const [isCounting, setIsCounting] = useState(false);
  const ref = useRef(null);

  const startAnimation = () => {
    if (isCounting) return;
    setIsCounting(true);
    const startTime = performance.now();

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Exponential deceleration ease-out curve for smooth landing
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentVal = easeProgress * end;

      setCount(currentVal);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(end);
        setIsCounting(false);
      }
    };

    requestAnimationFrame(step);
  };

  useEffect(() => {
    let hasRun = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRun) {
          hasRun = true;
          startAnimation();
        }
      },
      { threshold: 0.15 }
    );

    const current = ref.current;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
  }, [end, duration]);

  const formattedCount = decimals > 0 
    ? count.toFixed(decimals) 
    : Math.floor(count).toLocaleString();

  return (
    <span
      ref={ref}
      onMouseEnter={() => { if (!isCounting) startAnimation(); }}
      className="tabular-nums inline-block select-none cursor-default"
      title="Hover to replay"
    >
      {prefix}{formattedCount}{suffix}
    </span>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const handleGetStarted = () => {
    router.push('/dashboard');
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "How does the AI grading and competency gap calculation work?",
      a: "Our proprietary AI models evaluate diagnostic answers based on conceptual context, analytical depth, and domain precision—going far beyond simple keyword checks. It cross-references scores against standardized MoSPI competency benchmarks to calculate exact deficit points."
    },
    {
      q: "How does Pariksha AI integrate with iGOT Karmayogi?",
      a: "Pariksha AI is aligned with the National Programme for Civil Services Capacity Building (NPCSCB) framework. When competency gaps are identified, our algorithm dynamically recommends official iGOT Karmayogi and MoSPI courses directly targeted at closing those specific deficiencies."
    },
    {
      q: "Is government and departmental data protected and secure?",
      a: "Yes, security is foundational. Pariksha AI adheres to enterprise-grade security protocols, including AES-256 encryption at rest and in transit, strict role-based access control (RBAC), and alignment with government data residency guidelines."
    },
    {
      q: "Can administrators generate customized quizzes from circulars & documents?",
      a: "Absolutely. With our AI Quiz Generator, training directors and officers can paste circular text, enter specific topics, or upload training guidelines to create calibrated quizzes with instant answer key generation and multi-tier difficulty levels."
    },
    {
      q: "Can officers re-take assessments to track competency improvement?",
      a: "Yes. After completing recommended courses, officers can take verified re-assessments. Their updated competency radar and deficit scores update in real time on the officer dashboard and administrative analytics."
    }
  ];

  return (
    <div className={`min-h-screen w-full max-w-full overflow-x-hidden bg-[#141210] text-[#f5f0eb] selection:bg-primary selection:text-white scroll-smooth ${inter.className}`}>
      
      {/* ========================================================================= */}
      {/* HERO SECTION                                                             */}
      {/* ========================================================================= */}
      <section className="relative min-h-[90vh] md:min-h-screen w-full max-w-full overflow-hidden flex flex-col items-center justify-start pb-16 sm:pb-20 md:pb-28">
        {/* Full-screen Background Video with Orange/Coral Color Shift */}
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{ filter: 'hue-rotate(125deg) saturate(1.35) contrast(1.08) brightness(0.95)' }}
          className="absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-1000 pointer-events-none"
        >
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260210_031346_d87182fb-b0af-4273-84d1-c6fd17d6bf0f.mp4" type="video/mp4" />
        </video>

        {/* Orange Brand Color Tint Blend Layer */}
        <div className="absolute inset-0 bg-[#f05a28]/20 mix-blend-color z-[1] pointer-events-none" />

        {/* Ambient Warm Dark Overlay for visual readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#141210]/60 via-[#141210]/20 to-[#141210] z-[1] pointer-events-none" />

        {/* Navbar */}
        <nav className={`relative z-30 w-full flex justify-between items-center px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 py-4 md:py-5 bg-transparent animate-fade-in ${manrope.className}`}>
          {/* Brand Logo */}
          <Link href="/landing" className="flex items-center gap-3 text-white font-bold text-lg sm:text-xl tracking-tight hover:opacity-90 hover:scale-[1.02] transition-all duration-200 shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-[10px] bg-white flex items-center justify-center overflow-hidden shadow-md shrink-0">
              <img src="/logo.png" alt="Pariksha AI Logo" className="w-full h-full object-cover block" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">Pariksha <span className="text-primary">AI</span></span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex gap-6 xl:gap-8 items-center">
            <a href="#hero" className="text-white/80 hover:text-primary-light text-[14px] font-medium transition-all duration-200 hover:-translate-y-0.5">Home</a>
            <a href="#features" className="text-white/80 hover:text-primary-light text-[14px] font-medium transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-1 group">
              Features
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-y-0.5 transition-transform duration-200"><path d="m6 9 6 6 6-6"/></svg>
            </a>
            <a href="#how-it-works" className="text-white/80 hover:text-primary-light text-[14px] font-medium transition-all duration-200 hover:-translate-y-0.5">How it Works</a>
            <a href="#testimonials" className="text-white/80 hover:text-primary-light text-[14px] font-medium transition-all duration-200 hover:-translate-y-0.5">Reviews</a>
            <a href="#faq" className="text-white/80 hover:text-primary-light text-[14px] font-medium transition-all duration-200 hover:-translate-y-0.5">FAQ</a>
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <button
              onClick={handleGetStarted}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2 rounded-[8px] text-[14px] font-semibold backdrop-blur-md transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={handleGetStarted}
              className="bg-primary hover:bg-[#ff7a4d] text-white px-5 py-2 rounded-[8px] text-[14px] font-semibold shadow-lg shadow-primary/30 transition-all duration-200 hover:shadow-primary/50 hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              Get Started
            </button>
          </div>

          {/* Mobile & Tablet Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-white p-2.5 rounded-lg bg-white/10 border border-white/20 backdrop-blur-md transition-transform active:scale-90 cursor-pointer flex items-center justify-center"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            )}
          </button>
        </nav>

        {/* Mobile & Tablet Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="absolute top-16 sm:top-20 left-0 right-0 z-40 w-full px-5 sm:px-8 py-5 bg-[#1a1613]/98 backdrop-blur-2xl border-b border-white/15 lg:hidden flex flex-col gap-3 animate-fade-in shadow-2xl">
            <a href="#hero" onClick={() => setMobileMenuOpen(false)} className="text-white hover:text-primary-light py-2 text-base font-medium transition-colors border-b border-white/5">Home</a>
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-white hover:text-primary-light py-2 text-base font-medium transition-colors border-b border-white/5">Features</a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-white hover:text-primary-light py-2 text-base font-medium transition-colors border-b border-white/5">How it Works</a>
            <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="text-white hover:text-primary-light py-2 text-base font-medium transition-colors border-b border-white/5">Reviews</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="text-white hover:text-primary-light py-2 text-base font-medium transition-colors">FAQ</a>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button onClick={handleGetStarted} className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-semibold text-sm transition-colors cursor-pointer">Sign In</button>
              <button onClick={handleGetStarted} className="w-full bg-primary hover:bg-[#ff7a4d] text-white py-3 rounded-xl font-semibold text-sm shadow-md shadow-primary/30 transition-colors cursor-pointer">Get Started</button>
            </div>
          </div>
        )}

        {/* Hero Central Content with Staggered Entrance Animations */}
        <div id="hero" className="relative z-10 flex flex-col items-center text-center mt-8 sm:mt-16 md:mt-20 px-3 sm:px-4 max-w-5xl mx-auto w-full">
          {/* Pill Badge */}
          <div
            style={{ animationDelay: '100ms' }}
            className={`opacity-0 animate-fade-in-up [animation-fill-mode:forwards] inline-flex items-center gap-2 bg-[rgba(65,45,35,0.6)] backdrop-blur-md border border-[rgba(240,90,40,0.35)] rounded-full py-1 px-3 sm:px-3.5 mb-5 sm:mb-6 text-white text-xs sm:text-[13.5px] font-medium shadow-sm transition-transform duration-300 hover:scale-105 ${cabin.className}`}
          >
            <span className="bg-primary px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold tracking-wide uppercase shadow-sm">New</span>
            <span className="text-white/90 truncate">Pariksha AI v2.0 • MoSPI Framework Aligned</span>
          </div>

          {/* Majestic Hero Headline with Warm Glowing Loop Animation */}
          <h1
            style={{ animationDelay: '200ms' }}
            className={`opacity-0 animate-fade-in-up [animation-fill-mode:forwards] text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[84px] leading-[1.1] sm:leading-[1.06] tracking-tight mb-5 sm:mb-6 max-w-4xl px-1 ${instrumentSerif.className}`}
          >
            <span className="inline-block animate-headline-loop bg-[linear-gradient(110deg,#ffffff,25%,#fed7aa,40%,#fb923c,50%,#f05a28,58%,#ffffff,72%,#ffffff)] bg-[length:200%_100%] bg-clip-text text-transparent select-none">
              Diagnose the gap <i className="italic font-light">and</i> personalize the path.
            </span>
          </h1>

          {/* Subtitle */}
          <p
            style={{ animationDelay: '300ms' }}
            className={`opacity-0 animate-fade-in-up [animation-fill-mode:forwards] text-[#d6cec7] text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl mb-7 sm:mb-8 leading-relaxed font-normal px-2 ${inter.className}`}
          >
            The AI-powered competency assessment platform designed to identify civil service skill gaps and generate personalized learning journeys for your team.
          </p>

          {/* Call to Action Buttons */}
          <div
            style={{ animationDelay: '400ms' }}
            className={`opacity-0 animate-fade-in-up [animation-fill-mode:forwards] flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto items-stretch sm:items-center justify-center px-2 ${cabin.className}`}
          >
            <button
              onClick={handleGetStarted}
              className="bg-primary text-white font-semibold text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl hover:bg-[#ff7a4d] transition-all duration-300 shadow-[0_10px_30px_rgba(240,90,40,0.4)] hover:shadow-[0_15px_40px_rgba(240,90,40,0.6)] hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Sign Up / Get Started</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
            <button
              onClick={handleGetStarted}
              className="bg-secondary/90 text-[#f6f7f9] font-medium text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl hover:bg-[#34241c] transition-all duration-300 border border-white/15 backdrop-blur-md hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore Dashboard</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            </button>
          </div>

          {/* ========================================================================= */}
          {/* UPLOADED DASHBOARD IMAGE SHOWCASE WITH AMBIENT ORANGE GLOW                */}
          {/* ========================================================================= */}
          <div
            style={{ animationDelay: '500ms' }}
            className="opacity-0 animate-fade-in-up [animation-fill-mode:forwards] mt-10 sm:mt-16 w-full max-w-5xl px-0 sm:px-2 z-10"
          >
            <div className="relative group animate-float">
              {/* Pulsing Ambient Orange Halo behind the preview image */}
              <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-primary/40 via-orange-400/30 to-primary/40 rounded-2xl sm:rounded-3xl blur-xl sm:blur-2xl animate-pulse-glow pointer-events-none -z-10" />

              {/* Mockup Frame / Glass Window Container */}
              <div className="relative rounded-xl sm:rounded-2xl p-2 sm:p-3.5 bg-gradient-to-b from-[#241c17]/95 via-[#1c1612]/95 to-[#141210]/98 backdrop-blur-2xl border border-white/20 shadow-[0_20px_70px_-15px_rgba(240,90,40,0.45)] overflow-hidden transition-all duration-500 group-hover:border-primary/50">
                {/* Browser Header Bar */}
                <div className="flex items-center justify-between px-2 sm:px-3 py-2 sm:py-2.5 mb-2 sm:mb-2.5 border-b border-white/10 gap-2">
                  {/* macOS dots */}
                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#ff5f56] inline-block shadow-sm" />
                    <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#ffbd2e] inline-block shadow-sm" />
                    <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#27c93f] inline-block shadow-sm" />
                  </div>

                  {/* Centered address pill */}
                  <div className={`hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/70 truncate ${manrope.className}`}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary shrink-0"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    <span className="truncate">pariksha.ai/dashboard/pathways</span>
                  </div>

                  {/* MoSPI Synchronized Pill */}
                  <div className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] sm:text-[11px] font-medium text-emerald-300 shrink-0 ${cabin.className}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>MoSPI Synced</span>
                  </div>
                </div>

                {/* Dashboard Image */}
                <div className="relative rounded-lg sm:rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-[#141210]">
                  <img
                    src="/hero-preview.png"
                    alt="Pariksha AI Personalized Learning Pathways Dashboard Preview"
                    className="w-full h-auto object-cover block transform transition-transform duration-700 ease-out group-hover:scale-[1.01]"
                  />
                  {/* Subtle inner top glare overlay */}
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/5 via-transparent to-black/20" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Smooth gradient transition at bottom of hero */}
        <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-[#141210] to-transparent pointer-events-none z-10" />
      </section>


      {/* ========================================================================= */}
      {/* SOCIAL PROOF & KEY METRICS STRIP                                          */}
      {/* ========================================================================= */}
      <section className="relative z-10 border-y border-white/10 bg-[#1a1613]/80 backdrop-blur-xl py-8 sm:py-10 px-4 sm:px-8 md:px-12">
        <Reveal>
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 text-center">
            <div className="flex flex-col items-center group transition-transform duration-300 hover:-translate-y-1 p-2">
              <span className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight ${cabin.className}`}>
                <AnimatedCounter end={98.4} decimals={1} suffix="%" duration={2000} />
              </span>
              <span className={`text-[#9a938c] text-[11px] sm:text-xs md:text-sm mt-1.5 ${inter.className}`}>Skill Gap Diagnostic Accuracy</span>
            </div>
            <div className="flex flex-col items-center group transition-transform duration-300 hover:-translate-y-1 p-2">
              <span className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary tracking-tight ${cabin.className}`}>
                <AnimatedCounter end={10} decimals={0} suffix="x" duration={1800} />
              </span>
              <span className={`text-[#9a938c] text-[11px] sm:text-xs md:text-sm mt-1.5 ${inter.className}`}>Faster Pathway Generation</span>
            </div>
            <div className="flex flex-col items-center group transition-transform duration-300 hover:-translate-y-1 p-2">
              <span className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight ${cabin.className}`}>
                <AnimatedCounter end={50000} decimals={0} suffix="+" duration={2200} />
              </span>
              <span className={`text-[#9a938c] text-[11px] sm:text-xs md:text-sm mt-1.5 ${inter.className}`}>Civil Servants Benchmarked</span>
            </div>
            <div className="flex flex-col items-center group transition-transform duration-300 hover:-translate-y-1 p-2">
              <span className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary-light tracking-tight ${cabin.className}`}>
                <AnimatedCounter end={100} decimals={0} suffix="%" duration={2000} />
              </span>
              <span className={`text-[#9a938c] text-[11px] sm:text-xs md:text-sm mt-1.5 ${inter.className}`}>iGOT Karmayogi Synced</span>
            </div>
          </div>
        </Reveal>
      </section>


      {/* ========================================================================= */}
      {/* FEATURES & BENEFITS SECTION                                               */}
      {/* ========================================================================= */}
      <section id="features" className="relative py-16 sm:py-24 px-4 sm:px-8 md:px-12 lg:px-16 max-w-7xl mx-auto">
        {/* Glow ambient background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[550px] md:w-[650px] h-[350px] bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-glow" />

        {/* Section Header */}
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 md:mb-20 px-2">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-orange-300 mb-3 sm:mb-4 ${cabin.className}`}>
              <span>Intelligent Core Features</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-4 sm:mb-5 tracking-tight ${instrumentSerif.className}`}>
              Diagnose with <i className="italic">AI precision</i>, bridge gaps with purpose.
            </h2>
            <p className={`text-[#9a938c] text-sm sm:text-base md:text-lg leading-relaxed ${inter.className}`}>
              Comprehensive tools designed specifically for civil service capacity building, MoSPI compliance, and continuous officer advancement.
            </p>
          </div>
        </Reveal>

        {/* Features Grid with Staggered Delays */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
          {/* Card 1: Gap Analysis */}
          <Reveal delay={100}>
            <div className="group relative h-full bg-[#1e1a17]/85 hover:bg-[#28221c]/95 backdrop-blur-xl border border-white/10 hover:border-primary/50 rounded-xl sm:rounded-2xl p-6 sm:p-8 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_20px_45px_-10px_rgba(240,90,40,0.3)] flex flex-col justify-between">
              <div>
                <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-xl sm:text-2xl mb-5 sm:mb-6 text-primary group-hover:scale-110 group-hover:bg-primary/25 transition-all duration-300">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                </div>
                <div className={`inline-block px-2.5 py-0.5 rounded-md bg-orange-500/10 border border-orange-500/20 text-xs font-medium text-orange-300 mb-3 ${cabin.className}`}>
                  Competency Auditing
                </div>
                <h3 className={`text-xl sm:text-2xl font-bold text-white mb-2.5 sm:mb-3 tracking-tight ${manrope.className}`}>
                  Multi-Dimensional Gap Analysis
                </h3>
                <p className={`text-[#9a938c] text-sm sm:text-base leading-relaxed mb-6 ${inter.className}`}>
                  Benchmark officer capabilities against official MoSPI competencies. Instantly isolate deficits in Statistical Methods, Survey Design, GIS, and Data Governance.
                </p>
              </div>
              <div className={`pt-4 border-t border-white/5 flex items-center justify-between text-xs text-white/50 ${manrope.className}`}>
                <span>Metric: 0-100 Benchmark Scale</span>
                <span className="text-primary font-semibold group-hover:translate-x-1.5 transition-transform duration-200">Learn more →</span>
              </div>
            </div>
          </Reveal>

          {/* Card 2: Personalized Pathways */}
          <Reveal delay={200}>
            <div className="group relative h-full bg-[#1e1a17]/85 hover:bg-[#28221c]/95 backdrop-blur-xl border border-white/10 hover:border-primary/50 rounded-xl sm:rounded-2xl p-6 sm:p-8 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_20px_45px_-10px_rgba(240,90,40,0.3)] flex flex-col justify-between">
              <div>
                <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-xl sm:text-2xl mb-5 sm:mb-6 text-primary group-hover:scale-110 group-hover:bg-primary/25 transition-all duration-300">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                </div>
                <div className={`inline-block px-2.5 py-0.5 rounded-md bg-orange-500/10 border border-orange-500/20 text-xs font-medium text-orange-300 mb-3 ${cabin.className}`}>
                  Curriculum Integration
                </div>
                <h3 className={`text-xl sm:text-2xl font-bold text-white mb-2.5 sm:mb-3 tracking-tight ${manrope.className}`}>
                  Automated Personalized Pathways
                </h3>
                <p className={`text-[#9a938c] text-sm sm:text-base leading-relaxed mb-6 ${inter.className}`}>
                  Dynamically rank and recommend iGOT Karmayogi, NSSO, and ISI Kolkata courses based on individual deficit severity, maximizing training ROI.
                </p>
              </div>
              <div className={`pt-4 border-t border-white/5 flex items-center justify-between text-xs text-white/50 ${manrope.className}`}>
                <span>Live iGOT Karmayogi Synced</span>
                <span className="text-primary font-semibold group-hover:translate-x-1.5 transition-transform duration-200">Learn more →</span>
              </div>
            </div>
          </Reveal>

          {/* Card 3: AI Quiz Generator */}
          <Reveal delay={150}>
            <div className="group relative h-full bg-[#1e1a17]/85 hover:bg-[#28221c]/95 backdrop-blur-xl border border-white/10 hover:border-primary/50 rounded-xl sm:rounded-2xl p-6 sm:p-8 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_20px_45px_-10px_rgba(240,90,40,0.3)] flex flex-col justify-between">
              <div>
                <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-xl sm:text-2xl mb-5 sm:mb-6 text-primary group-hover:scale-110 group-hover:bg-primary/25 transition-all duration-300">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path></svg>
                </div>
                <div className={`inline-block px-2.5 py-0.5 rounded-md bg-orange-500/10 border border-orange-500/20 text-xs font-medium text-orange-300 mb-3 ${cabin.className}`}>
                  Generative AI Engine
                </div>
                <h3 className={`text-xl sm:text-2xl font-bold text-white mb-2.5 sm:mb-3 tracking-tight ${manrope.className}`}>
                  Contextual AI Quiz Generator
                </h3>
                <p className={`text-[#9a938c] text-sm sm:text-base leading-relaxed mb-6 ${inter.className}`}>
                  Convert official circulars, census methodologies, or statutory documents into targeted diagnostic quizzes with automated multi-dimensional grading.
                </p>
              </div>
              <div className={`pt-4 border-t border-white/5 flex items-center justify-between text-xs text-white/50 ${manrope.className}`}>
                <span>Supports PDF, Text & Syllabus</span>
                <span className="text-primary font-semibold group-hover:translate-x-1.5 transition-transform duration-200">Learn more →</span>
              </div>
            </div>
          </Reveal>

          {/* Card 4: Actionable Insights */}
          <Reveal delay={250}>
            <div className="group relative h-full bg-[#1e1a17]/85 hover:bg-[#28221c]/95 backdrop-blur-xl border border-white/10 hover:border-primary/50 rounded-xl sm:rounded-2xl p-6 sm:p-8 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_20px_45px_-10px_rgba(240,90,40,0.3)] flex flex-col justify-between">
              <div>
                <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-xl sm:text-2xl mb-5 sm:mb-6 text-primary group-hover:scale-110 group-hover:bg-primary/25 transition-all duration-300">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                </div>
                <div className={`inline-block px-2.5 py-0.5 rounded-md bg-orange-500/10 border border-orange-500/20 text-xs font-medium text-orange-300 mb-3 ${cabin.className}`}>
                  Cadre Administration
                </div>
                <h3 className={`text-xl sm:text-2xl font-bold text-white mb-2.5 sm:mb-3 tracking-tight ${manrope.className}`}>
                  Administrative & Cadre Insights
                </h3>
                <p className={`text-[#9a938c] text-sm sm:text-base leading-relaxed mb-6 ${inter.className}`}>
                  Executive dashboards giving training heads real-time visibility into cadre readiness, benchmark closure rates, and departmental training progress.
                </p>
              </div>
              <div className={`pt-4 border-t border-white/5 flex items-center justify-between text-xs text-white/50 ${manrope.className}`}>
                <span>Exportable Audit Logs</span>
                <span className="text-primary font-semibold group-hover:translate-x-1.5 transition-transform duration-200">Learn more →</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* HOW IT WORKS SECTION                                                      */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="relative py-16 sm:py-24 px-4 sm:px-8 md:px-12 bg-gradient-to-b from-[#141210] via-[#1c1713] to-[#141210]">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <Reveal>
            <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20 px-2">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-orange-300 mb-3 sm:mb-4 ${cabin.className}`}>
                <span>The Methodology</span>
              </div>
              <h2 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-4 sm:mb-5 tracking-tight ${instrumentSerif.className}`}>
                A systematic pathway <i className="italic">to institutional mastery</i>.
              </h2>
              <p className={`text-[#9a938c] text-sm sm:text-base md:text-lg leading-relaxed ${inter.className}`}>
                A 3-step closed-loop cycle designed to elevate competencies rapidly with empirical validation.
              </p>
            </div>
          </Reveal>

          {/* Steps Timeline / Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative">
            {/* Step 1 */}
            <Reveal delay={100}>
              <div className="group relative h-full bg-[#1e1a17]/90 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-primary/50 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(240,90,40,0.25)] transition-all duration-300 ease-out">
                <div>
                  <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <div className={`w-11 sm:w-12 h-11 sm:h-12 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-lg sm:text-xl shadow-lg shadow-primary/40 group-hover:scale-110 transition-transform duration-300 ${cabin.className}`}>
                      01
                    </div>
                    <span className={`text-xs uppercase font-semibold text-orange-300 bg-orange-500/10 px-2.5 py-1 rounded-full border border-orange-500/20 ${cabin.className}`}>Diagnostic</span>
                  </div>
                  <h3 className={`text-xl sm:text-2xl font-bold text-white mb-2.5 sm:mb-3 tracking-tight ${manrope.className}`}>
                    Take the Assessment
                  </h3>
                  <p className={`text-[#9a938c] text-sm sm:text-base leading-relaxed ${inter.className}`}>
                    Complete a baseline diagnostic quiz evaluating your conceptual understanding and practical problem-solving in your specific cadre role.
                  </p>
                </div>
                <div className="mt-6 sm:mt-8 pt-4 border-t border-white/5 text-xs text-white/40">
                  Phase 1: Diagnostic Evaluation
                </div>
              </div>
            </Reveal>

            {/* Step 2 */}
            <Reveal delay={200}>
              <div className="group relative h-full bg-[#1e1a17]/90 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-primary/50 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(240,90,40,0.25)] transition-all duration-300 ease-out">
                <div>
                  <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <div className={`w-11 sm:w-12 h-11 sm:h-12 rounded-xl bg-[#241c17] text-orange-300 border border-orange-500/40 flex items-center justify-center font-bold text-lg sm:text-xl shadow-lg group-hover:scale-110 group-hover:border-primary/70 transition-transform duration-300 ${cabin.className}`}>
                      02
                    </div>
                    <span className={`text-xs uppercase font-semibold text-orange-300 bg-orange-500/10 px-2.5 py-1 rounded-full border border-orange-500/20 ${cabin.className}`}>Discovery</span>
                  </div>
                  <h3 className={`text-xl sm:text-2xl font-bold text-white mb-2.5 sm:mb-3 tracking-tight ${manrope.className}`}>
                    Review Your Gaps
                  </h3>
                  <p className={`text-[#9a938c] text-sm sm:text-base leading-relaxed ${inter.className}`}>
                    Analyze your customized radar chart to pinpoint exact skill deficits against the MoSPI benchmark standards.
                  </p>
                </div>
                <div className="mt-6 sm:mt-8 pt-4 border-t border-white/5 text-xs text-white/40">
                  Phase 2: Real-time Deficit Mapping
                </div>
              </div>
            </Reveal>

            {/* Step 3 */}
            <Reveal delay={300}>
              <div className="group relative h-full bg-[#1e1a17]/90 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-primary/50 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(240,90,40,0.25)] transition-all duration-300 ease-out">
                <div>
                  <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <div className={`w-11 sm:w-12 h-11 sm:h-12 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-lg sm:text-xl shadow-lg shadow-primary/40 group-hover:scale-110 transition-transform duration-300 ${cabin.className}`}>
                      03
                    </div>
                    <span className={`text-xs uppercase font-semibold text-orange-300 bg-orange-500/10 px-2.5 py-1 rounded-full border border-orange-500/20 ${cabin.className}`}>Mastery</span>
                  </div>
                  <h3 className={`text-xl sm:text-2xl font-bold text-white mb-2.5 sm:mb-3 tracking-tight ${manrope.className}`}>
                    Follow the Path
                  </h3>
                  <p className={`text-[#9a938c] text-sm sm:text-base leading-relaxed ${inter.className}`}>
                    Enroll in prioritized iGOT Karmayogi modules to close specific gaps, complete re-assessments, and earn verified certifications.
                  </p>
                </div>
                <div className="mt-6 sm:mt-8 pt-4 border-t border-white/5 text-xs text-white/40">
                  Phase 3: Targeted Upskilling
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* TESTIMONIALS / SOCIAL PROOF SECTION                                       */}
      {/* ========================================================================= */}
      <section id="testimonials" className="relative py-16 sm:py-24 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 md:mb-20 px-2">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-orange-300 mb-3 sm:mb-4 ${cabin.className}`}>
              <span>Endorsements & Impact</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-4 sm:mb-5 tracking-tight ${instrumentSerif.className}`}>
              Trusted by <i className="italic">officers & training leaders</i>.
            </h2>
            <p className={`text-[#9a938c] text-sm sm:text-base md:text-lg leading-relaxed ${inter.className}`}>
              See how civil servants and training authorities leverage Pariksha AI to transform capability development.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {/* Review 1 */}
          <Reveal delay={100}>
            <div className="group h-full bg-[#1e1a17]/85 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:border-primary/50 hover:-translate-y-1.5 transition-all duration-300 ease-out hover:shadow-[0_15px_35px_-10px_rgba(240,90,40,0.25)]">
              <div>
                {/* Stars */}
                <div className="flex gap-1 text-amber-400 mb-4 sm:mb-5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  ))}
                </div>
                <p className={`text-[#d6cec7] text-sm sm:text-base italic leading-relaxed mb-6 ${inter.className}`}>
                  "Pariksha AI completely transformed how we approach training. The targeted course recommendations saved our division hundreds of manual audit hours."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <div className={`w-9 sm:w-10 h-9 sm:h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary-light font-bold text-xs sm:text-sm group-hover:scale-105 transition-transform ${cabin.className}`}>
                  AM
                </div>
                <div>
                  <strong className={`block text-white text-xs sm:text-sm font-semibold ${manrope.className}`}>Anita M.</strong>
                  <span className="text-[#9a938c] text-[11px] sm:text-xs">Director of Training • MoSPI</span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Review 2 */}
          <Reveal delay={200}>
            <div className="group h-full bg-[#1e1a17]/85 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:border-primary/50 hover:-translate-y-1.5 transition-all duration-300 ease-out hover:shadow-[0_15px_35px_-10px_rgba(240,90,40,0.25)]">
              <div>
                <div className="flex gap-1 text-amber-400 mb-4 sm:mb-5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  ))}
                </div>
                <p className={`text-[#d6cec7] text-sm sm:text-base italic leading-relaxed mb-6 ${inter.className}`}>
                  "The AI Quiz Generator is incredible. We can convert complex survey methodology circulars into calibrated diagnostic assessments in under a minute."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <div className={`w-9 sm:w-10 h-9 sm:h-10 rounded-full bg-[#241c17] border border-white/20 flex items-center justify-center text-orange-300 font-bold text-xs sm:text-sm group-hover:scale-105 transition-transform ${cabin.className}`}>
                  RK
                </div>
                <div>
                  <strong className={`block text-white text-xs sm:text-sm font-semibold ${manrope.className}`}>Rahul K.</strong>
                  <span className="text-[#9a938c] text-[11px] sm:text-xs">Statistical Officer • Census Operations</span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Review 3 */}
          <Reveal delay={300}>
            <div className="group h-full bg-[#1e1a17]/85 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:border-primary/50 hover:-translate-y-1.5 transition-all duration-300 ease-out hover:shadow-[0_15px_35px_-10px_rgba(240,90,40,0.25)]">
              <div>
                <div className="flex gap-1 text-amber-400 mb-4 sm:mb-5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  ))}
                </div>
                <p className={`text-[#d6cec7] text-sm sm:text-base italic leading-relaxed mb-6 ${inter.className}`}>
                  "Aligning diagnostic deficits directly with iGOT Karmayogi curriculum creates an accountable, continuous learning loop across our departments."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <div className={`w-9 sm:w-10 h-9 sm:h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary-light font-bold text-xs sm:text-sm group-hover:scale-105 transition-transform ${cabin.className}`}>
                  SN
                </div>
                <div>
                  <strong className={`block text-white text-xs sm:text-sm font-semibold ${manrope.className}`}>Dr. S. Nair</strong>
                  <span className="text-[#9a938c] text-[11px] sm:text-xs">Senior Advisor • Capacity Building</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* FREQUENTLY ASKED QUESTIONS SECTION (ACCORDION)                            */}
      {/* ========================================================================= */}
      <section id="faq" className="relative py-16 sm:py-24 px-4 sm:px-8 md:px-12 bg-gradient-to-b from-[#141210] via-[#1a1613] to-[#141210]">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <Reveal>
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 px-2">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-orange-300 mb-3 sm:mb-4 ${cabin.className}`}>
                <span>Common Inquiries</span>
              </div>
              <h2 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-4 sm:mb-5 tracking-tight ${instrumentSerif.className}`}>
                Frequently asked <i className="italic">questions</i>.
              </h2>
              <p className={`text-[#9a938c] text-sm sm:text-base md:text-lg leading-relaxed ${inter.className}`}>
                Everything you need to know about competencies, curriculum matching, and platform capabilities.
              </p>
            </div>
          </Reveal>

          {/* FAQ Accordion List */}
          <Reveal delay={150}>
            <div className="flex flex-col gap-3.5 sm:gap-4">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className={`border rounded-xl sm:rounded-2xl transition-all duration-300 ease-out overflow-hidden ${
                      isOpen
                        ? 'bg-[#28221c] border-primary/50 shadow-[0_10px_30px_rgba(240,90,40,0.2)]'
                        : 'bg-[#1e1a17]/70 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex items-center justify-between p-4 sm:p-6 text-left cursor-pointer transition-colors duration-200 gap-3"
                    >
                      <span className={`text-sm sm:text-base md:text-lg font-semibold text-white ${manrope.className}`}>
                        {faq.q}
                      </span>
                      <span className={`w-7 sm:w-8 h-7 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ease-out ${
                        isOpen ? 'bg-primary text-white rotate-180' : 'bg-white/10 text-white/70'
                      }`}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                      </span>
                    </button>

                    {/* Smooth Height Expansion with CSS Grid */}
                    <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                      <div className="overflow-hidden">
                        <div className="px-4 sm:px-6 pb-5 sm:pb-6 pt-1 text-[#d6cec7] text-xs sm:text-sm md:text-base leading-relaxed border-t border-white/5">
                          {faq.a}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* BOTTOM CALL-TO-ACTION SECTION                                             */}
      {/* ========================================================================= */}
      <section className="relative py-16 sm:py-24 md:py-28 px-4 sm:px-8 md:px-12 overflow-hidden">
        {/* Ambient Backlight Mesh */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[600px] md:w-[800px] h-[350px] bg-gradient-to-r from-primary/30 via-orange-400/20 to-primary/30 rounded-full blur-[90px] pointer-events-none -z-10 animate-pulse-glow" />

        <Reveal>
          <div className="max-w-5xl mx-auto rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#28201a]/95 via-[#1e1814]/95 to-[#16120f]/98 border border-white/20 p-6 sm:p-10 md:p-14 text-center shadow-[0_25px_80px_-15px_rgba(240,90,40,0.35)] backdrop-blur-2xl transition-all duration-300 hover:border-primary/40">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/40 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-orange-200 mb-5 sm:mb-6 ${cabin.className}`}>
              <span>Start Upskilling Today</span>
            </div>

            <h2 className={`text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-4 sm:mb-6 tracking-tight ${instrumentSerif.className}`}>
              Ready to transform institutional <i className="italic">learning</i>?
            </h2>

            <p className={`text-[#d6cec7] text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2 ${inter.className}`}>
              Join forward-thinking officers and departments diagnosing deficits, closing gaps, and elevating national capability with Pariksha AI.
            </p>

            <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center ${cabin.className}`}>
              <button
                onClick={handleGetStarted}
                className="bg-primary hover:bg-[#ff7a4d] text-white font-semibold text-sm sm:text-base px-7 sm:px-9 py-3.5 sm:py-4 rounded-xl transition-all duration-200 shadow-xl shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] active:scale-95 w-full sm:w-auto cursor-pointer"
              >
                Sign Up / Get Started Now
              </button>
              <button
                onClick={handleGetStarted}
                className="bg-white/10 hover:bg-white/20 text-white font-medium text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl border border-white/20 transition-all duration-200 hover:scale-[1.02] active:scale-95 w-full sm:w-auto cursor-pointer"
              >
                Schedule Department Demo
              </button>
            </div>

            <div className={`mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[11px] sm:text-xs text-white/50 ${manrope.className}`}>
              <span className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><polyline points="20 6 9 17 4 12"></polyline></svg>
                No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Instant dashboard access
              </span>
              <span className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><polyline points="20 6 9 17 4 12"></polyline></svg>
                iGOT Karmayogi framework aligned
              </span>
            </div>
          </div>
        </Reveal>
      </section>


      {/* ========================================================================= */}
      {/* FOOTER                                                                    */}
      {/* ========================================================================= */}
      <footer className="relative border-t border-white/10 bg-[#0f0d0b] pt-12 sm:pt-16 pb-10 sm:pb-12 px-4 sm:px-8 md:px-12 text-[#9a938c]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8 sm:gap-12 mb-10 sm:mb-12">
          {/* Brand Info */}
          <div className="max-w-sm">
            <div className={`flex items-center gap-3 text-white font-bold text-lg sm:text-xl mb-3 sm:mb-4 ${manrope.className}`}>
              <div className="w-8 h-8 rounded-[9px] bg-white flex items-center justify-center overflow-hidden shadow-sm shrink-0">
                <img src="/logo.png" alt="Pariksha AI Logo" className="w-full h-full object-cover block" />
              </div>
              <span className="text-white font-bold text-lg tracking-tight">Pariksha <span className="text-primary">AI</span></span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-[#9a938c] mb-5 sm:mb-6">
              Diagnose the gap and personalize the path. The AI-powered competency management and skill audit platform for civil servants and government departments.
            </p>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] sm:text-xs text-white/70 ${manrope.className}`}>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>All Systems Operational • v2.0</span>
            </div>
          </div>

          {/* Navigation Links Columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 md:gap-12 text-xs sm:text-sm">
            <div className="flex flex-col gap-2.5 sm:gap-3">
              <h4 className={`text-white font-semibold text-xs tracking-wider uppercase ${cabin.className}`}>Platform</h4>
              <a href="#features" className="hover:text-primary-light transition-colors duration-200">Gap Analysis</a>
              <a href="#features" className="hover:text-primary-light transition-colors duration-200">Personalized Paths</a>
              <a href="#features" className="hover:text-primary-light transition-colors duration-200">Quiz Generator</a>
              <a href="#features" className="hover:text-primary-light transition-colors duration-200">Cadre Analytics</a>
            </div>

            <div className="flex flex-col gap-2.5 sm:gap-3">
              <h4 className={`text-white font-semibold text-xs tracking-wider uppercase ${cabin.className}`}>Resources</h4>
              <a href="#how-it-works" className="hover:text-primary-light transition-colors duration-200">How it Works</a>
              <a href="#testimonials" className="hover:text-primary-light transition-colors duration-200">Case Studies</a>
              <a href="#faq" className="hover:text-primary-light transition-colors duration-200">FAQ</a>
              <Link href="/dashboard" className="hover:text-primary-light transition-colors duration-200">Officer Portal</Link>
            </div>

            <div className="flex flex-col gap-2.5 sm:gap-3 col-span-2 sm:col-span-1">
              <h4 className={`text-white font-semibold text-xs tracking-wider uppercase ${cabin.className}`}>Institutional</h4>
              <a href="#" className="hover:text-primary-light transition-colors duration-200">MoSPI Compliance</a>
              <a href="#" className="hover:text-primary-light transition-colors duration-200">iGOT Framework</a>
              <a href="#" className="hover:text-primary-light transition-colors duration-200">Data Privacy</a>
              <a href="#" className="hover:text-primary-light transition-colors duration-200">Terms of Service</a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto pt-6 sm:pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] sm:text-xs text-[#9a938c]/70 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Pariksha AI. All rights reserved. Designed for Institutional Capacity Building.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <a href="#" className="hover:text-primary-light transition-colors duration-200">Privacy Policy</a>
            <a href="#" className="hover:text-primary-light transition-colors duration-200">Security Standards</a>
            <a href="#" className="hover:text-primary-light transition-colors duration-200">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
