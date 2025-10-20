'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
  Checkbox,
  Alert,
  Avatar,
  CircularProgress,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  FilterList,
} from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout/AdminLayout';
import ImageUpload from '@/components/ImageUpload/ImageUpload';
import { useAdminProducts } from '@/hooks/useAdminProducts';
import { useAdminCategories } from '@/hooks/useAdminCategories';
import { AdminProductsTableSkeleton } from '@/components/AdminSkeleton/AdminSkeleton';
import { AdminOperationOverlay } from '@/components/AdminOperationOverlay/AdminOperationOverlay';
import EmptyState from '@/components/EmptyState/EmptyState';

interface ProductFormData {
  name: string;
  short_description: string;
  full_description: string;
  materials: string;
  production_time: string;
  price: string;
  discount: string;
  discounted_price: string;
  image: string;
  category_id: string;
  is_new: boolean;
  is_popular: boolean;
  is_active: boolean;
}

export default function AdminProducts() {
  const { products, loading, saving, deleting, error, createProduct, updateProduct, deleteProduct, deleteProducts } = useAdminProducts();
  const { categories } = useAdminCategories();
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [isEditingDiscountedPrice, setIsEditingDiscountedPrice] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    short_description: '',
    full_description: '',
    materials: '',
    production_time: '',
    price: '',
    discount: '',
    discounted_price: '',
    image: '',
    category_id: '',
    is_new: false,
    is_popular: false,
    is_active: true,
  });

  const handleSelectProduct = (productId: number) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    setSelectedProducts(
      selectedProducts.length === products.length ? [] : products.map(p => p.id)
    );
  };

  const handleDeleteSelected = async () => {
    try {
      await deleteProducts(selectedProducts);
      setSelectedProducts([]);
      setDeleteAlert(true);
      setTimeout(() => setDeleteAlert(false), 3000);
    } catch (error) {
      console.error('Error deleting products:', error);
    }
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setIsEditingDiscountedPrice(false);
    setFormData({
      name: product.name,
      short_description: product.short_description,
      full_description: product.full_description,
      materials: product.materials,
      production_time: product.production_time,
      price: product.price.toString(),
      discount: product.discount?.toString() || '',
      discounted_price: product.discounted_price?.toString() || '',
      image: product.image,
      category_id: product.category_id?.toString() || '',
      is_new: Boolean(product.is_new),
      is_popular: Boolean(product.is_popular),
      is_active: Boolean(product.is_active),
    });
    setOpenDialog(true);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsEditingDiscountedPrice(false);
    setFormData({
      name: '',
      short_description: '',
      full_description: '',
      materials: '',
      production_time: '',
      price: '',
      discount: '',
      discounted_price: '',
      image: '',
      category_id: '',
      is_new: false,
      is_popular: false,
      is_active: true,
    });
    setOpenDialog(true);
  };

  const handleSaveProduct = async () => {
    try {
      const productData = {
        name: formData.name,
        short_description: formData.short_description,
        full_description: formData.full_description,
        materials: formData.materials,
        production_time: formData.production_time,
        price: parseFloat(formData.price),
        ...(formData.discount && { discount: parseInt(formData.discount) }),
        ...(formData.discounted_price && { discounted_price: parseFloat(formData.discounted_price) }),
        image: formData.image,
        ...(formData.category_id && { category_id: parseInt(formData.category_id) }),
        is_new: formData.is_new,
        is_popular: formData.is_popular,
        is_active: formData.is_active,
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await createProduct(productData);
      }

      setOpenDialog(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleInputChange = (field: keyof ProductFormData, value: string | boolean) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };

      // Автоматический расчет цены со скидкой (только если пользователь не редактирует её вручную)
      if ((field === 'price' || field === 'discount') && !isEditingDiscountedPrice) {
        const price = field === 'price' ? parseFloat(value as string) : parseFloat(prev.price);
        const discount = field === 'discount' ? parseFloat(value as string) : parseFloat(prev.discount);

        if (price && discount && discount > 0) {
          const discountedPrice = price * (1 - discount / 100);
          newData.discounted_price = Math.round(discountedPrice).toString();
        } else if (field === 'discount' && (!discount || discount <= 0)) {
          // Если скидка убрана или равна 0, очищаем цену со скидкой
          newData.discounted_price = '';
        }
      }

      return newData;
    });
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.short_description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box mb={4}>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Управление товарами
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Добавление, редактирование и удаление товаров в каталоге
          </Typography>
        </Box>

        {deleteAlert && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Выбранные товары успешно удалены!
          </Alert>
        )}

        {/* Controls */}
        <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
          <Box
            display="flex"
            flexDirection={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'stretch', sm: 'center' }}
            gap={2}
          >
            <Box
              display="flex"
              gap={2}
              alignItems="center"
              flexDirection={{ xs: 'column', sm: 'row' }}
              width={{ xs: '100%', sm: 'auto' }}
            >
              <TextField
                size="small"
                placeholder="Поиск товаров..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ color: 'action.active', mr: 1 }} />,
                }}
                sx={{
                  minWidth: { xs: '100%', sm: 300 },
                  width: { xs: '100%', sm: 'auto' }
                }}
              />
              <IconButton sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}>
                <FilterList />
              </IconButton>
            </Box>
            <Box
              display="flex"
              gap={2}
              flexDirection={{ xs: 'column', sm: 'row' }}
              width={{ xs: '100%', sm: 'auto' }}
            >
              {selectedProducts.length > 0 && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Delete />}
                  onClick={handleDeleteSelected}
                  sx={{ width: { xs: '100%', sm: 'auto' } }}
                >
                  Удалить выбранные ({selectedProducts.length})
                </Button>
              )}
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddProduct}
                sx={{
                  backgroundColor: '#333',
                  '&:hover': { backgroundColor: '#555' },
                  width: { xs: '100%', sm: 'auto' }
                }}
              >
                Добавить товар
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Loading State */}
        {loading && <AdminProductsTableSkeleton />}

        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Products Table */}
        {!loading && !error && (
          <>
            {filteredProducts.length === 0 ? (
              <EmptyState
                message="Товары не найдены"
                variant="card"
                height={300}
              />
            ) : (
              <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
                <Table sx={{ minWidth: 800 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                        <Checkbox
                          checked={selectedProducts.length === products.length}
                          indeterminate={selectedProducts.length > 0 && selectedProducts.length < products.length}
                          onChange={handleSelectAll}
                        />
                      </TableCell>
                      <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Изображение</TableCell>
                      <TableCell>Название</TableCell>
                      <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Категория</TableCell>
                      <TableCell>Цена</TableCell>
                      <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>Статус</TableCell>
                      <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>Дата создания</TableCell>
                      <TableCell align="center">Действия</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id} hover>
                        <TableCell padding="checkbox" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                          <Checkbox
                            checked={selectedProducts.includes(product.id)}
                            onChange={() => handleSelectProduct(product.id)}
                          />
                        </TableCell>
                        <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                          <Avatar
                            src={product.image}
                            alt={product.name}
                            variant="rounded"
                            sx={{ width: 50, height: 50 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={2}>
                            <Avatar
                              src={product.image}
                              alt={product.name}
                              variant="rounded"
                              sx={{
                                width: { xs: 40, sm: 0 },
                                height: { xs: 40, sm: 0 },
                                display: { xs: 'block', sm: 'none' }
                              }}
                            />
                            <Box>
                              <Typography variant="subtitle2" fontWeight="medium">
                                {product.name}
                              </Typography>
                              <Typography variant="caption" color="textSecondary" sx={{ display: { xs: 'block', sm: 'block' } }}>
                                {product.short_description}
                              </Typography>
                              <Typography variant="caption" color="textSecondary" sx={{ display: { xs: 'block', md: 'none' } }}>
                                {product.category?.name || 'Без категории'}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                          {product.category?.name || 'Без категории'}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {product.price} руб.
                            {product.discounted_price && (
                              <span style={{ textDecoration: 'line-through', marginLeft: 8, color: 'gray' }}>
                                {product.discounted_price} руб.
                              </span>
                            )}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>
                          <Box display="flex" gap={1} flexWrap="wrap">
                            {product.is_new && <Chip label="Новинка" color="primary" size="small" />}
                            {product.is_popular && <Chip label="Популярный" color="success" size="small" />}
                            <Chip
                              label={product.is_active ? "Активен" : "Неактивен"}
                              color={product.is_active ? "success" : "error"}
                              size="small"
                            />
                          </Box>
                        </TableCell>
                        <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>
                          {new Date(product.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell align="center">
                          <Box display="flex" gap={1} justifyContent="center">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleEditProduct(product)}
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => deleteProduct(product.id)}
                            >
                              <Delete />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}

        {/* Add/Edit Product Dialog */}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="lg"
          fullWidth
          fullScreen
        >
          <DialogTitle>
            {editingProduct ? 'Редактировать товар' : 'Добавить новый товар'}
          </DialogTitle>
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={3} pt={1}>
              <TextField
                fullWidth
                label="Название товара"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Краткое описание"
                value={formData.short_description}
                onChange={(e) => handleInputChange('short_description', e.target.value)}
                variant="outlined"
                multiline
                rows={2}
              />
              <TextField
                fullWidth
                label="Полное описание"
                value={formData.full_description}
                onChange={(e) => handleInputChange('full_description', e.target.value)}
                variant="outlined"
                multiline
                rows={3}
              />
              <FormControl fullWidth>
                <InputLabel>Категория</InputLabel>
                <Select
                  value={formData.category_id}
                  onChange={(e) => handleInputChange('category_id', e.target.value)}
                  label="Категория"
                >
                  <MenuItem value="">Без категории</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box
                display="flex"
                gap={2}
                flexDirection={{ xs: 'column', sm: 'row' }}
              >
                <TextField
                  fullWidth
                  label="Цена (руб.)"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Скидка (%)"
                  type="number"
                  value={formData.discount}
                  onChange={(e) => handleInputChange('discount', e.target.value)}
                  variant="outlined"
                />
                <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                  <TextField
                    fullWidth
                    label="Цена со скидкой (руб.)"
                    type="number"
                    value={formData.discounted_price}
                    onChange={(e) => handleInputChange('discounted_price', e.target.value)}
                    variant="outlined"
                    InputProps={{
                      readOnly: !isEditingDiscountedPrice,
                    }}
                    helperText={isEditingDiscountedPrice ? "Редактирование вручную" : "Рассчитывается автоматически"}
                  />
                  <Button
                    variant={isEditingDiscountedPrice ? "contained" : "outlined"}
                    size="small"
                    onClick={() => setIsEditingDiscountedPrice(!isEditingDiscountedPrice)}
                    sx={{ minWidth: 'auto', px: 2 }}
                  >
                    {isEditingDiscountedPrice ? "Авто" : "Изменить"}
                  </Button>
                </Box>
              </Box>
              <Box
                display="flex"
                gap={2}
                flexDirection={{ xs: 'column', sm: 'row' }}
              >
                <TextField
                  fullWidth
                  label="Материалы"
                  value={formData.materials}
                  onChange={(e) => handleInputChange('materials', e.target.value)}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Время производства"
                  value={formData.production_time}
                  onChange={(e) => handleInputChange('production_time', e.target.value)}
                  variant="outlined"
                />
              </Box>
              <ImageUpload
                value={formData.image}
                onChange={(imageUrl) => handleInputChange('image', imageUrl)}
                label="Изображение товара"
                helperText="Загрузите изображение товара (JPEG, PNG, WebP до 5MB)"
                previewSize={{ width: 180, height: 120 }}
                aspectRatio={200 / 120}
                uploadType="product"
              />
              <Box display="flex" gap={2} flexDirection="column">
                <Typography variant="subtitle2" gutterBottom>
                  Статусы товара
                </Typography>
                <Box display="flex" gap={2}>
                  <Box display="flex" alignItems="center">
                    <Checkbox
                      checked={Boolean(formData.is_new)}
                      onChange={(e) => handleInputChange('is_new', e.target.checked)}
                      color="primary"
                    />
                    <Typography variant="body2">Новинка</Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Checkbox
                      checked={Boolean(formData.is_popular)}
                      onChange={(e) => handleInputChange('is_popular', e.target.checked)}
                      color="primary"
                    />
                    <Typography variant="body2">Популярный</Typography>
                  </Box>
                </Box>
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={Boolean(formData.is_active)}
                    onChange={(e) => handleInputChange('is_active', e.target.checked)}
                    color="primary"
                  />
                }
                label="Товар активен (отображается на сайте)"
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
            <Button
              onClick={() => setOpenDialog(false)}
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              Отмена
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveProduct}
              sx={{
                backgroundColor: '#333',
                '&:hover': { backgroundColor: '#555' },
                width: { xs: '100%', sm: 'auto' }
              }}
            >
              {editingProduct ? 'Сохранить' : 'Добавить'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Operation Overlays */}
        <AdminOperationOverlay
          open={saving}
          message={editingProduct ? "Сохранение изменений..." : "Создание товара..."}
        />
        <AdminOperationOverlay
          open={deleting}
          message="Удаление товаров..."
        />
      </Container>
    </AdminLayout>
  );
}