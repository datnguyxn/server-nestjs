import { configDotenv } from 'dotenv';
configDotenv();
export default {
  env: process.env.NODE_ENV,
  db: process.env.MONGO_URI,
  host: {
    url: process.env.URL,
    port: process.env.PORT,
  },
  jwt: {
    secretOrKey: process.env.JWT_SECRET,
    expiresIn: 36000000,
  },
  mail: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};
