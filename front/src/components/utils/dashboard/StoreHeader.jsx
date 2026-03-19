import { ImageIcon, UploadCloud, Pencil } from "lucide-react";

function StoreHeader({ logoUrl, bannerUrl, storeName, isOpen, onToggle, setUploadType }) {
  return (
    <div className="w-full max-w-xl rounded-xl border border-gray-200 shadow-sm bg-white p-4">

      {/* Linha de cima: logo + botão banner lado a lado */}
      <div className="flex items-center gap-3">

        {/* Botão do Logo */}
        <button
          onClick={() => setUploadType("logo")}
          className="relative w-16 h-16 rounded-xl overflow-hidden group 
                     hover:border-red-500 transition-all cursor-pointer flex-shrink-0"
        >
          {logoUrl ? (
            <img src={logoUrl} alt="Logo da loja" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-1
                          text-red-400 border-2 border-dashed border-red-300 bg-orange-50
                          rounded-xl">
              <ImageIcon className="w-6 h-6" />
              <span className="text-[10px] font-medium">Logo</span>
            </div>
          )}
          <div className="absolute inset-0 bg bg-opacity-0 group-hover:bg-opacity-40 
                          flex items-center justify-center transition-all rounded-xl">
            <Pencil className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </button>

        {/* Botão do Banner */}
        <button
          onClick={() => setUploadType("banner")}
          className="relative h-16 flex-1 rounded-xl overflow-hidden group 
                     hover:border-red-500 transition-all cursor-pointer"
        >
          {bannerUrl ? (
            <img src={bannerUrl} alt="Banner da loja" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-red-400
                            border-2 border-dashed border-red-300 bg-orange-50 rounded-xl">
              <UploadCloud className="w-6 h-6" />
              <span className="text-xs font-medium">Adicionar banner</span>
            </div>
          )}
          <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-40 
                          flex items-center justify-center transition-all">
            <Pencil className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </button>

      </div>

      {/* Linha de baixo: nome à esquerda, toggle à direita */}
      <div className="flex items-center justify-between mt-3">
        <span className="text-base font-semibold text-gray-800">{storeName}</span>

        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium ${isOpen ? "text-green-500" : "text-gray-400"}`}>
            {isOpen ? "Aberta" : "Fechada"}
          </span>
          <button
            onClick={onToggle}
            className={`relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none
                        ${isOpen ? "bg-green-500" : "bg-gray-300"}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow 
                          transition-transform duration-300
                          ${isOpen ? "translate-x-5" : "translate-x-0"}`}
            />
          </button>
        </div>
      </div>

    </div>
  );
}

export default StoreHeader;