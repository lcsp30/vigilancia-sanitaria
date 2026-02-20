import estilo from "./estiloTelaEstabelecimentosCpf.module.css";
import { AiTwotoneDelete, AiOutlineExport} from "react-icons/ai";
import { useNavigate } from "react-router";

function TelaEstabelecimentosCpf(){
    let nav = useNavigate();

    function detalhes(){
        nav('/informacao-estabelecimento');
    }

    return(
        <div className={estilo.divPrincipal}>
            <div className={estilo.divTitulo}>
                <h1>Estabelicimentos Pessoa Física - CPF</h1>
            </div>
                <div>
                    <div className={estilo.divTabela}>
                        <div className={estilo.divInput}>
                            <input type="text" placeholder="🔍 Buscar Estabelecimento..."/>
                        </div>
                        <table className={estilo.tabelaEstabelecimnetos}>
                            <thead>
                                <tr>
                                <th>CPF</th>
                                <th>Nome do Estabelecimento</th>
                                <th>Nome do Proprietario</th>
                                <th>Situação</th>
                                <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>000.000.000-00</td>
                                    <td>Weliton Programação Ltda</td>
                                    <td>Weliton Batista Pereira</td>
                                    <td style={{color:"#32CD32"}}>Ativo ✔</td>
                                    <td>
                                        <div style={{textAlign:"center"}}>
                                            <AiTwotoneDelete size={23} style={{cursor:"pointer", marginRight:"20px"}}/> 
                                            <AiOutlineExport size={23} style={{cursor:"pointer"}} onClick={detalhes}/>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>000.000.000-00</td>
                                    <td>Luis Programação Ltda</td>
                                    <td>Luis Carlos Souza</td>
                                    <td style={{color: "#FFD700"}}>Pendencia de Documentação 📄</td>
                                    <td>
                                        <div style={{textAlign:"center"}}>
                                            <AiTwotoneDelete size={23} style={{cursor:"pointer", marginRight:"20px"}}/> 
                                            <AiOutlineExport size={23} style={{cursor:"pointer"}} onClick={detalhes}/>
                                        </div>
                                    </td> 
                                </tr>
                            </tbody>
                        </table>

                    </div>
                </div>
        </div>
    )
}

export default TelaEstabelecimentosCpf;