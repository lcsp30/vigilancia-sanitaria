/**
 * Entry point da aplicação React — bootstrap da SPA.
 *
 * Estratégia de roteamento:
 *   - createBrowserRouter (React Router 7) provê navegação SPA com histórico HTML5.
 *   - Todas as rotas são filhas de RootLayout, que injeta AuthProvider como ancestral comum,
 *     garantindo que o contexto de autenticação esteja disponível em qualquer ponto da árvore.
 *
 * Estratégia de proteção:
 *   - ProtectedRoute envolve cada página individualmente por opção arquitetural: se a proteção
 *     fosse aplicada no nível do layout (ex: um ProtectedLayout), o AuthProvider não estaria
 *     acessível na rota /login (que é pública). A redundância de repetir ProtectedRoute em cada
 *     rota é intencional e paga o preço da verbosidade em troca da clareza de que /login é a
 *     única rota pública — todas as demais exigem autenticação explícita.
 *   - A rota /admin acumula ProtectedRoute (herdado do wrapper) + RoleRoute com allowedLevels [1].
 */
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Outlet } from "react-router";

import './index.css'
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RoleRoute } from './components/RoleRoute';

import App from "./pages/TelaInicial/App";
import TelaLogin from './pages/TelaLogin/TelaLogin';
import FormularioCpf from './pages/FormularioCadastroCpf/FormularioCpf';
import FormularioCnpj from './pages/FormularioCadastroCnpj/FormularioCnpj';
import TelaEstabelecimentosCpf from './pages/TelaEstabelecimentosCpf/TelaEstabelecimentosCpf';
import TelaInformacaoEstabelecimento from './pages/TelaInformacaoEstabelecimento/TelaInformacaoEstabelecimento';
import TelaDocumentosEstabelecimento from './pages/TelaDocumentosEstabelecimento/TelaDocumentosEstabelecimento';
import TelaEstabelecimentosNotificados from './pages/TelaEstabelecimentosNotificados/TelaEstabelecimentosNotificados';
import TelaEstabelecimentosCnpj from './pages/TelaEstabelecimentosCnpj/TelaEstabelecimentosCnpj';
import TelaLicencas from './pages/TelaLicencas/TelaLicencas';
import PanelAdmin from './pages/PanelAdmin/PanelAdmin';

/**
 * Layout raiz da aplicação.
 *
 * Única responsabilidade: prover o AuthContext para toda a árvore de rotas.
 * O Outlet é o ponto de montagem onde as rotas filhas são renderizadas.
 * Não contém UI (sidebar, topbar) — cada página autenticada é responsável
 * por compor seu próprio layout.
 */
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
      /*
       * As 10 rotas abaixo seguem o mesmo padrão:
       *   Component: () => (<ProtectedRoute><Pagina /></ProtectedRoute>)
       *
       * O wrapper em arrow function é necessário porque createBrowserRouter espera
       * um React element como Component, não um componente que recebe children.
       * Sem a arrow function, ProtectedRoute seria tratado como o componente da rota
       * e não como wrapper.
       */
      {
        path: "/",
        Component: () => (
          <ProtectedRoute>
            <App />
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
          /*
           * A rota /admin não repete ProtectedRoute explicitamente porque RoleRoute
           * já verifica isAuthenticated internamente (redireciona ao /login se não
           * autenticado). O allowedLevels [1] restringe acesso a administradores.
           */
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
