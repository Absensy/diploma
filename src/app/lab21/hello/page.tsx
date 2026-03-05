import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

/**
 * Скрипт вывода информации о разработчике
 */
export default function HelloPage() {
  // Данные разработчика
  const devInfo = {
    name: 'Дашкевич Евгений',
    group: 'ПЗТ-41',
    createdAt: '17.07.2006'
  };

  return (
    <Container sx={{ mt: 10 }}>
      <Paper sx={{ p: 5, textAlign: 'center' }} elevation={10}>
        <Typography variant="h2" color="primary" gutterBottom>
          Привет всем!!!
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Разработчик: {devInfo.name}</Typography>
          <Typography variant="h6">Группа: {devInfo.group}</Typography>
          <Typography variant="body2" color="text.secondary">Дата рождения: {devInfo.createdAt}</Typography>
        </Box>
      </Paper>
    </Container>
  );
}