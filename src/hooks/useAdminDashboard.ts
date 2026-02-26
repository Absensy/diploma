import { useState, useEffect } from 'react';

interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalExamplesWork: number;
  totalOrders?: number;
  totalUsers?: number;
  recentProducts: Array<{
    id: number;
    name: string;
    price: number;
    created_at: string;
    category?: {
      id: number;
      name: string;
    };
  }>;
}

interface SystemStatus {
  database: { status: 'online' | 'offline'; message: string };
  api: { status: 'online' | 'offline'; message: string };
  cloudinary: { status: 'online' | 'offline'; message: string };
}

export function useAdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/admin/dashboard');
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }
      
      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке статистики');
    } finally {
      setLoading(false);
    }
  };

  const fetchSystemStatus = async () => {
    try {
      const response = await fetch('/api/admin/system-status');
      if (!response.ok) {
        throw new Error('Failed to fetch system status');
      }
      
      const data = await response.json();
      setSystemStatus(data);
    } catch (err) {
      console.error('Error fetching system status:', err);
      // Устанавливаем статус по умолчанию при ошибке
      setSystemStatus({
        database: { status: 'offline', message: 'Неизвестно' },
        api: { status: 'offline', message: 'Неизвестно' },
        cloudinary: { status: 'offline', message: 'Неизвестно' },
      });
    }
  };

  useEffect(() => {
    fetchStats();
    fetchSystemStatus();
    
    // Обновляем статус системы каждые 30 секунд
    const interval = setInterval(() => {
      fetchSystemStatus();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return {
    stats,
    systemStatus,
    loading,
    error,
    fetchStats,
    fetchSystemStatus,
  };
}
