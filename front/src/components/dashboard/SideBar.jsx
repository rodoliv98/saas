import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Clipboard, Utensils, BarChart2, Settings, LogOut, QrCode } from 'lucide-react';
import { useRefreshHook } from '../utils/refresh-hook';
import LogoButton from '../utils/dashboard/LogoButton';
import ModalUploadLogo from './ModalUploadLogo';

function Sidebar({ selectedSection, onSectionChange }) {
    const [isStoreOpen, setIsStoreOpen] = useState();
    const [logoModalOpen, setLogoModalOpen] = useState(false);
    const [storeName, setStoreName] = useState();
    const [logoUrl, setLogoUrl] = useState(null);
    const { refreshHook } = useRefreshHook();
		const redirect = useNavigate();

		const navLinkClass =
        "flex items-center gap-3 px-4 py-3 rounded-md hover:bg-red-50 transition-colors font-medium text-gray-600 w-60";

    useEffect(() => {
			const fetch = async () => {
				try {
					const res = await refreshHook('get', '/tenant-is-open');
          setStoreName(res.data.storeName);
          setIsStoreOpen(res.data.isStoreOpen);
					setLogoUrl(res.data.logoUrl);
          console.log(res);
				} catch (err) {
					console.log(err);
				}
			}

      fetch();
    }, [])

		const handleClick = async () => {
			try {
        const newValue = !isStoreOpen;
        setIsStoreOpen(newValue);
				
        await refreshHook('patch', '/tenant-is-open', { isStoreOpen: newValue });
				
			} catch (err) {
			}
		}

		const handleLogout = async () => {
			try {
				await refreshHook('post', '/logout');
				redirect('/');

			} catch (err) {
			}
		}

    return (
        <aside className="h-screen w-64">
            <nav className="h-full flex flex-col bg-white border-r shadow-sm">
                <div className="p-4 pb-2 flex justify-between items-center">
                    <button onClick={() => onSectionChange("inicio")} className="text-4xl text-gray-900 tracking-widest" style={{fontFamily: 'Bebas Neue'}}>
                        Eldur
                    </button>
                </div>
                <div className="flex-1 px-3">
                    <button
                        className={navLinkClass + (selectedSection === "inicio" ? " bg-red-100 text-red-600" : "")}
                        onClick={() => onSectionChange("inicio")}
                    >
                        <Home size={20} /> <span className="ml-3">Início</span>
                    </button>
                    <button
                        className={navLinkClass + (selectedSection === "pedidos" ? " bg-red-100 text-red-600" : "")}
                        onClick={() => onSectionChange("pedidos")}
                    >
                        <Clipboard size={20} /> <span className="ml-3">Pedidos</span>
                    </button>
                    <button
                        className={navLinkClass + (selectedSection === "cardapio" ? " bg-red-100 text-red-600" : "")}
                        onClick={() => onSectionChange("cardapio")}
                    >
                        <Utensils size={20} /> <span className="ml-3">Cardápio</span>
                    </button>
                    <button
                        className={navLinkClass + (selectedSection === "relatorios" ? " bg-red-100 text-red-600" : "")}
                        onClick={() => onSectionChange("relatorios")}
                    >
                        <BarChart2 size={20} /> <span className="ml-3">Relatórios</span>
                    </button>
                    <button
                        className={navLinkClass + (selectedSection === "configuracoes" ? " bg-red-100 text-red-600" : "")}
                        onClick={() => onSectionChange("configuracoes")}
                    >
                        <Settings size={20} /> <span className="ml-3">Configurações</span>
                    </button>
                    <button
											className={navLinkClass + (selectedSection === "codigo-entregador" ? " bg-red-100 text-red-600" : "")}
                      onClick={() => onSectionChange("codigo-entregador")}
                    >
											<QrCode size={20} /> <span className='ml-3'>Código Entregador</span>
                    </button>
                </div>
                <div className="border-t flex p-3">
                    <LogoButton 
                        logoUrl={logoUrl}
                        onClick={() => setLogoModalOpen(true)} 
                    />
                    <div className="flex justify-between items-center overflow-hidden transition-all w-40 ml-3">
                        <div className="leading-4">
                            <h4 className="font-semibold">{storeName}</h4>
                            <div className="flex items-center">
                                <span className={`h-2 w-2 rounded-full ${isStoreOpen ? 'bg-green-500' : 'bg-red-500'} mr-2`}></span>
                                <span className="text-xs text-gray-600">{isStoreOpen ? 'Aberta' : 'Fechada'}</span>
                            </div>
                        </div>
                        <div 
                            onClick={() => handleClick()} 
                            className={`relative w-12 h-6 rounded-full cursor-pointer transition-colors ${isStoreOpen ? 'bg-green-500' : 'bg-gray-300'}`}>
                            <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${isStoreOpen ? 'transform translate-x-6' : ''}`}></div>
                        </div>
                    </div>
                </div>
                <div className="px-3 pb-3">
                    <a className={navLinkClass} onClick={handleLogout}>
                        <LogOut size={20} /> <span className="ml-3">Sair</span>
                    </a>
                </div>
                <ModalUploadLogo 
                    isOpen={logoModalOpen}
                    onClose={() => setLogoModalOpen(false)}
                />
            </nav>
        </aside>
    );
}

export default Sidebar