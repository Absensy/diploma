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
  Menu,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Refresh,
  Visibility,
  VisibilityOff,
  Search,
  FileDownload,
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridActionsCellItem, GridRowParams, GridRenderCellParams } from '@mui/x-data-grid';
import AdminLayout from '@/components/AdminLayout/AdminLayout';
import ImageUpload from '@/components/ImageUpload/ImageUpload';
import { useAdminCategories } from '@/hooks/useAdminCategories';
import { ruRU } from '@/lib/dataGridLocale';
import { exportToExcel, exportToPDF, ExportColumn } from '@/lib/exportUtils';

// Компонент для отображения изображения товара с обработкой ошибок
const ProductImageAvatar: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [imageError, setImageError] = useState(false);
  
  return (
    <Avatar
      src={imageError ? undefined : src}
      alt={alt}
      variant="rounded"
      sx={{ width: 56, height: 56 }}
      onError={() => setImageError(true)}
    >
      {alt?.charAt(0) || '?'}
    </Avatar>
  );
};

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
  const [searchText, setSearchText] = useState('');
  const [exportMenuAnchor, setExportMenuAnchor] = useState<null | HTMLElement>(null);
  const { categories, loading: categoriesLoading } = useAdminCategories();

  // Filter products based on search text
  const filteredProducts = products.filter((product) => {
    if (!searchText.trim()) return true;
    const searchLower = searchText.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchLower) ||
      product.id.toString().includes(searchLower) ||
      product.sku?.toLowerCase().includes(searchLower) ||
      product.category?.name.toLowerCase().includes(searchLower) ||
      product.price.toString().includes(searchLower)
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

  const handleExportExcel = () => {
    const exportColumns: ExportColumn[] = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Название', key: 'name', width: 30 },
      { header: 'Категория', key: 'category', width: 20, formatter: (val, row) => row.category?.name || 'Без категории' },
      { header: 'Цена', key: 'price', width: 15, formatter: (val) => `${val} BYN` },
      { header: 'Скидка', key: 'discount', width: 12, formatter: (val) => val ? `${val}%` : '-' },
      { header: 'Цена со скидкой', key: 'discounted_price', width: 18, formatter: (val) => val ? `${val} BYN` : '-' },
      { header: 'Остаток', key: 'stock_quantity', width: 12, formatter: (val) => val ?? 'Н/Д' },
      { header: 'Статус', key: 'is_active', width: 12, formatter: (val) => val ? 'Активен' : 'Неактивен' },
      { header: 'Новинка', key: 'is_new', width: 10, formatter: (val) => val ? 'Да' : 'Нет' },
      { header: 'Популярное', key: 'is_popular', width: 12, formatter: (val) => val ? 'Да' : 'Нет' },
      { header: 'SKU', key: 'sku', width: 15 },
      { header: 'Создано', key: 'created_at', width: 20, formatter: (val) => new Date(val).toLocaleString('ru-RU') },
    ];
    exportToExcel(filteredProducts, exportColumns, `товары_${new Date().toISOString().split('T')[0]}`);
    handleExportClose();
  };

  const handleExportPDF = async () => {
    const exportColumns: ExportColumn[] = [
      { header: 'ID', key: 'id' },
      { header: 'Название', key: 'name' },
      { header: 'Категория', key: 'category', formatter: (val, row) => row.category?.name || 'Без категории' },
      { header: 'Цена', key: 'price', formatter: (val) => `${val} BYN` },
      { header: 'Скидка', key: 'discount', formatter: (val) => val ? `${val}%` : '-' },
      { header: 'Цена со скидкой', key: 'discounted_price', formatter: (val) => val ? `${val} BYN` : '-' },
      { header: 'Остаток', key: 'stock_quantity', formatter: (val) => val ?? 'Н/Д' },
      { header: 'Статус', key: 'is_active', formatter: (val) => val ? 'Активен' : 'Неактивен' },
      { header: 'Новинка', key: 'is_new', formatter: (val) => val ? 'Да' : 'Нет' },
      { header: 'Популярное', key: 'is_popular', formatter: (val) => val ? 'Да' : 'Нет' },
      { header: 'SKU', key: 'sku' },
      { header: 'Создано', key: 'created_at', formatter: (val) => new Date(val).toLocaleString('ru-RU') },
    ];
    await exportToPDF(filteredProducts, exportColumns, `товары_${new Date().toISOString().split('T')[0]}`, 'Отчет по товарам');
    handleExportClose();
  };

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
        <ProductImageAvatar 
          src={params.value as string} 
          alt={params.row.name} 
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
      headerName: 'Категория',
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
      renderCell: (params: GridRenderCellParams<Product>) => (params.value ? <Chip label="Новинка" size="small" color="info" /> : '-'),
    },
    {
      field: 'is_popular',
      headerName: 'Популярное',
      width: 100,
      type: 'boolean',
      renderCell: (params: GridRenderCellParams<Product>) => (params.value ? <Chip label="Популярное" size="small" color="warning" /> : '-'),
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
            Управление товарами
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Управление каталогом товаров
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
              Всего товаров: {filteredProducts.length}
            </Typography>
            <TextField
              placeholder="Поиск по товарам..."
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
              onClick={fetchProducts}
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
              Добавить товар
            </Button>
          </Stack>
        </Box>

        {/* DataGrid */}
        <Paper sx={{ height: { xs: 'calc(100vh - 250px)', md: 'calc(100vh - 300px)' }, width: '100%', overflow: 'auto' }}>
          <DataGrid
            rows={filteredProducts}
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
          maxWidth="md"
          fullWidth
          fullScreen={false}
          PaperProps={{
            sx: { 
              maxHeight: { xs: '100vh', md: '90vh' },
              m: { xs: 0, md: 2 },
              width: { xs: '100%', md: 'auto' }
            },
          }}
        >
          <DialogTitle>
            {editingProduct ? 'Редактировать товар' : 'Создать новый товар'}
          </DialogTitle>
          <DialogContent dividers>
            <Stack spacing={3} sx={{ mt: 1 }}>
              {/* Basic Information */}
              <TextField
                label="Название товара"
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
                label="Краткое описание"
                value={formData.short_description}
                onChange={(e) => handleInputChange('short_description', e.target.value)}
                fullWidth
                required
                multiline
                rows={2}
              />
              <TextField
                label="Полное описание"
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
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Цена"
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
                  label="Категория"
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
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
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
              {saving ? 'Сохранение...' : editingProduct ? 'Обновить' : 'Создать'}
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
