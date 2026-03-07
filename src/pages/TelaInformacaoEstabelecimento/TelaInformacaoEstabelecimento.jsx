import estilo from "./estiloTelaInformacaoEstabelecimento.module.css";
import { useNavigate, useLocation } from "react-router";
import { useEffect, useState } from "react";
import api from "../../services/api";


function TelaInformacaoEstabelecimento(){
    let nav = useNavigate();
    let local = useLocation();
    let [anos, setAnos] = useState([]);
    let dd = local.state;

    useEffect(() => {
        let iid = dd.id;
       
        console.log(dd);

        api.get('doc/documentos', {
            params: {
                id:iid
            }
        })
        .then(function (response){
            let resposta = response.data;
            setAnos(resposta);
            console.log(resposta);
        })
        .catch(function(error){
            console.error(error);
        });


    },[]);


    function pastaDocumentos(dadoAno){
        let dados = {
            id: dd.id,
            ano: dadoAno,
            categoria: dd.categoria
        }

        nav('/documentos', {state: dados});
    }

    return(
        <div className={estilo.divPrincipal}>
            <div className={estilo.divTitulo}>
                <h1>{dd.nome}</h1>
            </div>
            <div className={estilo.divConteiner}>
                {anos.map((dd) => 
                <div className={estilo.conteiner} key={dd.ano} onClick={() => pastaDocumentos(dd.ano)}>
                    <h1>{dd.ano}</h1>
                </div>
                )}
            </div>
        </div>
    );
}

export default TelaInformacaoEstabelecimento;