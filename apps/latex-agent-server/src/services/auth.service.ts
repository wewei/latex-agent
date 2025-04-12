import jwt from 'jsonwebtoken';
import { userDao } from '../dao';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const TOKEN_EXPIRES_IN = '24h';

export interface TokenPayload {
  userId: number;
  username: string;
  isAdmin: boolean;
}

class AuthService {
  /**
   * 生成 JWT 令牌
   */
  generateToken(userId: number, username: string, isAdmin: boolean): string {
    const payload: TokenPayload = {
      userId,
      username,
      isAdmin
    };
    
    return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });
  }
  
  /**
   * 验证 JWT 令牌
   */
  verifyToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }
  
  /**
   * 登录验证
   */
  async login(username: string, password: string): Promise<{ token: string, user: any } | null> {
    // 这里应该使用加密密码比较，但简化处理
    const user = await userDao.findByUsername(username);
    
    if (!user || user.password_hash !== password) {
      return null;
    }
    
    const token = this.generateToken(user.id, user.username, user.is_admin);
    
    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.is_admin
      }
    };
  }

  /**
   * 登出
   */
  async logout(userId: number): Promise<void> {
    try {
      // 如果您使用Redis或其他存储来跟踪活动令牌，可以在这里使其失效
      // 例如: await redisClient.del(`user_token:${userId}`);
      
      // 如果您正在使用会话令牌表，可以在这里将令牌标记为已撤销
      // 例如: await tokenDao.revokeUserTokens(userId);
      
      // 简单实现：仅记录登出操作
      console.log(`User ${userId} logged out`);
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  }
}

export default new AuthService();