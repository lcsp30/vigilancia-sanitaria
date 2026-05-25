import estilo from "./cssComponents/estiloBarraNavegacao.module.css"
import { NavLink } from "react-router";

function BarraNavegação(){
    return(
        <div className={estilo.divPrincipal}>
            <div>
                <h2>Sistema Visa</h2>
            </div>

            <div className={estilo.divLinks}>
            <NavLink to={'/'} className={estilo.navLink}>
                Tela Inicial
            </NavLink>
            <NavLink to={'/funcionalidades'} className={estilo.navLink}>
               Funções
            </NavLink>
            <NavLink to={'/telaLicencas'} className={estilo.navLink}>
               Licenças
            </NavLink>
            <NavLink to={'/admin'} className={estilo.navLink}>
              Panel Admin
            </NavLink>
            </div>
           
        </div>
    )
}

export default BarraNavegação;