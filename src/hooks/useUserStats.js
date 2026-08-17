import { useEffect, useState } from 'react';
import { fetchUserStatsApi } from '../lib/api/quiz';

export function useUserStats() {
  const [stats, setStats] = useState({ totalXp: 0, level: 1, currentStreak: 0, longestStreak: 0 });

  useEffect(() => {
    let active = true;
    fetchUserStatsApi()
      .then((s) => { if (active) setStats(s); })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  return stats;
}