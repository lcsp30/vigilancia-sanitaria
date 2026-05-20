import estilo from "./estiloTelaLicencas.module.css";
import { BiLogOut } from "react-icons/bi";
import { useNavigate } from "react-router";
import BarraNavegação from "../../components/BarraNavegacao";
import { useState, useEffect } from "react";
import api from "../../services/api";

function TelaLicencas(){
    let nav = useNavigate();
    let [dcqa, setDcqa] = useState([]);
    let [dcsep, setDcsep] = useState([]);
    let [dcdm, setDcdm] = useState([]);
    let [dcsht, setDcsht] = useState([]);

    useEffect(() => {
        api.get('getLicencas')
        .then(function(response){
            console.log(response.data)
            setDcqa(response.data.DCQA);
            setDcsep(response.data.DCSEP);
            setDcdm(response.data.DCDM);
            setDcsht(response.data.DCSHT);
        })
        .catch(function(error){
            console.error(error);
        });
    }, []);

     const mascararCnpj = (valor) => {
    return valor
        .replace(/\D/g, "") // Remove tudo que não é número
        .replace(/^(\d{2})(\d)/, "$1.$2") // 00.000
        .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3") // 00.000.000
        .replace(/\.(\d{3})(\d)/, ".$1/$2") // 00.000.000/0000
        .replace(/(\d{4})(\d)/, "$1-$2") // 00.000.000/0000-00
        .substring(0, 18); // Limita o tamanho máximo do CNPJ com máscara
};

const mascararCpf = (valor) => {
    return valor
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4")
        .substring(0, 14); // Limita o tamanho máximo do CPF com máscara
};
    
    function voltar(){
        nav(-1);
    }

    return(
        <div className={estilo.divPrincipal}>
            <BarraNavegação/>
            <BiLogOut className={estilo.iconeVoltar} size={35} onClick={voltar}/>
            <div className={estilo.divTitulo}>
                <h1>Licenças</h1>
            </div>
            <div style={{marginBottom: "2%", width: "83vw"}}>
                {/* DCQA */}
                <div className={estilo.divTabela}>
                    <div className={estilo.tituloSecao}>DCQA - Divisão de Controle de Qualidade e Alimentos</div>
                    <div className={estilo.divTabelaScroll}>
                        <table className={estilo.tabelaLicencas}>
                            <thead>
                                <tr>
                                    <th>Nº Licença</th>
                                    <th>CPF/CNPJ</th>
                                    <th>Nome do Estabelecimento</th>
                                    <th>Categoria</th>
                                    <th>Ano</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dcqa.length > 0 && (
                                <>
                                {dcqa.filter(dd => dd.cpf == null).map((dd, index) =>(
                                        <tr key={index}>
                                            <td>{dd.numero_licenca}</td>
                                            <td>{mascararCnpj(dd.cnpj)}</td>
                                            <td>{dd.nome_fantasia_cnpj}</td>
                                            {dd.categoria_id_cnpj == 1 &&
                                                <td>{dd.categoria_cnpj}/{dd.tipo_estb_cnpj}</td>
                                            }
                                            {dd.categoria_id_cnpj != 1 &&
                                                <td>{dd.categoria_cnpj}</td>
                                            }
                                            <td>{dd.ano}</td>
                                        </tr>
                                        ))}
                                {dcqa.filter(dd => dd.cnpj == null).map((dd, index) => ( 
                                        <tr key={index}>
                                            <td>{dd.numero_licenca}</td>
                                            <td>{mascararCpf(dd.cpf)}</td>
                                            <td>{dd.nome_fantasia}</td>
                                            <td>{dd.categoria_cpf}/{dd.tipo_estb_cpf}</td>
                                            <td>{dd.ano}</td>
                                        </tr>
                                        ))}
                                    </>
                                )}
                                {dcqa.length == 0 && 
                                    <tr>
                                        <td colSpan={3}>Nenhuma Licença Encontrada!</td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* DCSEP */}
                <div className={estilo.divTabela}>
                    <div className={estilo.tituloSecao}>DCSEP - Divisão de Controle de Serviços e Produtos</div>
                    <div className={estilo.divTabelaScroll}>
                        <table className={estilo.tabelaLicencas}>
                            <thead>
                                <tr>
                                    <th>Nº Licença</th>
                                    <th>CPF/CNPJ</th>
                                    <th>Nome do Estabelecimento</th>
                                    <th>Categoria</th>
                                    <th>Ano</th>
                                </tr>
                            </thead>
                            <tbody>
                                <>
                                {dcsep.filter(dd => dd.cpf == null).map((dd, index) =>(
                                        <tr key={index}>
                                            <td>{dd.numero_licenca}</td>
                                            <td>{mascararCnpj(dd.cnpj)}</td>
                                            <td>{dd.nome_fantasia_cnpj}</td>
                                            {dd.categoria_id_cnpj == 1 &&
                                                <td>{dd.categoria_cnpj}/{dd.tipo_estb_cnpj}</td>
                                            }
                                            {dd.categoria_id_cnpj != 1 &&
                                                <td>{dd.categoria_cnpj}</td>
                                            }
                                            <td>{dd.ano}</td>
                                        </tr>
                                        ))}
                                {dcsep.filter(dd => dd.cnpj == null).map((dd, index) => ( 
                                        <tr key={index}>
                                            <td>{dd.numero_licenca}</td>
                                            <td>{mascararCpf(dd.cpf)}</td>
                                            <td>{dd.nome_fantasia}</td>
                                            <td>{dd.categoria_cpf}/{dd.tipo_estb_cpf}</td>
                                            <td>{dd.ano}</td>
                                        </tr>
                                        ))}
                                    </>
                                {dcsep.length == 0 && 
                                    <tr>
                                        <td colSpan={3}>Nenhuma Licença Encontrada!</td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* DCDM */}
                <div className={estilo.divTabela}>
                    <div className={estilo.tituloSecao}>DCDM - Divisão de Controle de Medicamentos</div>
                    <div className={estilo.divTabelaScroll}>
                        <table className={estilo.tabelaLicencas}>
                            <thead>
                                <tr>
                                    <th>Nº Licença</th>
                                    <th>CPF/CNPJ</th>
                                    <th>Nome do Estabelecimento</th>
                                    <th>Categoria</th>
                                    <th>Ano</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dcdm.length > 0 && 
                                     <>
                                {dcdm.filter(dd => dd.cpf == null).map((dd, index) =>(
                                        <tr key={index}>
                                            <td>{dd.numero_licenca}</td>
                                            <td>{mascararCnpj(dd.cnpj)}</td>
                                            <td>{dd.nome_fantasia_cnpj}</td>
                                            {dd.categoria_id_cnpj == 1 &&
                                                <td>{dd.categoria_cnpj}/{dd.tipo_estb_cnpj}</td>
                                            }
                                            {dd.categoria_id_cnpj != 1 &&
                                                <td>{dd.categoria_cnpj}</td>
                                            }
                                            <td>{dd.ano}</td>
                                        </tr>
                                        ))}
                                {dcdm.filter(dd => dd.cnpj == null).map((dd, index) => ( 
                                        <tr key={index}>
                                            <td>{dd.numero_licenca}</td>
                                            <td>{mascararCpf(dd.cpf)}</td>
                                            <td>{dd.nome_fantasia}</td>
                                            <td>{dd.categoria_cpf}/{dd.tipo_estb_cpf}</td>
                                            <td>{dd.ano}</td>
                                        </tr>
                                        ))}
                                    </>
                                }
                                {dcdm.length == 0 && 
                                    <tr>
                                        <td colSpan={3}>Nenhuma Licença Encontrada!</td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* DCSHT */}
                <div className={estilo.divTabela}>
                    <div className={estilo.tituloSecao}>DCSHT - Divisão de Controle de Saúde e Higiene no Trabalho</div>
                    <div className={estilo.divTabelaScroll}>
                        <table className={estilo.tabelaLicencas}>
                            <thead>
                                <tr>
                                    <th>Nº Licença</th>
                                    <th>CPF/CNPJ</th>
                                    <th>Nome do Estabelecimento</th>
                                    <th>Categoria</th>
                                    <th>Ano</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dcsht.length > 0 && 
                                    <>
                                {dcsht.filter(dd => dd.cpf == null).map((dd, index) =>(
                                        <tr key={index}>
                                            <td>{dd.numero_licenca}</td>
                                            <td>{mascararCnpj(dd.cnpj)}</td>
                                            <td>{dd.nome_fantasia_cnpj}</td>
                                            {dd.categoria_id_cnpj == 1 &&
                                                <td>{dd.categoria_cnpj}/{dd.tipo_estb_cnpj}</td>
                                            }
                                            {dd.categoria_id_cnpj != 1 &&
                                                <td>{dd.categoria_cnpj}</td>
                                            }
                                            <td>{dd.ano}</td>
                                        </tr>
                                        ))}
                                {dcsht.filter(dd => dd.cnpj == null).map((dd, index) => ( 
                                        <tr key={index}>
                                            <td>{dd.numero_licenca}</td>
                                            <td>{mascararCpf(dd.cpf)}</td>
                                            <td>{dd.nome_fantasia}</td>
                                            <td>{dd.categoria_cpf}/{dd.tipo_estb_cpf}</td>
                                            <td>{dd.ano}</td>
                                        </tr>
                                        ))}
                                    </>
                                }
                                {dcsht.length == 0 && 
                                    <tr>
                                        <td colSpan={3}>Nenhuma Licença Encontrada!</td>
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

export default TelaLicencas;
