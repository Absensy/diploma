import React from 'react';
import { Container, Typography, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';
import packageJson from '../../../../package.json'; // Путь к package.json для получения версии Next.js

/**
 * Страница вывода технической информации о сервере (Аналог проверки окружения в PHP)
 * Используется Server Component (по умолчанию в App Router)
 */
export default function DevInfoPage() {
  // Получаем данные на стороне сервера
  const nodeVersion = process.version;
  const nextVersion = packageJson.dependencies.next;
  const envMode = process.env.NODE_ENV;
  const serverTime = new Date().toLocaleString('ru-RU');

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom color="primary">
          Информация о системе
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <List>
          <ListItem>
            <ListItemText primary="Версия Node.js" secondary={nodeVersion} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Версия Next.js" secondary={nextVersion} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Режим окружения" secondary={envMode} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Дата и время сервера" secondary={serverTime} />
          </ListItem>
        </List>
      </Paper>
    </Container>
  );
}