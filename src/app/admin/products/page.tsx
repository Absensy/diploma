'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  CircularProgress,
  Paper,
  Toolbar,
  Stack,
  Avatar,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Refresh,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridActionsCellItem, GridRowParams, GridRenderCellParams } from '@mui/x-data-grid';
import AdminLayout from '@/components/AdminLayout/AdminLayout';
import ImageUpload from '@/components/ImageUpload/ImageUpload';
import { useAdminCategories } from '@/hooks/useAdminCategories';

// TypeScript interfaces
interface Product {
  id: number;
  name: string;
  slug: string | null;
  short_description: string;
  full_description: string;
  materials: string;
  production_time: string;
  price: number;
  discount: number | null;
  discounted_price: number | null;
  image: string;
  category_id: number | null;
  category: {
    id: number;
    name: string;
  } | null;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  weight: number | null;
  dimensions: string | null;
  stock_quantity: number | null;
  sku: string | null;
  is_new: boolean;
  is_popular: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ProductFormData {
  name: string;
  slug: string;
  short_description: string;
  full_description: string;
  materials: string;
  production_time: string;
  price: string;
  discount: string;
  discounted_price: string;
  image: string;
  category_id: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  weight: string;
  dimensions: string;
  stock_quantity: string;
  sku: string;
  is_new: boolean;
  is_popular: boolean;
  is_active: boolean;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
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
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditingDiscountedPrice, setIsEditingDiscountedPrice] = useState(false);
  const { categories, loading: categoriesLoading } = useAdminCategories();

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    slug: '',
    short_description: '',
    full_description: '',
    materials: '',
    production_time: '',
    price: '',
    discount: '',
    discounted_price: '',
    image: '',
    category_id: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    weight: '',
    dimensions: '',
    stock_quantity: '',
    sku: '',
    is_new: false,
    is_popular: false,
    is_active: true,
  });

  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/admin/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch products';
      setError(message);
      setSnackbar({ open: true, message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle form input changes
  const handleInputChange = (field: keyof ProductFormData, value: string | boolean) => {
    setFormData((prev: ProductFormData) => {
      const newData = { ...prev, [field]: value };

      // Auto-generate slug from name
      if (field === 'name' && !editingProduct) {
        const slug = (value as string)
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '');
        newData.slug = slug;
      }

      // Auto-calculate discounted price
      if ((field === 'price' || field === 'discount') && !isEditingDiscountedPrice) {
        const price = field === 'price' ? parseFloat(value as string) : parseFloat(prev.price);
        const discount = field === 'discount' ? parseFloat(value as string) : parseFloat(prev.discount);

        if (price && discount && discount > 0) {
          const discountedPrice = price * (1 - discount / 100);
          newData.discounted_price = Math.round(discountedPrice * 100) / 100 + '';
        } else if (field === 'discount' && (!discount || discount <= 0)) {
          newData.discounted_price = '';
        }
      }

      return newData;
    });
  };

  // Open dialog for create
  const handleCreate = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      slug: '',
      short_description: '',
      full_description: '',
      materials: '',
      production_time: '',
      price: '',
      discount: '',
      discounted_price: '',
      image: '',
      category_id: '',
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
      weight: '',
      dimensions: '',
      stock_quantity: '',
      sku: '',
      is_new: false,
      is_popular: false,
      is_active: true,
    });
    setIsEditingDiscountedPrice(false);
    setOpenDialog(true);
  };

  // Open dialog for edit
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsEditingDiscountedPrice(false);
    setFormData({
      name: product.name,
      slug: product.slug || '',
      short_description: product.short_description,
      full_description: product.full_description,
      materials: product.materials,
      production_time: product.production_time,
      price: product.price.toString(),
      discount: product.discount?.toString() || '',
      discounted_price: product.discounted_price?.toString() || '',
      image: product.image,
      category_id: product.category_id?.toString() || '',
      meta_title: product.meta_title || '',
      meta_description: product.meta_description || '',
      meta_keywords: product.meta_keywords || '',
      weight: product.weight?.toString() || '',
      dimensions: product.dimensions || '',
      stock_quantity: product.stock_quantity?.toString() || '',
      sku: product.sku || '',
      is_new: product.is_new,
      is_popular: product.is_popular,
      is_active: product.is_active,
    });
    setOpenDialog(true);
  };

  // Handle save (create or update)
  const handleSave = async () => {
    // Validation
    if (!formData.name.trim()) {
      setSnackbar({ open: true, message: 'Название товара обязательно', severity: 'error' });
      return;
    }
    if (!formData.price || parseFloat(formData.price) < 0) {
      setSnackbar({ open: true, message: 'Требуется корректная цена', severity: 'error' });
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const url = editingProduct
        ? `/api/admin/products/${editingProduct.id}`
        : '/api/admin/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          category_id: formData.category_id || null,
          discount: formData.discount ? parseFloat(formData.discount) : null,
          discounted_price: formData.discounted_price ? parseFloat(formData.discounted_price) : null,
          weight: formData.weight ? parseFloat(formData.weight) : null,
          stock_quantity: formData.stock_quantity ? parseInt(formData.stock_quantity) : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save product');
      }

      setSnackbar({
        open: true,
        message: editingProduct ? 'Товар успешно обновлен' : 'Товар успешно создан',
        severity: 'success',
      });
      setOpenDialog(false);
      fetchProducts();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save product';
      setError(message);
      setSnackbar({ open: true, message, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) {
      return;
    }

    try {
      setDeleting(id);
      setError(null);

      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      setSnackbar({ open: true, message: 'Товар успешно удален', severity: 'success' });
      fetchProducts();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete product';
      setError(message);
      setSnackbar({ open: true, message, severity: 'error' });
    } finally {
      setDeleting(null);
    }
  };

  // Toggle active status
  const handleToggleActive = async (product: Product) => {
    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_active: !product.is_active,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      setSnackbar({
        open: true,
        message: product.is_active ? 'Товар деактивирован' : 'Товар активирован',
        severity: 'success',
      });
      fetchProducts();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update product';
      setSnackbar({ open: true, message, severity: 'error' });
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
      field: 'image',
      headerName: 'Изображение',
      width: 100,
      renderCell: (params: GridRenderCellParams<Product>) => (
        <Avatar
          src={params.value as string}
          alt={params.row.name}
          variant="rounded"
          sx={{ width: 56, height: 56 }}
        />
      ),
      sortable: false,
      filterable: false,
    },
    {
      field: 'name',
      headerName: 'Название',
      width: 200,
      flex: 1,
    },
    {
      field: 'category',
      headerName: 'Category',
      width: 150,
      valueGetter: (value: unknown, row: Product) => row.category?.name || 'Без категории',
      renderCell: (params: GridRenderCellParams<Product>) => (
        <Chip
          label={params.value}
          size="small"
          color={params.row.category ? 'primary' : 'default'}
          variant="outlined"
        />
      ),
    },
    {
      field: 'price',
      headerName: 'Цена',
      width: 120,
      type: 'number',
      valueFormatter: (value: number | null) => value != null ? `${value.toFixed(2)} BYN` : 'Н/Д',
    },
    {
      field: 'discount',
      headerName: 'Скидка',
      width: 100,
      type: 'number',
      renderCell: (params: GridRenderCellParams<Product>) =>
        params.value ? (
          <Chip label={`${params.value}%`} size="small" color="error" />
        ) : (
          '-'
        ),
    },
    {
      field: 'stock_quantity',
      headerName: 'Остаток',
      width: 100,
      type: 'number',
      renderCell: (params: GridRenderCellParams<Product>) => (
        <Chip
          label={params.value ?? 'Н/Д'}
          size="small"
          color={params.value && params.value > 0 ? 'success' : 'default'}
        />
      ),
    },
    {
      field: 'is_active',
      headerName: 'Статус',
      width: 100,
      type: 'boolean',
      renderCell: (params: GridRenderCellParams<Product>) => (
        <Chip
          label={params.value ? 'Активен' : 'Неактивен'}
          size="small"
          color={params.value ? 'success' : 'default'}
        />
      ),
    },
    {
      field: 'is_new',
      headerName: 'Новинка',
      width: 80,
      type: 'boolean',
      renderCell: (params: GridRenderCellParams<Product>) => (params.value ? <Chip label="New" size="small" color="info" /> : '-'),
    },
    {
      field: 'is_popular',
      headerName: 'Популярное',
      width: 100,
      type: 'boolean',
      renderCell: (params: GridRenderCellParams<Product>) => (params.value ? <Chip label="Popular" size="small" color="warning" /> : '-'),
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
          onClick={() => handleEdit(params.row as Product)}
        />,
        <GridActionsCellItem
          key="toggle"
          icon={params.row.is_active ? <VisibilityOff /> : <Visibility />}
          label={params.row.is_active ? 'Деактивировать' : 'Активировать'}
          onClick={() => handleToggleActive(params.row as Product)}
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
                Управление товарами
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Управление каталогом товаров
              </Typography>
            </Box>
            <Stack direction="row" gap={1}>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={fetchProducts}
                disabled={loading}
              >
                Обновить
              </Button>
              <Button variant="contained" startIcon={<Add />} onClick={handleCreate}>
                Добавить товар
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
            rows={products}
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

        {/* Create/Edit Dialog */}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: { maxHeight: '90vh' },
          }}
        >
          <DialogTitle>
            {editingProduct ? 'Редактировать товар' : 'Создать новый товар'}
          </DialogTitle>
          <DialogContent dividers>
            <Stack spacing={3} sx={{ mt: 1 }}>
              {/* Basic Information */}
              <TextField
                label="Название товара *"
                value={formData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('name', e.target.value)}
                fullWidth
                required
              />
              <TextField
                label="Slug"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                fullWidth
                helperText="URL-идентификатор (автоматически генерируется из названия)"
              />
              <TextField
                label="SKU"
                value={formData.sku}
                onChange={(e) => handleInputChange('sku', e.target.value)}
                fullWidth
              />
              <TextField
                label="Краткое описание *"
                value={formData.short_description}
                onChange={(e) => handleInputChange('short_description', e.target.value)}
                fullWidth
                required
                multiline
                rows={2}
              />
              <TextField
                label="Полное описание *"
                value={formData.full_description}
                onChange={(e) => handleInputChange('full_description', e.target.value)}
                fullWidth
                required
                multiline
                rows={4}
              />
              <TextField
                label="Materials"
                value={formData.materials}
                onChange={(e) => handleInputChange('materials', e.target.value)}
                fullWidth
                helperText="Список материалов через запятую"
              />
              <TextField
                label="Время изготовления"
                value={formData.production_time}
                onChange={(e) => handleInputChange('production_time', e.target.value)}
                fullWidth
              />

              {/* Pricing */}
              <Stack direction="row" spacing={2}>
                <TextField
                  label="Цена *"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  fullWidth
                  required
                  inputProps={{ min: 0, step: 0.01 }}
                />
                <TextField
                  label="Скидка (%)"
                  type="number"
                  value={formData.discount}
                  onChange={(e) => handleInputChange('discount', e.target.value)}
                  fullWidth
                  inputProps={{ min: 0, max: 100 }}
                />
                <TextField
                  label="Цена со скидкой"
                  type="number"
                  value={formData.discounted_price}
                  onChange={(e) => {
                    handleInputChange('discounted_price', e.target.value);
                    setIsEditingDiscountedPrice(true);
                  }}
                  fullWidth
                  inputProps={{ min: 0, step: 0.01 }}
                  helperText="Автоматически рассчитывается или введите вручную"
                />
              </Stack>

              {/* Category */}
              <FormControl fullWidth>
                <InputLabel>Категория</InputLabel>
                <Select
                  value={formData.category_id}
                  label="Category"
                  onChange={(e) => handleInputChange('category_id', e.target.value as string)}
                >
                  <MenuItem value="">Без категории</MenuItem>
                  {categories.map((cat: { id: number; name: string }) => (
                    <MenuItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Image */}
              <Box>
                <ImageUpload
                  value={formData.image}
                  onChange={(url: string) => handleInputChange('image', url)}
                  label="Изображение товара"
                />
              </Box>

              {/* Additional Information */}
              <TextField
                label="Вес (кг)"
                type="number"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                fullWidth
                inputProps={{ min: 0, step: 0.01 }}
              />
              <TextField
                label="Габариты"
                value={formData.dimensions}
                onChange={(e) => handleInputChange('dimensions', e.target.value)}
                fullWidth
                helperText="e.g., 100x50x30"
              />
              <TextField
                label="Количество на складе"
                type="number"
                value={formData.stock_quantity}
                onChange={(e) => handleInputChange('stock_quantity', e.target.value)}
                fullWidth
                inputProps={{ min: 0 }}
              />

              {/* SEO Fields */}
              <TextField
                label="Meta заголовок"
                value={formData.meta_title}
                onChange={(e) => handleInputChange('meta_title', e.target.value)}
                fullWidth
              />
              <TextField
                label="Meta описание"
                value={formData.meta_description}
                onChange={(e) => handleInputChange('meta_description', e.target.value)}
                fullWidth
                multiline
                rows={2}
              />
              <TextField
                label="Meta ключевые слова"
                value={formData.meta_keywords}
                onChange={(e) => handleInputChange('meta_keywords', e.target.value)}
                fullWidth
                helperText="Ключевые слова через запятую"
              />

              {/* Flags */}
              <Stack direction="row" spacing={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.is_active}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('is_active', e.target.checked)}
                    />
                  }
                  label="Активен"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.is_new}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('is_new', e.target.checked)}
                    />
                  }
                  label="Новинка"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.is_popular}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('is_popular', e.target.checked)}
                    />
                  }
                  label="Популярное"
                />
              </Stack>
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
              {saving ? 'Сохранение...' : editingProduct ? 'Обновить' : 'Создать'}
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
