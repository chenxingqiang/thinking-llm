import { useState, useEffect } from 'react';

interface CategoryUsage {
  name: string;
  value: number;
}

interface MonthlyActivity {
  month: string;
  value: number;
}

interface ProtocolStats {
  categoryUsage: CategoryUsage[];
  monthlyActivity: MonthlyActivity[];
  totalUsers: number;
  totalForks: number;
  averageRating: number;
}

export const useProtocolStats = () => {
  const [stats, setStats] = useState<ProtocolStats>({
    categoryUsage: [],
    monthlyActivity: [],
    totalUsers: 0,
    totalForks: 0,
    averageRating: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/protocols/stats');
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
}; 