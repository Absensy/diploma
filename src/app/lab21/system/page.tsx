import React from 'react';
import { Container, Typography, Paper, Alert } from '@mui/material';

/**
 * Вывод предопределенных переменных процесса Node.js
 */
export default function SystemPage() {
  return (
    <Container sx={{ mt: 4 }}>
      <Alert severity="info" sx={{ mb: 2 }}>
        В Next.js App Router (Server Components) мы имеем доступ к process API на стороне сервера.
      </Alert>
      <Paper sx={{ p: 3, backgroundColor: '#f5f5f5' }}>
        <Typography variant="body1" component="div">
          <ul>
            <li><b>Версия Node:</b> {process.version}</li>
            <li><b>Рабочая директория:</b> {process.cwd()}</li>
            <li><b>Время сервера:</b> {new Date().toISOString()}</li>
            <li><b>Платформа:</b> {process.platform}</li>
            <li><b>NODE_ENV:</b> {process.env.NODE_ENV}</li>
          </ul>
        </Typography>
      </Paper>
    </Container>
  );
}