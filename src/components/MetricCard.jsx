// Exibe um card de métrica com valor, título, ícone e cor no dashboard.
// O iconMap desacopla a escolha do ícone: cada chave representa uma métrica do domínio da vigilância sanitária.
import {
  AiOutlineShop,
  AiOutlineCheckCircle,
  AiOutlineBell,
  AiOutlineWarning,
  AiOutlineClockCircle,
} from 'react-icons/ai';
import estilo from './cssComponents/estiloMetricCard.module.css';

const iconMap = {
  estabelecimentos: AiOutlineShop,
  licencasAtivas: AiOutlineCheckCircle,
  notificados: AiOutlineBell,
  licencasVencidas: AiOutlineWarning,
  licencasAVencer: AiOutlineClockCircle,
};

/**
 * @param {Object} props
 * @param {string} props.title - Rótulo da métrica (ex: "Estabelecimentos")
 * @param {(number|string)} props.value - Valor numérico ou textual exibido em destaque
 * @param {string} [props.variant='green'] - Variante de cor do card (green, red, yellow, blue)
 * @param {string} [props.icon] - Chave do iconMap para o ícone correspondente
 */
function MetricCard({ title, value, variant = 'green', icon }) {
  const IconComponent = iconMap[icon] || AiOutlineShop;

  return (
    <div className={`${estilo.card} ${estilo[`card--${variant}`]}`}>
      <div className={estilo.top}>
        <span className={estilo.label}>{title}</span>
        <div className={`${estilo.iconWrap} ${estilo[`iconWrap--${variant}`]}`}>
          <IconComponent size={20} />
        </div>
      </div>
      <strong className={estilo.value}>{value}</strong>
    </div>
  );
}

export default MetricCard;
