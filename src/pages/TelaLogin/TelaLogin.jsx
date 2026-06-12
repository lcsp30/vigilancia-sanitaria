// Tela de login — única rota pública. Autentica o usuário via AuthContext e redireciona ao dashboard.
import { useState } from 'react';
import { useNavigate } from "react-router";
import { useAuth } from '../../contexts/AuthContext';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import estilo from "./estiloTelaLogin.module.css";
import logo from "../../assets/logoVisa_4k.svg";

function TelaLogin(){
    let nav = useNavigate();
    const { login } = useAuth();
    const [form, setForm] = useState({ name:'', senha:''});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showSenha, setShowSenha] = useState(false);

    // Envia credenciais ao AuthContext.login() e trata erros de autenticação do backend.
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(form.name, form.senha);
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao fazer login.');
        } finally {
            setLoading(false);
        }
    };

    return(
        <div className={estilo.divPrincipal}>
            <div className={estilo.caixaFormulario}>
                <form className={estilo.formLogin} onSubmit={handleSubmit}>
                    {/* <h2 className={estilo.formTitle}>Login</h2> */}
                    <div className={estilo.caixaImg}>
                        <img src={logo} alt="Logo VISA" />
                    </div>

                    <div className={estilo.caixaInput}>
                        <label className={estilo.labelLogin} htmlFor="name">Usuário</label>
                        <input
                            className={estilo.inputLogin}
                            type="text"
                            name="name_user"
                            placeholder="Digite seu usuário"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className={estilo.caixaInput}>
                        <label className={estilo.labelLogin} htmlFor="senha">Código de Acesso</label>
                        <div className={estilo.senhaWrapper}>
                            <input
                                className={estilo.inputSenha}
                                type={showSenha ? "text" : "password"}
                                name="senha"
                                placeholder="Digite seu código de acesso"
                                value={form.senha}
                                onChange={(e) => setForm({ ...form, senha: e.target.value })}
                                required
                            />
                            <button
                                type="button"
                                className={estilo.btnToggleSenha}
                                onClick={() => setShowSenha(!showSenha)}
                                tabIndex={-1}
                                title={showSenha ? "Esconder senha" : "Mostrar senha"}
                            >
                                {showSenha ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
                            </button>
                        </div>
                    </div>

                    {error && <p className={estilo.errorText}>{error}</p>}

                    <div className={estilo.caixaBtn}>
                        <button className={estilo.btnEntrar} type="submit" disabled={loading}>
                            {loading ? 'Entrando...' : 'Entrar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TelaLogin;