import { Request, Response, NextFunction } from 'express';

/**
 * 请求和响应日志中间件
 * 记录所有API调用的请求和响应信息
 */
export const requestResponseLogger = (req: Request, res: Response, next: NextFunction): void => {
  // 获取当前时间
  const startTime = new Date();
  const requestId = `${startTime.toISOString()}-${Math.random().toString(36).substring(2, 15)}`;
  
  // 克隆请求体，避免修改原始请求
  const requestBody = JSON.stringify(req.body);
  
  // 打印请求信息
  console.log(`\n=== Request [${requestId}] ===`);
  console.log(`[${startTime.toISOString()}] ${req.method} ${req.originalUrl}`);
  console.log('Headers:', JSON.stringify(sanitizeHeaders(req.headers), null, 2));
  
  // 只打印请求体，如果不是GET请求
  if (req.method !== 'GET' && req.body) {
    console.log('Body:', sanitizeBody(requestBody));
  }
  
  // 捕获响应，处理响应信息
  const originalSend = res.send;
  let responseBody: any;
  
  res.send = function(body): Response {
    responseBody = body;
    return originalSend.call(this, body);
  };
  
  // 响应结束后打印响应信息
  res.on('finish', () => {
    const endTime = new Date();
    const responseTime = endTime.getTime() - startTime.getTime();
    
    console.log(`\n=== Response [${requestId}] ===`);
    console.log(`[${endTime.toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode}`);
    console.log('Response Time:', `${responseTime}ms`);
    
    // 尝试解析和打印响应体
    if (responseBody) {
      try {
        const parsedBody = typeof responseBody === 'string' ? 
          JSON.parse(responseBody) : responseBody;
        
        console.log('Response Body:', JSON.stringify(parsedBody, null, 2));
      } catch (error) {
        // 如果无法解析为JSON，直接打印字符串形式（限制长度）
        console.log('Response Body:', String(responseBody).substring(0, 1000) + 
          (String(responseBody).length > 1000 ? '...' : ''));
      }
    }
    
    console.log('=== End ===\n');
  });
  
  next();
};

/**
 * 清理请求头中的敏感信息
 */
function sanitizeHeaders(headers: any): any {
  const sanitized = { ...headers };
  
  // 如果存在授权头，只保留类型不保留具体token
  if (sanitized.authorization) {
    const authParts = sanitized.authorization.split(' ');
    if (authParts.length > 1) {
      sanitized.authorization = `${authParts[0]} [REDACTED]`;
    } else {
      sanitized.authorization = '[REDACTED]';
    }
  }
  
  // 隐藏其他可能的敏感头
  const sensitiveHeaders = ['cookie', 'set-cookie', 'x-auth-token'];
  sensitiveHeaders.forEach(header => {
    if (sanitized[header]) {
      sanitized[header] = '[REDACTED]';
    }
  });
  
  return sanitized;
}

/**
 * 清理请求体中的敏感信息
 */
function sanitizeBody(bodyStr: string): any {
  try {
    const body = JSON.parse(bodyStr);
    const sensitiveFields = ['password', 'password_hash', 'token', 'secret', 'apiKey', 'api_key'];
    
    // 深度遍历对象，隐藏敏感字段
    const sanitizeObj = (obj: any): any => {
      if (!obj || typeof obj !== 'object') return obj;
      
      const sanitized = Array.isArray(obj) ? [...obj] : { ...obj };
      
      Object.keys(sanitized).forEach(key => {
        if (sensitiveFields.includes(key.toLowerCase())) {
          sanitized[key] = '[REDACTED]';
        } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
          sanitized[key] = sanitizeObj(sanitized[key]);
        }
      });
      
      return sanitized;
    };
    
    return JSON.stringify(sanitizeObj(body), null, 2);
  } catch (error) {
    // 如果无法解析JSON，直接返回原字符串
    return bodyStr;
  }
}