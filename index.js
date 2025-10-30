const { program } = require('commander');
const fs = require('fs/promises'); // Використовуємо асинхронний модуль
const http = require('http');

// Налаштування програми та обов'язкових параметрів
program
  .requiredOption('-h, --host <адреса_сервера>', 'адреса сервера')
  .requiredOption('-p, --port <порт_сервера>', 'порт сервера')
  .requiredOption('-c, --cache <шлях_до_директорії>', 'шлях до директорії, яка міститиме кешовані файли');

// Парсинг аргументів командного рядка
program.parse(process.argv);

const options = program.opts();

async function startServer() {
  try {
    // Перевірка та створення директорії кешу асинхронно
    await fs.mkdir(options.cache, { recursive: true });
    console.log(`Директорію для кешу створено або вона вже існує: ${options.cache}`);

    // Створення та запуск веб-сервера
    const server = http.createServer((req, res) => {
      // Наразі сервер відповідає простим "Hello, World!"
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Hello, World!');
    });

    // Обробка помилок при запуску сервера (наприклад, зайнятий порт)
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Помилка: Порт ${options.port} на адресі ${options.host} вже використовується.`);
      } else {
        console.error('Сталася помилка:', err);
      }
      process.exit(1); // Завершення програми з кодом помилки
    });

    server.listen(options.port, options.host, () => {
      console.log(`Сервер запущено на http://${options.host}:${options.port}`);
    });

  } catch (err) {
    console.error('Помилка під час підготовки до запуску сервера:', err);
    process.exit(1);
  }
}

// Виклик функції для запуску сервера
startServer();