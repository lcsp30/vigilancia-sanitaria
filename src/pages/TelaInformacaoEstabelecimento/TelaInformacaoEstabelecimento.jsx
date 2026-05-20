import estilo from "./estiloTelaInformacaoEstabelecimento.module.css";
import { useNavigate, useLocation } from "react-router";
import { useEffect, useState } from "react";
import api from "../../services/api";
import BarraNavegação from "../../components/BarraNavegacao";
import { BiLogOut } from "react-icons/bi";
import ModalNovoAno from "../../components/ModalNovoAno";


function TelaInformacaoEstabelecimento(){
    let nav = useNavigate();
    let local = useLocation();
    let [anoAtual, setAnoAtual] = useState("");
    let [anos, setAnos] = useState([]);
    let [execultar, setExecultar] = useState(false);
    let dd = local.state;

    useEffect(() => {
        console.log(dd);
        let iid = dd.id;

        api.get('doc/documentos', {
            params: {
                id:iid,
                tipo:dd.tipo
            }
        })
        .then(function (response){
            let resposta = response.data;
            let atual = resposta[0];
            let outros = resposta.filter(item => atual != item);
            setAnoAtual(atual);
            setAnos(outros);
        })
        .catch(function(error){
            console.error(error);
        });
    },[execultar]);

    function pastaDocumentos(dadoAno){
        let dados = {
            id: dd.id,
            ano: dadoAno,
            tipo: dd.tipo,
            nome:dd.nome,
            num_doc:dd.num_doc,
            categoria:dd.categoria
        }

        nav('/documentos', {state: dados});
    }

    function voltar(){
        nav(-1);
    }


    return(
        <div className={estilo.divPrincipal}>
            <BarraNavegação/>
             <BiLogOut className={estilo.iconeVoltar} size={35} onClick={voltar}/>
             <span className={estilo.btnNovoAno}>
                  <ModalNovoAno idDado={dd.id} categoriaid={dd.id_categoria} tipoEstabelecimento={dd.tipo} setExecultar={setExecultar}/>
             </span>
            <div className={estilo.divTitulo}>
                <h1>{dd.nome}</h1>
            </div>
            <div className={estilo.divConteiner}>
                <div className={estilo.conteiner} onClick={() => pastaDocumentos(anoAtual)}>
                    <h1>{anoAtual}</h1>
                </div>
                {anos.map((dd) => 
                <div className={`${estilo.conteiner} ${estilo.outros}`} key={dd} onClick={() => pastaDocumentos(dd)}>
                    <h1>{dd}</h1>
                </div>
                )}
            </div>
        </div>
    );
}

export default TelaInformacaoEstabelecimento;