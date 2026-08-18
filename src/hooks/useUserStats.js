import { useEffect, useState } from 'react';
import { fetchUserStatsApi } from '../lib/api/quiz';

export function useUserStats() {
  const [stats, setStats] = useState({
    totalXp: 0,
    level: 1,
    currentStreak: 0,
    longestStreak: 0,
    quizzesTaken: 0,
    quizzesPassed: 0,
  });

  useEffect(() => {
    let active = true;
    fetchUserStatsApi()
      .then((s) => {
        if (!active) return;
        // Normalise backend snake_case → camelCase
        setStats({
          totalXp:        s.total_xp       ?? s.totalXp       ?? 0,
          level:          s.level          ?? 1,
          currentStreak:  s.current_streak ?? s.currentStreak ?? 0,
          longestStreak:  s.longest_streak ?? s.longestStreak ?? 0,
          quizzesTaken:   s.quizzes_taken  ?? s.quizzesTaken  ?? 0,
          quizzesPassed:  s.quizzes_passed ?? s.quizzesPassed ?? 0,
        });
      })
      .catch(() => {
        // keep defaults (all zeroes) on network / auth errors
      });
    return () => { active = false; };
  }, []);

  return stats;
}