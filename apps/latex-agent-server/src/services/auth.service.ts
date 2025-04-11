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
}

export default new AuthService();