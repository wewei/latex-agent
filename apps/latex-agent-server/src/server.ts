import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { initializeDatabase } from './db';
import router from './routes';


const app = express();
const port = process.env.PORT || 3000;

// 中间件
app.use(helmet());  // 安全头
app.use(cors());    // 跨域支持
app.use(morgan('dev')); // 日志
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 公开路由
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to the LaTeX Agent API Server!'
  });
});


// API 路由 - 大部分需要鉴权
app.use('/latex/api/v1', router);

// 404 处理
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// 错误处理
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// 启动服务器
app.listen(port, async () => {
  try {
    await initializeDatabase();
    console.log(`Server is running on port ${port}`);
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
});

export default app;