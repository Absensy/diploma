import React from 'react';
import { Container, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';

/**
 * Страница-аналог phpinfo(), выводящая системные параметры Node.js процесса
 */
export default function PhpInfoAnalog() {
  const memory = process.memoryUsage();
  
  const systemData = [
    { param: 'Node Version', value: process.version },
    { param: 'Platform', value: process.platform },
    { param: 'Architecture', value: process.arch },
    { param: 'Current Directory', value: process.cwd() },
    { param: 'RSS Memory', value: `${(memory.rss / 1024 / 1024).toFixed(2)} MB` },
    { param: 'Heap Total', value: `${(memory.heapTotal / 1024 / 1024).toFixed(2)} MB` },
  ];

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Node Info (Analog phpinfo)</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {systemData.map((row) => (
              <TableRow key={row.param}>
                <TableCell sx={{ fontWeight: 'bold', width: '30%' }}>{row.param}</TableCell>
                <TableCell>{row.value}</TableCell>
              </TableRow>
            ))}
            {/* Вывод переменных окружения (безопасно) */}
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Environment</TableCell>
              <TableCell>
                <pre style={{ fontSize: '12px' }}>
                  {JSON.stringify({ NODE_ENV: process.env.NODE_ENV, TZ: process.env.TZ }, null, 2)}
                </pre>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}