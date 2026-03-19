import { UploadCloud } from "lucide-react";

function LogoButton({ logoUrl, onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative w-20 h-20 rounded-xl overflow-hidden group 
                 hover:border-red-500 transition-all cursor-pointer"
    >
      {logoUrl ? (
        <img
          src={logoUrl}
          alt="Logo da loja"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="border-2 border-dashed border-red-300 bg-orange-50 rounded-xl w-full h-full flex flex-col items-center justify-center gap-1 text-red-400">
          <UploadCloud className="w-6 h-6" />
          <span className="text-[10px] font-medium">Adicionar logo</span>
        </div>
      )}
    </button>
  );
}

export default LogoButton;