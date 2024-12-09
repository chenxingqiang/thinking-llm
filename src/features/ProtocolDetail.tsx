import React from 'react';
import { Protocol } from '../types/protocol';
import { Comment } from '../types/comment';

interface UsageStat {
  date: string;
  views: number;
  likes: number;
  shares: number;
}

interface ProtocolDetailProps {
  protocol: Protocol;
}

type TabType = 'overview' | 'stats' | 'comments';

export function ProtocolDetail({ protocol }: ProtocolDetailProps) {
  const [activeTab, setActiveTab] = React.useState<TabType>('overview');
  const [usageStats, setUsageStats] = React.useState<UsageStat[]>([]);
  const [comments, setComments] = React.useState<Comment[]>([]);

  React.useEffect(() => {
    const fetchUsageStats = async () => {
      try {
        const stats: UsageStat[] = await fetch(`/api/protocols/${protocol.id}/stats`).then(res => res.json());
        setUsageStats(stats);
      } catch (error) {
        console.error('Failed to fetch usage stats:', error);
      }
    };

    const fetchComments = async () => {
      try {
        const fetchedComments: Comment[] = await fetch(`/api/protocols/${protocol.id}/comments`).then(res => res.json());
        setComments(fetchedComments);
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      }
    };

    fetchUsageStats();
    fetchComments();
  }, [protocol.id]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="overview-section">
            <h2>{protocol.title}</h2>
            <p>{protocol.description}</p>
            <div className="content">{protocol.content}</div>
          </div>
        );
      case 'stats':
        return (
          <div className="stats-section">
            {usageStats.map((stat) => (
              <div key={stat.date} className="stat-item">
                <div className="stat-date">{stat.date}</div>
                <div className="stat-numbers">
                  <span>Views: {stat.views}</span>
                  <span>Likes: {stat.likes}</span>
                  <span>Shares: {stat.shares}</span>
                </div>
              </div>
            ))}
          </div>
        );
      case 'comments':
        return (
          <div className="comments-section">
            {comments.map((comment) => (
              <div key={comment.id} className="comment">
                <div className="comment-content">{comment.content}</div>
                <div className="comment-meta">
                  <span>Posted: {new Date(comment.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="protocol-detail">
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          Stats
        </button>
        <button 
          className={`tab ${activeTab === 'comments' ? 'active' : ''}`}
          onClick={() => setActiveTab('comments')}
        >
          Comments
        </button>
      </div>
      {renderTabContent()}
    </div>
  );
} 