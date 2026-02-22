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
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Refresh,
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridActionsCellItem, GridRowParams, GridRenderCellParams } from '@mui/x-data-grid';
import AdminLayout from '@/components/AdminLayout/AdminLayout';

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

const orderStatuses = ['PENDING', 'PAID', 'SHIPPED', 'COMPLETED', 'OFFLINE'];
const paymentMethods = ['ONLINE', 'OFFLINE'];

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
      valueGetter: (value: unknown, row: Order) => {
        if (row.user) {
          return `${row.user.first_name} ${row.user.last_name}`;
        }
          return 'Гость';
      },
      renderCell: (params: GridRenderCellParams<Order>) => (
        <Box>
          <Typography variant="body2" fontWeight="medium">
            {params.value}
          </Typography>
          {params.row.user && (
            <Typography variant="caption" color="text.secondary">
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
        const colors: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'error'> = {
          PENDING: 'warning',
          PAID: 'primary',
          SHIPPED: 'primary',
          COMPLETED: 'success',
          OFFLINE: 'default',
        };
        return (
          <Chip
            label={params.value as string}
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
      renderCell: (params: GridRenderCellParams<Order>) => (
        <Chip
          label={params.value as string}
          size="small"
          variant="outlined"
        />
      ),
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
          icon={<Delete />}
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
          <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Box>
              <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                Управление заказами
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Управление заказами клиентов
              </Typography>
            </Box>
            <Stack direction="row" gap={1}>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={fetchOrders}
                disabled={loading}
              >
                Обновить
              </Button>
            </Stack>
          </Stack>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* DataGrid */}
        <Paper sx={{ height: 'calc(100vh - 250px)', width: '100%' }}>
          <DataGrid
            rows={orders}
            columns={columns}
            loading={loading}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 25 },
              },
            }}
            pageSizeOptions={[10, 25, 50, 100]}
            disableRowSelectionOnClick
            sx={{
              '& .MuiDataGrid-cell:focus': {
                outline: 'none',
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
                  label="User"
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
                  label="Status"
                  onChange={(e) => handleInputChange('status', e.target.value as string)}
                >
                  {orderStatuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Способ оплаты</InputLabel>
                <Select
                  value={formData.payment_method}
                  label="Payment Method"
                  onChange={(e) => handleInputChange('payment_method', e.target.value as string)}
                >
                  {paymentMethods.map((method) => (
                    <MenuItem key={method} value={method}>
                      {method}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} disabled={saving}>
              Отмена
            </Button>
            <Button
              onClick={handleSave}
              variant="contained"
              disabled={saving}
              startIcon={saving ? <CircularProgress size={20} /> : null}
            >
              {saving ? 'Сохранение...' : 'Обновить'}
            </Button>
          </DialogActions>
        </Dialog>

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
