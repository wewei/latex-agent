import {  HashRouter, Routes, Route, Navigate,useLocation, BrowserRouter } from "react-router-dom";
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

const { Header, Content, Sider } = Layout;

// 路由保护组件
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
	const location = useLocation();
	// 这里添加实际的登录状态检查逻辑
	const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
	
	if (!isAuthenticated) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}
	
	return <>{children}</>;
};

function App() {
	const [collapsed, setCollapsed] = useState(false);

	return (
		// <HashRouter>
		// 	<Layout style={{ minHeight: "100vh" }}>
		// 		<Header style={{ display: "flex", alignItems: "center" }}>
		// 			<div className="logo" />
		// 			<h1 style={{ color: "white", margin: 0 }}>LaTeX Agent</h1>
		// 		</Header>
		// 		<Layout>
		// 			<Sider
		// 				width={200}
		// 				collapsible
		// 				collapsed={collapsed}
		// 				onCollapse={(value: boolean) => setCollapsed(value)}
		// 			>
		// 				<Menu
		// 					theme="dark"
		// 					mode="inline"
		// 					defaultSelectedKeys={["1"]}
		// 					defaultOpenKeys={["sub1"]}
		// 					style={{ height: "100%", borderRight: 0 }}
		// 				>
		// 					<Menu.Item key="1" icon={<HomeOutlined />}>
		// 						<a href="#/main">Home</a>
		// 					</Menu.Item>
		// 					<Menu.Item key="2" icon={<FileTextOutlined />}>
		// 						<a href="#/edit/test-document">Test Document</a>
		// 					</Menu.Item>
		// 				</Menu>
		// 			</Sider>
		// 			<Layout style={{ padding: "0 24px 24px" }}>
		// 				<Content
		// 					style={{
		// 						padding: 24,
		// 						margin: 0,
		// 						minHeight: 280,
		// 						background: "#fff",
		// 					}}
		// 				>
		// 					<Routes>
		// 						<Route path="/" element={<Navigate to="/main" replace />} />
		// 						<Route path="/main" element={<MainPage />} />
		// 						<Route path="/edit/:documentId" element={<EditPage />} />
		// 					</Routes>
		// 				</Content>
		// 			</Layout>
		// 		</Layout>
		// 	</Layout>
		// </HashRouter>


		<HashRouter>
		<Routes>
			<Route path="/login" element={<Login />} />
			<Route path="/register" element={<Register />} />
			<Route path="/" element={
				<ProtectedRoute>
					<BasicLayout />
				</ProtectedRoute>
			}>
				<Route path="/" element={<Navigate to="/main" replace />} />
		 		<Route path="main" element={<MainPage />} />
		 		<Route path="edit/:documentId" element={<EditPage />} />
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
