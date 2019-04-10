const config = module.exports = {
  port: 4000,
  env: 'dev',
  logging: {
    logFile: './logs/app.log',
    level: 'info',
  },
  postgres: {
    host: 'db',
    user: 'htmlAdmin',
    password: 'html',
    database: 'html',
    port: 5432,
    schema: 'html'
  },
  redis: {
    host: 'redis',
    port: 6379
  }
}