import 'reflect-metadata';

/**
 * CI / локальный запуск без реального .env: переменные до загрузки модулей.
 */
process.env.NODE_ENV ??= 'test';
process.env.PORT ??= '3999';
process.env.CLERK_SECRET_KEY ??= 'sk_test_01234567890123456789012345678901234567890';
process.env.DATABASE_URL ??= 'postgresql://postgres:postgres@127.0.0.1:5432/3d_stock_test';
