'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Alert,
  Tabs,
  Tab,
  Link,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import LogoGranitPrimary1Icon from '@/icons/LogoGranitPrimary1';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
      style={{ width: '100%' }}
    >
      {value === index && <Box sx={{ pt: 3, width: '100%' }}>{children}</Box>}
    </div>
  );
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AuthPage() {
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  
  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register form
  const [registerData, setRegisterData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  const { login, register } = useAuth();
  const router = useRouter();

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setError('');
    setFieldErrors({});
    setLoginEmail('');
    setLoginPassword('');
    setRegisterData({
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
    });
  };

  // Сбрасываем ошибку конкретного поля, как только пользователь его правит
  const clearFieldError = (field: string) =>
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });

  const handleLogin = async () => {
    const errs: Record<string, string> = {};
    if (!loginEmail.trim()) errs.loginEmail = 'Введите email';
    else if (!EMAIL_RE.test(loginEmail.trim())) errs.loginEmail = 'Некорректный email';
    if (!loginPassword) errs.loginPassword = 'Введите пароль';
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/auth/user-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка входа');
      }

      // Обновляем состояние через login функцию
      await login(loginEmail, loginPassword);
      
      // Проверяем, является ли пользователь админом из ответа
      if (data.user?.is_admin) {
        router.push('/admin/dashboard');
      } else {
        // Проверяем, есть ли URL для возврата
        const returnUrl = sessionStorage.getItem('returnUrl');
        if (returnUrl) {
          sessionStorage.removeItem('returnUrl');
          router.push(returnUrl);
        } else {
          router.push('/');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    const errs: Record<string, string> = {};
    if (!registerData.first_name.trim()) errs.first_name = 'Введите имя';
    if (!registerData.last_name.trim()) errs.last_name = 'Введите фамилию';
    if (!registerData.email.trim()) errs.email = 'Введите email';
    else if (!EMAIL_RE.test(registerData.email.trim())) errs.email = 'Некорректный email';
    if (!registerData.password) errs.password = 'Введите пароль';
    else if (registerData.password.length < 6) errs.password = 'Минимум 6 символов';
    if (!registerData.confirmPassword) errs.confirmPassword = 'Повторите пароль';
    else if (registerData.password !== registerData.confirmPassword)
      errs.confirmPassword = 'Пароли не совпадают';
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      setLoading(true);
      setError('');
      await register({
        first_name: registerData.first_name,
        last_name: registerData.last_name,
        email: registerData.email,
        password: registerData.password,
        phone: registerData.phone || undefined,
      });
      
      // Проверяем, есть ли URL для возврата
      const returnUrl = sessionStorage.getItem('returnUrl');
      if (returnUrl) {
        sessionStorage.removeItem('returnUrl');
        router.push(returnUrl);
      } else {
        router.push('/');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={8}
          sx={{
            p: 4,
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            maxWidth: 700,
            mx: 'auto',
            width: '100%',
          }}
        >
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <LogoGranitPrimary1Icon />
            <Typography variant="h4" component="h1" fontWeight="bold">
              Авторизация
            </Typography>
          </Box>

          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{ width: '100%', mb: 2 }}
            variant="fullWidth"
          >
            <Tab label="Вход" />
            <Tab label="Регистрация" />
          </Tabs>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {/* Login Tab */}
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
              <TextField
                label="Email"
                type="email"
                value={loginEmail}
                onChange={(e) => {
                  setLoginEmail(e.target.value);
                  clearFieldError('loginEmail');
                }}
                error={Boolean(fieldErrors.loginEmail)}
                helperText={fieldErrors.loginEmail}
                fullWidth
                required
                onKeyPress={(e) => handleKeyPress(e, handleLogin)}
              />
              <TextField
                label="Пароль"
                type={showPassword ? 'text' : 'password'}
                value={loginPassword}
                onChange={(e) => {
                  setLoginPassword(e.target.value);
                  clearFieldError('loginPassword');
                }}
                error={Boolean(fieldErrors.loginPassword)}
                helperText={fieldErrors.loginPassword}
                fullWidth
                required
                onKeyPress={(e) => handleKeyPress(e, handleLogin)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="contained"
                fullWidth
                onClick={handleLogin}
                disabled={loading}
                sx={{
                  mt: 2,
                  py: 1.5,
                  backgroundColor: '#333',
                  '&:hover': { backgroundColor: '#555' },
                }}
              >
                {loading ? 'Вход...' : 'Войти'}
              </Button>
            </Box>
          </TabPanel>

          {/* Register Tab */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
              <TextField
                label="Имя"
                value={registerData.first_name}
                onChange={(e) => {
                  setRegisterData({ ...registerData, first_name: e.target.value });
                  clearFieldError('first_name');
                }}
                error={Boolean(fieldErrors.first_name)}
                helperText={fieldErrors.first_name}
                fullWidth
                required
              />
              <TextField
                label="Фамилия"
                value={registerData.last_name}
                onChange={(e) => {
                  setRegisterData({ ...registerData, last_name: e.target.value });
                  clearFieldError('last_name');
                }}
                error={Boolean(fieldErrors.last_name)}
                helperText={fieldErrors.last_name}
                fullWidth
                required
              />
              <TextField
                label="Email"
                type="email"
                value={registerData.email}
                onChange={(e) => {
                  setRegisterData({ ...registerData, email: e.target.value });
                  clearFieldError('email');
                }}
                error={Boolean(fieldErrors.email)}
                helperText={fieldErrors.email}
                fullWidth
                required
              />
              <TextField
                label="Телефон"
                type="tel"
                value={registerData.phone}
                onChange={(e) =>
                  setRegisterData({ ...registerData, phone: e.target.value })
                }
                fullWidth
              />
              <TextField
                label="Пароль"
                type={showPassword ? 'text' : 'password'}
                value={registerData.password}
                onChange={(e) => {
                  setRegisterData({ ...registerData, password: e.target.value });
                  clearFieldError('password');
                }}
                error={Boolean(fieldErrors.password)}
                helperText={fieldErrors.password}
                fullWidth
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Подтвердите пароль"
                type={showPassword ? 'text' : 'password'}
                value={registerData.confirmPassword}
                onChange={(e) => {
                  setRegisterData({ ...registerData, confirmPassword: e.target.value });
                  clearFieldError('confirmPassword');
                }}
                error={Boolean(fieldErrors.confirmPassword)}
                helperText={fieldErrors.confirmPassword}
                fullWidth
                required
              />
              <Button
                variant="contained"
                fullWidth
                onClick={handleRegister}
                disabled={loading}
                sx={{
                  mt: 2,
                  py: 1.5,
                  backgroundColor: '#333',
                  '&:hover': { backgroundColor: '#555' },
                }}
              >
                {loading ? 'Регистрация...' : 'Зарегистрироваться'}
              </Button>
            </Box>
          </TabPanel>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Link href="/" sx={{ textDecoration: 'none', color: 'text.secondary' }}>
              Вернуться на главную
            </Link>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
