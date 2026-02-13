import estilo from "./estiloTelaEstabelecimentosCpf.module.css";
import IconesAcao from "../../components/IconesAcao";

function TelaEstabelecimentosCpf(){
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
                                    <td><IconesAcao/></td>
                                </tr>
                                <tr>
                                    <td>000.000.000-00</td>
                                    <td>Luis Programação Ltda</td>
                                    <td>Luis Carlos Souza</td>
                                    <td style={{color: "#FFD700"}}>Pendencia de Documentação 📄</td>
                                    <td><IconesAcao/></td> 
                                </tr>
                            </tbody>
                        </table>

                    </div>
                </div>
        </div>
    )
}

export default TelaEstabelecimentosCpf;