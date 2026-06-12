// Barra lateral com 8 links de navegação destacando visualmente a rota ativa no sistema.
import { NavLink } from 'react-router';
import {
  AiOutlineHome,
  AiOutlineUserAdd,
  AiOutlineTeam,
  AiOutlineBell,
  AiOutlineUser,
  AiOutlineShop,
  AiOutlineFileText,
  AiOutlineSetting,
} from 'react-icons/ai';
import estilo from './cssComponents/estiloSidebar.module.css';

const links = [
  { to: '/',                label: 'Home',                        icon: AiOutlineHome },
  { to: '/formCpf',        label: 'Cadastro PF',     icon: AiOutlineUserAdd },
  { to: '/formCnpj',       label: 'Cadastro PJ',   icon: AiOutlineTeam },
  { to: '/estabelecimentos-notificados', label: 'Estabelecimentos Notificados', icon: AiOutlineBell },
  { to: '/estabelecimentos-cpf', label: 'Estabelecimentos PF',           icon: AiOutlineShop },
  { to: '/estabelecimentos-cnpj', label: 'Estabelecimentos PJ',         icon: AiOutlineShop },
  { to: '/telaLicencas',   label: 'Licenças',                   icon: AiOutlineFileText },
  { to: '/admin',          label: 'Painel Admin',               icon: AiOutlineSetting },
];

function Sidebar() {
  return (
    <aside className={estilo.sidebar}>
      <nav className={estilo.nav}>
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `${estilo.link} ${isActive ? estilo.linkActive : ''}`
            }
          >
            <span className={estilo.linkIcon}>
              <Icon size={20} />
            </span>
            <span className={estilo.linkLabel}>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;