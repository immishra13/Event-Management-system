import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth, storage } from '../firebase/config';
import Navbar from '../components/Navbar';
import { Calendar, MapPin, Type, Image as ImageIcon, Send } from 'lucide-react';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
  });
  const [banner, setBanner] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setBanner(e.target.files[0]);
      setBannerPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    setLoading(true);

    try {
      let bannerURL = '';
      if (banner) {
        const fileRef = ref(storage, `event_banners/${Date.now()}_${banner.name}`);
        const snapshot = await uploadBytes(fileRef, banner);
        bannerURL = await getDownloadURL(snapshot.ref);
      }

      await addDoc(collection(db, 'events'), {
        ...formData,
        bannerURL,
        createdBy: auth.currentUser.displayName || auth.currentUser.email,
        createdAt: new Date().toISOString()
      });

      navigate('/explore');
    } catch (err) {
      console.error("Error creating event: ", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="app-background"></div>
      <Navbar user={auth.currentUser} />
      
      <main className="container" style={{ paddingTop: '140px', paddingBottom: '100px', display: 'flex', justifyContent: 'center' }}>
        <div className="glass-panel" style={{ width: '100%', maxWidth: '800px', padding: '40px' }}>
          
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Host an <span className="text-gradient">Event</span></h1>
          <p style={{ color: '#94a3b8', marginBottom: '32px' }}>Fill in the details below to publish your event to the community.</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Image Upload Area */}
            <div style={{ position: 'relative', width: '100%', height: '200px', borderRadius: '16px', background: bannerPreview ? `url(${bannerPreview}) center/cover` : 'rgba(255,255,255,0.02)', border: '2px dashed rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden' }}>
              <input type="file" onChange={handleImageChange} accept="image/*" style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
              {!bannerPreview && (
                <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                  <ImageIcon size={32} style={{ margin: '0 auto 12px' }} />
                  <p>Click to upload event banner</p>
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', color: '#cbd5e1', fontWeight: '500' }}>Event Title</label>
                <div style={{ position: 'relative' }}>
                  <Type size={18} style={{ position: 'absolute', top: '16px', left: '16px', color: '#94a3b8' }} />
                  <input name="title" required value={formData.title} onChange={handleChange} className="glass-input" style={{ paddingLeft: '48px' }} placeholder="e.g. Design Tech Summit 2024" />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', color: '#cbd5e1', fontWeight: '500' }}>Location</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={18} style={{ position: 'absolute', top: '16px', left: '16px', color: '#94a3b8' }} />
                  <input name="location" required value={formData.location} onChange={handleChange} className="glass-input" style={{ paddingLeft: '48px' }} placeholder="City, Venue or Virtual" />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.9rem', color: '#cbd5e1', fontWeight: '500' }}>Date & Time</label>
              <div style={{ position: 'relative' }}>
                <Calendar size={18} style={{ position: 'absolute', top: '16px', left: '16px', color: '#94a3b8' }} />
                <input name="date" type="datetime-local" required value={formData.date} onChange={handleChange} className="glass-input" style={{ paddingLeft: '48px', colorScheme: 'dark' }} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.9rem', color: '#cbd5e1', fontWeight: '500' }}>Description</label>
              <textarea name="description" required value={formData.description} onChange={handleChange} className="glass-input" style={{ minHeight: '150px', resize: 'vertical' }} placeholder="What is this event about?"></textarea>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button type="submit" disabled={loading} className="btn btn-glow" style={{ padding: '16px 40px' }}>
                {loading ? <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div> : <><Send size={18} /> Publish Event</>}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default CreateEvent;
