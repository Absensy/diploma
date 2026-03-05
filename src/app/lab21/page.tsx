import React from 'react';
import Link from 'next/link';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  Box, 
  Avatar,
  Divider
} from '@mui/material';
// Иконки для визуализации разделов
import TerminalIcon from '@mui/icons-material/Terminal';
import InfoIcon from '@mui/icons-material/Info';
import PersonIcon from '@mui/icons-material/Person';
import FunctionsIcon from '@mui/icons-material/Functions';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import CodeIcon from '@mui/icons-material/Code';

/**
 * Структура данных для карточек заданий
 */
const labTasks = [
  {
    title: 'Задание 1: Dev Info',
    description: 'Проверка окружения: Node.js, Next.js и системное время сервера.',
    path: '/lab21/dev-info',
    icon: <TerminalIcon color="primary" />,
    color: '#e3f2fd'
  },
  {
    title: 'Задание 2.1: Node Info',
    description: 'Аналог phpinfo(). Подробные данные о процессе, памяти и архитектуре.',
    path: '/lab21/phpinfo-analog',
    icon: <InfoIcon color="secondary" />,
    color: '#f3e5f5'
  },
  {
    title: 'Задание 2.2: Приветствие',
    description: 'Вывод ФИО разработчика, группы и даты создания скрипта.',
    path: '/lab21/hello',
    icon: <PersonIcon sx={{ color: '#2e7d32' }} />,
    color: '#e8f5e9'
  },
  {
    title: 'Задание 2.3: Стилизация',
    description: 'Демонстрация работы с константами цвета и размера шрифта.',
    path: '/lab21/developer',
    icon: <CodeIcon sx={{ color: '#ed6c02' }} />,
    color: '#fff3e0'
  },
  {
    title: 'Задание 2.4: Число E',
    description: 'Константы и динамическое преобразование типов (String, Int, Boolean).',
    path: '/lab21/constants',
    icon: <FunctionsIcon sx={{ color: '#d32f2f' }} />,
    color: '#ffebee'
  },
  {
    title: 'Задание 2.5: Система',
    description: 'Предопределенные переменные сервера и пути директорий.',
    path: '/lab21/system',
    icon: <SettingsSuggestIcon sx={{ color: '#0288d1' }} />,
    color: '#e1f5fe'
  }
];

export default function LabDashboard() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Заголовок страницы */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom fontWeight="800">
          Лабораторная работа 21
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Адаптация PHP заданий под стек Next.js 15 & TypeScript
        </Typography>
      </Box>

      <Divider sx={{ mb: 6 }} />

      {/* Сетка заданий */}
      <Grid container spacing={4}>
        {labTasks.map((task) => (
          <Grid item xs={12} sm={6} md={4} key={task.path}>
            <Card 
              elevation={4} 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: "10px",
                }
              }}
            >
              <Box sx={{ p: 2, display: 'flex', alignItems: 'center', backgroundColor: task.color }}>
                <Avatar sx={{ bgcolor: 'white', mr: 2 }}>
                  {task.icon}
                </Avatar>
                <Typography variant="subtitle1" fontWeight="bold">
                  {task.title.split(':')[0]}
                </Typography>
              </Box>

              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {task.title.split(':')[1]}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {task.description}
                </Typography>
              </CardContent>

              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button 
                  fullWidth 
                  variant="contained" 
                  component={Link} 
                  href={task.path}
                  sx={{ borderRadius: 2 }}
                >
                  Открыть результат
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}