import { useState } from 'react';
import Sidebar from './SideBar';
import TelaInicialDashboard from './TelaInicialDashboard';
import CardapioDashboard from './CardapioDashboard';
import ConfiguracoesDashboard from './ConfiguracoesDashboard';
import PedidosComponent from './PedidosDashboard';
import CodigoEntregador from './CodigoEntregador';
import RelatoriosComponent from './RelatoriosComponent';

function Dashboard() {
    const [selectedSection, setSelectedSection] = useState("inicio");
    
    let ContentComponent = null;
    if (selectedSection === "inicio") ContentComponent = <TelaInicialDashboard />;
    else if (selectedSection === "pedidos") ContentComponent = <PedidosComponent />;
    else if (selectedSection === "cardapio") ContentComponent = <CardapioDashboard />;
    else if (selectedSection === "relatorios") ContentComponent = <RelatoriosComponent />;
    else if (selectedSection === "configuracoes") ContentComponent = <ConfiguracoesDashboard />;
    else if (selectedSection === "codigo-entregador") ContentComponent = <CodigoEntregador />;

    return (
			<div className="flex">
				<Sidebar selectedSection={selectedSection} onSectionChange={setSelectedSection} />
				<main className="flex-1 p-8">
					{ContentComponent}
				</main>
			</div>
    );
}

export default Dashboard;
