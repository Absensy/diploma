'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  CircularProgress,
  Paper,
  Stack,
  Chip,
  Menu,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Refresh,
  Search,
  FileDownload,
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridActionsCellItem, GridRowParams, GridRenderCellParams } from '@mui/x-data-grid';
import AdminLayout from '@/components/AdminLayout/AdminLayout';
import { ruRU } from '@/lib/dataGridLocale';
import { exportToExcel, exportToPDF, ExportColumn } from '@/lib/exportUtils';

interface Order {
  id: number;
  user_id: number | null;
  order_date: string;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'COMPLETED' | 'OFFLINE';
  total_amount: number | null;
  payment_method: 'ONLINE' | 'OFFLINE';
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  } | null;
  itemsCount: number;
}

interface OrderFormData {
  user_id: string;
  status: string;
  payment_method: string;
}

const orderStatuses = [
  { value: 'PENDING', label: 'Ожидает' },
  { value: 'PAID', label: 'Оплачен' },
  { value: 'SHIPPED', label: 'Отправлен' },
  { value: 'COMPLETED', label: 'Завершен' },
  { value: 'OFFLINE', label: 'Офлайн' },
];
const paymentMethods = [
  { value: 'ONLINE', label: 'Онлайн' },
  { value: 'OFFLINE', label: 'Офлайн' },
];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [searchText, setSearchText] = useState('');
  const [exportMenuAnchor, setExportMenuAnchor] = useState<null | HTMLElement>(null);

  // Filter orders based on search text
  const filteredOrders = orders.filter((order) => {
    if (!searchText.trim()) return true;
    const searchLower = searchText.toLowerCase();
    return (
      order.id.toString().includes(searchLower) ||
      order.user?.first_name.toLowerCase().includes(searchLower) ||
      order.user?.last_name.toLowerCase().includes(searchLower) ||
      order.user?.email.toLowerCase().includes(searchLower) ||
      order.status.toLowerCase().includes(searchLower) ||
      order.total_amount?.toString().includes(searchLower)
    );
  });

  // Export functions
  const handleExportClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setExportMenuAnchor(event.currentTarget);
  };

  const handleExportClose = () => {
    setExportMenuAnchor(null);
  };

  const statusLabels: Record<string, string> = {
    PENDING: 'Ожидает',
    PAID: 'Оплачен',
    SHIPPED: 'Отправлен',
    COMPLETED: 'Завершен',
    OFFLINE: 'Офлайн',
  };

  const methodLabels: Record<string, string> = {
    ONLINE: 'Онлайн',
    OFFLINE: 'Офлайн',
  };

  const handleExportExcel = () => {
    const exportColumns: ExportColumn[] = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Клиент', key: 'user', width: 25, formatter: (val, row) => row.user ? `${row.user.first_name} ${row.user.last_name}` : 'Гость' },
      { header: 'Email', key: 'user', width: 25, formatter: (val, row) => row.user?.email || '-' },
      { header: 'Дата заказа', key: 'order_date', width: 20, formatter: (val) => new Date(val).toLocaleString('ru-RU') },
      { header: 'Статус', key: 'status', width: 15, formatter: (val) => statusLabels[val] || val },
      { header: 'Сумма', key: 'total_amount', width: 15, formatter: (val) => val ? `${val} BYN` : 'Н/Д' },
      { header: 'Способ оплаты', key: 'payment_method', width: 15, formatter: (val) => methodLabels[val] || val },
      { header: 'Товаров', key: 'itemsCount', width: 12 },
    ];
    exportToExcel(filteredOrders, exportColumns, `заказы_${new Date().toISOString().split('T')[0]}`);
    handleExportClose();
  };

  const handleExportPDF = async () => {
    const exportColumns: ExportColumn[] = [
      { header: 'ID', key: 'id' },
      { header: 'Клиент', key: 'user', formatter: (val, row) => row.user ? `${row.user.first_name} ${row.user.last_name}` : 'Гость' },
      { header: 'Email', key: 'user', formatter: (val, row) => row.user?.email || '-' },
      { header: 'Дата заказа', key: 'order_date', formatter: (val) => new Date(val).toLocaleString('ru-RU') },
      { header: 'Статус', key: 'status', formatter: (val) => statusLabels[val] || val },
      { header: 'Сумма', key: 'total_amount', formatter: (val) => val ? `${val} BYN` : 'Н/Д' },
      { header: 'Способ оплаты', key: 'payment_method', formatter: (val) => methodLabels[val] || val },
      { header: 'Товаров', key: 'itemsCount' },
    ];
    await exportToPDF(filteredOrders, exportColumns, `заказы_${new Date().toISOString().split('T')[0]}`, 'Отчет по заказам');
    handleExportClose();
  };

  const [formData, setFormData] = useState<OrderFormData>({
    user_id: '',
    status: 'PENDING',
    payment_method: 'ONLINE',
  });

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/admin/orders');
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch orders';
      setError(message);
      setSnackbar({ open: true, message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch users for dropdown
  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    fetchUsers();
  }, [fetchOrders, fetchUsers]);

  // Handle form input changes
  const handleInputChange = (field: keyof OrderFormData, value: string) => {
    setFormData((prev: OrderFormData) => ({ ...prev, [field]: value }));
  };

  // Open dialog for edit
  const handleEdit = (order: Order) => {
    setEditingOrder(order);
    setFormData({
      user_id: order.user_id?.toString() || '',
      status: order.status,
      payment_method: order.payment_method,
    });
    setOpenDialog(true);
  };

  // Handle save (update only - orders should be created through the frontend)
  const handleSave = async () => {
    if (!editingOrder) return;

    try {
      setSaving(true);
      setError(null);

      const response = await fetch(`/api/admin/orders/${editingOrder.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: formData.status,
          payment_method: formData.payment_method,
          user_id: formData.user_id || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update order');
      }

      setSnackbar({
        open: true,
        message: 'Заказ успешно обновлен',
        severity: 'success',
      });
      setOpenDialog(false);
      fetchOrders();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update order';
      setError(message);
      setSnackbar({ open: true, message, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот заказ?')) {
      return;
    }

    try {
      setDeleting(id);
      setError(null);

      const response = await fetch(`/api/admin/orders/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete order');
      }

      setSnackbar({ open: true, message: 'Заказ успешно удален', severity: 'success' });
      fetchOrders();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete order';
      setError(message);
      setSnackbar({ open: true, message, severity: 'error' });
    } finally {
      setDeleting(null);
    }
  };

  // DataGrid columns
  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
      type: 'number',
    },
    {
      field: 'user',
      headerName: 'Клиент',
      width: 200,
      flex: 1,
      valueGetter: (value: unknown, row: Order) => {
        if (row.user) {
          return `${row.user.first_name} ${row.user.last_name}`;
        }
          return 'Гость';
      },
      renderCell: (params: GridRenderCellParams<Order>) => (
        <Box sx={{ py: 0.5, minWidth: 0 }}>
          <Typography 
            variant="body2" 
            fontWeight="medium"
            sx={{ 
              fontSize: { xs: '0.75rem', md: '0.875rem' },
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {params.value}
          </Typography>
          {params.row.user && (
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ 
                fontSize: { xs: '0.7rem', md: '0.75rem' },
                display: 'block',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {params.row.user.email}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      field: 'order_date',
      headerName: 'Дата',
      width: 150,
      type: 'dateTime',
      valueGetter: (value: string) => new Date(value),
    },
    {
      field: 'status',
      headerName: 'Статус',
      width: 120,
      renderCell: (params: GridRenderCellParams<Order>) => {
        const statusLabels: Record<string, string> = {
          PENDING: 'Ожидает',
          PAID: 'Оплачен',
          SHIPPED: 'Отправлен',
          COMPLETED: 'Завершен',
          OFFLINE: 'Офлайн',
        };
        const colors: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'error'> = {
          PENDING: 'warning',
          PAID: 'primary',
          SHIPPED: 'primary',
          COMPLETED: 'success',
          OFFLINE: 'default',
        };
        return (
          <Chip
            label={statusLabels[params.value as string] || params.value as string}
            size="small"
            color={colors[params.value as string] || 'default'}
          />
        );
      },
    },
    {
      field: 'total_amount',
      headerName: 'Сумма',
      width: 120,
      type: 'number',
      valueFormatter: (value: number | null) => value != null ? `${value.toFixed(2)} BYN` : 'Н/Д',
    },
    {
      field: 'payment_method',
      headerName: 'Оплата',
      width: 120,
      renderCell: (params: GridRenderCellParams<Order>) => {
        const methodLabels: Record<string, string> = {
          ONLINE: 'Онлайн',
          OFFLINE: 'Офлайн',
        };
        return (
          <Chip
            label={methodLabels[params.value as string] || params.value as string}
            size="small"
            variant="outlined"
          />
        );
      },
    },
    {
      field: 'itemsCount',
      headerName: 'Товаров',
      width: 80,
      type: 'number',
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Действия',
      width: 150,
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          key="edit"
          icon={<Edit />}
          label="Редактировать"
          onClick={() => handleEdit(params.row as Order)}
        />,
        <GridActionsCellItem
          key="delete"
          icon={<Delete sx={{ color: 'error.main' }} />}
          label="Удалить"
          onClick={() => handleDelete(params.row.id)}
          disabled={deleting === params.row.id}
        />,
      ],
    },
  ];

  return (
    <AdminLayout>
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
        {/* Header */}
        <Box mb={3}>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Управление заказами
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Управление заказами клиентов
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Controls */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={{ xs: 2, md: 3 }}
          flexDirection={{ xs: 'column', sm: 'row' }}
          gap={2}
          flexWrap="wrap"
        >
          <Box display="flex" alignItems="center" gap={2} flex={1} minWidth={0}>
            <Typography
              variant="h6"
              sx={{ fontSize: { xs: '1rem', md: '1.25rem' }, whiteSpace: 'nowrap' }}
            >
              Всего заказов: {filteredOrders.length}
            </Typography>
            <TextField
              placeholder="Поиск по заказам..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              sx={{ maxWidth: 300, flex: { xs: 1, sm: 'none' } }}
              size="small"
            />
          </Box>
          <Stack direction="row" gap={1} flexWrap="wrap">
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchOrders}
              disabled={loading}
              size="small"
            >
              Обновить
            </Button>
            <Button
              variant="outlined"
              startIcon={<FileDownload />}
              onClick={handleExportClick}
              size="small"
            >
              Экспорт
            </Button>
          </Stack>
        </Box>

        {/* DataGrid */}
        <Paper sx={{ height: { xs: 'calc(100vh - 250px)', md: 'calc(100vh - 300px)' }, width: '100%', overflow: 'auto' }}>
          <DataGrid
            rows={filteredOrders}
            columns={columns}
            loading={loading}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 25 },
              },
            }}
            pageSizeOptions={[10, 25, 50, 100]}
            disableRowSelectionOnClick
            localeText={ruRU}
            sx={{
              '& .MuiDataGrid-cell:focus': {
                outline: 'none',
              },
              '& .MuiDataGrid-columnHeaders': {
                fontSize: { xs: '0.75rem', md: '0.875rem' },
              },
              '& .MuiDataGrid-cell': {
                fontSize: { xs: '0.75rem', md: '0.875rem' },
              },
            }}
          />
        </Paper>

        {/* Edit Dialog */}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Редактировать заказ</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <FormControl fullWidth>
                <InputLabel>Пользователь</InputLabel>
                <Select
                  value={formData.user_id}
                  label="Пользователь"
                  onChange={(e) => handleInputChange('user_id', e.target.value as string)}
                >
                  <MenuItem value="">Гость</MenuItem>
                  {users.map((user: { id: number; first_name: string; last_name: string; email: string }) => (
                    <MenuItem key={user.id} value={user.id.toString()}>
                      {user.first_name} {user.last_name} ({user.email})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Статус</InputLabel>
                <Select
                  value={formData.status}
                  label="Статус"
                  onChange={(e) => handleInputChange('status', e.target.value as string)}
                >
                  {orderStatuses.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Способ оплаты</InputLabel>
                <Select
                  value={formData.payment_method}
                  label="Способ оплаты"
                  onChange={(e) => handleInputChange('payment_method', e.target.value as string)}
                >
                  {paymentMethods.map((method) => (
                    <MenuItem key={method.value} value={method.value}>
                      {method.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ flexDirection: { xs: 'column', sm: 'row' }, gap: 2, p: { xs: 2, md: 3 } }}>
            <Button 
              onClick={() => setOpenDialog(false)} 
              disabled={saving}
              fullWidth={false}
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              Отмена
            </Button>
            <Button
              onClick={handleSave}
              variant="contained"
              disabled={saving}
              startIcon={saving ? <CircularProgress size={20} /> : null}
              fullWidth={false}
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              {saving ? 'Сохранение...' : 'Обновить'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Export Menu */}
        <Menu
          anchorEl={exportMenuAnchor}
          open={Boolean(exportMenuAnchor)}
          onClose={handleExportClose}
        >
          <MenuItem onClick={handleExportExcel}>
            <ListItemIcon>
              <FileDownload fontSize="small" />
            </ListItemIcon>
            <ListItemText>Экспорт в Excel</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleExportPDF}>
            <ListItemIcon>
              <FileDownload fontSize="small" />
            </ListItemIcon>
            <ListItemText>Экспорт в PDF</ListItemText>
          </MenuItem>
        </Menu>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </AdminLayout>
  );
}
