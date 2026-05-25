import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Outlet } from "react-router";

import './index.css'
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RoleRoute } from './components/RoleRoute';

import App from "./pages/TelaInicial/App";
import TelaLogin from './pages/TelaLogin/TelaLogin';
import TelaCadastro from './pages/TelaCadastro/TelaCadastro';
import TelaFuncionalidades from './pages/TelaFuncionalidades/TelaFuncionalidades';
import FormularioCpf from './pages/FormularioCadastroCpf/FormularioCpf';
import FormularioCnpj from './pages/FormularioCadastroCnpj/FormularioCnpj';
import TelaEstabelecimentosCpf from './pages/TelaEstabelecimentosCpf/TelaEstabelecimentosCpf';
import TelaInformacaoEstabelecimento from './pages/TelaInformacaoEstabelecimento/TelaInformacaoEstabelecimento';
import TelaDocumentosEstabelecimento from './pages/TelaDocumentosEstabelecimento/TelaDocumentosEstabelecimento';
import TelaEstabelecimentosNotificados from './pages/TelaEstabelecimentosNotificados/TelaEstabelecimentosNotificados';
import TelaEstabelecimentosCnpj from './pages/TelaEstabelecimentosCnpj/TelaEstabelecimentosCnpj';
import TelaLicencas from './pages/TelaLicencas/TelaLicencas';
import PanelAdmin from './pages/PanelAdmin/PanelAdmin';

function RootLayout() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}

let router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/login",
        Component: TelaLogin,
      },
      {
        path: "/",
        Component: () => (
          <ProtectedRoute>
            <App />
          </ProtectedRoute>
        ),
      },
      {
        path: "/cadastro",
        Component: () => (
          <ProtectedRoute>
            <TelaCadastro />
          </ProtectedRoute>
        ),
      },
      {
        path: "/funcionalidades",
        Component: () => (
          <ProtectedRoute>
            <TelaFuncionalidades />
          </ProtectedRoute>
        ),
      },
      {
        path: "/formCpf",
        Component: () => (
          <ProtectedRoute>
            <FormularioCpf />
          </ProtectedRoute>
        ),
      },
      {
        path: "/formCnpj",
        Component: () => (
          <ProtectedRoute>
            <FormularioCnpj />
          </ProtectedRoute>
        ),
      },
      {
        path: "/estabelecimentos-cpf",
        Component: () => (
          <ProtectedRoute>
            <TelaEstabelecimentosCpf />
          </ProtectedRoute>
        ),
      },
      {
        path: "/informacao-estabelecimento",
        Component: () => (
          <ProtectedRoute>
            <TelaInformacaoEstabelecimento />
          </ProtectedRoute>
        ),
      },
      {
        path: "/documentos",
        Component: () => (
          <ProtectedRoute>
            <TelaDocumentosEstabelecimento />
          </ProtectedRoute>
        ),
      },
      {
        path: "/estabelecimentos-notificados",
        Component: () => (
          <ProtectedRoute>
            <TelaEstabelecimentosNotificados />
          </ProtectedRoute>
        ),
      },
      {
        path: "/estabelecimentos-cnpj",
        Component: () => (
          <ProtectedRoute>
            <TelaEstabelecimentosCnpj />
          </ProtectedRoute>
        ),
      },
      {
        path: "/telaLicencas",
        Component: () => (
          <ProtectedRoute>
            <TelaLicencas />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin",
        Component: () => (
          <RoleRoute allowedLevels={[1]}>
            <PanelAdmin />
          </RoleRoute>
        ),
      },
    ],
  },
]);

function Root() {
  return <RouterProvider router={router} />;
}

createRoot(document.getElementById('root')).render(
  <Root />,
)
