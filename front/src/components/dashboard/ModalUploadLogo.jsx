import { useState, useRef } from "react";
import { X, UploadCloud, ImageIcon } from "lucide-react";
import { useRefreshHook } from "../utils/refresh-hook";

const config = {
  logo: {
    h2: "Logo do Estabelecimento",
    div: "Logo enviado com sucesso!",
    span: "Clique para selecionar o logo",
  },
  banner: {
    h2: "Banner do Estabelecimento",
    div: "Banner enviado com sucesso!",
    span: "Clique para selecionar o banner",
  }
}

function ModalUploadLogo({ isOpen, type, onClose }) {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { refreshHook } = useRefreshHook();
  const inputRef = useRef(null);

  const { h2, div, span } = config[type] || config.logo;

  // Quando o usuário escolhe um arquivo, guardamos ele e geramos um preview
  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setError("");
    setSuccess(false);

    // FileReader lê o arquivo e converte para uma URL que o <img> consegue exibir
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  }

  function handleRemoveImage() {
    setImage(null);
    setPreview(null);
    // Limpa o input de arquivo para permitir selecionar o mesmo arquivo novamente
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!image) {
      setError("Selecione uma imagem antes de enviar.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append(type, image);

      type === "logo" ? await refreshHook("patch", "/api/tenant/logo", formData)
                      : await refreshHook("patch", "/api/tenant/banner", formData);

      setSuccess(true);
      handleRemoveImage();

    } catch (err) {
      setError(err.message || "Ocorreu um erro inesperado.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleClose() {
    handleRemoveImage();
    setError("");
    setSuccess(false);
    onClose(null);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md shadow-xl">

        {/* Cabeçalho */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">{h2}</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Corpo */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Feedback de erro */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Feedback de sucesso */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
                {div}
              </div>
            )}

            {/* Área de upload / preview */}
            {!preview ? (
              // Zona de clique para selecionar arquivo — parece uma dropzone
              <label
                htmlFor="logo"
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <UploadCloud className="w-10 h-10 text-gray-400 mb-2" />
                <span className="text-sm font-medium text-gray-600">{span}</span>
                <span className="text-xs text-gray-400 mt-1">PNG, JPG ou WEBP</span>
                <input
                  ref={inputRef}
                  type="file"
                  id="logo"
                  name="logo"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden" // escondemos o input feio e usamos o label como gatilho
                />
              </label>
            ) : (
              // Preview da imagem selecionada
              <div className="relative flex flex-col items-center gap-3">
                <div className="w-full h-48 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                  <img
                    src={preview}
                    alt="Preview do logo"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <ImageIcon className="w-4 h-4" />
                  <span className="truncate max-w-[220px]">{image?.name}</span>
                </div>
                {/* Botão para trocar a imagem */}
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="text-sm text-red-500 hover:text-red-700 underline"
                >
                  Trocar imagem
                </button>
              </div>
            )}

            {/* Rodapé com ações */}
            <div className="pt-4 border-t flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading || !image}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Enviando..." : "Enviar"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default ModalUploadLogo;