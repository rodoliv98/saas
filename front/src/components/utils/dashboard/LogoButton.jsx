import { UploadCloud, Pencil } from "lucide-react";

function LogoButton({ logoUrl, onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative w-20 h-20 rounded-xl overflow-hidden group 
                 hover:border-red-500 transition-all cursor-pointer"
    >
      {logoUrl ? (
        // Tem logo: exibe a imagem
        <img
          src={logoUrl}
          alt="Logo da loja"
          className="w-full h-full object-cover"
        />
      ) : (
        // Sem logo: exibe o placeholder
        <div className="border-2 border-dashed border-red-300 bg-orange-50 rounded-xl w-full h-full flex flex-col items-center justify-center gap-1 text-red-400">
          <UploadCloud className="w-6 h-6" />
          <span className="text-[10px] font-medium">Adicionar logo</span>
        </div>
      )}

      {/* Overlay que aparece no hover em ambos os casos */}
      {/* <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 
                      flex items-center justify-center transition-all">
        <Pencil className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
      </div> */}
    </button>
  );
}

export default LogoButton;