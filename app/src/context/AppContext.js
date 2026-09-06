'use client';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { officers, initialOfficer, initialUserSkills, currentUserSkills, calculateGapScores, getRecommendations, sampleQuizzes, skills } from '@/data/mockData';
import { isSupabaseConfigured } from '@/lib/supabaseClient';
import {
  getProfile,
  upsertProfile,
  getOfficerSkills,
  saveOfficerSkill,
  getQuizzes,
  createQuiz,
  recordQuizAttempt,
  getQuizAttempts,
  getEnrolledCourses,
  enrollInCourse,
  getDiscussions,
  postDiscussion,
  getCurrentUserSession,
  subscribeToAuthChanges,
  signOutFromSupabase,
} from '@/lib/supabaseService';

const AppContext = createContext(null);

// Generate random skill levels for non-primary officers
function generateSkillsForOfficer(officer) {
  const base = {};
  skills.forEach(s => {
    base[s] = Math.floor(Math.random() * 50) + 20;
  });
  return base;
}

export function AppProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [currentUser, setCurrentUser] = useState({
    id: 0,
    name: "New Officer",
    role: "Statistical Officer",
    department: "Census Operations",
    cadre: "SSS",
    avatar: "SO",
    xp: 0,
    streak: 0
  });
  const [userSkills, setUserSkills] = useState({
    "Survey Design": 0,
    "GIS & Spatial Analysis": 0,
    "Data Science & Analytics": 0,
    "AI & Machine Learning": 0,
    "Statistical Methods": 0,
    "Data Governance": 0
  });
  const [quizHistory, setQuizHistory] = useState([]);
  const [generatedQuizzes, setGeneratedQuizzes] = useState([...sampleQuizzes]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Welcome to Pariksha AI! Take your first assessment to establish your competency baseline.", time: "Just now", read: false },
  ]);
  const [apiKey, setApiKey] = useState(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');
  const [language, setLanguage] = useState('English');
  const [defaultDifficulty, setDefaultDifficulty] = useState('Mixed');
  const [notifPrefs, setNotifPrefs] = useState({
    'Course recommendations': true,
    'Assessment reminders': true,
    'Department updates': true,
    'Achievement unlocked': true,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState('dark');
  const [collaborationMessages, setCollaborationMessages] = useState([
    { id: 1, user: 'Priya Nair', text: 'Has anyone completed the GIS module? I need help with spatial analysis.', time: '10 min ago', avatar: 'PN' },
    { id: 2, user: 'Amit Verma', text: 'The new survey design quiz is excellent! Scored 80%.', time: '25 min ago', avatar: 'AV' },
    { id: 3, user: 'Sneha Patel', text: 'Admin analytics show our department improved 5% this quarter! 🎉', time: '1 hr ago', avatar: 'SP' },
  ]);

  // Load persisted theme and apiKey from localStorage or environment on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('pariksha_theme');
      if (savedTheme) setTheme(savedTheme);
      const savedKey = localStorage.getItem('pariksha_gemini_key');
      if (savedKey) {
        setApiKey(savedKey);
      } else if (process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
        setApiKey(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
      }
    } catch (e) {}
  }, []);

  // Supabase Auth Session Management & State Sync
  useEffect(() => {
    if (!isSupabaseConfigured) {
      // If Supabase credentials are not configured, allow local testing
      setIsLoggedIn(true);
      return;
    }

    let isMounted = true;

    // Check existing active Supabase session
    getCurrentUserSession().then(session => {
      if (session?.user && isMounted) {
        setIsLoggedIn(true);
        const meta = session.user.user_metadata || {};
        const userName = meta.name || session.user.email?.split('@')[0] || "Statistical Officer";
        const initials = userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || "SO";
        setCurrentUser(prev => ({
          ...prev,
          id: session.user.id,
          email: session.user.email,
          name: userName,
          department: meta.department || prev.department,
          role: meta.role || prev.role,
          avatar: initials,
        }));
      }
    });

    // Listen for Auth changes (Sign In, Sign Out, Token Refresh)
    const unsubscribe = subscribeToAuthChanges((event, session) => {
      if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && session?.user && isMounted) {
        setIsLoggedIn(true);
        const meta = session.user.user_metadata || {};
        const userName = meta.name || session.user.email?.split('@')[0] || "Statistical Officer";
        const initials = userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || "SO";
        setCurrentUser(prev => ({
          ...prev,
          id: session.user.id,
          email: session.user.email,
          name: userName,
          department: meta.department || prev.department,
          role: meta.role || prev.role,
          avatar: initials,
        }));
      } else if (event === 'SIGNED_OUT' && isMounted) {
        setIsLoggedIn(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Hydrate database state from Supabase if configured
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let isMounted = true;
    async function hydrateFromSupabase() {
      try {
        const userEmail = currentUser.email || 'officer@mospi.gov.in';
        const profile = await getProfile(userEmail);
        if (profile && isMounted) {
          setCurrentUser(prev => ({
            ...prev,
            id: profile.id,
            name: profile.name || prev.name,
            role: profile.role || prev.role,
            department: profile.department || prev.department,
            cadre: profile.cadre || prev.cadre,
            avatar: profile.avatar || prev.avatar,
            xp: profile.xp ?? prev.xp,
            streak: profile.streak ?? prev.streak,
          }));

          // Fetch Skills for this profile
          const remoteSkills = await getOfficerSkills(profile.id);
          if (remoteSkills && Object.keys(remoteSkills).length > 0 && isMounted) {
            setUserSkills(prev => ({ ...prev, ...remoteSkills }));
          }

          // Fetch Quiz Attempts
          const attempts = await getQuizAttempts(profile.id);
          if (attempts && attempts.length > 0 && isMounted) {
            setQuizHistory(attempts.map(a => ({
              id: a.id,
              skill: a.quiz_title,
              score: a.score,
              totalQuestions: a.total_questions,
              scorePercent: Math.round((a.score / a.total_questions) * 100),
              date: new Date(a.completed_at).toLocaleDateString(),
            })));
          }

          // Fetch Enrolled Courses
          const courses = await getEnrolledCourses(profile.id);
          if (courses && courses.length > 0 && isMounted) {
            setEnrolledCourses(courses.map(c => c.course_id || c.title));
          }
        }

        // Fetch Custom Quizzes
        const remoteQuizzes = await getQuizzes();
        if (remoteQuizzes && remoteQuizzes.length > 0 && isMounted) {
          setGeneratedQuizzes(prev => {
            const existingIds = new Set(prev.map(q => q.id));
            const filteredNew = remoteQuizzes.filter(q => !existingIds.has(q.id));
            return [...filteredNew, ...prev];
          });
        }

        // Fetch Discussions
        const remoteDiscussions = await getDiscussions();
        if (remoteDiscussions && remoteDiscussions.length > 0 && isMounted) {
          setCollaborationMessages(remoteDiscussions.map(d => ({
            id: d.id,
            user: d.user_name,
            text: d.message,
            time: new Date(d.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            avatar: d.avatar,
          })));
        }
      } catch (err) {
        console.warn('Supabase hydration skipped:', err);
      }
    }

    hydrateFromSupabase();
    return () => { isMounted = false; };
  }, [currentUser.email]);

  const gapData = calculateGapScores(userSkills, currentUser.role);
  const recommendations = getRecommendations(gapData.gapList);

  // Theme management (Light / Dark)
  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const nextTheme = prev === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('pariksha_theme', nextTheme); } catch (e) {}
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', nextTheme);
      }
      return nextTheme;
    });
  }, []);

  const setThemeMode = useCallback((mode) => {
    const nextTheme = mode === 'light' ? 'light' : 'dark';
    setTheme(nextTheme);
    try { localStorage.setItem('pariksha_theme', nextTheme); } catch (e) {}
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', nextTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleMobileSidebar = useCallback(() => {
    setMobileSidebarOpen(prev => !prev);
  }, []);

  // Auth login handler
  const login = useCallback((userData) => {
    setIsLoggedIn(true);
    const newName = userData?.name || "Officer";
    const initials = newName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || "SO";
    const newOfficer = {
      id: userData?.id || Date.now(),
      name: newName,
      role: userData?.role || "Statistical Officer",
      department: userData?.department || "Census Operations",
      cadre: "SSS",
      avatar: initials,
      xp: 0,
      streak: 0,
      email: userData?.email || 'officer@mospi.gov.in',
    };
    setCurrentUser(newOfficer);
    setUserSkills({
      "Survey Design": 0,
      "GIS & Spatial Analysis": 0,
      "Data Science & Analytics": 0,
      "AI & Machine Learning": 0,
      "Statistical Methods": 0,
      "Data Governance": 0
    });
    setQuizHistory([]);
    setEnrolledCourses([]);

    if (isSupabaseConfigured) {
      upsertProfile({
        name: newOfficer.name,
        role: newOfficer.role,
        department: newOfficer.department,
        cadre: newOfficer.cadre,
        avatar: newOfficer.avatar,
        email: newOfficer.email,
      }).catch(err => console.warn('Supabase upsertProfile:', err));
    }
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    signOutFromSupabase().catch(err => console.warn('Supabase logout:', err));
  }, []);

  // Reset to Day 0
  const resetToZero = useCallback(() => {
    setCurrentUser(prev => ({ ...prev, xp: 0, streak: 0 }));
    setUserSkills({
      "Survey Design": 0,
      "GIS & Spatial Analysis": 0,
      "Data Science & Analytics": 0,
      "AI & Machine Learning": 0,
      "Statistical Methods": 0,
      "Data Governance": 0
    });
    setQuizHistory([]);
    setEnrolledCourses([]);
    setNotifications([{ id: Date.now(), text: "Platform reset to Day 0. Begin your baseline diagnostic assessment.", time: "Just now", read: false }]);
  }, []);

  // Switch officer persona
  const switchOfficer = useCallback((index) => {
    setCurrentUserIndex(index);
    setCurrentUser(officers[index]);
    if (index === 0) {
      setUserSkills({ ...currentUserSkills });
    } else {
      setUserSkills(generateSkillsForOfficer(officers[index]));
    }
    setQuizHistory([]);
    setEnrolledCourses([]);
  }, []);

  const updateSkillAfterQuiz = useCallback((skill, score, totalQuestions) => {
    setUserSkills(prev => {
      const performancePercent = Math.round((score / totalQuestions) * 100);
      const currentLevel = prev[skill] || 0;
      const newLevel = currentLevel === 0
        ? Math.min(100, Math.max(25, performancePercent))
        : Math.min(100, Math.round(currentLevel + (performancePercent - currentLevel) * 0.35 + 10));
      
      // Persist skill asynchronously to Supabase
      if (isSupabaseConfigured && currentUser.id && typeof currentUser.id === 'string' && currentUser.id.includes('-')) {
        saveOfficerSkill(currentUser.id, skill, newLevel)
          .catch(err => console.warn('Supabase saveOfficerSkill:', err));
      }

      return { ...prev, [skill]: newLevel };
    });
  }, [currentUser]);

  const addQuizResult = useCallback((result) => {
    const xpBonus = result.score * 30 + 50;
    setCurrentUser(prev => ({
      ...prev,
      xp: (prev.xp || 0) + xpBonus,
      streak: Math.max(1, (prev.streak || 0) + 1)
    }));
    setQuizHistory(prev => [result, ...prev]);
    setNotifications(prev => [{
      id: Date.now(),
      text: `Assessment completed: ${result.skill} — scored ${result.scorePercent}% (+${xpBonus} XP)`,
      time: 'Just now',
      read: false,
    }, ...prev]);

    // Persist attempt asynchronously to Supabase
    if (isSupabaseConfigured && currentUser.id && typeof currentUser.id === 'string' && currentUser.id.includes('-')) {
      recordQuizAttempt({
        profile_id: currentUser.id,
        quiz_title: result.skill,
        score: result.score,
        total_questions: result.totalQuestions,
        answers: result.answers || [],
      }).catch(err => console.warn('Supabase recordQuizAttempt:', err));
    }
  }, [currentUser]);

  const addGeneratedQuiz = useCallback((quiz) => {
    setGeneratedQuizzes(prev => [quiz, ...prev]);
    setNotifications(prev => [{
      id: Date.now(),
      text: `New quiz generated: ${quiz.title}`,
      time: 'Just now',
      read: false,
    }, ...prev]);

    // Persist quiz asynchronously to Supabase
    if (isSupabaseConfigured) {
      createQuiz({
        title: quiz.title,
        topic: quiz.topic || quiz.title,
        difficulty: quiz.difficulty || 'Intermediate',
        question_count: quiz.questions?.length || 5,
        questions: quiz.questions || [],
      }).catch(err => console.warn('Supabase createQuiz:', err));
    }
  }, []);

  const enrollCourse = useCallback((courseId) => {
    setEnrolledCourses(prev => {
      if (prev.includes(courseId)) return prev;
      return [...prev, courseId];
    });
    setNotifications(prev => [{
      id: Date.now(),
      text: `Successfully enrolled in a new course!`,
      time: 'Just now',
      read: false,
    }, ...prev]);

    // Persist course enrollment asynchronously to Supabase
    if (isSupabaseConfigured && currentUser.id && typeof currentUser.id === 'string' && currentUser.id.includes('-')) {
      enrollInCourse({
        profile_id: currentUser.id,
        course_id: String(courseId),
        title: typeof courseId === 'string' ? courseId : (courseId?.title || 'iGOT Course'),
        status: 'Enrolled',
        progress: 0,
      }).catch(err => console.warn('Supabase enrollInCourse:', err));
    }
  }, [currentUser]);

  const markNotificationRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const deleteNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const toggleNotifPref = useCallback((key) => {
    setNotifPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const addCollaborationMessage = useCallback((text) => {
    setCollaborationMessages(prev => [{
      id: Date.now(),
      user: currentUser.name,
      text,
      time: 'Just now',
      avatar: currentUser.avatar,
    }, ...prev]);

    // Persist discussion message asynchronously to Supabase
    if (isSupabaseConfigured) {
      postDiscussion({
        profile_id: typeof currentUser.id === 'string' && currentUser.id.includes('-') ? currentUser.id : null,
        user_name: currentUser.name,
        avatar: currentUser.avatar,
        message: text,
      }).catch(err => console.warn('Supabase postDiscussion:', err));
    }
  }, [currentUser]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider value={{
      isLoggedIn,
      login,
      logout,
      mobileSidebarOpen,
      toggleMobileSidebar,
      currentUser,
      currentUserIndex,
      switchOfficer,
      officers,
      userSkills,
      gapData,
      recommendations,
      quizHistory,
      generatedQuizzes,
      notifications,
      enrolledCourses,
      apiKey,
      setApiKey,
      language,
      setLanguage,
      defaultDifficulty,
      setDefaultDifficulty,
      notifPrefs,
      toggleNotifPref,
      searchQuery,
      setSearchQuery,
      unreadCount,
      theme,
      toggleTheme,
      setTheme: setThemeMode,
      setThemeMode,
      showGuideModal,
      setShowGuideModal,
      resetToZero,
      collaborationMessages,
      addCollaborationMessage,
      updateSkillAfterQuiz,
      addQuizResult,
      addGeneratedQuiz,
      enrollCourse,
      markNotificationRead,
      markAllNotificationsRead,
      deleteNotification,
      isSupabaseConnected: isSupabaseConfigured,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}
