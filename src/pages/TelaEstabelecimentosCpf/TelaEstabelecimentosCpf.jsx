import estilo from "./estiloTelaEstabelecimentosCpf.module.css";
import { AiTwotoneDelete, AiOutlineExport} from "react-icons/ai";
import { useNavigate } from "react-router";
import api from "../../services/api";
import { useEffect, useState } from "react";

function TelaEstabelecimentosCpf(){
    let nav = useNavigate();
    const [executou, setExecutou] = useState(false);
    let [dados, setDados] = useState([]);

    function formatCPF(cpf) {
    return cpf.replace(/\D/g, "")
            .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/,
                     "$1.$2.$3-$4");
}

 useEffect(() => {
    api.get('estabelecimentos_cpf')
    .then( function (response) {

        const dados = response.data.estabelecimentos;

        const dadosFormatdos = dados.map((dd) => ({
            ...dd,
            cpf_display: formatCPF(dd.cpf)
        }));

        setDados(dadosFormatdos);

        console.log(dadosFormatdos);
    }
    )
    .catch(function (error){
        console.log(error);
    });

 }, [executou]);


    function detalhes(dadoId, dadoNome, dadoCategoria){
        let dados = {
            id: dadoId,
            nome:dadoNome,
            categoria: dadoCategoria
        };

        nav('/informacao-estabelecimento', {state: dados});
    }

    
   async function deletar(e){

    let iid = e;
    console.log(iid);

    try{
         let response = await api.delete('estabelecimentos_cpf/deletar', {
            params:{
                id : iid
            }
         });

         console.log(response);
         setExecutou(prev => !prev);

    } catch (error){
        console.error(error); 
    }

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
                                <th>Categoria</th>
                                <th>Situação</th>
                                <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                  {dados.map((dd) => 
                                  <tr key={dd.id}>
                                    <td>{dd.cpf_display}</td>
                                    <td>{dd.nome_fantasia}</td>
                                    <td>{dd.nome}</td>
                                    <td>{dd.categoria}</td>
                                    <td>{dd.situacao}</td>
                                    <td>
                                        <div style={{textAlign:"center"}}>
                                            <AiTwotoneDelete size={25} style={{cursor:"pointer", marginRight:"20px"}} onClick={() => deletar(dd.id)}/> 
                                            <AiOutlineExport size={25} style={{cursor:"pointer"}} onClick={() => detalhes(dd.id, dd.nome_fantasia, dd.categoria)}/>
                                        </div>
                                    </td>
                                </tr>
                                )}
                            </tbody>
                        </table>

                    </div>
                </div>
        </div>
    )
}

export default TelaEstabelecimentosCpf;