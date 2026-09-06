'use client';
import { useState } from 'react';
import { MessageSquare, Send, ThumbsUp, Tag, User, Sparkles, Filter, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function CollaborationPage() {
  const { currentUser, collaborationMessages, addCollaborationMessage } = useApp();
  const [newPost, setNewPost] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [likes, setLikes] = useState({});
  const [postedSuccess, setPostedSuccess] = useState(false);

  const tags = ['All', 'Survey Design', 'Data Science', 'GIS & Spatial', 'Official Statistics', 'NSS Guidelines'];

  const defaultDiscussions = [
    {
      id: 101,
      user: 'Priya Nair',
      role: 'Senior Statistical Officer • NSS',
      avatar: 'PN',
      time: '15 minutes ago',
      tag: 'GIS & Spatial',
      title: 'Handling Boundary Inconsistencies in District-Level GIS Mapping',
      text: 'For the upcoming economic census, we noticed several new sub-districts formed in 2024. Anyone know if the MoSPI shapefile repository has been updated with the latest LGD codes?',
      likes: 12,
      replies: 4,
    },
    {
      id: 102,
      user: 'Amit Verma',
      role: 'Director • Economic Statistics',
      avatar: 'AV',
      time: '1 hour ago',
      tag: 'Survey Design',
      title: 'Probability Proportional to Size (PPS) with Replacement vs WOR in NSS 80th Round',
      text: 'Just finished testing the sample allocation variance. When stratified by rural/urban clusters, PPSWOR reduces design effect by 18% compared to standard circular systematic sampling.',
      likes: 24,
      replies: 8,
    },
    {
      id: 103,
      user: 'Dr. Ramesh Raman',
      role: 'Consultant • NITI Aayog',
      avatar: 'RR',
      time: '3 hours ago',
      tag: 'Data Science',
      title: 'Python for Statistical Officers: Using Pandas and Polars on 50M+ Records',
      text: 'Highly recommend the new iGOT module on Polars. For census microdata with millions of rows, memory overhead dropped from 14GB in Pandas to just 2.1GB in Polars.',
      likes: 31,
      replies: 12,
    },
    {
      id: 104,
      user: 'Sneha Patel',
      role: 'Field Investigator • Social Statistics',
      avatar: 'SP',
      time: '5 hours ago',
      tag: 'Official Statistics',
      title: 'Tips for Reducing Field Non-Response in Urban Consumer Expenditure Surveys',
      text: 'We conducted callback visits during weekend evening hours (6pm–8pm) instead of afternoon hours and reduced refusal rates from 22% to under 7%. Sharing questionnaire protocol below.',
      likes: 19,
      replies: 6,
    },
  ];

  const handleLike = (id) => {
    setLikes(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const handlePost = (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    addCollaborationMessage(newPost);
    setNewPost('');
    setPostedSuccess(true);
    setTimeout(() => setPostedSuccess(false), 3000);
  };

  const filteredDiscussions = selectedTag === 'All'
    ? defaultDiscussions
    : defaultDiscussions.filter(d => d.tag === selectedTag);

  return (
    <div className="fade-in">
      <div className="section-header mb-6">
        <div>
          <h1 className="section-title">Peer Discussion & Community Hub</h1>
          <p className="section-subtitle">Connect with 300+ statistical officers across MoSPI, NSSO, and state directorates</p>
        </div>
      </div>

      {/* Share Insight / Question Box */}
      <div className="card mb-6" style={{ background: 'var(--bg-surface)' }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <div className="header-avatar" style={{ width: 44, height: 44, fontSize: 16 }}>
            {currentUser.avatar}
          </div>
          <form onSubmit={handlePost} style={{ flex: 1 }}>
            <textarea
              rows={3}
              placeholder={`Share an insight, question, or study tip as ${currentUser.name}...`}
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              style={{ width: '100%', resize: 'vertical', marginBottom: 12 }}
            />
            <div className="flex-between" style={{ flexWrap: 'wrap', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span className="tag tag-priority" style={{ fontSize: 11 }}>
                  Posting as: {currentUser.role}
                </span>
                {postedSuccess && (
                  <span style={{ color: 'var(--success)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <CheckCircle2 size={14} /> Shared with community!
                  </span>
                )}
              </div>
              <button type="submit" className="btn btn-primary btn-sm" disabled={!newPost.trim()}>
                <Send size={14} /> Share Post
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Topic Filter Chips */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: 20 }}>
        {tags.map(tag => (
          <button
            key={tag}
            className={`btn btn-sm ${selectedTag === tag ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setSelectedTag(tag)}
            style={{ borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap' }}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Real-time AppContext user messages if any */}
      {collaborationMessages && collaborationMessages.length > 0 && (
        <div className="mb-6">
          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            ⚡ Recent Live Activity
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {collaborationMessages.map(msg => (
              <div key={msg.id} className="card" style={{ borderLeft: '3px solid var(--primary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="header-avatar" style={{ width: 32, height: 32, fontSize: 13 }}>
                      {msg.avatar || 'SO'}
                    </div>
                    <div>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{msg.user}</span>
                      <span style={{ color: 'var(--text-tertiary)', fontSize: 12, marginLeft: 8 }}>{msg.time}</span>
                    </div>
                  </div>
                  <span className="tag tag-easy" style={{ fontSize: 10 }}>Live Update</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.5 }}>
                  {msg.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Curated Statistical Discussions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {filteredDiscussions.map(item => (
          <div key={item.id} className="card" style={{ transition: 'transform 150ms ease' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="header-avatar" style={{ width: 38, height: 38, fontSize: 14 }}>
                  {item.avatar}
                </div>
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 700 }}>{item.user}</h4>
                  <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{item.role} • {item.time}</p>
                </div>
              </div>
              <span className="tag tag-priority" style={{ fontSize: 11 }}>
                {item.tag}
              </span>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>
              {item.title}
            </h3>

            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
              {item.text}
            </p>

            <div className="flex-between" style={{ borderTop: '1px solid var(--border-light)', paddingTop: 12, flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => handleLike(item.id)}
                  style={{ color: likes[item.id] ? 'var(--primary)' : 'var(--text-secondary)' }}
                >
                  <ThumbsUp size={14} />
                  {item.likes + (likes[item.id] || 0)} Helpful
                </button>
                <button className="btn btn-ghost btn-sm" style={{ color: 'var(--text-secondary)' }}>
                  <MessageSquare size={14} />
                  {item.replies} Replies
                </button>
              </div>
              <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                MoSPI Knowledge Network
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
