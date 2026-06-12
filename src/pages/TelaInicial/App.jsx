// Dashboard com 4 cards de métricas (estabelecimentos, licenças ativas, notificados, licenças vencidas) carregados via /api/metricas.
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import MetricCard from "../../components/MetricCard";
import TopAppBar from "../../components/TopAppBar/TopAppBar";
import estilo from "./App.module.css";
import logo from "../../assets/logoVisa_4k.svg";
import api from "../../services/api";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [totalCadastros, setTotalCadastros] = useState(0);
  const [licencasAtivas, setLicencasAtivas] = useState(0);
  const [licencasVencidas, setLicencasVencidas] = useState(0);
  const [notificados, setNotificados] = useState(0);

  useEffect(() => {
    api.get('metricas')
    .then(function(res){
      console.log(res.data);
      setTotalCadastros(res.data.totalCadastrados);
      setLicencasAtivas(res.data.licencasAtivas);
      setLicencasVencidas(res.data.licencasVencidas);
      setNotificados(res.data.notificados);
    })
    .catch(function(erro){
      console.error(erro);
    });

  },[]);

  const metrics = [
    {
      title: "Estabelecimentos Cadastrados",
      value: totalCadastros,
      variant: "blue",
      icon: "estabelecimentos",
    },
    {
      title: "Licenças Ativas",
      value: licencasAtivas,
      variant: "blue",
      icon: "licencasAtivas",
    },
    {
      title: "Estabelecimentos Notificados",
      value: notificados,
      variant: "yellow",
      icon: "notificados",
    },
    {
      title: "Licenças Vencidas",
      value: licencasVencidas,
      variant: "red",
      icon: "licencasVencidas",
    },
  ];

  const secondaryMetrics = [
    {
      title: "Licenças a Vencer (30 dias)",
      value: "23",
      variant: "purple",
      icon: "licencasAVencer",
    },
  ];

  return (
    <div className={estilo.page}>
      {/* Topbar */}
      <TopAppBar />

      <div className={estilo.principal}>
        {/* Sidebar */}
        <div
          className={`${estilo.sidebarWrapper} ${sidebarOpen ? estilo.sidebarOpen : ""}`}
        >
          <Sidebar />
        </div>

        {/* Conteúdo */}
        <div className={estilo.divCentro}>
          <main className={estilo.main}>
            <div className={estilo.container}>
              {/* Page Header */}
              <div className={estilo.pageHeader}>
                <div className={estilo.pageDivTitulo}>
                  <h1 className={estilo.pageTitle}>Dashboard</h1>
                  <p className={estilo.pageSubtitle}>
                    Indicadores e métricas do sistema de vigilância sanitária
                  </p>
                </div>
                <div className={estilo.divLogo}>
                  <img className={estilo.imgLogo} src={logo} alt="Logo VISA" />
                </div>
              </div>

              {/* KPI Grid — 4 cards principais */}
              <div className={estilo.kpiGrid}>
                {metrics.map((m) => (
                  <MetricCard
                    key={m.title}
                    title={m.title}
                    value={m.value}
                    variant={m.variant}
                    icon={m.icon}
                  />
                ))}
              </div>

              {/* Secondary Grid — métricas complementares */}
              <div className={estilo.secondaryGrid}>
                <div className={estilo.placeholderCard}>
                  <span className={estilo.placeholderText}>
                    Em breve — mais indicadores
                  </span>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
