'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
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
  DragIndicator,
} from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout/AdminLayout';
import ImageUpload from '@/components/ImageUpload/ImageUpload';
import { useAdminCategories } from '@/hooks/useAdminCategories';
import { AdminCategoriesGridSkeleton } from '@/components/AdminSkeleton/AdminSkeleton';
import { AdminOperationOverlay } from '@/components/AdminOperationOverlay/AdminOperationOverlay';
import EmptyState from '@/components/EmptyState/EmptyState';

interface CategoryFormData {
  name: string;
  price_from: string;
  photo: string;
  discount: string;
  discounted_price: string;
  is_active: boolean;
}

export default function AdminCategories() {
  const { categories, loading, saving, deleting, error, createCategory, updateCategory, deleteCategory } = useAdminCategories();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [saveAlert, setSaveAlert] = useState(false);
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [isEditingDiscountedPrice, setIsEditingDiscountedPrice] = useState(false);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    price_from: '',
    photo: '',
    discount: '',
    discounted_price: '',
    is_active: true,
  });

  const handleEditCategory = (category: any) => {
    setEditingCategory(category);
    setIsEditingDiscountedPrice(false);
    setFormData({
      name: category.name,
      price_from: category.price_from.toString(),
      photo: category.photo,
      discount: category.discount?.toString() || '',
      discounted_price: category.discounted_price?.toString() || '',
      is_active: Boolean(category.is_active),
    });
    setOpenDialog(true);
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsEditingDiscountedPrice(false);
    setFormData({
      name: '',
      price_from: '',
      photo: '',
      discount: '',
      discounted_price: '',
      is_active: true,
    });
    setOpenDialog(true);
  };

  const handleSaveCategory = async () => {
    try {
      const categoryData = {
        name: formData.name,
        price_from: parseFloat(formData.price_from),
        photo: formData.photo,
        ...(formData.discount && { discount: parseInt(formData.discount) }),
        ...(formData.discounted_price && { discounted_price: parseFloat(formData.discounted_price) }),
        is_active: formData.is_active,
      };

      if (editingCategory) {
        await updateCategory(editingCategory.id, categoryData);
      } else {
        await createCategory(categoryData);
      }

      setOpenDialog(false);
      setEditingCategory(null);
      setSaveAlert(true);
      setTimeout(() => setSaveAlert(false), 3000);
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    try {
      await deleteCategory(categoryId);
      setDeleteAlert(true);
      setTimeout(() => setDeleteAlert(false), 3000);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleInputChange = (field: keyof CategoryFormData, value: string | boolean) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };

      // Автоматический расчет цены со скидкой (только если пользователь не редактирует её вручную)
      if ((field === 'price_from' || field === 'discount') && !isEditingDiscountedPrice && typeof value === 'string') {
        const price = field === 'price_from' ? parseFloat(value) : parseFloat(prev.price_from);
        const discount = field === 'discount' ? parseFloat(value) : parseFloat(prev.discount);

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

  return (
    <AdminLayout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box mb={4}>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Управление категориями
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Создание и редактирование категорий товаров
          </Typography>
        </Box>

        {saveAlert && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Категория успешно сохранена!
          </Alert>
        )}

        {deleteAlert && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Категория успешно удалена!
          </Alert>
        )}

        {/* Controls */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
          flexDirection={{ xs: 'column', sm: 'row' }}
          gap={2}
        >
          <Typography variant="h6">
            Всего категорий: {categories.length}
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddCategory}
            sx={{
              backgroundColor: '#333',
              '&:hover': { backgroundColor: '#555' },
              width: { xs: '100%', sm: 'auto' }
            }}
          >
            Добавить категорию
          </Button>
        </Box>

        {/* Loading State */}
        {loading && <AdminCategoriesGridSkeleton />}

        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Categories Grid */}
        {!loading && !error && (
          <>
            {categories.length === 0 ? (
              <EmptyState
                message="Категории не найдены"
                variant="card"
                height={300}
              />
            ) : (
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
                {categories.map((category) => (
                  <Box key={category.id}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ position: 'relative' }}>
                        <Avatar
                          src={category.photo}
                          alt={category.name}
                          variant="rounded"
                          sx={{ width: '100%', height: 200 }}
                        />
                        <IconButton
                          sx={{
                            position: 'absolute',
                            top: 8,
                            left: 8,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            color: 'white',
                            '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' }
                          }}
                        >
                          <DragIndicator />
                        </IconButton>
                        <Chip
                          label={category.is_active ? "Активна" : "Неактивна"}
                          color={category.is_active ? "success" : "error"}
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                          }}
                        />
                      </Box>

                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" component="h3" gutterBottom>
                          {category.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                          От {category.price_from} руб.
                          {category.discounted_price && (
                            <span style={{ textDecoration: 'line-through', marginLeft: 8 }}>
                              {category.discounted_price} руб.
                            </span>
                          )}
                        </Typography>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2">
                            Товаров: <strong>{category.productsCount}</strong>
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            ID: {category.id}
                          </Typography>
                        </Box>
                      </CardContent>

                      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                        <Box>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEditCategory(category)}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </CardActions>
                    </Card>
                  </Box>
                ))}
              </Box>
            )}
          </>
        )}

        {/* Add/Edit Category Dialog */}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="md"
          fullWidth
          fullScreen
        >
          <DialogTitle>
            {editingCategory ? 'Редактировать категорию' : 'Добавить новую категорию'}
          </DialogTitle>
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={3} pt={1}>
              <TextField
                fullWidth
                label="Название категории"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Цена от (руб.)"
                type="number"
                value={formData.price_from}
                onChange={(e) => handleInputChange('price_from', e.target.value)}
                variant="outlined"
              />
              <Box
                display="flex"
                gap={2}
                flexDirection={{ xs: 'column', sm: 'row' }}
              >
                <TextField
                  fullWidth
                  label="Скидка (%)"
                  type="number"
                  value={formData.discount}
                  onChange={(e) => handleInputChange('discount', e.target.value)}
                  variant="outlined"
                  helperText="Необязательное поле"
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
              <ImageUpload
                value={formData.photo}
                onChange={(imageUrl) => handleInputChange('photo', imageUrl)}
                label="Изображение категории"
                helperText="Загрузите изображение категории (JPEG, PNG, WebP до 5MB)"
                previewSize={{ width: 180, height: 120 }}
                aspectRatio={200 / 120}
                uploadType="category"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={Boolean(formData.is_active)}
                    onChange={(e) => handleInputChange('is_active', e.target.checked)}
                    color="primary"
                  />
                }
                label="Категория активна (отображается на сайте)"
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
              onClick={handleSaveCategory}
              sx={{
                backgroundColor: '#333',
                '&:hover': { backgroundColor: '#555' },
                width: { xs: '100%', sm: 'auto' }
              }}
            >
              {editingCategory ? 'Сохранить' : 'Добавить'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Operation Overlays */}
        <AdminOperationOverlay
          open={saving}
          message={editingCategory ? "Сохранение изменений..." : "Создание категории..."}
        />
        <AdminOperationOverlay
          open={deleting}
          message="Удаление категории..."
        />
      </Container>
    </AdminLayout>
  );
}