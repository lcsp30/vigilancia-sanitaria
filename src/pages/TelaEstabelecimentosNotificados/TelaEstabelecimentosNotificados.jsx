import estilo from "./estiloTelaEstabelecimentosNotificados.module.css";
import { useState } from "react";
import { useNavigate } from "react-router";
import Modal from "../../components/Modal";
import ModalConstatacaoAdvertencia from "../../components/ModalConstatacaoAdvertencia";


function TelaEstabelecimentosNotificados(){
    let nav = useNavigate();

    function btnCadastra(){
        nav('/formCpf');
    }

    return(
        <div className={estilo.divPrincipal}>

                    <div className={estilo.divTitulo}>
                        <h1>Estabelicimentos Notificados</h1>
                        <Modal/>
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
                                        <th>Dia da Notificação</th>
                                        <th>CPF/CNPJ</th>
                                        <th style={{width:"1%" , whiteSpace: "nowrap"}}>Situação</th>
                                        <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Weliton Programação Ltda</td>
                                            <td>Weliton Batista Pereira</td>
                                            <td>15/03/2022</td>
                                            <td>000.000.000-61</td>
                                            <td>Aguardando Comparecimento</td>
                                            <td className={estilo.tdBtn}>
                                               <button onClick={btnCadastra}>Cadastrar</button>
                                               <ModalConstatacaoAdvertencia/>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Luis Programação Ltda</td>
                                            <td>Luis Carlos Souza</td>
                                            <td>15/03/2022</td>
                                            <td>005.000.000-99</td>
                                            <td>Aguardando Comparecimento</td>
                                            <td className={estilo.tdBtn} >
                                                <button onClick={btnCadastra}>Cadastrar</button>
                                                <ModalConstatacaoAdvertencia/>
                                            </td> 
                                        </tr>
                                    </tbody>
                                </table>
        
                            </div>
                        </div>
                </div>
    )
}

export default TelaEstabelecimentosNotificados;