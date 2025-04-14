import { HashRouter, Routes, Route, Navigate, useLocation, BrowserRouter } from "react-router-dom";
import { Layout, Menu } from "antd";
import { FileTextOutlined, HomeOutlined } from "@ant-design/icons";
import { useState } from "react";
import MainPage from "./pages/Main";
import EditPage from "./pages/Edit";

//import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import BasicLayout from './layouts/BasicLayout';
import Dashboard from './pages/Dashboard';
import Documents from './pages/Documents';
import Profile from './pages/Profile';
import Workspaces from './pages/Workspaces';
import Folders from './pages/Folders';
import SharedFolders from './pages/SharedFolders';
import Login from './pages/Login';
import Register from './pages/Register';
import { GlobalStateProvider } from "./common/GlobalStateContext";

const { Header, Content, Sider } = Layout;

// 路由保护组件
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
	const location = useLocation();
	// 这里添加实际的登录状态检查逻辑
	const isAuthenticated = localStorage.getItem('token') !== null;

	if (!isAuthenticated) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	return <>{children}</>;
};

function App() {
	const [collapsed, setCollapsed] = useState(false);

	return (
		<HashRouter>
			<Routes>
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/edit/:documentId" element={<EditPage />} />
				<Route path="/" element={
					<ProtectedRoute>
						<GlobalStateProvider>
							<BasicLayout />
						</GlobalStateProvider>
					</ProtectedRoute>
				}>
					<Route path="/" element={<Navigate to="/main" replace />} />
					<Route path="main" element={<MainPage />} />
					
					<Route path="dashboard" element={<Dashboard />} />
					<Route path="workspaces" element={<Workspaces />} />
					<Route path="folders">
						<Route path="list" element={<Folders />} />
						<Route path="documents" element={<Documents />} />
						<Route path="shared" element={<SharedFolders />} />
						<Route index element={<Navigate to="/folders/list" replace />} />
					</Route>
					<Route path="profile" element={<Profile />} />
				</Route>
			</Routes>
		</HashRouter>
	);
}

export default App;
