import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Scene3D from './components/Scene3D';
import AgentChat from './components/AgentChat';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const heroRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  // Refs for staggers
  const processRef = useRef<HTMLDivElement>(null);
  const portfolioRef = useRef<HTMLDivElement>(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("https://formspree.io/f/mbddjynj", {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        navigate('/success');
      } else {
        console.error("Transmission failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero Sequence (Load Animation)
      const tl = gsap.timeline();

      tl.fromTo(navRef.current,
        { y: -100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power4.out',
          delay: 0.2
        }
      )
        .fromTo("h1 .line-inner",
          { y: 120, opacity: 0, skewY: 7 },
          {
            y: 0,
            opacity: 1,
            skewY: 0,
            duration: 1.5,
            stagger: 0.1,
            ease: 'power4.out'
          }, "-=0.5")
        .fromTo(".hero-scroll-btn",
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out"
          }, "-=1");

      // 4. Contact Section Reveal
      gsap.fromTo("#contact-content",
        { y: 40, opacity: 0 },
        {
          scrollTrigger: {
            trigger: "#contact",
            start: "top 75%",
          },
          y: 0,
          opacity: 1,
          duration: 1.5,
          ease: "power4.out"
        }
      );

    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-onyx text-white font-sans min-h-screen selection:bg-gold-accent selection:text-black overflow-hidden">
      {/* Background Noise with higher contrast */}
      <div className="fixed inset-0 w-full h-full opacity-[0.03] pointer-events-none z-[9999] mix-blend-overlay"
        style={{ backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')` }}></div>

      {/* Navigation */}
      <nav ref={navRef} className="fixed top-0 w-full px-6 md:px-16 py-6 flex justify-between items-center z-50 backdrop-blur-2xl bg-onyx/80 border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] opacity-0">
        <div className="font-extrabold text-lg tracking-[2px] text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] z-50 relative">
          ONYX <span className="text-gold-accent drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">&</span> CODE
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-10 absolute left-1/2 -translate-x-1/2">
          {['PROCESS', 'PORTFOLIO', 'CONTACT'].map((item) => (
            <li key={item}>
              <a href={`#${item.toLowerCase()}`} className="text-xs font-bold tracking-[2px] text-gray-400 hover:text-white transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
                {item}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-6">
          <a href="#contact" className="hidden md:inline-block group relative p-[1px] rounded-lg overflow-hidden cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.1)] hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] transition-shadow duration-500">
            <div className="absolute inset-[-100%] w-[300%] h-[300%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent,var(--color-gold-accent),transparent_50%)] group-hover:bg-[conic-gradient(from_0deg,transparent,#fff,transparent_50%)]"></div>
            <div className="relative z-10 bg-onyx-light px-6 py-2.5 rounded-[7px] text-xs font-bold uppercase tracking-wider text-white group-hover:bg-black transition-colors border border-white/5">
              Start Project
            </div>
          </a>

          {/* Mobile Burger Button */}
          <button
            className="md:hidden text-white z-[100] relative w-8 h-8 flex flex-col justify-center gap-1.5"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className={`block w-full h-0.5 bg-gold-accent transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-full h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-full h-0.5 bg-gold-accent transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`fixed inset-0 bg-onyx/90 backdrop-blur-xl z-[90] transition-all duration-500 flex flex-col justify-start items-center gap-10 pt-48 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
          {/* Menu Branding */}
          <div className="font-extrabold text-2xl tracking-[4px] text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] mb-8">
            ONYX <span className="text-gold-accent drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">&</span> CODE
          </div>

          {['PROCESS', 'PORTFOLIO', 'CONTACT'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-4xl font-extrabold tracking-[2px] text-white/50 hover:text-white transition-all duration-300 hover:scale-105"
              onClick={() => setIsMenuOpen(false)}
            >
              {item}
            </a>
          ))}
        </div>
      </nav>

      {/* GLOBAL 3D LAYER - Preserved across scroll and menu states */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Mobile: Centered. Desktop: Right Side */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[60vh] md:top-0 md:left-auto md:right-0 md:translate-x-0 md:translate-y-0 md:w-1/2 md:h-full">
          <Scene3D />
        </div>
      </div>

      {/* Main Content Wrapper - Fades out when menu is open */}
      <main className={`relative z-10 transition-opacity duration-300 ${isMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="container mx-auto px-6 md:px-12 max-w-7xl relative">
          {/* Hero Section */}
          <section className="pt-48 pb-20 relative" ref={heroRef}>

            <h1 className="text-6xl md:text-9xl font-extrabold tracking-tighter leading-tight drop-shadow-2xl relative z-20">
              <div className="overflow-hidden py-2">
                <span className="line-inner block opacity-0">Architecting</span>
              </div>
              <div className="overflow-hidden py-2">
                <span className="line-inner block text-transparent bg-clip-text bg-gradient-to-r from-gold-accent to-white drop-shadow-[0_0_30px_rgba(212,175,55,0.15)] opacity-0">
                  Digital Luxury.
                </span>
              </div>
            </h1>
          </section>

          {/* Tech Marquee */}
          <div className="overflow-hidden py-12 border-y border-white/10 mt-8 mb-32 bg-white/[0.015] hero-scroll-btn opacity-0">
            <div className="flex gap-20 animate-scroll w-max">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex gap-20">
                  {['REACT', 'THREE.JS', 'GEMINI AI', 'TAILWIND', 'ANTIGRAVITY', 'NEXT.JS', 'WEBGL', 'TYPESCRIPT'].map((tech) => (
                    <span key={tech} className="font-mono text-xs tracking-[4px] text-gray-500 uppercase drop-shadow-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Blueprint / Process Cards */}
          <section id="process" className="pt-20" ref={processRef}>
            <span className="font-mono text-xs text-gold-accent opacity-80 tracking-[4px] block mb-8 drop-shadow-[0_0_5px_rgba(212,175,55,0.4)]">
                // CORE_PROTOCOL_01
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {[
                { id: '01', title: 'Strategic Discovery', desc: 'Dissecting business models to build foundations for high-traffic AI interactions.' },
                { id: '02', title: 'Precision Design', desc: 'Executive-standard builds using optimized frameworks and immersive 3D spatial orchestration.' },
                { id: '03', title: 'Visual Excellence', desc: 'Polishing user journeys with physics, motion, and lighting that defines the premium brand.' }
              ].map((step) => (
                <div key={step.id} className="process-card h-full bg-onyx-light p-12 md:p-12 border border-white/10 hover:border-gold-accent/50 transition-all duration-500 hover:-translate-y-2 shadow-lg hover:shadow-2xl hover:shadow-gold-accent/10 rounded-xl backdrop-blur-sm group flex flex-col justify-center">
                  <span className="font-mono text-gold-accent text-xs tracking-widest block mb-6 px-3 py-1 bg-gold-accent/10 w-fit rounded group-hover:bg-gold-accent group-hover:text-black transition-colors">
                    {step.id}_PHASE
                  </span>
                  <h3 className="text-2xl font-bold mb-4 tracking-tight text-white group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">{step.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed group-hover:text-white transition-colors">{step.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Portfolio Section */}
          <section id="portfolio" className="pt-40" ref={portfolioRef}>
            <h2 className="text-4xl font-bold tracking-tight mb-16 border-l-4 border-gold-accent pl-6 drop-shadow-lg">
              Selected Systems
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
              {[
                {
                  title: 'Areva WCS™',
                  desc: 'Industrial 3D Digital Twin & AI orchestration.',
                  img: 'https://i.imgur.com/21V0SHu.jpeg',
                  link: 'https://areva-automation.vercel.app'
                },
                {
                  title: 'Grooming Room No. 1',
                  desc: 'Luxury service management portal.',
                  img: 'https://images.pexels.com/photos/1319461/pexels-photo-1319461.jpeg?auto=compress&cs=tinysrgb&w=800',
                  link: 'https://muchona.github.io/grooming-room/'
                },
                {
                  title: 'NexGen Chat App',
                  desc: 'Real-time encrypted AI communication.',
                  img: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800',
                  link: 'https://www.behance.net/gallery/240092459/Landing-page-for-Chat-App'
                },
                {
                  title: 'Learning Platform',
                  desc: 'Adaptive EdTech spatial learning environment.',
                  img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800',
                  link: 'https://author-ripen-65928570.figma.site/'
                }
              ].map((project) => (
                <a href={project.link} target="_blank" rel="noopener noreferrer" key={project.title} className="project-card group block">
                  <div className="w-full aspect-video bg-onyx-light border border-white/10 rounded-2xl overflow-hidden mb-8 relative shadow-2xl transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] group-hover:border-white/20">
                    <div className="absolute inset-0 bg-gold-accent/0 group-hover:bg-gold-accent/5 transition-colors duration-500 z-10"></div>
                    <img
                      src={project.img}
                      alt={project.title}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out grayscale group-hover:grayscale-0"
                    />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-gold-accent transition-colors drop-shadow-md">{project.title}</h3>
                  <p className="text-gray-500 text-sm group-hover:text-gray-300 transition-colors">{project.desc}</p>
                </a>
              ))}
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="py-48 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32">
            <div id="contact-content">
              <h2 className="text-6xl md:text-8xl font-extrabold tracking-tighter leading-[0.9] mb-8 drop-shadow-2xl">
                Ready for<br />Deployment?
              </h2>
              <p className="text-gray-400 max-w-sm leading-relaxed text-lg">
                Upload your assets or project specifications to initialize the protocol.
                Our agents are standing by.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-8" id="contact-form">
              <div className="group">
                <input type="text" name="name" placeholder="Authorized Name" required className="w-full bg-transparent border-b border-white/20 py-4 text-white placeholder-gray-500 outline-none focus:border-gold-accent focus:bg-white/[0.02] transition-colors text-lg" />
              </div>

              <div className="group">
                <input type="email" name="email" placeholder="Business Email" required className="w-full bg-transparent border-b border-white/20 py-4 text-white placeholder-gray-500 outline-none focus:border-gold-accent focus:bg-white/[0.02] transition-colors text-lg" />
              </div>
              <div className="group">
                <textarea name="message" rows={4} placeholder="System Requirements / Brief..." required className="w-full bg-transparent border-b border-white/20 py-4 text-white placeholder-gray-500 outline-none focus:border-gold-accent focus:bg-white/[0.02] transition-colors text-lg resize-none"></textarea>
              </div>

              <label className="border border-dashed border-white/20 hover:border-gold-accent/60 bg-white/5 hover:bg-white/10 rounded-xl p-10 text-center cursor-pointer transition-all duration-300 group shadow-inner">
                <span className="text-sm text-gray-500 group-hover:text-white transition-colors">Attach 3D Blueprints / Brief (PDF, ZIP, OBJ)</span>
                <input type="file" name="upload" className="hidden" />
              </label>

              <button type="submit" className="w-fit shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:shadow-[0_0_35px_rgba(212,175,55,0.4)] transition-shadow duration-500 rounded-lg">
                <div className="relative group overflow-hidden rounded-lg p-[1px]">
                  <div className="absolute inset-[-100%] w-[300%] h-[300%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent,var(--color-gold-accent),transparent_50%)]"></div>
                  <div className="relative bg-onyx px-10 py-4 rounded-[7px] border border-white/10">
                    <span className="font-bold text-sm tracking-widest uppercase text-white group-hover:text-gold-accent transition-colors">
                      Initialize Protocol
                    </span>
                  </div>
                </div>
              </button>
            </form>
          </section>
        </div>

        {/* Footer */}
        <footer className="border-t border-white/10 py-12 text-center bg-onyx-light/30">
          <p className="text-gray-600 text-xs font-mono tracking-widest uppercase mb-2">
            © {new Date().getFullYear()} ONYX & CODE. All rights reserved.
          </p>
          <p className="text-gray-700 text-[10px] tracking-widest opacity-50">
            SECURED BY ANTIGRAVITY
          </p>
        </footer>

        <AgentChat />
      </main>
    </div>
  );
}
