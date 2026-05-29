'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Divider,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import {
  Save,
  Phone,
  LocationOn,
  Instagram,
  Schedule,
  Email,
  Description as DescriptionIcon,
  AccountBalance,
} from '@mui/icons-material';
import AdminLayout from '@/components/AdminLayout/AdminLayout';
import { useAdminContacts } from '@/hooks/useAdminContacts';
import { AdminContactsSkeleton } from '@/components/AdminSkeleton/AdminSkeleton';
import { AdminOperationOverlay } from '@/components/AdminOperationOverlay/AdminOperationOverlay';

export default function AdminContacts() {
  const { contactInfo, loading, saving, error, updateContactInfo } = useAdminContacts();
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [contactData, setContactData] = useState({
    phone: '',
    address: '',
    instagram: '',
    email: '',
    working_hours: '',
    company_name: '',
    legal_form: 'ООО',
    director_name: '',
    director_basis: 'Устава',
    unp: '',
    legal_address: '',
    bank_name: '',
    bank_account: '',
    bik: '',
  });
  const [workingHours, setWorkingHours] = useState({
    weekdays: '',
    weekends: '',
  });

  // Загружаем данные из БД при инициализации
  React.useEffect(() => {
    if (contactInfo) {
      setContactData({
        phone: contactInfo.phone,
        address: contactInfo.address,
        instagram: contactInfo.instagram || '',
        email: contactInfo.email,
        working_hours: contactInfo.working_hours,
        company_name: contactInfo.company_name || '',
        legal_form: contactInfo.legal_form || 'ООО',
        director_name: contactInfo.director_name || '',
        director_basis: contactInfo.director_basis || 'Устава',
        unp: contactInfo.unp || '',
        legal_address: contactInfo.legal_address || '',
        bank_name: contactInfo.bank_name || '',
        bank_account: contactInfo.bank_account || '',
        bik: contactInfo.bik || '',
      });

      // Парсим режим работы для раздельного редактирования
      const workingHoursStr = contactInfo.working_hours || 'Пн-Пт: 9:00 - 18:00, Сб-Вс: 10:00 - 16:00';
      const parts = workingHoursStr.split(', ');
      const weekdays = parts[0]?.replace('Пн-Пт: ', '') || '9:00 - 18:00';
      const weekends = parts[1]?.replace('Сб-Вс: ', '') || '10:00 - 16:00';

      setWorkingHours({
        weekdays,
        weekends,
      });
    }
  }, [contactInfo]);

  const handleSave = async () => {
    try {
      // Собираем режим работы из отдельных полей
      const workingHoursStr = `Пн-Пт: ${workingHours.weekdays}, Сб-Вс: ${workingHours.weekends}`;

      await updateContactInfo({
        ...contactData,
        working_hours: workingHoursStr,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving contact info:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setContactData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleWorkingHoursChange = (type: 'weekdays' | 'weekends', value: string) => {
    setWorkingHours(prev => ({
      ...prev,
      [type]: value,
    }));
  };

  return (
    <AdminLayout>
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
        {/* Header */}
        <Box mb={{ xs: 3, md: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            gutterBottom
            sx={{ fontSize: { xs: '1.75rem', sm: '2.125rem', md: '2.5rem' } }}
          >
            Управление контактами
          </Typography>
          <Typography
            variant="body1"
            color="textSecondary"
            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
          >
            Редактирование контактной информации компании
          </Typography>
        </Box>

        {saveSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Контактные данные успешно обновлены!
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <AdminContactsSkeleton />
        ) : (
          <Grid container spacing={{ xs: 2, md: 4 }}>
            {/* Основная контактная информация */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: { xs: 2, md: 3 } }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontSize: { xs: '1.1rem', md: '1.25rem' }
                  }}
                >
                  <Phone color="primary" />
                  Основная информация
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Box display="flex" flexDirection="column" gap={3}>
                  <TextField
                    fullWidth
                    label="Номер телефона"
                    value={contactData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    variant="outlined"
                    InputProps={{
                      startAdornment: <Phone sx={{ color: 'action.active', mr: 1 }} />,
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={contactData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    variant="outlined"
                    InputProps={{
                      startAdornment: <Email sx={{ color: 'action.active', mr: 1 }} />,
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Адрес"
                    value={contactData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    variant="outlined"
                    multiline
                    rows={1}
                    size="small"
                    InputProps={{
                      startAdornment: <LocationOn sx={{ color: 'action.active', mr: 1, alignSelf: 'flex-start', mt: 0.5 }} />,
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Instagram"
                    value={contactData.instagram}
                    onChange={(e) => handleInputChange('instagram', e.target.value)}
                    variant="outlined"
                    InputProps={{
                      startAdornment: <Instagram sx={{ color: 'action.active', mr: 1 }} />,
                    }}
                    helperText="Только имя пользователя без @"
                  />
                </Box>
              </Paper>
            </Grid>

            {/* Режим работы */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: { xs: 2, md: 3 } }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontSize: { xs: '1.1rem', md: '1.25rem' }
                  }}
                >
                  <Schedule color="primary" />
                  Режим работы
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Box display="flex" flexDirection="column" gap={3}>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      sx={{
                        fontWeight: 600,
                        fontSize: { xs: '0.875rem', md: '0.875rem' }
                      }}
                    >
                      Будние дни (Пн-Пт)
                    </Typography>
                    <TextField
                      fullWidth
                      label="Время работы"
                      value={workingHours.weekdays}
                      onChange={(e) => handleWorkingHoursChange('weekdays', e.target.value)}
                      variant="outlined"
                      placeholder="9:00 - 18:00"
                      helperText="Введите время в формате ЧЧ:ММ - ЧЧ:ММ"
                      size="small"
                    />
                  </Box>

                  <Box>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      sx={{
                        fontWeight: 600,
                        fontSize: { xs: '0.875rem', md: '0.875rem' }
                      }}
                    >
                      Выходные дни (Сб-Вс)
                    </Typography>
                    <TextField
                      fullWidth
                      label="Время работы"
                      value={workingHours.weekends}
                      onChange={(e) => handleWorkingHoursChange('weekends', e.target.value)}
                      variant="outlined"
                      placeholder="10:00 - 16:00"
                      helperText="Введите время в формате ЧЧ:ММ - ЧЧ:ММ"
                      size="small"
                    />
                  </Box>
                </Box>
              </Paper>
            </Grid>


            {/* Юридические реквизиты для договора */}
            <Grid size={{ xs: 12 }}>
              <Paper sx={{ p: { xs: 2, md: 3 } }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontSize: { xs: '1.1rem', md: '1.25rem' }
                  }}
                >
                  <DescriptionIcon color="primary" />
                  Реквизиты для договора
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Используются при формировании договора изготовления и установки памятника.
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 8 }}>
                    <TextField
                      fullWidth
                      label="Полное наименование организации"
                      value={contactData.company_name}
                      onChange={(e) => handleInputChange('company_name', e.target.value)}
                      placeholder="ООО «Гранит памяти»"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      fullWidth
                      label="Юр. форма"
                      value={contactData.legal_form}
                      onChange={(e) => handleInputChange('legal_form', e.target.value)}
                      placeholder="ООО"
                      variant="outlined"
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Руководитель (ФИО)"
                      value={contactData.director_name}
                      onChange={(e) => handleInputChange('director_name', e.target.value)}
                      placeholder="Иванов Иван Иванович"
                      variant="outlined"
                      helperText="Лицо, подписывающее договор от имени Исполнителя"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Действует на основании"
                      value={contactData.director_basis}
                      onChange={(e) => handleInputChange('director_basis', e.target.value)}
                      placeholder="Устава"
                      variant="outlined"
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="УНП"
                      value={contactData.unp}
                      onChange={(e) => handleInputChange('unp', e.target.value.replace(/\D/g, ''))}
                      placeholder="500123456"
                      inputProps={{ maxLength: 9 }}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Юридический адрес"
                      value={contactData.legal_address}
                      onChange={(e) => handleInputChange('legal_address', e.target.value)}
                      placeholder="230015, г. Гродно, пр. Янки Купалы, 22а"
                      variant="outlined"
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, mb: 1 }}>
                      <AccountBalance fontSize="small" color="action" />
                      <Typography variant="subtitle2">Банковские реквизиты</Typography>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Наименование банка"
                      value={contactData.bank_name}
                      onChange={(e) => handleInputChange('bank_name', e.target.value)}
                      placeholder="ОАО «Белинвестбанк», ЦБУ № 421 г. Гродно"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Расчётный счёт (IBAN)"
                      value={contactData.bank_account}
                      onChange={(e) => handleInputChange('bank_account', e.target.value.toUpperCase())}
                      placeholder="BY00 ABCD 1234 5678 9012 3456 7890"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="БИК (BIC)"
                      value={contactData.bik}
                      onChange={(e) => handleInputChange('bik', e.target.value.toUpperCase())}
                      placeholder="BLBBBY2X"
                      inputProps={{ maxLength: 11 }}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Предварительный просмотр */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: { xs: 2, md: 3 } }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}
                >
                  Предварительный просмотр
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Card variant="outlined" sx={{ mb: 2 }}>
                  <CardContent sx={{ p: { xs: 1.5, md: 2 } }}>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      sx={{ fontSize: { xs: '0.875rem', md: '0.875rem' } }}
                    >
                      Как будет отображаться в шапке:
                    </Typography>
                    <Box sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' }, color: 'text.secondary' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <LocationOn sx={{ fontSize: { xs: 14, md: 16 } }} />
                        {contactData.address}
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Phone sx={{ fontSize: { xs: 14, md: 16 } }} />
                        {contactData.phone}
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Instagram sx={{ fontSize: { xs: 14, md: 16 } }} />
                        {contactData.instagram}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>

                <Card variant="outlined">
                  <CardContent sx={{ p: { xs: 1.5, md: 2 } }}>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      sx={{ fontSize: { xs: '0.875rem', md: '0.875rem' } }}
                    >
                      Режим работы:
                    </Typography>
                    <Box sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' }, color: 'text.secondary' }}>
                      <div>Пн-Пт: {workingHours.weekdays}</div>
                      <div>Сб-Вс: {workingHours.weekends}</div>
                    </Box>
                  </CardContent>
                </Card>
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* Save Button */}
        <Box mt={{ xs: 3, md: 4 }} display="flex" justifyContent="center">
          <Button
            variant="contained"
            size="large"
            startIcon={<Save />}
            onClick={handleSave}
            sx={{
              backgroundColor: '#333',
              '&:hover': { backgroundColor: '#555' },
              px: { xs: 3, md: 4 },
              py: 1.5,
              width: { xs: '100%', sm: 'auto' },
              fontSize: { xs: '0.875rem', md: '1rem' }
            }}
          >
            Сохранить все изменения
          </Button>
        </Box>

        {/* Operation Overlay */}
        <AdminOperationOverlay
          open={saving}
          message="Сохранение контактной информации..."
        />
      </Container>
    </AdminLayout>
  );
}