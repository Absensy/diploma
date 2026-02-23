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

interface Material {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  productsCount: number;
}

interface MaterialFormData {
  name: string;
  description: string;
}

export default function AdminMaterials() {
  const [materials, setMaterials] = useState<Material[]>([]);
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
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [searchText, setSearchText] = useState('');

  // Filter materials based on search text
  const filteredMaterials = materials.filter((material) => {
    if (!searchText.trim()) return true;
    const searchLower = searchText.toLowerCase();
    return (
      material.name.toLowerCase().includes(searchLower) ||
      material.id.toString().includes(searchLower) ||
      material.description?.toLowerCase().includes(searchLower)
    );
  });

  const [formData, setFormData] = useState<MaterialFormData>({
    name: '',
    description: '',
  });

  // Fetch materials
  const fetchMaterials = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/admin/materials');
      if (!response.ok) {
        throw new Error('Failed to fetch materials');
      }
      const data = await response.json();
      setMaterials(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch materials';
      setError(message);
      setSnackbar({ open: true, message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  // Handle form input changes
  const handleInputChange = (field: keyof MaterialFormData, value: string) => {
    setFormData((prev: MaterialFormData) => ({ ...prev, [field]: value }));
  };

  // Open dialog for create
  const handleCreate = () => {
    setEditingMaterial(null);
    setFormData({
      name: '',
      description: '',
    });
    setOpenDialog(true);
  };

  // Open dialog for edit
  const handleEdit = (material: Material) => {
    setEditingMaterial(material);
    setFormData({
      name: material.name,
      description: material.description || '',
    });
    setOpenDialog(true);
  };

  // Handle save (create or update)
  const handleSave = async () => {
    if (!formData.name.trim()) {
      setSnackbar({ open: true, message: 'Название материала обязательно', severity: 'error' });
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const url = editingMaterial
        ? `/api/admin/materials/${editingMaterial.id}`
        : '/api/admin/materials';
      const method = editingMaterial ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save material');
      }

      setSnackbar({
        open: true,
        message: editingMaterial ? 'Материал успешно обновлен' : 'Материал успешно создан',
        severity: 'success',
      });
      setOpenDialog(false);
      fetchMaterials();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save material';
      setError(message);
      setSnackbar({ open: true, message, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот материал?')) {
      return;
    }

    try {
      setDeleting(id);
      setError(null);

      const response = await fetch(`/api/admin/materials/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete material');
      }

      setSnackbar({ open: true, message: 'Материал успешно удален', severity: 'success' });
      fetchMaterials();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete material';
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
      field: 'description',
      headerName: 'Описание',
      width: 300,
      flex: 1,
    },
    {
      field: 'productsCount',
      headerName: 'Используется в товарах',
      width: 150,
      type: 'number',
      renderCell: (params: GridRenderCellParams<Material>) => (
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
          onClick={() => handleEdit(params.row as Material)}
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
            Управление материалами
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Управление материалами товаров
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
              Всего материалов: {filteredMaterials.length}
            </Typography>
            <TextField
              placeholder="Поиск по материалам..."
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
              onClick={fetchMaterials}
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
              Добавить материал
            </Button>
          </Stack>
        </Box>

        {/* DataGrid */}
        <Paper sx={{ height: { xs: 'calc(100vh - 250px)', md: 'calc(100vh - 300px)' }, width: '100%', overflow: 'auto' }}>
          <DataGrid
            rows={filteredMaterials}
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
            {editingMaterial ? 'Редактировать материал' : 'Создать новый материал'}
          </DialogTitle>
          <DialogContent dividers>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                label="Название материала"
                value={formData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('name', e.target.value)}
                fullWidth
                required
              />
              <TextField
                label="Описание"
                value={formData.description}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('description', e.target.value)}
                fullWidth
                multiline
                rows={4}
              />
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
              {saving ? 'Сохранение...' : editingMaterial ? 'Обновить' : 'Создать'}
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
