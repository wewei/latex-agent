import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout, Menu } from "antd";
import { FileTextOutlined, HomeOutlined } from "@ant-design/icons";
import { useState } from "react";
import MainPage from "./pages/Main";
import EditPage from "./pages/Edit";

const { Header, Content, Sider } = Layout;

function App() {
	const [collapsed, setCollapsed] = useState(false);

	return (
		<HashRouter>
			<Layout style={{ minHeight: "100vh" }}>
				<Header style={{ display: "flex", alignItems: "center" }}>
					<div className="logo" />
					<h1 style={{ color: "white", margin: 0 }}>LaTeX Agent</h1>
				</Header>
				<Layout>
					<Sider
						width={200}
						collapsible
						collapsed={collapsed}
						onCollapse={(value: boolean) => setCollapsed(value)}
					>
						<Menu
							theme="dark"
							mode="inline"
							defaultSelectedKeys={["1"]}
							defaultOpenKeys={["sub1"]}
							style={{ height: "100%", borderRight: 0 }}
						>
							<Menu.Item key="1" icon={<HomeOutlined />}>
								<a href="#/main">Home</a>
							</Menu.Item>
							<Menu.Item key="2" icon={<FileTextOutlined />}>
								<a href="#/edit/test-document">Test Document</a>
							</Menu.Item>
						</Menu>
					</Sider>
					<Layout style={{ padding: "0 24px 24px" }}>
						<Content
							style={{
								padding: 24,
								margin: 0,
								minHeight: 280,
								background: "#fff",
							}}
						>
							<Routes>
								<Route path="/" element={<Navigate to="/main" replace />} />
								<Route path="/main" element={<MainPage />} />
								<Route path="/edit/:documentId" element={<EditPage />} />
							</Routes>
						</Content>
					</Layout>
				</Layout>
			</Layout>
		</HashRouter>
	);
}

export default App;
