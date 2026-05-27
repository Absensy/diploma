'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  CircularProgress,
  Paper,
  Stack,
  Chip,
  Menu,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
} from '@mui/material';
import {
  Edit,
  Delete,
  Refresh,
  Search,
  FileDownload,
  ArrowForward,
  Cancel as CancelIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridActionsCellItem, GridRowParams, GridRenderCellParams } from '@mui/x-data-grid';
import AdminLayout from '@/components/AdminLayout/AdminLayout';
import OrderStatusStepper, { type OrderTimestamps } from '@/components/OrderStatusStepper';
import { ruRU } from '@/lib/dataGridLocale';
import { exportToExcel, exportToPDF, ExportColumn } from '@/lib/exportUtils';
import {
  ORDER_STATUS_META,
  ORDER_STATUS_LIST,
  ALLOWED_TRANSITIONS,
  getNextStatus,
  getStatusLabel,
  getStatusColor,
  type OrderStatus,
} from '@/lib/orderStatus';
import { generateReceiptPDF, type ReceiptCompany } from '@/lib/receiptGenerator';
import { useAlert } from '@/components/GlobalAlert/GlobalAlert';

interface AdminOrderItem {
  id: number;
  quantity: number;
  price_at_purchase: number | string;
  product: {
    id: number;
    name: string;
    image: string;
  } | null;
}

interface Order extends OrderTimestamps {
  id: number;
  user_id: number | null;
  order_date: string;
  status: OrderStatus;
  total_amount: number | null;
  payment_method: 'ONLINE' | 'OFFLINE';
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string | null;
  } | null;
  itemsCount: number;
  order_items?: AdminOrderItem[];
}

interface OrderFormData {
  user_id: string;
  status: OrderStatus;
  payment_method: string;
}

const paymentMethods = [
  { value: 'ONLINE', label: 'Онлайн' },
  { value: 'OFFLINE', label: 'Офлайн' },
];

const methodLabels: Record<string, string> = {
  ONLINE: 'Онлайн',
  OFFLINE: 'Офлайн',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<{ id: number; first_name: string; last_name: string; email: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [advancing, setAdvancing] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { showSuccess, showError } = useAlert();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | OrderStatus>('ALL');
  const [exportMenuAnchor, setExportMenuAnchor] = useState<null | HTMLElement>(null);
  const [companyInfo, setCompanyInfo] = useState<ReceiptCompany | null>(null);
  const [downloadingReceipt, setDownloadingReceipt] = useState(false);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (statusFilter !== 'ALL' && order.status !== statusFilter) return false;
      if (!searchText.trim()) return true;
      const q = searchText.toLowerCase();
      return (
        order.id.toString().includes(q) ||
        order.user?.first_name.toLowerCase().includes(q) ||
        order.user?.last_name.toLowerCase().includes(q) ||
        order.user?.email.toLowerCase().includes(q) ||
        getStatusLabel(order.status).toLowerCase().includes(q) ||
        order.total_amount?.toString().includes(q)
      );
    });
  }, [orders, searchText, statusFilter]);

  const statusCounts = useMemo(() => {
    const counts: Partial<Record<OrderStatus, number>> = {};
    for (const order of orders) {
      counts[order.status] = (counts[order.status] ?? 0) + 1;
    }
    return counts;
  }, [orders]);

  const statusOptionsForOrder: OrderStatus[] = editingOrder
    ? [editingOrder.status, ...ALLOWED_TRANSITIONS[editingOrder.status]]
    : (ORDER_STATUS_LIST as OrderStatus[]);

  const handleExportClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setExportMenuAnchor(event.currentTarget);
  };

  const handleExportClose = () => setExportMenuAnchor(null);

  const handleExportExcel = () => {
    const exportColumns: ExportColumn[] = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Клиент', key: 'user', width: 25, formatter: (_val, row) => row.user ? `${row.user.first_name} ${row.user.last_name}` : 'Гость' },
      { header: 'Email', key: 'user', width: 25, formatter: (_val, row) => row.user?.email || '-' },
      { header: 'Дата заказа', key: 'order_date', width: 20, formatter: (val) => new Date(val).toLocaleString('ru-RU') },
      { header: 'Статус', key: 'status', width: 18, formatter: (val) => getStatusLabel(val) },
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
      { header: 'Клиент', key: 'user', formatter: (_val, row) => row.user ? `${row.user.first_name} ${row.user.last_name}` : 'Гость' },
      { header: 'Email', key: 'user', formatter: (_val, row) => row.user?.email || '-' },
      { header: 'Дата заказа', key: 'order_date', formatter: (val) => new Date(val).toLocaleString('ru-RU') },
      { header: 'Статус', key: 'status', formatter: (val) => getStatusLabel(val) },
      { header: 'Сумма', key: 'total_amount', formatter: (val) => val ? `${val} BYN` : 'Н/Д' },
      { header: 'Способ оплаты', key: 'payment_method', formatter: (val) => methodLabels[val] || val },
      { header: 'Товаров', key: 'itemsCount' },
    ];
    await exportToPDF(filteredOrders, exportColumns, `заказы_${new Date().toISOString().split('T')[0]}`, 'Отчет по заказам');
    handleExportClose();
  };

  const [formData, setFormData] = useState<OrderFormData>({
    user_id: '',
    status: 'NEW',
    payment_method: 'OFFLINE',
  });

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/admin/orders');
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch orders';
      setError(message);
      showError(message);
    } finally {
      setLoading(false);
    }
  }, []);

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

  const handleInputChange = (field: keyof OrderFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value as OrderFormData[typeof field] }));
  };

  const handleEdit = (order: Order) => {
    setEditingOrder(order);
    setFormData({
      user_id: order.user_id?.toString() || '',
      status: order.status,
      payment_method: order.payment_method,
    });
    setOpenDialog(true);
  };

  const handleSave = async () => {
    if (!editingOrder) return;
    try {
      setSaving(true);
      setError(null);
      const response = await fetch(`/api/admin/orders/${editingOrder.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
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
      showSuccess('Заказ успешно обновлён');
      setOpenDialog(false);
      fetchOrders();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update order';
      setError(message);
      showError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleAdvance = async (target: OrderStatus) => {
    if (!editingOrder) return;
    try {
      setAdvancing(true);
      const response = await fetch(`/api/admin/orders/${editingOrder.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: target }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Не удалось перевести заказ');
      }
      const updated = await response.json();
      setEditingOrder((prev) => prev ? { ...prev, ...updated } : prev);
      setFormData((prev) => ({ ...prev, status: target }));
      showSuccess(`Статус изменён на «${getStatusLabel(target)}»`);
      fetchOrders();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to advance';
      showError(message);
    } finally {
      setAdvancing(false);
    }
  };

  const ensureCompanyInfo = async (): Promise<ReceiptCompany> => {
    if (companyInfo) return companyInfo;
    const res = await fetch('/api/contact');
    if (!res.ok) throw new Error('Не удалось получить реквизиты компании');
    const data = await res.json();
    const info: ReceiptCompany = {
      address: data.address,
      phone: data.phone,
      email: data.email,
      working_hours: data.working_hours,
      instagram: data.instagram ?? null,
    };
    setCompanyInfo(info);
    return info;
  };

  const handleDownloadReceipt = async () => {
    if (!editingOrder) return;
    if (!editingOrder.order_items || editingOrder.order_items.length === 0) {
      showError('У заказа нет товаров для формирования чека');
      return;
    }
    try {
      setDownloadingReceipt(true);
      const company = await ensureCompanyInfo();
      await generateReceiptPDF({
        order: {
          id: editingOrder.id,
          order_date: editingOrder.order_date,
          status: editingOrder.status,
          total_amount: editingOrder.total_amount,
          payment_method: editingOrder.payment_method,
          paid_at: editingOrder.paid_at ?? null,
          in_production_at: editingOrder.in_production_at ?? null,
          in_delivery_at: editingOrder.in_delivery_at ?? null,
          completed_at: editingOrder.completed_at ?? null,
          cancelled_at: editingOrder.cancelled_at ?? null,
          user: editingOrder.user
            ? {
                first_name: editingOrder.user.first_name,
                last_name: editingOrder.user.last_name,
                email: editingOrder.user.email,
                phone: editingOrder.user.phone ?? null,
              }
            : null,
          order_items: editingOrder.order_items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            price_at_purchase: Number(item.price_at_purchase),
            product: item.product ? { id: item.product.id, name: item.product.name } : null,
          })),
        },
        company,
        download: true,
      });
      showSuccess('Чек скачан');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Не удалось сгенерировать чек';
      showError(message);
    } finally {
      setDownloadingReceipt(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот заказ?')) return;
    try {
      setDeleting(id);
      setError(null);
      const response = await fetch(`/api/admin/orders/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete order');
      }
      showSuccess('Заказ успешно удалён');
      fetchOrders();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete order';
      setError(message);
      showError(message);
    } finally {
      setDeleting(null);
    }
  };

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
      valueGetter: (_value: unknown, row: Order) =>
        row.user ? `${row.user.first_name} ${row.user.last_name}` : 'Гость',
      renderCell: (params: GridRenderCellParams<Order>) => (
        <Box sx={{ py: 0.5, minWidth: 0 }}>
          <Typography
            variant="body2"
            fontWeight="medium"
            sx={{
              fontSize: { xs: '0.75rem', md: '0.875rem' },
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
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
                whiteSpace: 'nowrap',
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
      width: 170,
      renderCell: (params: GridRenderCellParams<Order>) => {
        const value = params.value as OrderStatus;
        const meta = ORDER_STATUS_META[value];
        if (!meta) {
          return <Chip label={value} size="small" />;
        }
        const Icon = meta.icon;
        return (
          <Chip
            icon={<Icon sx={{ fontSize: '1rem !important', color: `${meta.hex} !important` }} />}
            label={meta.label}
            size="small"
            sx={{
              fontWeight: 600,
              backgroundColor: `${meta.hex}15`,
              color: meta.hex,
              border: `1px solid ${meta.hex}40`,
            }}
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
          label={methodLabels[params.value as string] || params.value as string}
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
          icon={<Delete sx={{ color: 'error.main' }} />}
          label="Удалить"
          onClick={() => handleDelete(params.row.id)}
          disabled={deleting === params.row.id}
        />,
      ],
    },
  ];

  const nextStatus = editingOrder ? getNextStatus(editingOrder.status) : null;
  const canCancel = editingOrder
    ? ALLOWED_TRANSITIONS[editingOrder.status].includes('CANCELLED')
    : false;

  return (
    <AdminLayout>
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
        <Box mb={3}>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Управление заказами
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Управление заказами клиентов и контроль этапов производства/доставки
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
          <Chip
            label={`Все · ${orders.length}`}
            color={statusFilter === 'ALL' ? 'primary' : 'default'}
            variant={statusFilter === 'ALL' ? 'filled' : 'outlined'}
            onClick={() => setStatusFilter('ALL')}
          />
          {(ORDER_STATUS_LIST as OrderStatus[]).map((s) => {
            const meta = ORDER_STATUS_META[s];
            const Icon = meta.icon;
            return (
              <Chip
                key={s}
                icon={<Icon sx={{ fontSize: '1rem !important', color: statusFilter === s ? '#fff !important' : `${meta.hex} !important` }} />}
                label={`${meta.label} · ${statusCounts[s] ?? 0}`}
                onClick={() => setStatusFilter(s)}
                sx={{
                  fontWeight: 500,
                  ...(statusFilter === s
                    ? { backgroundColor: meta.hex, color: '#fff' }
                    : { backgroundColor: `${meta.hex}10`, color: meta.hex, border: `1px solid ${meta.hex}40` }),
                  '&:hover': { backgroundColor: statusFilter === s ? meta.hex : `${meta.hex}25` },
                }}
              />
            );
          })}
        </Stack>

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
              Найдено: {filteredOrders.length}
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
            <Button variant="outlined" startIcon={<Refresh />} onClick={fetchOrders} disabled={loading} size="small">
              Обновить
            </Button>
            <Button variant="outlined" startIcon={<FileDownload />} onClick={handleExportClick} size="small">
              Экспорт
            </Button>
          </Stack>
        </Box>

        <Paper sx={{ height: { xs: 'calc(100vh - 320px)', md: 'calc(100vh - 360px)' }, width: '100%', overflow: 'auto' }}>
          <DataGrid
            rows={filteredOrders}
            columns={columns}
            loading={loading}
            initialState={{ pagination: { paginationModel: { page: 0, pageSize: 25 } } }}
            pageSizeOptions={[10, 25, 50, 100]}
            disableRowSelectionOnClick
            localeText={ruRU}
            sx={{
              '& .MuiDataGrid-cell:focus': { outline: 'none' },
              '& .MuiDataGrid-columnHeaders': { fontSize: { xs: '0.75rem', md: '0.875rem' } },
              '& .MuiDataGrid-cell': { fontSize: { xs: '0.75rem', md: '0.875rem' } },
            }}
          />
        </Paper>

        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="h6" component="span">
                Заказ #{editingOrder?.id}
              </Typography>
              {editingOrder && (
                <Chip
                  label={getStatusLabel(editingOrder.status)}
                  size="small"
                  color={getStatusColor(editingOrder.status)}
                />
              )}
            </Stack>
          </DialogTitle>
          <DialogContent dividers>
            {editingOrder && (
              <Stack spacing={3} sx={{ mt: 1 }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary', fontWeight: 600 }}>
                    Прогресс заказа
                  </Typography>
                  <OrderStatusStepper
                    status={editingOrder.status}
                    timestamps={editingOrder}
                    orientation="horizontal"
                  />
                </Box>

                {(nextStatus || canCancel) && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary', fontWeight: 600 }}>
                      Быстрые действия
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {nextStatus && (
                        <Tooltip title={ORDER_STATUS_META[nextStatus].description}>
                          <span>
                            <Button
                              variant="contained"
                              startIcon={advancing ? <CircularProgress size={16} color="inherit" /> : <ArrowForward />}
                              onClick={() => handleAdvance(nextStatus)}
                              disabled={advancing}
                              sx={{
                                background: `linear-gradient(135deg, ${ORDER_STATUS_META[nextStatus].hex} 0%, ${ORDER_STATUS_META[nextStatus].hex}dd 100%)`,
                                '&:hover': {
                                  background: `linear-gradient(135deg, ${ORDER_STATUS_META[nextStatus].hex} 0%, ${ORDER_STATUS_META[nextStatus].hex} 100%)`,
                                  filter: 'brightness(0.95)',
                                },
                              }}
                            >
                              Перевести в «{ORDER_STATUS_META[nextStatus].label}»
                            </Button>
                          </span>
                        </Tooltip>
                      )}
                      {canCancel && (
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<CancelIcon />}
                          onClick={() => handleAdvance('CANCELLED')}
                          disabled={advancing}
                        >
                          Отменить заказ
                        </Button>
                      )}
                    </Stack>
                  </Box>
                )}

                <Divider />

                <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  Параметры заказа
                </Typography>

                <FormControl fullWidth>
                  <InputLabel>Пользователь</InputLabel>
                  <Select
                    value={formData.user_id}
                    label="Пользователь"
                    onChange={(e) => handleInputChange('user_id', e.target.value as string)}
                  >
                    <MenuItem value="">Гость</MenuItem>
                    {users.map((user) => (
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
                    {statusOptionsForOrder.map((value) => {
                      const meta = ORDER_STATUS_META[value];
                      const Icon = meta.icon;
                      return (
                        <MenuItem key={value} value={value}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Icon sx={{ fontSize: '1.1rem', color: meta.hex }} />
                            <span>{meta.label}</span>
                          </Stack>
                        </MenuItem>
                      );
                    })}
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
            )}
          </DialogContent>
          <DialogActions sx={{ flexDirection: { xs: 'column', sm: 'row' }, gap: 2, p: { xs: 2, md: 3 } }}>
            <Button
              onClick={handleDownloadReceipt}
              variant="outlined"
              startIcon={downloadingReceipt ? <CircularProgress size={18} /> : <ReceiptIcon />}
              disabled={downloadingReceipt || saving || !editingOrder}
              sx={{ width: { xs: '100%', sm: 'auto' }, mr: { sm: 'auto' } }}
            >
              {downloadingReceipt ? 'Генерация...' : 'Скачать чек'}
            </Button>
            <Button onClick={() => setOpenDialog(false)} disabled={saving} sx={{ width: { xs: '100%', sm: 'auto' } }}>
              Закрыть
            </Button>
            <Button
              onClick={handleSave}
              variant="contained"
              disabled={saving}
              startIcon={saving ? <CircularProgress size={20} /> : null}
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              {saving ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </DialogActions>
        </Dialog>

        <Menu anchorEl={exportMenuAnchor} open={Boolean(exportMenuAnchor)} onClose={handleExportClose}>
          <MenuItem onClick={handleExportExcel}>
            <ListItemIcon><FileDownload fontSize="small" /></ListItemIcon>
            <ListItemText>Экспорт в Excel</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleExportPDF}>
            <ListItemIcon><FileDownload fontSize="small" /></ListItemIcon>
            <ListItemText>Экспорт в PDF</ListItemText>
          </MenuItem>
        </Menu>

      </Container>
    </AdminLayout>
  );
}
