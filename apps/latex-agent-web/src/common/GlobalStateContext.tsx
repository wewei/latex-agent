import { createContext, ReactNode, useContext, useState } from 'react';
import { UserProfile } from '../services/api/user';

// 定义全局状态的类型
interface GlobalState {
    userProfile: UserProfile;
    setUserProfile: (user: UserProfile) => void;
    other: string;
    setOther: (other: string) => void;
    // 可以继续添加其他全局变量和方法
}

// 创建上下文并提供默认值
export const GlobalStateContext = createContext<GlobalState | undefined>(undefined);

// 创建Provider组件
export const GlobalStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userProfile, setUserProfile] = useState<UserProfile>({ id: '', username: '', email: '', phone: '', avatar: '', currentWorkspace: '', createdAt: '', updatedAt: '' });
    const [other, setOther] = useState<string>('light');
    const value: GlobalState = {
        userProfile,
        setUserProfile,
        other,
        setOther
        // 可以继续添加其他全局变量和方法
    };

    return (
        <GlobalStateContext.Provider value={value}>
            {children}
        </GlobalStateContext.Provider>
    );
};

// 自定义钩子，用于简化上下文的使用
export const useGlobalContext = (): GlobalState => {
    const context = useContext(GlobalStateContext);
    if (context === undefined) {
        throw new Error('useGlobalState must be used within a GlobalStateProvider');
    }
    return context;
};
