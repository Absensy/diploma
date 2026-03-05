import React from 'react';
import { 
  Container, Typography, Box, Paper, Divider, 
  Table, TableBody, TableCell, TableContainer, TableRow, Button, Theme 
} from '@mui/material';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

/**
 * Адаптация PHP Лабораторной работы (Вариант 13) на TypeScript/Next.js
 */
export default function Variant13Page() {
  // --- Данные Задания 3 (Цикл) ---
  const lastName = "Дашкевич";
  const firstName = "Евгений";
  const n = 6;
  const times = n + 5; // 11 раз
  const loopResults = Array.from({ length: times }, (_, i) => `${i + 1}. ${lastName} ${firstName}`);

  // --- Данные Задания 2 (Переменные) ---
  const a = 1.45;
  const b = 2.8;
  const c = a + b;
  const mathResult = c / (b - a);

  // --- Данные Задания 4 (Массивы) ---
  // В JS используем объект как ассоциативный массив
  const Books: Record<string, string> = {
    'Пушкин': 'Евгений Онегин',
    'Лермонтов': 'Мцыри',
    'Гоголь': 'Вий',
  };
  // Сортировка по ключам (аналог ksort)
  const sortedAuthors = Object.keys(Books).sort();

  // --- Данные Задания 5 (Строки) ---
  const S1 = "Дашкевич Евгений";
  const S2 = "пр. Клецкова 23-148";

  // --- Данные Задания 6 (Функция) ---
  /**
   * Вычисление функции b(x, a, s)
   * Аналог PHP: log($arg) / log($s) - это логарифм по основанию s
   */
  const calcB = (x: number, a_val: number, s: number): number => {
    const x2 = x * x;
    const denom = Math.pow(x2 + a_val * a_val, 3);
    const firstPart = x / denom;
    
    const sqrtArg = x2 + 1;
    const logArg = x2 + Math.sqrt(sqrtArg);
    const secondPart = Math.log(logArg) / Math.log(s);
    
    return firstPart + secondPart;
  };

  const functionResult = calcB(1, 1, 2);



  return (
    <Box sx={{ bgcolor: '#f9f9f9', minHeight: '100vh', pb: 10 }}>
        {/* Шапка (Аналог header из PHP) */}

      <Container maxWidth="md">
        <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ mb: 4 }}>
          Лабораторная работа (Вариант 13)
        </Typography>

        {/* Задание 1: Структура и объединение (Аналог PHP Include) */}
        <Paper sx={blockStyle('#2C2C2C')}>
        <Typography variant="h6" color="#2C2C2C" gutterBottom>
            Задание 1: Структура и объединение компонентов
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
            В PHP это решалось через <code>include 'header.php'</code> и <code>include 'footer.php'</code>.
        </Typography>
        <Box sx={{ p: 2, bgcolor: '#ECECEC', borderRadius: 2, border: '1px dashed #2C2C2C' }}>
            <Typography variant="subtitle2" color="#2C2C2C">
            ✓ Реализовано через React-компоненты:
            </Typography>
            <ul style={{ margin: '8px 0', fontSize: '14px' }}>
            <li>Весь контент собран в единый <b>Server Component</b>.</li>
            <li>Общая структура (Шапка/Подвал) вынесена в Layout.</li>
            <li>Стилизация реализована через общую систему <b>Material UI</b>.</li>
            </ul>
        </Box>
        </Paper>
        {/* Задание 2: Математика */}
        <Paper sx={blockStyle('#2C2C2C')}>
          <Typography variant="h6" color="#2C2C2C" gutterBottom>
            Задание 2: Переменные и константы
          </Typography>
          <Typography variant="body1">a = {a}, b = {b}</Typography>
          <Typography variant="body1" sx={{ mt: 1, fontWeight: 'bold' }}>
            Результат (c / (b - a)) = {mathResult.toFixed(4)}
          </Typography>
        </Paper>

        {/* Задание 3: Цикл */}
        <Paper sx={blockStyle('#2C2C2C')}>
          <Typography variant="h6" color="#2C2C2C" gutterBottom>
            Задание 3: Цикл — Фамилия и Имя n+5 раз
          </Typography>
          <Box sx={{ maxHeight: 200, overflow: 'auto', bgcolor: '#f0f0f0', p: 2, borderRadius: 2 }}>
            {loopResults.map((line, idx) => (
              <Typography key={idx} variant="body2" sx={{ fontFamily: 'monospace' }}>
                {line}
              </Typography>
            ))}
          </Box>
        </Paper>

        {/* Задание 4: Массивы */}
        <Paper sx={blockStyle('#2C2C2C')}>
          <Typography variant="h6" color="#2C2C2C" gutterBottom>
            Задание 4: Массивы
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Книга Лермонтова: <b>{Books['Лермонтов']}</b>
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Typography variant="subtitle2" gutterBottom>Массив после сортировки по авторам:</Typography>
          <TableContainer>
            <Table size="small">
              <TableBody>
                {sortedAuthors.map(author => (
                  <TableRow key={author}>
                    <TableCell><b>{author}</b></TableCell>
                    <TableCell>{Books[author]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Задание 5: Строки */}
        <Paper sx={blockStyle('#2C2C2C')}>
          <Typography variant="h6" color="#2C2C2C" gutterBottom>
            Задание 5: Строки
          </Typography>
          <Typography variant="body1">Длина S2 (адрес): <b>{S2.length}</b></Typography>
          <Typography variant="body1">Объединение (S1 + S2): <i>{S1 + " " + S2}</i></Typography>
          <Typography variant="body1">Нижний регистр S2: {S2.toLowerCase()}</Typography>
        </Paper>

        {/* Задание 6: Функция */}
        <Paper sx={blockStyle('#2C2C2C')}>
          <Typography variant="h6" color="#2C2C2C" gutterBottom>
            Задание 6: Пользовательская функция
          </Typography>
          <Box sx={{ bgcolor: '#2d2d2d', color: '#FFFFFF', p: 2, borderRadius: 2, mb: 2 }}>
            <code>b(1, 1, 2) = {functionResult.toFixed(8)}</code>
          </Box>
          <Typography variant="caption" color="text.secondary">
            *Расчет произведен с использованием Math.log (натуральный логарифм) и формулы смены основания.
          </Typography>
        </Paper>

        {/* Кнопка назад */}
        <Button 
          variant="contained" 
          startIcon={<ArrowBackIcon />} 
          component={Link} 
          href="/lab"
          sx={{ mt: 2, bgcolor: '#2C2C2C', '&:hover': { bgcolor: '#4a9529' } }}
        >
          Вернуться в меню
        </Button>
      </Container>
    </Box>
  );
}

/**
 * Хелпер для стилизации блоков заданий (имитация PHP стилей из задания)
 */
const blockStyle = (borderColor: string) => ({
    p: 3, 
  mb: 4, 
  borderLeft: `5px solid ${borderColor}`,
  borderRadius: '0 8px 8px 0',
  transition: '0.3s',
  '&:hover': { boxShadow: 4 }
});