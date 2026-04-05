import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import Navbar from '../components/Navbar';
import { Calendar, Ticket, MapPin, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('registered');
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!auth.currentUser) return;
      try {
        setLoading(true);
        // Fetch registered
        const regQ = query(collection(db, 'registrations'), where('userId', '==', auth.currentUser.uid));
        const regSnap = await getDocs(regQ);
        setRegisteredEvents(regSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        // Fetch my created events
        const myQ = query(collection(db, 'events'), where('createdBy', '==', auth.currentUser.displayName || auth.currentUser.email));
        const mySnap = await getDocs(myQ);
        setMyEvents(mySnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="app-background"></div>
      <Navbar user={auth.currentUser} />
      
      <main className="container" style={{ paddingTop: '140px', paddingBottom: '100px' }}>
        <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h1 style={{ fontSize: '3rem', marginBottom: '8px' }}>Your <span className="text-gradient">Dashboard</span></h1>
            <p style={{ color: '#94a3b8', fontSize: '1.2rem' }}>Welcome back, {auth.currentUser?.displayName || 'User'}</p>
          </div>
          
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', padding: '6px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <button 
              onClick={() => setActiveTab('registered')} 
              style={{ padding: '10px 24px', borderRadius: '12px', border: 'none', background: activeTab === 'registered' ? 'rgba(255,255,255,0.1)' : 'transparent', color: activeTab === 'registered' ? 'white' : '#94a3b8', cursor: 'pointer', transition: '0.2s', fontWeight: '500' }}>
              Registered Events
            </button>
            <button 
              onClick={() => setActiveTab('created')} 
              style={{ padding: '10px 24px', borderRadius: '12px', border: 'none', background: activeTab === 'created' ? 'rgba(255,255,255,0.1)' : 'transparent', color: activeTab === 'created' ? 'white' : '#94a3b8', cursor: 'pointer', transition: '0.2s', fontWeight: '500' }}>
              Hosted Events
            </button>
          </div>
        </div>

        {loading ? (
           <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}><div className="spinner"></div></div>
        ) : activeTab === 'registered' ? (
          <div>
            {registeredEvents.length === 0 ? (
              <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
                <Ticket size={48} style={{ margin: '0 auto 16px', color: '#64748b' }} />
                <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>No registrations yet</h3>
                <p style={{ color: '#94a3b8', marginBottom: '24px' }}>Discover exciting events and join the community.</p>
                <Link to="/explore" className="btn btn-glow">Explore Events</Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
                {registeredEvents.map(reg => (
                  <div key={reg.id} className="glass-card" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '1.3rem', marginBottom: '12px' }}>{reg.eventTitle}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', marginBottom: '8px' }}>
                      <Calendar size={16} color="#c4b5fd" /> {reg.eventDate}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontSize: '0.85rem', marginBottom: '24px' }}>
                      Registered on: {new Date(reg.registeredAt).toLocaleDateString()}
                    </div>
                    <Link to={`/event/${reg.eventId}`} className="btn btn-glass" style={{ width: '100%' }}>View Details</Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {myEvents.length === 0 ? (
              <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>You haven't hosted any events</h3>
                <p style={{ color: '#94a3b8', marginBottom: '24px' }}>Create an event to gather the community.</p>
                <Link to="/create" className="btn btn-glow">Create Event</Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px' }}>
                {myEvents.map(event => (
                  <div key={event.id} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <h3 style={{ fontSize: '1.3rem' }}>{event.title}</h3>
                      <span style={{ fontSize: '0.8rem', padding: '4px 10px', background: 'rgba(56, 189, 248, 0.1)', color: '#7dd3fc', borderRadius: '100px', border: '1px solid rgba(56,189,248,0.2)' }}>Hosted</span>
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={16} /> {event.date}</div>
                    <div style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={16} /> {event.location}</div>
                    <Link to={`/event/${event.id}`} className="btn btn-glass" style={{ marginTop: 'auto' }}>Manage Event <ExternalLink size={16} /></Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
};

export default Dashboard;
