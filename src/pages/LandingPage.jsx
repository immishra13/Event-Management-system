import React from 'react';
import { motion as Motion } from 'framer-motion';
import { ArrowRight, Sparkles, Calendar, Users, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const LandingPage = () => {
  return (
    <>
      <div className="app-background">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>
      
      <Navbar />

      <main style={{ paddingTop: '160px', paddingBottom: '100px', display: 'flex', flexDirection: 'column', gap: '120px' }}>
        
        {/* Hero Section */}
        <section className="container text-center" style={{ textAlign: 'center', position: 'relative' }}>
          <Motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)', borderRadius: '100px', color: '#c4b5fd', fontSize: '0.875rem', fontWeight: '600', marginBottom: '32px' }}>
              <Sparkles size={16} /> Welcome to the future of events
            </div>
            <h1 style={{ fontSize: '4.5rem', fontWeight: '800', lineHeight: '1.2', color: 'white', marginBottom: '24px', letterSpacing: '-0.03em' }}>
              Discover & Host <br /> <span className="text-gradient">Extraordinary Events</span>
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 48px', lineHeight: '1.6' }}>
              Cloud Event Hub is the premium platform for discovering experiences, managing registrations, and connecting with a vibrant community.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <Link to="/explore" className="btn btn-glow" style={{ padding: '16px 36px', fontSize: '1.1rem' }}>
                Explore Events <ArrowRight size={20} />
              </Link>
              <Link to="/auth" className="btn btn-glass" style={{ padding: '16px 36px', fontSize: '1.1rem' }}>
                Host an Event
              </Link>
            </div>
          </Motion.div>
        </section>

        {/* Features Glass Grid */}
        <section className="container">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Powerful <span className="text-gradient">Features</span></h2>
            <p style={{ color: '#94a3b8' }}>Everything you need to manage your events effortlessly.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
            
            <Motion.div whileHover={{ y: -10 }} className="glass-card" style={{ padding: '40px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(139, 92, 246, 0))', border: '1px solid rgba(139, 92, 246, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: '#c4b5fd' }}>
                <Calendar size={28} />
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Seamless Planning</h3>
              <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>Create and manage your events with our beautiful glass dashboard. Add banners, details, and schedules easily.</p>
            </Motion.div>

            <Motion.div whileHover={{ y: -10 }} className="glass-card" style={{ padding: '40px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(236, 72, 153, 0))', border: '1px solid rgba(236, 72, 153, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: '#fbcfe8' }}>
                <Users size={28} />
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Global Community</h3>
              <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>Reach millions of potential attendees. Allow users to register instantly with our robust backend system.</p>
            </Motion.div>

            <Motion.div whileHover={{ y: -10 }} className="glass-card" style={{ padding: '40px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(56, 189, 248, 0))', border: '1px solid rgba(56, 189, 248, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: '#bae6fd' }}>
                <Star size={28} />
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Premium Experience</h3>
              <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>Deliver an elite experience. Your attendees will love the modern glassmorphism design and smooth interactions.</p>
            </Motion.div>

          </div>
        </section>

      </main>
    </>
  );
};

export default LandingPage;
