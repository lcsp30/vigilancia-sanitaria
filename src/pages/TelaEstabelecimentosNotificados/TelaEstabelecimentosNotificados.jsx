import estilo from "./estiloTelaEstabelecimentosNotificados.module.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Modal from "../../components/Modal";
import ModalConstatacaoAdvertencia from "../../components/ModalConstatacaoAdvertencia";
import BarraNavegação from "../../components/BarraNavegacao";
import { BiLogOut } from "react-icons/bi";
import api from "../../services/api";

function TelaEstabelecimentosNotificados(){
    let nav = useNavigate();
    let [dados, setDados] = useState([]);
    let [execultar, setExecultar] = useState(false);

    useEffect(() => {
        api.get('estabelecimentos_notificados')
        .then(function(response){
            let dadosBD = response.data;

            console.log(dadosBD);
            setDados(dadosBD);
        })
        .catch(function(erro){
            console.error(erro);
        });

    }, [execultar]);

    function btnFinalizar(id){
        api.delete('estabelecimentos_notificados/delete', {
            params: {
                id : id
            }
        })
        .then(function(response){
            console.log(response.data);
            setExecultar(prev => !prev);
        })
        .catch(function(erro){
             console.error(erro.response?.data || erro);
        });
    }

      function voltar(){
        nav(-1);
    }


    return(
        <div className={estilo.divPrincipal}>
            <BarraNavegação/>
            <BiLogOut className={estilo.iconeVoltar} size={35} onClick={voltar}/>
                    <div className={estilo.divTitulo}>
                        <h1>Estabelicimentos Notificados</h1>
                        <Modal setExecultar={setExecultar}/>
                    </div>
                    
                        <div>
                            <div className={estilo.divTabela}>
                                <div className={estilo.divInput}>
                                    <input type="text" placeholder="🔍 Buscar Estabelecimento..."/>
                                </div>
                                <table className={estilo.tabelaEstabelecimnetos}>
                                    <thead>
                                        <tr>
                                        <th>Nome do Estabelecimento</th>
                                        <th>Nome do Proprietario</th>
                                        <th>Contato</th>
                                        <th>Dia da Notificação</th>
                                        <th style={{width:"1%" , whiteSpace: "nowrap"}}>Situação</th>
                                        <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dados.length > 0 &&
                                        dados.map((dd) => 
                                        <tr key={dd.id}>
                                            <td>{dd.nome_estabelecimento}</td>
                                            <td>{dd.nome_proprietario}</td>
                                            <td>{dd.contato}</td>
                                            <td>{dd.data_notificacao}</td>
                                            <td>{dd.situacao}</td>
                                            <td className={estilo.tdBtn}>
                                               <button onClick={() => btnFinalizar(dd.id)}>Finalizar</button>
                                            </td>
                                        </tr>
                                        )}
                                        {dados.length == 0 &&
                                            <tr>
                                                 <td colSpan={4}>Nenhum Estabelecimento Notificado!</td>
                                            </tr>
                                        }
                                    </tbody>
                                </table>
        
                            </div>
                        </div>
                </div>
    )
}

export default TelaEstabelecimentosNotificados;