import React from 'react';
import { Container, Typography, Paper, Box, Divider } from '@mui/material';

/**
 * Лабораторная работа по изучению констант и приведению типов в TypeScript/JS
 */
export default function ConstantsPage() {
  // Объявление константы (Аналог define в PHP)
  const NUM_E = 2.71828;
  
  // Инициализация переменной
  let numE1 = NUM_E;

  // Функция для рендера строки состояния переменной
  const renderInfo = (val: any, label: string) => (
    <Box sx={{ mb: 1 }}>
      <Typography variant="body1">
        <b>{label}:</b> Значение: <code>{String(val)}</code> | Тип: <code>{typeof val}</code>
      </Typography>
    </Box>
  );

  return (
    <Container sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5">Число e равно {NUM_E}</Typography>
        <Divider sx={{ my: 2 }} />

        {renderInfo(numE1, "Исходное состояние")}

        {/* 1. В строку */}
        {(() => {
          const casted = String(numE1);
          return renderInfo(casted, "После String()");
        })()}

        {/* 2. В целое число */}
        {(() => {
          const casted = Math.floor(numE1); // Аналог (int) в PHP
          return renderInfo(casted, "После Math.floor() (int)");
        })()}

        {/* 3. В булево */}
        {(() => {
          const casted = Boolean(numE1);
          return renderInfo(casted, "После Boolean()");
        })()}
      </Paper>
    </Container>
  );
}