import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Функция для транслитерации кириллицы в латиницу
// jsPDF не поддерживает кириллицу без кастомных шрифтов
const transliterate = (text: string): string => {
  if (!text) return '';
  const translitMap: Record<string, string> = {
    'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'E',
    'Ж': 'Zh', 'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M',
    'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U',
    'Ф': 'F', 'Х': 'H', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sch',
    'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya',
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
    'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
    '№': 'N', '—': '-', '–': '-', '«': '"', '»': '"', '„': '"', '“': '"',
  };
  return text.split('').map(char => translitMap[char] || char).join('');
};

export interface ExportColumn {
  header: string;
  key: string;
  width?: number;
  formatter?: (value: any, row: any) => string;
}

export const exportToExcel = (
  data: any[],
  columns: ExportColumn[],
  fileName: string
) => {
  try {
    if (!data || data.length === 0) {
      alert('Нет данных для экспорта');
      return;
    }

    // Подготовка данных для Excel
    const excelData = data.map((row) => {
      const excelRow: Record<string, any> = {};
      columns.forEach((col) => {
        const value = row[col.key];
        excelRow[col.header] = col.formatter ? col.formatter(value, row) : value ?? '';
      });
      return excelRow;
    });

    // Создание рабочей книги
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Настройка ширины столбцов
    const colWidths = columns.map((col) => ({
      wch: col.width || 15,
    }));
    ws['!cols'] = colWidths;

    // Добавление листа в книгу
    XLSX.utils.book_append_sheet(wb, ws, 'Данные');

    // Сохранение файла
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  } catch (error) {
    console.error('Ошибка при экспорте в Excel:', error);
    alert('Произошла ошибка при экспорте в Excel');
  }
};

export const exportToPDF = (
  data: any[],
  columns: ExportColumn[],
  fileName: string,
  title: string = 'Отчет'
) => {
  try {
    if (!data || data.length === 0) {
      alert('Нет данных для экспорта');
      return;
    }

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    // Заголовок
    doc.setFontSize(16);
    doc.text(transliterate(title), 14, 10);

    // Дата создания
    const date = new Date().toLocaleString('ru-RU');
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Created: ${date}`, 14, 16);

    // Подготовка данных для таблицы с транслитерацией кириллицы
    const tableData = data.map((row) =>
      columns.map((col) => {
        try {
          const value = row[col.key];
          const formatted = col.formatter ? col.formatter(value, row) : value;
          // Преобразуем все значения в строки и обрезаем длинные тексты
          const strValue = String(formatted ?? '');
          const truncated = strValue.length > 50 ? strValue.substring(0, 50) + '...' : strValue;
          return transliterate(truncated);
        } catch (error) {
          console.error('Ошибка форматирования ячейки:', error);
          return '';
        }
      })
    );

    const headers = columns.map((col) => transliterate(col.header));

    // Добавление таблицы
    autoTable(doc, {
      head: [headers],
      body: tableData,
      startY: 20,
      styles: { 
        fontSize: 8, 
        cellPadding: 2,
        font: 'helvetica',
        fontStyle: 'normal',
      },
      headStyles: { 
        fillColor: [66, 66, 66], 
        textColor: 255, 
        fontStyle: 'bold',
        font: 'helvetica',
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { top: 20 },
      didParseCell: (data: any) => {
        // Убеждаемся, что текст правильно обрабатывается и транслитерируется
        if (data.cell.text) {
          const textArray = Array.isArray(data.cell.text) 
            ? data.cell.text.map((t: any) => String(t || ''))
            : [String(data.cell.text || '')];
          // Применяем транслитерацию к каждому элементу
          data.cell.text = textArray.map((t: string) => transliterate(t));
        }
      },
    });

    // Сохранение файла
    doc.save(`${fileName}.pdf`);
  } catch (error) {
    console.error('Ошибка при экспорте в PDF:', error);
    alert('Произошла ошибка при экспорте в PDF');
  }
};
