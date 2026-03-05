import React from 'react';
import { Container, Typography, Box } from '@mui/material';

/**
 * Демонстрация использования переменных для динамической стилизации (аналог $color в PHP)
 */
export default function DeveloperPage() {
  // Объявление переменных стилей
  const color = "blue";
  const size = "48px"; // Увеличил для наглядности

  return (
    <Container sx={{ mt: 5 }}>
      <Box sx={{ border: '1px dashed grey', p: 3 }}>
        <Typography 
          sx={{ 
            color: color, 
            fontSize: size,
            fontWeight: 'bold',
            transition: '0.3s'
          }}
        >
          Дашкевич Евгений
        </Typography>
        <Typography variant="caption">
          Стиль применен через константы: color: {color}, fontSize: {size}
        </Typography>
      </Box>
    </Container>
  );
}