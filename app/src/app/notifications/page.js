'use client';
import { useState } from 'react';
import { Bell, Check, Trash2, CheckCheck, BellOff } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead, deleteNotification, unreadCount } = useApp();
  const [filter, setFilter] = useState('all'); // 'all' | 'unread' | 'read'

  const filtered = filter === 'all'
    ? notifications
    : filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications.filter(n => n.read);

  return (
    <div className="fade-in" style={{ maxWidth: 800 }}>
      <div className="section-header mb-6">
        <div>
          <h1 className="section-title">Notifications</h1>
          <p className="section-subtitle">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        <button className="btn btn-outline" onClick={markAllNotificationsRead} disabled={unreadCount === 0}
          style={{ opacity: unreadCount === 0 ? 0.4 : 1 }}>
          <CheckCheck size={16} /> Mark all read
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[
          { key: 'all', label: `All (${notifications.length})` },
          { key: 'unread', label: `Unread (${notifications.filter(n => !n.read).length})` },
          { key: 'read', label: `Read (${notifications.filter(n => n.read).length})` },
        ].map(tab => (
          <button
            key={tab.key}
            className={`btn btn-sm ${filter === tab.key ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setFilter(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map(n => (
          <div key={n.id} className="card fade-in" style={{
            padding: 16,
            borderLeft: n.read ? 'none' : '3px solid var(--primary)',
            opacity: n.read ? 0.7 : 1,
            transition: 'all 250ms ease',
          }}>
            <div className="flex-between">
              <div
                style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, cursor: !n.read ? 'pointer' : 'default' }}
                onClick={() => { if (!n.read) markNotificationRead(n.id); }}
              >
                <Bell size={18} style={{ color: n.read ? 'var(--text-tertiary)' : 'var(--primary)', flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 14, fontWeight: n.read ? 400 : 500 }}>{n.text}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>{n.time}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                {!n.read && (
                  <button className="btn btn-ghost btn-sm" onClick={() => markNotificationRead(n.id)} title="Mark as read">
                    <Check size={14} />
                  </button>
                )}
                <button className="btn btn-ghost btn-sm" onClick={() => deleteNotification(n.id)} title="Delete"
                  style={{ color: 'var(--error)' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <BellOff size={48} />
          <h3>{filter === 'unread' ? 'No unread notifications' : 'No notifications'}</h3>
          <p>{filter === 'unread' ? 'You\'re all caught up!' : 'Notifications will appear here as you use the app.'}</p>
        </div>
      )}
    </div>
  );
}
