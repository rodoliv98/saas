function WarningModal({ isOpen, onConfirm, onCancel, novoStatus }) {
  if (!isOpen) return null;

  const isCancel = novoStatus === 'cancelado';

  const config = {
    concluido: {
      icon: (
        <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
        </svg>
      ),
      iconBg: 'bg-green-100',
      title: 'Concluir pedido?',
      description: 'Você está prestes a marcar este pedido como concluído.',
      confirmLabel: 'Sim, concluir',
      confirmClass: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
    },
    cancelado: {
      icon: (
        <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </svg>
      ),
      iconBg: 'bg-red-100',
      title: 'Cancelar pedido?',
      description: 'Você está prestes a cancelar este pedido.',
      confirmLabel: 'Sim, cancelar',
      confirmClass: 'bg-red-700 hover:bg-red-800 focus:ring-red-500',
    },
  };

  const { icon, iconBg, title, description, confirmLabel, confirmClass } = config[novoStatus] ?? config.concluido;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-5">
        {/* Ícone */}
        <div className="flex justify-center">
          <div className={`w-16 h-16 ${iconBg} rounded-full flex items-center justify-center`}>
            {icon}
          </div>
        </div>

        {/* Texto */}
        <div className="text-center">
          <h2 id="modal-title" className="text-lg font-bold text-gray-900 mb-1">
            {title}
          </h2>
          <p className="text-sm text-gray-600">
            {description}
          </p>
          <p className="text-xs text-gray-400 mt-2 font-medium">
            ⚠️ Esta ação não pode ser desfeita.
          </p>
        </div>

        {/* Botões */}
        <div className="flex gap-3 mt-1">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
          >
            Voltar
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2.5 text-sm font-semibold text-white rounded-lg focus:outline-none focus:ring-2 transition-colors ${confirmClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default WarningModal;