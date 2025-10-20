// Тестовый скрипт для проверки cloud storage
// Запустите: node scripts/test-cloud-storage.js

const { createStorageProvider } = require('../src/lib/cloudStorage');

async function testCloudStorage() {
  console.log('🧪 Тестирование Cloud Storage...');
  
  try {
    // Создаем провайдер
    const storage = createStorageProvider();
    console.log('✅ Провайдер создан успешно');
    
    // Создаем тестовый файл (1x1 пиксель PNG)
    const testImageBuffer = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
      0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0xD7, 0x63, 0xF8, 0x0F, 0x00, 0x00,
      0x01, 0x00, 0x01, 0x00, 0x18, 0xDD, 0x8D, 0xB4, 0x00, 0x00, 0x00, 0x00,
      0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
    ]);
    
    console.log('📤 Загружаем тестовое изображение...');
    
    // Загружаем файл
    const result = await storage.uploadFile(
      testImageBuffer,
      'test_image.png',
      'test',
      'image/png'
    );
    
    console.log('✅ Файл загружен успешно!');
    console.log('📁 URL:', result.url);
    console.log('📄 Имя файла:', result.fileName);
    console.log('🔑 Public ID:', result.publicId);
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    
    if (error.message.includes('package not found')) {
      console.log('\n💡 Решение:');
      console.log('1. Установите нужный пакет:');
      console.log('   npm install cloudinary --legacy-peer-deps');
      console.log('   npm install @vercel/blob --legacy-peer-deps');
      console.log('2. Или используйте локальное хранилище:');
      console.log('   CLOUD_STORAGE_PROVIDER=local');
    }
    
    if (error.message.includes('Invalid API credentials')) {
      console.log('\n💡 Решение:');
      console.log('1. Проверьте переменные окружения в .env.local');
      console.log('2. Убедитесь, что API ключи правильные');
      console.log('3. Проверьте отсутствие пробелов в ключах');
    }
  }
}

// Запускаем тест
testCloudStorage();
