// Database
process.env.DATABASE_HOST = 'mysql.newschoolapp.com.br';
process.env.DATABASE_NAME = 'newschool_tests';
process.env.DATABASE_USERNAME = 'newschool_tests';
process.env.DATABASE_PASSWORD = '2(M@2!E&{G@:';
process.env.DATABASE_PORT = 3306;
process.env.SYNC_DATABASE = true;
//Mail
process.env.EMAIL_CONTACTUS = 'no-reply-dev@newschoolapp.com.br';
process.env.SMTP_HOST = 'vps-3769045.newschoolapp.com.br';
process.env.SMTP_PORT = 587;
process.env.SMTP_SECURE = '';
process.env.SMTP_REQUIRE_TLS = true;
process.env.SMTP_USER = 'no-reply-dev@newschoolapp.com.br';
process.env.SMTP_PASSWORD = 'D(^o5R|l*-H7';
process.env.SMTP_FROM = 'New School<no-reply-dev@newschoolapp.com.br>';
//Others
process.env.JWT_SECRET = 'secret';
process.env.EXPIRES_IN_ACCESS_TOKEN = '1h';
process.env.EXPIRES_IN_REFRESH_TOKEN = '2h';
process.env.CHANGE_PASSWORD_EXPIRATION_TIME = 100000000;

module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: '.e2e-spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  setupFilesAfterEnv: ['./jest.setup.ts'],
};
