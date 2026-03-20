import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Clipboard, Utensils, BarChart2, Settings, LogOut, QrCode } from 'lucide-react';
import { useRefreshHook } from '../utils/refresh-hook';
import ModalUploadLogo from './ModalUploadLogo';
import StoreHeader from '../utils/dashboard/StoreHeader';

function Sidebar({ selectedSection, onSectionChange }) {
    const [isStoreOpen, setIsStoreOpen] = useState();
    const [storeName, setStoreName] = useState();
    const [logoUrl, setLogoUrl] = useState(null);
		const [bannerUrl, setBannerUrl] = useState(null);
    const [uploadType, setUploadType] = useState(null);
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
					setBannerUrl(res.data.bannerUrl);
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
                    <StoreHeader 
											logoUrl={logoUrl}
											bannerUrl={bannerUrl}
											storeName={storeName}
											isOpen={isStoreOpen}
											onToggle={handleClick}
											setUploadType={setUploadType}
										/>
                </div>
                <div className="px-3 pb-3">
                    <a className={navLinkClass} onClick={handleLogout}>
                        <LogOut size={20} /> <span className="ml-3">Sair</span>
                    </a>
                </div>
                <ModalUploadLogo 
                    isOpen={uploadType !== null}
										type={uploadType}
                    onClose={setUploadType}
                />
            </nav>
        </aside>
    );
}

export default Sidebar