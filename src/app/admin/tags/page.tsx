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
  Search,
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridActionsCellItem, GridRowParams, GridRenderCellParams } from '@mui/x-data-grid';
import AdminLayout from '@/components/AdminLayout/AdminLayout';
import { ruRU } from '@/lib/dataGridLocale';

interface Tag {
  id: number;
  name: string;
  slug: string;
  created_at: string;
  productsCount: number;
}

interface TagFormData {
  name: string;
  slug: string;
}

export default function AdminTags() {
  const [tags, setTags] = useState<Tag[]>([]);
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
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [searchText, setSearchText] = useState('');

  // Filter tags based on search text
  const filteredTags = tags.filter((tag) => {
    if (!searchText.trim()) return true;
    const searchLower = searchText.toLowerCase();
    return (
      tag.name.toLowerCase().includes(searchLower) ||
      tag.slug.toLowerCase().includes(searchLower) ||
      tag.id.toString().includes(searchLower)
    );
  });

  const [formData, setFormData] = useState<TagFormData>({
    name: '',
    slug: '',
  });

  // Fetch tags
  const fetchTags = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/admin/tags');
      if (!response.ok) {
        throw new Error('Failed to fetch tags');
      }
      const data = await response.json();
      // Убеждаемся, что все slug являются строками
      const normalizedData = data.map((tag: any) => ({
        ...tag,
        slug: tag.slug ? String(tag.slug) : '',
      }));
      setTags(normalizedData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch tags';
      setError(message);
      setSnackbar({ open: true, message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  // Handle form input changes
  const handleInputChange = (field: keyof TagFormData, value: string) => {
    setFormData((prev: TagFormData) => {
      const newData = { ...prev, [field]: value };
      
      // Auto-generate slug from name
      if (field === 'name' && !editingTag) {
        const slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        newData.slug = slug;
      }
      
      return newData;
    });
  };

  // Open dialog for create
  const handleCreate = () => {
    setEditingTag(null);
    setFormData({
      name: '',
      slug: '',
    });
    setOpenDialog(true);
  };

  // Open dialog for edit
  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    setFormData({
      name: tag.name,
      slug: tag.slug,
    });
    setOpenDialog(true);
  };

  // Handle save (create or update)
  const handleSave = async () => {
    if (!formData.name.trim()) {
      setSnackbar({ open: true, message: 'Название тега обязательно', severity: 'error' });
      return;
    }

    if (!formData.slug.trim()) {
      setSnackbar({ open: true, message: 'Slug тега обязателен', severity: 'error' });
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const url = editingTag
        ? `/api/admin/tags/${editingTag.id}`
        : '/api/admin/tags';
      const method = editingTag ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save tag');
      }

      setSnackbar({
        open: true,
        message: editingTag ? 'Тег успешно обновлен' : 'Тег успешно создан',
        severity: 'success',
      });
      setOpenDialog(false);
      fetchTags();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save tag';
      setError(message);
      setSnackbar({ open: true, message, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот тег?')) {
      return;
    }

    try {
      setDeleting(id);
      setError(null);

      const response = await fetch(`/api/admin/tags/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete tag');
      }

      setSnackbar({ open: true, message: 'Тег успешно удален', severity: 'success' });
      fetchTags();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete tag';
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
      field: 'name',
      headerName: 'Название',
      width: 200,
      flex: 1,
    },
    {
      field: 'slug',
      headerName: 'URL-адрес',
      width: 200,
      flex: 1,
      type: 'string',
      valueGetter: (value: any, row: Tag) => {
        // Убеждаемся, что slug всегда строка
        if (!row.slug && value !== undefined) {
          return String(value);
        }
        return row.slug ? String(row.slug) : '';
      },
      renderCell: (params: GridRenderCellParams<Tag>) => {
        const slug = params.row.slug ? String(params.row.slug) : '';
        return <span>{slug || '-'}</span>;
      },
    },
    {
      field: 'productsCount',
      headerName: 'Используется в товарах',
      width: 150,
      type: 'number',
      renderCell: (params: GridRenderCellParams<Tag>) => (
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
          onClick={() => handleEdit(params.row as Tag)}
        />,
        <GridActionsCellItem
          key="delete"
          icon={<Delete />}
          label="Удалить"
          onClick={() => handleDelete(params.row.id)}
          disabled={deleting === params.row.id || params.row.productsCount > 0}
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
            Управление тегами
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Управление тегами товаров
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
        >
          <Box display="flex" alignItems="center" gap={2} flex={1} minWidth={0}>
            <Typography
              variant="h6"
              sx={{ fontSize: { xs: '1rem', md: '1.25rem' }, whiteSpace: 'nowrap' }}
            >
              Всего тегов: {filteredTags.length}
            </Typography>
            <TextField
              placeholder="Поиск по тегам..."
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
              onClick={fetchTags}
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
              Добавить тег
            </Button>
          </Stack>
        </Box>

        {/* DataGrid */}
        <Paper sx={{ height: { xs: 'calc(100vh - 250px)', md: 'calc(100vh - 300px)' }, width: '100%', overflow: 'auto' }}>
          <DataGrid
            rows={filteredTags}
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
          PaperProps={{
            sx: { 
              m: { xs: 1, md: 2 },
              width: { xs: 'calc(100% - 16px)', md: 'auto' }
            },
          }}
        >
          <DialogTitle>
            {editingTag ? 'Редактировать тег' : 'Создать новый тег'}
          </DialogTitle>
          <DialogContent dividers>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                label="Название тега"
                value={formData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('name', e.target.value)}
                fullWidth
                required
              />
              <TextField
                label="Slug"
                value={formData.slug}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('slug', e.target.value)}
                fullWidth
                required
                helperText="URL-идентификатор (автоматически генерируется из названия)"
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
              {saving ? 'Сохранение...' : editingTag ? 'Обновить' : 'Создать'}
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
