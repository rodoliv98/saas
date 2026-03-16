import { Link } from "react-router-dom"
import { useState } from "react";

function NavBar () {
  const [isOpen, setIsOpen] = useState(false);

	return (
		<header className="bg-white shadow-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex justify-between items-center h-16">
								<div className="flex items-center gap-2">
                  <Link to="/" className="text-4xl text-gray-900 tracking-widest" style={{fontFamily: 'Bebas Neue'}}>
                    Eldur
                  </Link>
                </div>
                <nav className="hidden md:flex space-x-8">
                    <a href="#recursos" className="text-gray-700 hover:text-red-700 font-medium">Recursos</a>
                    <a href="#precos" className="text-gray-700 hover:text-red-700 font-medium">Preços</a>
                    <a href="#contato" className="text-gray-700 hover:text-red-700 font-medium">Contato</a>
                    <Link to="/login" className="text-gray-700 hover:text-red-700 font-medium" >Entrar</Link>
                    <Link to="/cadastro" className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition-colors">
                        Teste Grátis
                    </Link>
                </nav>
                <button 
                  className="md:hidden text-gray-700 hover:text-red-700"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
						</div>
            {isOpen && (
              <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-md border-b border-gray-200 z-50">
                <nav className="flex flex-col px-4 py-4 space-y-4">
                  <a href="#recursos" className="text-gray-700 hover:text-red-700 font-medium" onClick={() => setIsOpen(false)}>Recursos</a>
                  <a href="#precos" className="text-gray-700 hover:text-red-700 font-medium" onClick={() => setIsOpen(false)}>Preços</a>
                  <a href="#contato" className="text-gray-700 hover:text-red-700 font-medium" onClick={() => setIsOpen(false)}>Contato</a>
                  <Link to="/login" className="text-gray-700 hover:text-red-700 font-medium" onClick={() => setIsOpen(false)}>Entrar</Link>
                  <Link to="/cadastro" className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition-colors text-center" onClick={() => setIsOpen(false)}>
                    Teste Grátis
                  </Link>
                </nav>
              </div>
            )}
				</div>
      </header>
	)
}

export default NavBar;