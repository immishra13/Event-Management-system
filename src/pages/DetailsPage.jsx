import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import Navbar from '../components/Navbar';
import { Calendar, MapPin, User, ArrowLeft } from 'lucide-react';

const DetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const docRef = doc(db, 'events', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setEvent({ id: docSnap.id, ...docSnap.data() });
        }
        
        // Check if user is registered
        if (auth.currentUser) {
          const regQ = query(collection(db, 'registrations'), where('eventId', '==', id), where('userId', '==', auth.currentUser.uid));
          const regSnap = await getDocs(regQ);
          if (!regSnap.empty) {
            setIsRegistered(true);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchEventData();
  }, [id]);

  const handleRegister = async () => {
    if (!auth.currentUser) return navigate('/auth');
    setRegistering(true);
    try {
      await addDoc(collection(db, 'registrations'), {
        eventId: id,
        userId: auth.currentUser.uid,
        eventTitle: event.title,
        eventDate: event.date,
        registeredAt: new Date().toISOString()
      });
      setIsRegistered(true);
    } catch (e) {
      console.error(e);
    } finally {
      setRegistering(false);
    }
  };

  return (
    <>
      <div className="app-background"></div>
      <Navbar user={auth.currentUser} />
      
      <main className="container" style={{ paddingTop: '120px', paddingBottom: '100px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '24px' }}>
          <ArrowLeft size={16} /> Back
        </button>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}><div className="spinner"></div></div>
        ) : event ? (
          <div className="glass-panel" style={{ overflow: 'hidden' }}>
            <div style={{ height: '350px', background: event.bannerURL ? `url(${event.bannerURL}) center/cover` : 'rgba(255,255,255,0.05)', position: 'relative' }}>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '150px', background: 'linear-gradient(to top, rgba(15, 23, 42, 1), transparent)' }}></div>
            </div>
            
            <div style={{ padding: '40px', position: 'relative', top: '-40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px', marginBottom: '32px' }}>
                <div>
                  <h1 style={{ fontSize: '3rem', marginBottom: '16px', lineHeight: '1.2' }}>{event.title}</h1>
                  <div style={{ display: 'flex', gap: '24px', color: '#94a3b8', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={18} color="#c4b5fd" /> {event.date}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={18} color="#c4b5fd" /> {event.location}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><User size={18} color="#c4b5fd" /> Organized by {event.createdBy || 'Admin'}</div>
                  </div>
                </div>

                <div style={{ minWidth: '200px' }}>
                  <button onClick={handleRegister} disabled={isRegistered || registering} className={`btn ${isRegistered ? 'btn-glass' : 'btn-glow'} w-full`} style={{ width: '100%', padding: '16px 24px', fontSize: '1.1rem' }}>
                    {registering ? 'Registering...' : isRegistered ? 'You are Registered' : 'Register Now'}
                  </button>
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '32px' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>About this Event</h3>
                <p style={{ color: '#cbd5e1', lineHeight: '1.8', whiteSpace: 'pre-wrap', fontSize: '1.1rem' }}>{event.description}</p>
              </div>
            </div>
          </div>
        ) : (
          <div>Event not found.</div>
        )}
      </main>
    </>
  );
};

export default DetailsPage;
