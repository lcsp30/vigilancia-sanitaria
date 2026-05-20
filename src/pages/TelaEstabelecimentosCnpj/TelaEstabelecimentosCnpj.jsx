import estilo from "./estiloTelaEstabelecimentosCnpj.module.css";
import { AiTwotoneDelete, AiOutlineExport} from "react-icons/ai";
import { useNavigate } from "react-router";
import api from "../../services/api";
import { useEffect, useState, useMemo } from "react";
import BarraNavegação from "../../components/BarraNavegacao";
import { BiLogOut } from "react-icons/bi";

function TelaEstabelecimentosCnpj(){
    let nav = useNavigate();
    const [executou, setExecutou] = useState(false);
    let [dados, setDados] = useState([]);
    // let [dadosExibir, setDadosExibir] = useState([]);
    let [gerando, setGerando] = useState(false);
    const [busca, setBusca] = useState('');

 useEffect(() => {
     setGerando(true);
    api.get('estabelecimentos_cnpj')
    .then( function (response) {
        const dados = response.data;
        setDados(dados.data);
       // setDadosExibir(dados);
        console.log(dados);
    })
    .catch(function (error){
        console.log(error);
    })
    .finally(function (){
        setGerando(false);
    });

 }, [executou]);


    function detalhes(dadoId, dadoNome, cnpj, dadoCategoria, idcategoria){
        let dados = {
            id: dadoId,
            nome:dadoNome,
            num_doc: cnpj,
            tipo: "cnpj",
            categoria: dadoCategoria,
            id_categoria: idcategoria
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

     function voltar(){
        nav(-1);
    }

    const dadosExibir = useMemo(() => {
    if (!busca) return dados;
    return dados.filter((dd) => dd.nome_fantasia.toLowerCase().includes(busca));
    }, [busca, dados]);

    // No input, só atualiza o estado `busca`
        function buscar(e) {
        setBusca(e.target.value.toLowerCase());
        }

    return(
        <div className={estilo.divPrincipal}>
            <BarraNavegação/>
            <BiLogOut className={estilo.iconeVoltar} size={35} onClick={voltar}/>
            {gerando && <div className={estilo.loadingOverlay}><span className={estilo.spinner}></span></div>}
            <div className={estilo.divTitulo}>
                <h1>Estabelicimentos Pessoa Jurídica - CNPJ</h1>
            </div>
                <div style={{marginBottom: "2%"}}>
                    <div className={estilo.divTabela}>
                        <div className={estilo.divInput}>
                            <input type="text" placeholder="🔍 Buscar Estabelecimento..." onChange={buscar}/>
                        </div>
                        <div className={estilo.divTabelaScroll}>
                            <table className={estilo.tabelaEstabelecimnetos}>
                            <thead>
                                <tr>
                                <th>CNPJ</th>
                                <th>Nome do Estabelecimento</th>
                                <th>Categoria</th>
                                <th>Situação</th>
                                <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {dadosExibir.length > 0 &&
                                    dadosExibir.map((dd) => 
                                  <tr key={dd.id}>
                                    <td>{dd.cnpj}</td>
                                    <td>{dd.nome_fantasia}</td>
                                    {dd.categoria_id == 1 &&
                                        <td>{dd.categoria}/{dd.tipo_estb}</td>
                                    }
                                    {dd.categoria_id != 1 &&
                                        <td>{dd.categoria}</td>
                                    }
                                    {dd.indexSit == 0 &&
                                         <td style={{backgroundColor: "#FFF9C4"}}>{dd.situacao}</td>
                                    }
                                    {dd.indexSit == 1 &&
                                         <td style={{backgroundColor: "#C1E1C1"}}>{dd.situacao}</td>
                                    }
                                    {dd.indexSit == 3 &&
                                         <td style={{backgroundColor: "#FF8585CC"}}>{dd.situacao}</td>
                                    }
                                    {dd.indexSit == 4 &&
                                         <td style={{backgroundColor: "#FFF9C4"}}>{dd.situacao}</td>
                                    }
                                    <td>
                                        <div style={{textAlign:"center"}}>
                                            {/* <AiTwotoneDelete size={25} style={{cursor:"pointer", marginRight:"20px"}} onClick={() => deletar(dd.id)}/>  */}
                                            <AiOutlineExport size={25} style={{cursor:"pointer"}} onClick={() => detalhes(dd.id, dd.nome_fantasia, dd.cnpj, dd.categoria, dd.categoria_id)}/>
                                        </div>
                                    </td>
                                </tr>
                                )}
                                 {dadosExibir.length == 0 && 
                                    <tr>
                                        <td colSpan={5}>Nenhuma Estabelecimento Encontrado!</td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                        </div>
                        
                    </div>
                </div>
        </div>
    )
}

export default TelaEstabelecimentosCnpj;