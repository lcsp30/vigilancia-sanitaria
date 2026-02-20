import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider} from "react-router";

import './index.css'
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

let router = createBrowserRouter([
  {
    path: "/",
    Component: App,
  },
  {
    path:"/Login",
    Component: TelaLogin,
  },
  {
    path:"/cadastro",
    Component: TelaCadastro,
  },
  {
    path:"/funcionalidades",
    Component: TelaFuncionalidades,
  },
  {
    path:"/formCpf",
    Component:FormularioCpf,
  },
  {
    path:"/formCnpj",
    Component: FormularioCnpj,
  },
  {
    path:"/estabelecimentos-cpf",
    Component: TelaEstabelecimentosCpf,
  },
  {
    path:"/informacao-estabelecimento",
    Component: TelaInformacaoEstabelecimento,
  },
  {
    path:"/documentos",
    Component: TelaDocumentosEstabelecimento,
  },
  {
    path:"/estabelecimentos-notificados",
    Component: TelaEstabelecimentosNotificados,
  }
]);

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />,
)
