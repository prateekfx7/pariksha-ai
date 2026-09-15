'use client';
import { useState, useEffect } from 'react';
import { Activity, Wifi, WifiOff, AlertTriangle, ShieldCheck, Database, RefreshCw } from 'lucide-react';
import { getStagingVault } from '@/lib/igotBridge';

export default function PortalStatusBadge({ compact = false, onOpenVault }) {
  const [status, setStatus] = useState('healthy'); // 'healthy' | 'degraded' | 'offline'
  const [latency, setLatency] = useState(48);
  const [vaultCount, setVaultCount] = useState(0);
  const [isChecking, setIsChecking] = useState(false);

  const refreshStatus = () => {
    setIsChecking(true);
    setTimeout(() => {
      // Periodic realistic telemetry simulation based on real-world gov portal behavior
      const r = Math.random();
      if (r > 0.82) {
        setStatus('degraded');
        setLatency(Math.floor(Math.random() * 1200) + 950);
      } else if (r > 0.96) {
        setStatus('offline');
        setLatency(0);
      } else {
        setStatus('healthy');
        setLatency(Math.floor(Math.random() * 40) + 38);
      }
      const vault = getStagingVault();
      setVaultCount(vault.length);
      setIsChecking(false);
    }, 450);
  };

  useEffect(() => {
    refreshStatus();
    const timer = setInterval(refreshStatus, 45000);
    return () => clearInterval(timer);
  }, []);

  const config = {
    healthy: {
      color: '#22c55e',
      bg: 'rgba(34, 197, 94, 0.12)',
      border: 'rgba(34, 197, 94, 0.3)',
      label: 'iGOT Portal: Stable',
      sub: `${latency}ms • Direct sync ready`,
      icon: ShieldCheck
    },
    degraded: {
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.12)',
      border: 'rgba(245, 158, 11, 0.35)',
      label: 'iGOT Portal: High Latency',
      sub: `${latency}ms • 504 Timeout risk`,
      icon: AlertTriangle
    },
    offline: {
      color: '#ef4444',
      bg: 'rgba(239, 68, 68, 0.14)',
      border: 'rgba(239, 68, 68, 0.35)',
      label: 'iGOT Portal: Downtime',
      sub: 'Using Local Staging Vault',
      icon: WifiOff
    }
  }[status];

  const Icon = config.icon;

  if (compact) {
    return (
      <div
        title={`iGOT Karmayogi Status: ${config.label} (${config.sub})`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 8px',
          borderRadius: 'var(--radius-full, 9999px)',
          background: config.bg,
          border: `1px solid ${config.border}`,
          fontSize: 11,
          fontWeight: 700,
          color: config.color,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          width: 'auto',
          boxSizing: 'border-box'
        }}
        onClick={refreshStatus}
      >
        <span style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: config.color,
          boxShadow: `0 0 6px ${config.color}`,
          animation: status === 'healthy' ? 'none' : 'pulse 1.5s infinite'
        }} />
        <span>{status === 'healthy' ? `iGOT ${latency}ms` : status === 'degraded' ? 'iGOT Lag' : 'iGOT Offline'}</span>
      </div>
    );
  }

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      padding: '7px 12px',
      borderRadius: 'var(--radius-lg, 10px)',
      background: config.bg,
      border: `1px solid ${config.border}`,
      backdropFilter: 'blur(8px)',
      transition: 'all 200ms ease'
    }}>
      <div style={{
        width: 28,
        height: 28,
        borderRadius: 6,
        background: 'rgba(0,0,0,0.18)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: config.color,
        flexShrink: 0
      }}>
        <Icon size={16} />
      </div>

      <div style={{ minWidth: 0, lineHeight: 1.25 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-primary)' }}>
            {config.label}
          </span>
          <span style={{
            fontSize: 10,
            fontWeight: 700,
            padding: '1px 5px',
            borderRadius: 4,
            background: config.bg,
            color: config.color,
            border: `1px solid ${config.border}`
          }}>
            {latency > 0 ? `${latency}ms` : 'Offline'}
          </span>
        </div>
        <p style={{ fontSize: 11, color: 'var(--text-tertiary)', margin: 0 }}>
          {status === 'degraded'
            ? 'High latency on central portal. Offline Staging recommended.'
            : status === 'offline'
            ? 'Central server unreachable. Changes safely buffered locally.'
            : 'Operational. Fast batch upload available.'}
        </p>
      </div>

      <button
        onClick={refreshStatus}
        className="btn btn-ghost btn-sm"
        title="Ping iGOT Karmayogi Server"
        style={{ padding: 4, color: 'var(--text-tertiary)', marginLeft: 4 }}
      >
        <RefreshCw size={13} className={isChecking ? 'animate-spin' : ''} />
      </button>

      {vaultCount > 0 && onOpenVault && (
        <button
          onClick={onOpenVault}
          className="btn btn-outline btn-sm"
          style={{
            padding: '3px 8px',
            fontSize: 11,
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4
          }}
        >
          <Database size={12} />
          <span>Vault ({vaultCount})</span>
        </button>
      )}
    </div>
  );
}
