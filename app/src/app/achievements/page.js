'use client';
import { Trophy, Star, Zap, Target, BookOpen, Award, Brain, Flame } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function AchievementsPage() {
  const { currentUser, quizHistory, enrolledCourses, gapData } = useApp();

  // Dynamic unlock logic based on actual user actions
  const quizCount = quizHistory.length;
  const hasAced = quizHistory.some(q => q.scorePercent === 100);
  const gapReduced = gapData?.gapList?.some(g => g.percentage >= 80) || false;
  const modulesComplete = quizCount;

  const achievementsList = [
    { icon: Star, title: "First Quiz Completed", desc: "Completed your first assessment", unlocked: quizCount >= 1, xp: 100 },
    { icon: Flame, title: "7-Day Streak", desc: "Maintained a 7-day learning streak", unlocked: currentUser.streak >= 7, xp: 250 },
    { icon: Target, title: "Gap Closer", desc: "Reached 80%+ in any skill area", unlocked: gapReduced, xp: 500 },
    { icon: BookOpen, title: "Module Master", desc: "Completed 5 learning modules", unlocked: modulesComplete >= 5, xp: 300 },
    { icon: Brain, title: "Course Explorer", desc: "Enrolled in 3 or more courses", unlocked: enrolledCourses.length >= 3, xp: 200 },
    { icon: Award, title: "Quiz Ace", desc: "Scored 100% on any quiz", unlocked: hasAced, xp: 750 },
    { icon: Zap, title: "Quiz Machine", desc: "Completed 5 quizzes", unlocked: quizCount >= 5, xp: 400 },
    { icon: Trophy, title: "Department Leader", desc: "Reached #1 in your department leaderboard", unlocked: currentUser.xp >= 4000, xp: 1000 },
  ];

  const totalXP = achievementsList.filter(a => a.unlocked).reduce((sum, a) => sum + a.xp, 0);
  const unlockedCount = achievementsList.filter(a => a.unlocked).length;

  return (
    <div className="fade-in">
      <div className="section-header mb-6">
        <div>
          <h1 className="section-title">Achievements</h1>
          <p className="section-subtitle">{unlockedCount} of {achievementsList.length} unlocked</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div className="header-badge xp" style={{ fontSize: 16 }}>
            <Zap size={20} /> {currentUser.xp.toLocaleString()} XP
          </div>
          <div className="header-badge" style={{ fontSize: 14, color: 'var(--success)' }}>
            <Award size={18} /> +{totalXP} earned
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="card mb-6" style={{ padding: 20 }}>
        <div className="flex-between" style={{ marginBottom: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Achievement Progress</span>
          <span style={{ fontSize: 14, color: 'var(--primary)', fontWeight: 700 }}>{unlockedCount}/{achievementsList.length}</span>
        </div>
        <div className="progress-bar-track" style={{ height: 12 }}>
          <div className="progress-bar-fill" style={{ width: `${(unlockedCount / achievementsList.length) * 100}%`, height: '100%' }} />
        </div>
      </div>

      <div className="grid-3">
        {achievementsList.map((a, i) => {
          const Icon = a.icon;
          return (
            <div key={i} className="card fade-in" style={{
              animationDelay: `${0.05 * i}s`,
              opacity: a.unlocked ? 1 : 0.4,
              textAlign: 'center',
              padding: 28,
              borderColor: a.unlocked ? 'var(--primary)' : 'var(--border-light)',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {a.unlocked && (
                <div style={{
                  position: 'absolute', top: 10, right: 10,
                  background: 'var(--success)', color: 'white',
                  borderRadius: '50%', width: 22, height: 22,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12,
                }}>✓</div>
              )}
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: a.unlocked ? 'var(--primary-glow)' : 'var(--bg-elevated)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
              }}>
                <Icon size={28} style={{ color: a.unlocked ? 'var(--primary)' : 'var(--text-tertiary)' }} />
              </div>
              <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{a.title}</h4>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>{a.desc}</p>
              <span className="tag tag-priority">+{a.xp} XP</span>
              {!a.unlocked && <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 8 }}>🔒 Locked</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
