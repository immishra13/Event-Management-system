import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import Navbar from '../components/Navbar';

const ExplorerPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsRef = collection(db, 'events');
        const q = query(eventsRef, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const eventsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEvents(eventsData);
      } catch (err) {
        console.error("Failed to fetch events", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <>
      <div className="app-background"></div>
      <Navbar />

      <main className="container" style={{ paddingTop: '140px', paddingBottom: '100px' }}>
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '16px' }}>Upcoming <span className="text-gradient">Events</span></h1>
          <p style={{ color: '#94a3b8', fontSize: '1.2rem', maxWidth: '600px' }}>Discover trending events around the world and register to join them securely.</p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
            <div className="spinner"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>No events found</h3>
            <p style={{ color: '#94a3b8' }}>Check back later or host your own event!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px' }}>
            {events.map((event, i) => (
              <Motion.div 
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card"
                style={{ display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ height: '200px', width: '100%', background: event.bannerURL ? `url(${event.bannerURL}) center/cover` : 'rgba(255,255,255,0.05)', position: 'relative' }}>
                  {!event.bannerURL && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#94a3b8' }}>No Image</div>}
                </div>
                
                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>{event.title}</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px', color: '#94a3b8', fontSize: '0.95rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={16} color="#c4b5fd" /> {event.date}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={16} color="#c4b5fd" /> {event.location}
                    </div>
                  </div>
                  
                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>By {event.createdBy || 'Unknown'}</span>
                    <Link to={`/event/${event.id}`} className="btn btn-glow" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>
                      Details <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </Motion.div>
            ))}
          </div>
        )}
      </main>
    </>
  );
};

export default ExplorerPage;
