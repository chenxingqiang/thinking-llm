import { useState, useEffect } from 'react';

interface UsageData {
  date: string;
  usage: number;
}

interface TagData {
  tag: string;
  count: number;
}

interface EngagementData {
  type: string;
  count: number;
}

export const useProtocolAnalytics = () => {
  const [usageData, setUsageData] = useState<UsageData[]>([]);
  const [popularTags, setPopularTags] = useState<TagData[]>([]);
  const [userEngagement, setUserEngagement] = useState<EngagementData[]>([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [usageRes, tagsRes, engagementRes] = await Promise.all([
          fetch('/api/analytics/usage'),
          fetch('/api/analytics/tags'),
          fetch('/api/analytics/engagement'),
        ]);

        const [usage, tags, engagement] = await Promise.all([
          usageRes.json(),
          tagsRes.json(),
          engagementRes.json(),
        ]);

        setUsageData(usage);
        setPopularTags(tags);
        setUserEngagement(engagement);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      }
    };

    fetchAnalytics();
  }, []);

  return {
    usageData,
    popularTags,
    userEngagement,
  };
}; 