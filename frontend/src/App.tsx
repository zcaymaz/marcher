import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import PublicLayout from './components/layout/PublicLayout';
import AdminRoute from './components/admin/AdminRoute';
import AdminLayout from './components/admin/AdminLayout';

import Home from './pages/Home';
import Menu from './pages/Menu';
import MenuDetail from './pages/MenuDetail';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import References from './pages/References';
import Franchise from './pages/Franchise';
import About from './pages/About';

import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import MenuList from './pages/admin/MenuList';
import MenuForm from './pages/admin/MenuForm';
import BlogList from './pages/admin/BlogList';
import BlogForm from './pages/admin/BlogForm';
import CampaignList from './pages/admin/CampaignList';
import CampaignForm from './pages/admin/CampaignForm';
import ReferenceList from './pages/admin/ReferenceList';
import ReferenceForm from './pages/admin/ReferenceForm';
import ReviewList from './pages/admin/ReviewList';
import ReviewForm from './pages/admin/ReviewForm';
import FranchiseList from './pages/admin/FranchiseList';
import SiteSettingsPage from './pages/admin/SiteSettingsPage';
import UserList from './pages/admin/UserList';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <SettingsProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/menu/:slug" element={<MenuDetail />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
                <Route path="/references" element={<References />} />
                <Route path="/franchise" element={<Franchise />} />
                <Route path="/about" element={<About />} />
              </Route>

              <Route path="/admin/login" element={<AdminLogin />} />

              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="menu" element={<MenuList />} />
                  <Route path="menu/new" element={<MenuForm />} />
                  <Route path="menu/edit/:slug" element={<MenuForm />} />
                  <Route path="blog" element={<BlogList />} />
                  <Route path="blog/new" element={<BlogForm />} />
                  <Route path="blog/edit/:slug" element={<BlogForm />} />
                  <Route path="campaigns" element={<CampaignList />} />
                  <Route path="campaigns/new" element={<CampaignForm />} />
                  <Route path="campaigns/edit/:id" element={<CampaignForm />} />
                  <Route path="references" element={<ReferenceList />} />
                  <Route path="references/new" element={<ReferenceForm />} />
                  <Route path="references/edit/:slug" element={<ReferenceForm />} />
                  <Route path="reviews" element={<ReviewList />} />
                  <Route path="reviews/new" element={<ReviewForm />} />
                  <Route path="reviews/edit/:id" element={<ReviewForm />} />
                  <Route path="franchise" element={<FranchiseList />} />
                  <Route path="settings" element={<SiteSettingsPage />} />
                  <Route path="users" element={<UserList />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </SettingsProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
