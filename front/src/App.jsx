import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Terms from "./components/Terms";
import Login from "./components/auth/Login";
import NavBar from "./components/NavBar";
import Cadastro from "./components/auth/Cadastro";
import Dashboard from "./components/dashboard/Dashboard";
import TenantStore from "./components/storefront/StorefrontPage";
import UserLogin from "./components/users/UserLogin";
import UserRegister from "./components/users/UserRegister";
import UserProfile from "./components/users/UserProfile";
import AuthProvider from "./components/auth/AuthProvider";
import UserNav from "./components/users/UserNav";
import RecoveryPassword from "./components/RecoveryPassword";

const MainLayout = () => {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  )
};

const UserLayout = () => {
  
  return (
    <>
      <UserNav />
      <Outlet />
    </>
  )
}

function App () {
  
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Pagina principal */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/termos" element={<Terms />} />
            <Route path="/recuperar-senha" element={<RecoveryPassword />} />
          </Route>
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Pagina das lojas */}
          <Route element={<UserLayout />} >
            <Route path="/usuario-perfil" element={<UserProfile />} />
            <Route path="/usuario-cadastro" element={<UserRegister />} />
            <Route path="/usuario-login" element={<UserLogin />} />
            <Route path="/:slug" element={<TenantStore />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App