import estilo from "./estiloTelaEstabelecimentosNotificados.module.css";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useState } from "react";

function TelaEstabelecimentosNotificados(){
    let [show, setShow] = useState(false);

    function fecharModal(){
        setShow(true);
    }

    function abrirModal(){
        setShow(false);
    }

    return(
        <div className={estilo.divPrincipal}>
            <Modal show={show} onHide={fecharModal}>
        <Modal.Header >
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            Woohoo, you are reading this text in a modal!
            
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={fecharModal}>
                    Close
                </Button>
                <Button onClick={fecharModal}>
                    Save Changes
                </Button>
            </Modal.Footer>
                </Modal>
                    <div className={estilo.divTitulo}>
                        <h1>Estabelicimentos Notificados</h1>
                        <button onClick={abrirModal}>Gerar Notificação</button>
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
                                        <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Weliton Programação Ltda</td>
                                            <td>Weliton Batista Pereira</td>
                                            <td>15/03/2022</td>
                                            <td>000.000.000-61</td>
                                            <td className={estilo.tdBtn}>
                                               <button>Cadastrar</button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Luis Programação Ltda</td>
                                            <td>Luis Carlos Souza</td>
                                            <td>15/03/2022</td>
                                            <td>005.000.000-99</td>
                                            <td className={estilo.tdBtn}>
                                                <button>Cadastrar</button>
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