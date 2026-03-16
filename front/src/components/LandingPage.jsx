function LandingPage () {

	return (
		<>
			<section className="bg-gray-50 relative overflow-hidden">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
									<div className="text-white">
											<h2 className="text-5xl text-black font-bold mb-6 leading-tight">
													Gerencie os Pedidos do seu Comércio
											</h2>
											<p className="text-xl mb-8 text-gray-600">
													Pare de perder pedidos e clientes! Tenha seu próprio sistema de pedidos online 
													sem pagar comissões para apps de delivery.
											</p>
											<div className="flex flex-col sm:flex-row gap-4">
													<button className="bg-white text-red-700 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors">
															Começar Teste Grátis
													</button>
													<button className="bg-white text-red-700 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors">
															Ver Demonstração
													</button>
											</div>
											<div className="mt-8 flex items-center gap-4 text-gray-600">
													<div className="flex items-center gap-2">
															<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
																	<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
															</svg>
															<span>Sem comissões</span>
													</div>
													<div className="flex items-center gap-2">
															<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
																	<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
															</svg>
															<span>Configuração em 24h</span>
													</div>
													<div className="flex items-center gap-2">
															<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
																	<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
															</svg>
															<span>Suporte brasileiro</span>
													</div>
											</div>
									</div>
									<div className="relative">
											<div className="bg-white rounded-2xl shadow-2xl p-6 transform rotate-2 hover:rotate-0 transition-transform duration-300">
													<div className="flex items-center justify-between mb-4">
															<div className="flex items-center gap-3">
																	<div className="w-12 h-12 bg-red-700 rounded-full flex items-center justify-center">
																			<span className="text-white font-bold text-lg">P</span>
																	</div>
																	<div>
																			<h3 className="font-bold text-gray-900">Pizzaria Bella Vista</h3>
																			<p className="text-gray-600 text-sm">Rua das Flores, 123</p>
																	</div>
															</div>
															<span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
																	Aberto
															</span>
													</div>
													
													<div className="space-y-4">
															<div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
																	<div className="flex items-center gap-3">
																			<img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Ccircle cx='24' cy='24' r='24' fill='%23FFA500'/%3E%3Cpath d='M12 24c0-6.627 5.373-12 12-12s12 5.373 12 12-5.373 12-12 12S12 30.627 12 24z' fill='%23FF6B00'/%3E%3C/svg%3E" alt="Pizza" className="w-12 h-12 rounded-lg" />
																			<div>
																					<h4 className="font-semibold text-gray-900">Pizza Margherita</h4>
																					<p className="text-gray-600 text-sm">Molho, mussarela, tomate, manjericão</p>
																			</div>
																	</div>
																	<div className="text-right">
																			<p className="font-bold text-gray-900">R$ 32,90</p>
																			<button className="bg-red-700 text-white px-3 py-1 rounded text-sm font-medium hover:bg-red-700">
																					Adicionar
																			</button>
																	</div>
															</div>
															
															<div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
																	<div className="flex items-center gap-3">
																			<img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Ccircle cx='24' cy='24' r='24' fill='%23FF4500'/%3E%3Cpath d='M12 24c0-6.627 5.373-12 12-12s12 5.373 12 12-5.373 12-12 12S12 30.627 12 24z' fill='%23FF6B00'/%3E%3C/svg%3E" alt="Pizza" className="w-12 h-12 rounded-lg" />
																			<div>
																					<h4 className="font-semibold text-gray-900">Pizza Calabresa</h4>
																					<p className="text-gray-600 text-sm">Molho, mussarela, calabresa, cebola</p>
																			</div>
																	</div>
																	<div className="text-right">
																			<p className="font-bold text-gray-900">R$ 36,90</p>
																			<button className="bg-red-700 text-white px-3 py-1 rounded text-sm font-medium hover:bg-red-700">
																					Adicionar
																			</button>
																	</div>
															</div>
													</div>
													
													<div className="mt-6 p-4 bg-red-700 text-white rounded-lg">
															<div className="flex justify-between items-center">
																	<span className="font-semibold">Carrinho (2 itens)</span>
																	<span className="font-bold">R$ 69,80</span>
															</div>
															<button className="w-full mt-3 bg-white text-red-700 py-2 rounded font-bold hover:bg-gray-100 transition-colors">
																	Finalizar Pedido
															</button>
													</div>
											</div>
									</div>
							</div>
					</div>
			</section>

			<section className="py-16 bg-white">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
							<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
									<div className="text-center">
											<div className="text-4xl font-bold text-red-700 mb-2">7 Dias</div>
											<div className="text-gray-600">Teste Grátis</div>
									</div>
									<div className="text-center">
											<div className="text-4xl font-bold text-red-700 mb-2">Zero</div>
											<div className="text-gray-600">Taxas Escondidas</div>
									</div>
									<div className="text-center">
											<div className="text-4xl font-bold text-red-700 mb-2">0%</div>
											<div className="text-gray-600">Comissão por Pedido</div>
									</div>
									<div className="text-center">
											<div className="text-4xl font-bold text-red-700 mb-2">24/7</div>
											<div className="text-gray-600">Sistema Disponível</div>
									</div>
							</div>
					</div>
			</section>

			<section id="recursos" className="py-20 bg-gray-50">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
							<div className="text-center mb-16">
									<h2 className="text-4xl font-bold text-gray-900 mb-4">
											Tudo que sua comércio precisa
									</h2>
									<p className="text-xl text-gray-600 max-w-3xl mx-auto">
											Sistema completo de pedidos online com todas as funcionalidades essenciais 
											para automatizar e crescer seu negócio.
									</p>
							</div>
							
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
									<div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
											<div className="w-12 h-12 bg-red-700 rounded-lg flex items-center justify-center mb-4">
													<svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
															<path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM10 6a2 2 0 0 1 4 0v1h-4V6zm8 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2v10z"/>
													</svg>
											</div>
											<h3 className="text-xl font-bold text-gray-900 mb-3">Cardápio Digital</h3>
											<p className="text-gray-600">
													Cardápio online responsivo com fotos, descrições e preços. 
													Atualize em tempo real e organize por categorias.
											</p>
									</div>
									
									<div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
											<div className="w-12 h-12 bg-red-700 rounded-lg flex items-center justify-center mb-4">
													<svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
															<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
													</svg>
											</div>
											<h3 className="text-xl font-bold text-gray-900 mb-3">Gestão de Pedidos</h3>
											<p className="text-gray-600">
													Receba, organize e acompanhe todos os pedidos em tempo real. 
													Status automático: Novo → Preparando → Pronto → Entregue.
											</p>
									</div>
									
									<div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
											<div className="w-12 h-12 bg-red-700 rounded-lg flex items-center justify-center mb-4">
													<svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
															<path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
													</svg>
											</div>
											<h3 className="text-xl font-bold text-gray-900 mb-3">Bot no Telegram</h3>
											<p className="text-gray-600">
													Entregadores podem ter acesso aos pedidos que estão prontos
													para fazer entrega.
											</p>
									</div>
									
									<div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
											<div className="w-12 h-12 bg-red-700 rounded-lg flex items-center justify-center mb-4">
													<svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
															<path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
													</svg>
											</div>
											<h3 className="text-xl font-bold text-gray-900 mb-3">Dashboard Completo</h3>
											<p className="text-gray-600">
													Acompanhe vendas, produtos mais pedidos, horários de pico 
													e relatórios detalhados para otimizar seu negócio.
											</p>
									</div>
									
									<div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
											<div className="w-12 h-12 bg-red-700 rounded-lg flex items-center justify-center mb-4">
													<svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
															<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
													</svg>
											</div>
											<h3 className="text-xl font-bold text-gray-900 mb-3">Seu Próprio Site</h3>
											<p className="text-gray-600">
													Domínio personalizado (suapizzaria.com.br) com design 
													profissional e otimizado para conversão.
											</p>
									</div>
									
									<div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
											<div className="w-12 h-12 bg-red-700 rounded-lg flex items-center justify-center mb-4">
													<svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
															<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
													</svg>
											</div>
											<h3 className="text-xl font-bold text-gray-900 mb-3">Sem Comissões</h3>
											<p className="text-gray-600">
													Pagamento fixo mensal, sem cobrança por pedido. 
													Toda a receita fica com você, não com apps de delivery.
											</p>
									</div>
							</div>
					</div>
			</section>

			<section id="precos" className="py-20 bg-white">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
							<div className="text-center mb-16">
									<h2 className="text-4xl font-bold text-gray-900 mb-4">
											Planos que cabem no seu bolso
									</h2>
									<p className="text-xl text-gray-600 max-w-3xl mx-auto">
											Escolha o plano ideal para o tamanho do seu comércio. 
											Teste grátis por 15 dias, sem compromisso.
									</p>
							</div>
							
							<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
									<div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-red-700 transition-colors relative blur-sm opacity-70">
											<div className="absolute inset-0 flex items-center justify-center z-10">
													<span className="bg-gray-900 text-white px-6 py-3 rounded-full text-lg font-bold transform rotate-[-5deg]">Em Breve!</span>
											</div>
											<div className="text-center mb-8">
													<h3 className="text-2xl font-bold text-gray-900 mb-2">Intermediário</h3>
													<p className="text-gray-600 mb-4">Para comércios médios</p>
													<div className="text-4xl font-bold text-gray-900 mb-2">
															R$ 80<span className="text-lg text-gray-600">/mês</span>
													</div>
													<p className="text-sm text-gray-600">Até 50 pedidos/dia</p>
											</div>
											<ul className="space-y-4 mb-8">
													<li className="flex items-center gap-3">
															<svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
																	<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
															</svg>
															<span className="text-gray-700">Tudo do plano Básico</span>
													</li>
													<li className="flex items-center gap-3">
															<svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
																	<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
															</svg>
															<span className="text-gray-700">Dashboard avançado</span>
													</li>
													<li className="flex items-center gap-3">
															<svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
																	<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
															</svg>
															<span className="text-gray-700">Relatórios detalhados</span>
													</li>
													<li className="flex items-center gap-3">
															<svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
																	<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
															</svg>
															<span className="text-gray-700">Suporte por WhatsApp</span>
													</li>
											</ul>
											<button className="w-full bg-red-700 text-white py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors" disabled>
													Começar Teste Grátis
											</button>
									</div>
									
									<div className="bg-white border-2 shadow-xl border-red-700 scale-105 rounded-2xl p-8 hover:border-red-700 transition-colors relative">
											<div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-red-700 text-white px-4 py-1 rounded-full text-sm font-medium">
													Disponível Agora
											</div>
											<div className="text-center mb-8">
													<h3 className="text-2xl font-bold text-gray-900 mb-2">Básico</h3>
													<p className="text-gray-600 mb-4">Para comércios pequenos</p>
													<div className="text-4xl font-bold text-gray-900 mb-2">
															R$ 79,90<span className="text-lg text-gray-600">/mês</span>
													</div>
													<p className="text-sm text-gray-600">Até 1.500 pedidos/mês</p>
											</div>
											<ul className="space-y-4 mb-8">
													<li className="flex items-center gap-3">
															<svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
																	<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
															</svg>
															<span className="text-gray-700">Cardápio digital completo</span>
													</li>
													<li className="flex items-center gap-3">
															<svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
																	<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
															</svg>
															<span className="text-gray-700">Gestão de pedidos</span>
													</li>
													<li className="flex items-center gap-3">
															<svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
																	<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
															</svg>
															<span className="text-gray-700">Telegram Bot para entregadores</span>
													</li>
													<li className="flex items-center gap-3">
															<svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
																	<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
															</svg>
															<span className="text-gray-700">Relatório básico de vendas</span>
													</li>
													<li className="flex items-center gap-3">
															<svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
																	<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
															</svg>
															<span className="text-gray-700">Suporte por Whatsapp</span>
													</li>
											</ul>
											<button className="w-full bg-red-700 text-white py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
													Começar Teste Grátis
											</button>
									</div>

									<div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-red-700 transition-colors relative blur-sm opacity-70">
											<div className="absolute inset-0 flex items-center justify-center z-10">
													<span className="bg-gray-900 text-white px-6 py-3 rounded-full text-lg font-bold transform rotate-[5deg]">Em Breve!</span>
											</div>
											<div className="text-center mb-8">
													<h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
													<p className="text-gray-600 mb-4">Para comércios grandes</p>
													<div className="text-4xl font-bold text-gray-900 mb-2">
															R$ 100<span className="text-lg text-gray-600">/mês</span>
													</div>
													<p className="text-sm text-gray-600">Até 100+ pedidos/dia</p>
											</div>
											<ul className="space-y-4 mb-8">
													<li className="flex items-center gap-3">
															<svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
																	<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
															</svg>
															<span className="text-gray-700">Cardápio digital completo</span>
													</li>
													<li className="flex items-center gap-3">
															<svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
																	<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
															</svg>
															<span className="text-gray-700">Gestão de pedidos</span>
													</li>
													<li className="flex items-center gap-3">
															<svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
																	<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
															</svg>
															<span className="text-gray-700">Notificações WhatsApp</span>
													</li>
													<li className="flex items-center gap-3">
															<svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
																	<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
															</svg>
															<span className="text-gray-700">Suporte por email</span>
													</li>
											</ul>
											<button className="w-full bg-red-700 text-white py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors" disabled>
													Começar Teste Grátis
											</button>
									</div>
							</div>
					</div>
			</section>
		</>
  )
}

export default LandingPage;