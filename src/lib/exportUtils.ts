import * as XLSX from 'xlsx';
// @ts-ignore - pdfmake не имеет полных типов
import pdfMake from 'pdfmake/build/pdfmake';
// @ts-ignore - pdfmake не имеет полных типов
import pdfFonts from 'pdfmake/build/vfs_fonts';

// Инициализация шрифтов для pdfmake
// pdfmake использует встроенные шрифты, которые поддерживают кириллицу
if (typeof window !== 'undefined' && pdfMake && pdfFonts) {
  (pdfMake as any).vfs = (pdfFonts as any).pdfMake?.vfs || (pdfFonts as any).vfs;
  (pdfMake as any).fonts = {
    Roboto: {
      normal: 'Roboto-Regular.ttf',
      bold: 'Roboto-Medium.ttf',
      italics: 'Roboto-Italic.ttf',
      bolditalics: 'Roboto-MediumItalic.ttf'
    }
  };
}

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

// Функция экспорта в PDF с использованием pdfmake
// pdfmake создает текстовые PDF с поддержкой кириллицы
export const exportToPDF = async (
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

    // Создаем дату
    const date = new Date().toLocaleString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Подготавливаем заголовки таблицы
    const tableHeaders = columns.map(col => ({
      text: col.header || '',
      style: 'tableHeader',
      bold: true
    }));

    // Подготавливаем строки таблицы
    const tableBody = data.map(row => {
      return columns.map(col => {
        try {
          const value = row[col.key];
          const formatted = col.formatter ? col.formatter(value, row) : value;
          const strValue = String(formatted ?? '');
          // Обрезаем длинные тексты
          return strValue.length > 50 ? strValue.substring(0, 50) + '...' : strValue;
        } catch (error) {
          console.error('Ошибка форматирования ячейки:', error);
          return '';
        }
      });
    });

    // Определение документа PDF
    const docDefinition: any = {
      pageOrientation: 'landscape',
      pageSize: 'A4',
      content: [
        // Заголовок
        {
          text: title,
          style: 'header',
          margin: [0, 0, 0, 10]
        },
        // Дата
        {
          text: `Создано: ${date}`,
          style: 'subheader',
          margin: [0, 0, 0, 20]
        },
        // Таблица
        {
          table: {
            headerRows: 1,
            widths: columns.map(col => col.width ? `${col.width}mm` : 'auto'),
            body: [
              tableHeaders,
              ...tableBody
            ]
          },
          layout: {
            fillColor: (rowIndex: number) => {
              if (rowIndex === 0) return '#424242';
              return rowIndex % 2 === 0 ? '#f5f5f5' : null;
            },
            hLineWidth: (i: number) => (i === 0 || i === 1) ? 1 : 0.5,
            vLineWidth: () => 0.5,
            hLineColor: () => '#ddd',
            vLineColor: () => '#ddd',
            paddingLeft: () => 6,
            paddingRight: () => 6,
            paddingTop: () => 6,
            paddingBottom: () => 6
          }
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          color: '#333',
          alignment: 'left'
        },
        subheader: {
          fontSize: 10,
          color: '#666',
          alignment: 'left'
        },
        tableHeader: {
          fontSize: 10,
          bold: true,
          color: 'white',
          fillColor: '#424242',
          alignment: 'left'
        }
      },
      defaultStyle: {
        fontSize: 9,
        font: 'Roboto'
      }
    };

    // Создаем и скачиваем PDF
    (pdfMake as any).createPdf(docDefinition).download(`${fileName}.pdf`);

    console.log('PDF успешно создан с поддержкой кириллицы (текстовый формат)');
  } catch (error) {
    console.error('Ошибка при экспорте в PDF:', error);
    console.error('Детали ошибки:', error instanceof Error ? error.message : String(error));
    alert(`Произошла ошибка при экспорте в PDF: ${error instanceof Error ? error.message : String(error)}`);
  }
};
