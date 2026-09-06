import { supabase, isSupabaseConfigured } from './supabaseClient';

/**
 * Service to interact with Supabase database.
 * Every method includes fallback handling so the application runs seamlessly
 * even before database tables are created or in case of network interruptions.
 */

// ==============================================================================
// AUTHENTICATION
// ==============================================================================
export async function signInWithSupabase(email, password) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured');
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signUpWithSupabase(email, password, metadata = {}) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured');
  }
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: metadata.name,
        department: metadata.department || 'Census Operations',
        role: metadata.role || 'Statistical Officer',
        cadre: metadata.cadre || 'SSS',
      },
    },
  });
  if (error) throw error;
  return data;
}

export async function signOutFromSupabase() {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    await supabase.auth.signOut();
  } catch (err) {
    console.warn('Supabase signOut error:', err);
  }
}

export async function getCurrentUserSession() {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  } catch (err) {
    console.warn('Supabase getSession error:', err);
    return null;
  }
}

export function subscribeToAuthChanges(callback) {
  if (!isSupabaseConfigured || !supabase) return () => {};
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
  return () => subscription.unsubscribe();
}

// ==============================================================================
// PROFILES
// ==============================================================================
export async function getProfile(email = 'officer@mospi.gov.in') {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      console.warn('Supabase getProfile:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Supabase getProfile exception:', err);
    return null;
  }
}

export async function upsertProfile(profileData) {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert(profileData, { onConflict: 'email' })
      .select()
      .maybeSingle();

    if (error) {
      console.warn('Supabase upsertProfile:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Supabase upsertProfile exception:', err);
    return null;
  }
}

// ==============================================================================
// OFFICER SKILLS / COMPETENCY SCORES
// ==============================================================================
export async function getOfficerSkills(profileId) {
  if (!isSupabaseConfigured || !supabase || !profileId) return null;
  try {
    const { data, error } = await supabase
      .from('officer_skills')
      .select('skill_name, score')
      .eq('profile_id', profileId);

    if (error) {
      console.warn('Supabase getOfficerSkills:', error.message);
      return null;
    }
    if (!data || data.length === 0) return null;

    // Convert array to key-value object
    const skillsObj = {};
    data.forEach(row => {
      skillsObj[row.skill_name] = row.score;
    });
    return skillsObj;
  } catch (err) {
    console.warn('Supabase getOfficerSkills exception:', err);
    return null;
  }
}

export async function saveOfficerSkill(profileId, skillName, score) {
  if (!isSupabaseConfigured || !supabase || !profileId) return null;
  try {
    const { data, error } = await supabase
      .from('officer_skills')
      .upsert(
        { profile_id: profileId, skill_name: skillName, score, updated_at: new Date().toISOString() },
        { onConflict: 'profile_id,skill_name' }
      )
      .select();

    if (error) {
      console.warn('Supabase saveOfficerSkill:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Supabase saveOfficerSkill exception:', err);
    return null;
  }
}

// ==============================================================================
// QUIZZES & ATTEMPTS
// ==============================================================================
export async function getQuizzes() {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase getQuizzes:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Supabase getQuizzes exception:', err);
    return null;
  }
}

export async function createQuiz(quizData) {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('quizzes')
      .insert([quizData])
      .select()
      .single();

    if (error) {
      console.warn('Supabase createQuiz:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Supabase createQuiz exception:', err);
    return null;
  }
}

export async function recordQuizAttempt(attemptData) {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('quiz_attempts')
      .insert([attemptData])
      .select()
      .single();

    if (error) {
      console.warn('Supabase recordQuizAttempt:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Supabase recordQuizAttempt exception:', err);
    return null;
  }
}

export async function getQuizAttempts(profileId) {
  if (!isSupabaseConfigured || !supabase || !profileId) return null;
  try {
    const { data, error } = await supabase
      .from('quiz_attempts')
      .select('*')
      .eq('profile_id', profileId)
      .order('completed_at', { ascending: false });

    if (error) {
      console.warn('Supabase getQuizAttempts:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Supabase getQuizAttempts exception:', err);
    return null;
  }
}

// ==============================================================================
// ENROLLED COURSES
// ==============================================================================
export async function getEnrolledCourses(profileId) {
  if (!isSupabaseConfigured || !supabase || !profileId) return null;
  try {
    const { data, error } = await supabase
      .from('enrolled_courses')
      .select('*')
      .eq('profile_id', profileId)
      .order('enrolled_at', { ascending: false });

    if (error) {
      console.warn('Supabase getEnrolledCourses:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Supabase getEnrolledCourses exception:', err);
    return null;
  }
}

export async function enrollInCourse(courseData) {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('enrolled_courses')
      .insert([courseData])
      .select()
      .single();

    if (error) {
      console.warn('Supabase enrollInCourse:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Supabase enrollInCourse exception:', err);
    return null;
  }
}

// ==============================================================================
// DISCUSSIONS / FORUM
// ==============================================================================
export async function getDiscussions() {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('discussions')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.warn('Supabase getDiscussions:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Supabase getDiscussions exception:', err);
    return null;
  }
}

export async function postDiscussion(messageData) {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('discussions')
      .insert([messageData])
      .select()
      .single();

    if (error) {
      console.warn('Supabase postDiscussion:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Supabase postDiscussion exception:', err);
    return null;
  }
}
