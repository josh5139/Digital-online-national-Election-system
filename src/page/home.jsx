import React, { useEffect, useState, useRef } from "react";
import { ShieldCheck, BarChart, Lock, Users, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [offsetY, setOffsetY] = useState(0);
  const [activeSection, setActiveSection] = useState("hero");

  // Animated counters
  const [votersCount, setVotersCount] = useState(0);
  const [votesCount, setVotesCount] = useState(0);
  const [candidatesCount, setCandidatesCount] = useState(0);

  // Section refs
  const heroRef = useRef();
  const featuresRef = useRef();
  const enbeRef = useRef();
  const statsRef = useRef();

  // Scroll listener for parallax & active section
  useEffect(() => {
    const handleScroll = () => {
      setOffsetY(window.pageYOffset);
      const heroTop = heroRef.current?.offsetTop || 0;
      const featuresTop = featuresRef.current?.offsetTop || 0;
      const enbeTop = enbeRef.current?.offsetTop || 0;
      const statsTop = statsRef.current?.offsetTop || 0;
      const scrollY = window.pageYOffset + 150;

      if (scrollY >= statsTop) setActiveSection("stats");
      else if (scrollY >= enbeTop) setActiveSection("enbe");
      else if (scrollY >= featuresTop) setActiveSection("features");
      else setActiveSection("hero");
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animate counters on mount
  useEffect(() => {
    const duration = 2000; // 2 sec
    let start = 0;
    const votersTarget = 12450;
    const votesTarget = 9850;
    const candidatesTarget = 350;

    const step = (timestamp) => {
      const progress = Math.min((start += 50), duration);
      setVotersCount(Math.floor((progress / duration) * votersTarget));
      setVotesCount(Math.floor((progress / duration) * votesTarget));
      setCandidatesCount(Math.floor((progress / duration) * candidatesTarget));
      if (progress < duration) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, []);

  const scrollToSection = (ref) => {
    window.scrollTo({ top: ref.current.offsetTop - 70, behavior: "smooth" });
  };

  return (
    <div className="w-full bg-gray-50 font-sans overflow-x-hidden">

      {/* HERO SECTION */}
      <section ref={heroRef} className="relative h-[600px] w-full overflow-hidden mt-16">
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(25)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-yellow-400 rounded-full absolute"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 600, opacity: [0, 1, 0] }}
              transition={{ duration: 8 + i, repeat: Infinity, delay: i * 0.2 }}
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}px` }}
            />
          ))}
        </div>

        {/* Hero background image */}
        <motion.img
          src="/src/assets/istockphoto-2000065331-2048x2048.jpg"
          alt="election hero"
          style={{ transform: `translateY(${offsetY * 0.3}px)` }}
          className="absolute inset-0 w-full h-full object-cover scale-105 transition-transform duration-500"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
        />

        {/* Hero content */}
        <div className="absolute inset-0 bg-gradient-to-r from-green/90 via-black/40 to-transparent flex flex-col justify-center px-6 md:px-16">
          <motion.h1
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-blue-400 text-4xl md:text-5xl font-extrabold drop-shadow-lg hover:drop-shadow-xl cursor-default"
          >
            Transparent & Secure & Modern Elections
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-gray-200 text-lg mt-3 md:mt-5"
          >
            Experience Ethiopia’s first fully digital and transparent election system.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-6 flex gap-4 flex-wrap"
          >
            <a
              href="/register"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg transition transform hover:-translate-y-1 hover:scale-105"
            >
              Create Account
            </a>
            <a
              href="#features"
              className="px-6 py-3 bg-white/20 backdrop-blur rounded-xl text-white border border-white/30 hover:bg-white/30 transition transform hover:-translate-y-1 hover:scale-105"
            >
              Learn More
            </a>
          </motion.div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section ref={featuresRef} className="max-w-7xl mx-auto py-16 px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard
          icon={<ShieldCheck className="w-10 h-10 text-blue-400" />}
          title="Digital Voting"
          desc="Secure, fast, and reliable electronic voting powered by modern authentication."
          offsetY={offsetY}
        />
        <FeatureCard
          icon={<BarChart className="w-10 h-10 text-green-400" />}
          title="Real-Time Results"
          desc="Accurate preliminary results displayed instantly with live updates."
          offsetY={offsetY}
        />
        <FeatureCard
          icon={<Lock className="w-10 h-10 text-purple-400" />}
          title="Transparency"
          desc="End-to-end encrypted votes ensuring integrity and confidence."
          offsetY={offsetY}
        />
      </section>

      {/* ENBE SECTION */}
      <section ref={enbeRef} className="bg-white py-16 px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-10"
        >
          ENBE - Ethiopia National Election Board
        </motion.h2>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-center">
          <FadeCard
            icon={<ShieldCheck className="w-8 h-8 mx-auto text-blue-400" />}
            title="Our Vision"
            desc="To conduct transparent, inclusive, and credible elections fostering democracy across Ethiopia."
            offsetY={offsetY}
          />
          <FadeCard
            icon={<Lock className="w-8 h-8 mx-auto text-green-400" />}
            title="Our Mission"
            desc="To implement secure digital election systems with integrity, fairness, and accessibility for all citizens."
            offsetY={offsetY}
          />
          <FadeCard
            icon={<Users className="w-8 h-8 mx-auto text-purple-400" />}
            title="About Us"
            desc="ENBE is Ethiopia's official election authority, dedicated to modernizing election processes while ensuring transparency and trust."
            offsetY={offsetY}
          />
        </div>
      </section>

      {/* STATISTICS SECTION */}
      <section ref={statsRef} className="bg-gray-100 py-16 px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Election Statistics</h2>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-center">
          <StatCard icon={<Users className="w-10 h-10 mx-auto" />} count={votersCount} label="Registered Voters" />
          <StatCard icon={<CheckCircle2 className="w-10 h-10 mx-auto" />} count={votesCount} label="Votes Cast" />
          <StatCard icon={<BarChart className="w-10 h-10 mx-auto" />} count={candidatesCount} label="Candidates" />
        </div>
      </section>
    </div>
  );
}

/* FEATURE CARD COMPONENT */
function FeatureCard({ icon, title, desc, offsetY }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05, boxShadow: "0px 15px 35px rgba(0,0,0,0.2)" }}
      transition={{ duration: 0.8 }}
      style={{ transform: `translateY(${offsetY * 0.02}px)` }}
      className="bg-black/55 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-transparent hover:border-blue-400 transition transform"
    >
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="font-bold text-xl text-center mb-2">{title}</h3>
      <p className="text-gray-200 text-center">{desc}</p>
    </motion.div>
  );
}

/* FADE CARD COMPONENT */
function FadeCard({ icon, title, desc, offsetY }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05 }}
      style={{ transform: `translateY(${offsetY * 0.03}px)` }}
      className="p-6 bg-gray-50 rounded-xl shadow-lg transition transform hover:shadow-2xl border border-transparent hover:border-blue-400"
    >
      {icon && <div className="mb-4">{icon}</div>}
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <p>{desc}</p>
    </motion.div>
  );
}

/* STAT CARD COMPONENT */
function StatCard({ icon, count, label }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05, boxShadow: "0px 20px 40px rgba(0,0,0,0.2)" }}
      transition={{ duration: 0.8 }}
      className="bg-yellow p-6 rounded-xl shadow-lg"
    >
      <div>{icon}</div>
      <h3 className="text-3xl font-bold mt-4">{count.toLocaleString()}</h3>
      <p className="text-gray-600 mt-2">{label}</p>
    </motion.div>
  );
}
