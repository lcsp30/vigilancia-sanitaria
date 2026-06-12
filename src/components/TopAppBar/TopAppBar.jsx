// Barra superior global com logotipo, nome do sistema e botão de logout.
import { useAuth } from '../../contexts/AuthContext';
import { AiOutlineLogout } from 'react-icons/ai';
import styles from './TopAppBar.module.css';

export default function TopAppBar() {
  const { logout } = useAuth();

  return (
    <header className={styles.topbar}>
      <div className={styles.topbarLeft}>
        <div className={styles.titleGroup}>
          <span className={styles.topbarTitle}>Sistema VISA</span>
          <span className={styles.topbarSubtitle}>Vigilância Sanitária - Ipixuna do Pará</span>
        </div>
      </div>

      <div className={styles.topbarRight}>
        <div className={styles.divider} aria-hidden="true" />
        <button
          className={styles.logoutBtn}
          onClick={logout}
          title="Sair do sistema"
        >
          <AiOutlineLogout size={16} className={styles.logoutIcon} />
          <span className={styles.logoutLabel}>Sair</span>
        </button>
      </div>
    </header>
  );
}