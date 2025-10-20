'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  IconButton,
  CircularProgress,
  Alert,
  Chip,
  Avatar,
  LinearProgress,
  Divider,
  Stack,
  Button,
} from '@mui/material';
import {
  Inventory,
  Category,
  Article,
  TrendingUp,
  Add,
  Edit,
  Visibility,
  Phone,
  Email,
  LocationOn,
  Schedule,
  AttachMoney,
  ShoppingCart,
  Star,
  NewReleases,
  People,
  Analytics,
  Settings,
  ContentCopy,
} from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout/AdminLayout';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import { AdminDashboardSkeleton } from '@/components/AdminSkeleton/AdminSkeleton';

const StatCard = ({
  title,
  value,
  icon,
  color,
  trend,
  subtitle
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: string;
  subtitle?: string;
}) => (
  <Card
    sx={{
      height: '100%',
      background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
      border: `1px solid ${color}30`,
      borderRadius: 3,
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: `0 8px 25px ${color}25`,
      }
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={2}>
        <Box
          sx={{
            backgroundColor: color,
            borderRadius: 2,
            p: 1.5,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
        {trend && (
          <Chip
            label={trend}
            size="small"
            color="success"
            sx={{ fontSize: '0.75rem', height: 24 }}
          />
        )}
      </Box>
      <Typography variant="h4" component="div" fontWeight="bold" color={color} gutterBottom>
        {value}
      </Typography>
      <Typography color="textSecondary" variant="body2" fontWeight="medium">
        {title}
      </Typography>
      {subtitle && (
        <Typography color="textSecondary" variant="caption" sx={{ mt: 1, display: 'block' }}>
          {subtitle}
        </Typography>
      )}
    </CardContent>
  </Card>
);

const QuickActionCard = ({
  title,
  description,
  icon,
  color,
  onClick
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}) => (
  <Card
    sx={{
      height: '100%',
      cursor: 'pointer',
      borderRadius: 3,
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: `0 8px 25px ${color}25`,
      }
    }}
  >
    <CardActionArea onClick={onClick} sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Box
            sx={{
              backgroundColor: color,
              borderRadius: 2,
              p: 1.5,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
          <Box flex={1}>
            <Typography variant="h6" component="div" fontWeight="bold" gutterBottom>
              {title}
            </Typography>
            <Typography color="textSecondary" variant="body2">
              {description}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </CardActionArea>
  </Card>
);

const RecentProductCard = ({ product }: { product: any }) => (
  <Card sx={{ mb: 2, borderRadius: 2 }}>
    <CardContent sx={{ p: 2 }}>
      <Box display="flex" alignItems="center" gap={2}>
        <Avatar
          src={product.image || '/images/placeholder.jpg'}
          alt={product.name}
          variant="rounded"
          sx={{ width: 48, height: 48 }}
        />
        <Box flex={1}>
          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
            {product.name}
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Chip
              label={product.category?.name || 'Без категории'}
              size="small"
              variant="outlined"
            />
            <Typography variant="body2" color="textSecondary">
              {new Date(product.created_at).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
        <Box textAlign="right">
          <Typography variant="h6" fontWeight="bold" color="primary">
            {product.price} ₽
          </Typography>
          {product.discount && (
            <Typography variant="caption" color="success.main">
              Скидка {product.discount}%
            </Typography>
          )}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export default function AdminDashboard() {
  const router = useRouter();
  const { stats, loading, error } = useAdminDashboard();

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'add-product':
        router.push('/admin/products');
        break;
      case 'add-category':
        router.push('/admin/categories');
        break;
      case 'edit-content':
        router.push('/admin/content');
        break;
      case 'update-contacts':
        router.push('/admin/contacts');
        break;
      default:
        console.log(`Quick action: ${action}`);
    }
  };

  return (
    <AdminLayout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box mb={4}>
          <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
            Панель управления
          </Typography>
          <Typography variant="h6" color="textSecondary">
            Добро пожаловать в админ-панель Granit Memory
          </Typography>
        </Box>

        {/* Loading State */}
        {loading && <AdminDashboardSkeleton />}

        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Statistics Cards */}
        {!loading && !error && stats && (
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="Всего товаров"
                value={stats.totalProducts}
                icon={<Inventory />}
                color="#2196f3"
                subtitle="В каталоге"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="Категории"
                value={stats.totalCategories}
                icon={<Category />}
                color="#4caf50"
                subtitle="Активных категорий"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="Примеры работ"
                value={stats.totalExamplesWork}
                icon={<Article />}
                color="#ff9800"
                subtitle="В портфолио"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="Недавние товары"
                value={stats.recentProducts.length}
                icon={<NewReleases />}
                color="#9c27b0"
                subtitle="Последние добавленные"
              />
            </Grid>
          </Grid>
        )}

        {/* Main Content Grid */}
        <Grid container spacing={3}>
          {/* Quick Actions */}
          <Grid item xs={12} lg={8}>
            <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
              <Typography variant="h5" component="h2" fontWeight="bold" mb={3}>
                Быстрые действия
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <QuickActionCard
                    title="Добавить товар"
                    description="Создать новый товар в каталоге"
                    icon={<Add />}
                    color="#2196f3"
                    onClick={() => handleQuickAction('add-product')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <QuickActionCard
                    title="Управление категориями"
                    description="Добавить или изменить категории"
                    icon={<Category />}
                    color="#4caf50"
                    onClick={() => handleQuickAction('add-category')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <QuickActionCard
                    title="Редактировать контент"
                    description="Изменить содержимое страниц"
                    icon={<ContentCopy />}
                    color="#ff9800"
                    onClick={() => handleQuickAction('edit-content')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <QuickActionCard
                    title="Контактная информация"
                    description="Обновить контакты и адреса"
                    icon={<Phone />}
                    color="#9c27b0"
                    onClick={() => handleQuickAction('update-contacts')}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Recent Products */}
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                <Typography variant="h5" component="h2" fontWeight="bold">
                  Недавние товары
                </Typography>
                <Button
                  variant="text"
                  endIcon={<Visibility />}
                  onClick={() => router.push('/admin/products')}
                >
                  Все товары
                </Button>
              </Box>
              {stats?.recentProducts.length > 0 ? (
                <Box>
                  {stats.recentProducts.map((product) => (
                    <RecentProductCard key={product.id} product={product} />
                  ))}
                </Box>
              ) : (
                <Box textAlign="center" py={4}>
                  <Inventory sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    Нет товаров
                  </Typography>
                  <Typography variant="body2" color="textSecondary" mb={3}>
                    Добавьте первый товар в каталог
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => handleQuickAction('add-product')}
                  >
                    Добавить товар
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} lg={4}>
            {/* System Status */}
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Статус системы
              </Typography>
              <Stack spacing={2}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main' }} />
                    <Typography variant="body2">База данных</Typography>
                  </Box>
                  <Typography variant="body2" color="success.main" fontWeight="bold">
                    Онлайн
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main' }} />
                    <Typography variant="body2">API</Typography>
                  </Box>
                  <Typography variant="body2" color="success.main" fontWeight="bold">
                    Работает
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main' }} />
                    <Typography variant="body2">Cloudinary</Typography>
                  </Box>
                  <Typography variant="body2" color="success.main" fontWeight="bold">
                    Подключен
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </AdminLayout>
  );
}