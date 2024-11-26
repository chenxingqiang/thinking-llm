import { createClient } from '@supabase/supabase-js';

interface Env {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
}

export default {
  async fetch(request: Request, env: Env) {
    const supabaseClient = createClient(
      env.SUPABASE_URL,
      env.SUPABASE_ANON_KEY
    );

    try {
      const { data: protocols, error: protocolsError } = await supabaseClient
        .from('protocols')
        .select('category, downloads, rating');

      if (protocolsError) throw protocolsError;

      const categoryUsage = protocols.reduce((acc: Record<string, number>, protocol) => {
        acc[protocol.category] = (acc[protocol.category] || 0) + 1;
        return acc;
      }, {});

      const monthlyActivity = await calculateMonthlyActivity(supabaseClient);
      const totalUsers = await calculateTotalUsers(supabaseClient);
      const averageRating = calculateAverageRating(protocols);

      return new Response(
        JSON.stringify({
          categoryUsage: Object.entries(categoryUsage).map(([name, value]) => ({
            name,
            value,
          })),
          monthlyActivity,
          totalUsers,
          averageRating,
        }),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  },
};

async function calculateMonthlyActivity(supabase: any) {
  const { data, error } = await supabase
    .from('protocols')
    .select('created_at')
    .order('created_at');

  if (error) throw error;

  const monthlyData = data.reduce((acc: Record<string, number>, { created_at }: { created_at: string }) => {
    const month = new Date(created_at).toLocaleString('default', {
      month: 'long',
      year: 'numeric',
    });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(monthlyData).map(([month, value]) => ({
    month,
    value,
  }));
}

async function calculateTotalUsers(supabase: any) {
  const { count, error } = await supabase
    .from('user_profiles')
    .select('*', { count: 'exact', head: true });

  if (error) throw error;
  return count;
}

function calculateAverageRating(protocols: any[]) {
  const ratings = protocols.map((p) => p.rating).filter(Boolean);
  return ratings.length
    ? ratings.reduce((a, b) => a + b, 0) / ratings.length
    : 0;
} 