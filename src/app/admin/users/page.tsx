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
  Alert,
  CircularProgress,
  Paper,
  Stack,
  Chip,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Refresh,
  Search,
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridActionsCellItem, GridRowParams, GridRenderCellParams } from '@mui/x-data-grid';
import AdminLayout from '@/components/AdminLayout/AdminLayout';
import { ruRU } from '@/lib/dataGridLocale';
import { useAlert } from '@/components/GlobalAlert/GlobalAlert';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  is_admin?: boolean;
  created_at: string;
  ordersCount: number;
}

interface UserFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  is_admin: boolean;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { showSuccess, showError } = useAlert();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchText, setSearchText] = useState('');

  // Filter users based on search text
  const filteredUsers = users.filter((user) => {
    if (!searchText.trim()) return true;
    const searchLower = searchText.toLowerCase();
    return (
      user.first_name.toLowerCase().includes(searchLower) ||
      user.last_name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.phone?.toLowerCase().includes(searchLower) ||
      user.id.toString().includes(searchLower)
    );
  });

  const [formData, setFormData] = useState<UserFormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    is_admin: false,
  });

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/admin/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch users';
      setError(message);
      showError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle form input changes
  const handleInputChange = (field: keyof UserFormData, value: string | boolean) => {
    setFormData((prev: UserFormData) => ({ ...prev, [field]: value }));
  };

  // Open dialog for create
  const handleCreate = () => {
    setEditingUser(null);
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      password: '',
      is_admin: false,
    });
    setOpenDialog(true);
  };

  // Open dialog for edit
  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone || '',
      password: '', // Don't show password when editing
      is_admin: user.is_admin || false,
    });
    setOpenDialog(true);
  };

  // Handle save (create or update)
  const handleSave = async () => {
    if (!formData.first_name.trim() || !formData.last_name.trim() || !formData.email.trim()) {
      showError('Имя, фамилия и email обязательны');
      return;
    }

    if (!editingUser && !formData.password.trim()) {
      showError('Пароль обязателен для новых пользователей');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const url = editingUser
        ? `/api/admin/users/${editingUser.id}`
        : '/api/admin/users';
      const method = editingUser ? 'PUT' : 'POST';

      const payload: any = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        is_admin: formData.is_admin,
      };

      // Only include password if it's provided (for new users or when updating)
      if (formData.password.trim()) {
        payload.password = formData.password;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save user');
      }

      showSuccess(editingUser ? 'Пользователь успешно обновлен' : 'Пользователь успешно создан');
      setOpenDialog(false);
      fetchUsers();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save user';
      setError(message);
      showError(message);
    } finally {
      setSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      return;
    }

    try {
      setDeleting(id);
      setError(null);

      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete user');
      }

      showSuccess('Пользователь успешно удален');
      fetchUsers();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete user';
      setError(message);
      showError(message);
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
      field: 'first_name',
      headerName: 'Имя',
      width: 150,
    },
    {
      field: 'last_name',
      headerName: 'Фамилия',
      width: 150,
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 250,
      flex: 1,
    },
    {
      field: 'phone',
      headerName: 'Телефон',
      width: 150,
      valueGetter: (value: string | null) => value || 'Н/Д',
    },
    {
      field: 'is_admin',
      headerName: 'Админ',
      width: 100,
      type: 'boolean',
      renderCell: (params: GridRenderCellParams<User>) => (
        <Chip
          label={params.value ? 'Да' : 'Нет'}
          size="small"
          color={params.value ? 'error' : 'default'}
        />
      ),
    },
    {
      field: 'ordersCount',
      headerName: 'Заказов',
      width: 100,
      type: 'number',
      renderCell: (params: GridRenderCellParams<User>) => (
        <Chip
          label={params.value as number}
          size="small"
          color={(params.value as number) > 0 ? 'primary' : 'default'}
        />
      ),
    },
    {
      field: 'created_at',
      headerName: 'Создано',
      width: 150,
      type: 'dateTime',
      valueGetter: (value: string) => new Date(value),
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
          onClick={() => handleEdit(params.row as User)}
        />,
        <GridActionsCellItem
          key="delete"
          icon={<Delete sx={{ color: 'error.main' }} />}
          label="Удалить"
          onClick={() => handleDelete(params.row.id)}
          disabled={deleting === params.row.id || params.row.ordersCount > 0}
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
            Управление пользователями
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Управление учетными записями пользователей
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
              Всего пользователей: {filteredUsers.length}
            </Typography>
            <TextField
              placeholder="Поиск по пользователям..."
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
              onClick={fetchUsers}
              disabled={loading}
              size="small"
            >
              Обновить
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleCreate}
              sx={{
                backgroundColor: '#333',
                '&:hover': { backgroundColor: '#555' },
                width: { xs: '100%', sm: 'auto' }
              }}
            >
              Добавить пользователя
            </Button>
          </Stack>
        </Box>

        {/* DataGrid */}
        <Paper sx={{ height: { xs: 'calc(100vh - 250px)', md: 'calc(100vh - 300px)' }, width: '100%', overflow: 'auto' }}>
          <DataGrid
            rows={filteredUsers}
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

        {/* Create/Edit Dialog */}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {editingUser ? 'Редактировать пользователя' : 'Создать нового пользователя'}
          </DialogTitle>
          <DialogContent dividers>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                label="Имя"
                value={formData.first_name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('first_name', e.target.value)}
                fullWidth
                required
              />
              <TextField
                label="Фамилия"
                value={formData.last_name}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                fullWidth
                required
              />
              <TextField
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                fullWidth
                required
                disabled={!!editingUser}
              />
              <TextField
                label="Телефон"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                fullWidth
              />
              <TextField
                label={editingUser ? 'Новый пароль (оставьте пустым, чтобы оставить текущий)' : 'Пароль'}
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                fullWidth
                required={!editingUser}
                helperText={editingUser ? 'Оставьте пустым, чтобы оставить текущий пароль' : 'Обязательно для новых пользователей'}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.is_admin}
                    onChange={(e) => handleInputChange('is_admin', e.target.checked)}
                  />
                }
                label="Администратор"
              />
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
              {saving ? 'Сохранение...' : editingUser ? 'Обновить' : 'Создать'}
            </Button>
          </DialogActions>
        </Dialog>

      </Container>
    </AdminLayout>
  );
}
