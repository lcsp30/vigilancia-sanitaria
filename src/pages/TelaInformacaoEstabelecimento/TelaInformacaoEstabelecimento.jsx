import estilo from "./estiloTelaInformacaoEstabelecimento.module.css";
import { useNavigate } from "react-router";


function TelaInformacaoEstabelecimento(){
    let nav = useNavigate();

    function pastaDocumentos(){
        nav('/documentos');
    }

    return(
        <div className={estilo.divPrincipal}>
            <div className={estilo.divTitulo}>
                <h1>Nome do Estabelecimento</h1>
            </div>
            <div className={estilo.divConteiner}>
                <div className={estilo.conteiner} onClick={pastaDocumentos}>
                    <h1>2026</h1>
                    <p>Status: <b>Ativo</b></p>
                </div>

                <div className={estilo.conteiner}>

                </div>

                <div className={estilo.conteiner}>

                </div>
            </div>
        </div>
    );
}

export default TelaInformacaoEstabelecimento;