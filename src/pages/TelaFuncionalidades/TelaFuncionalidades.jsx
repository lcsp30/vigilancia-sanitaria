import estilo from "./estiloTelaFuncionalidades.module.css";
import { useNavigate } from "react-router";

function TelaFuncionalidades(){
let nav = useNavigate();

function cadastroCpf(){
    nav('/formCpf');
}

function cadastroCnpj(){
    nav('/formCnpj')
}

function estabelecimentoCpf(){
    nav('/estabelecimentos-cpf');
}

function notificados(){
    nav('/estabelecimentos-notificados');
}

    return(
        <div className={estilo.divPrincipal}>
        <div className={estilo.caixaFuncoesPrincipal}>
            <div className={estilo.caixaFuncoes}>
                <div className={estilo.funcoes} onClick={cadastroCpf}>
                    <h2 style={{textAlign: "center"}} >Cadastro de Pessoa Física (CPF)</h2>
                    </div>
                <div className={estilo.funcoes}>
                    <h2 style={{textAlign: "center"}} onClick={cadastroCnpj}>Cadastro de Pessoa Jurídica (CNPJ)</h2>
                </div>
                <div className={estilo.funcoes} onClick={notificados}>
                    <h2 style={{textAlign: "center"}}>Estabelecimentos Notificados</h2>
                </div>
            </div>
            <div className={estilo.caixaFuncoes}>
                <div className={estilo.funcoes}  onClick={estabelecimentoCpf}>
                    <h2 style={{textAlign: "center"}}>Estabelecimentos de Pessoa Física (CPF)</h2>
                </div>
                <div className={estilo.funcoes}>
                    <h2 style={{textAlign: "center"}}>Estabelecimentos de Pessoa Jurídica (CNPJ)</h2>
                </div>
            </div>
        </div>
        </div>
    );
}

export default TelaFuncionalidades;