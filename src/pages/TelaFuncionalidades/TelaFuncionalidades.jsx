import estilo from "./estiloTelaFuncionalidades.module.css";

function TelaFuncionalidades(){
    return(
        <div className={estilo.divPrincipal}>
        <div className={estilo.caixaFuncoesPrincipal}>
            <div className={estilo.caixaFuncoes}>
                <div className={estilo.funcoes}>
                    <h2 style={{textAlign: "center"}}>Cadastro de Pessoa Física (CPF)</h2>
                    </div>
                <div className={estilo.funcoes}>
                    <h2 style={{textAlign: "center"}}>Cadastro de Pessoa Jurídica (CNPJ)</h2>
                </div>
                <div className={estilo.funcoes}>
                    <h2 style={{textAlign: "center"}}>Notificação de Estabelecimento</h2>
                </div>
            </div>
            <div className={estilo.caixaFuncoes}>
                <div className={estilo.funcoes}>
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