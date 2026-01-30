import { useEffect, useState } from "react"
import { MapPin, Clock, Phone, Hash, Save, Lock } from 'lucide-react';
import { useRefreshHook } from '../utils/refresh-hook';

function ConfiguracoesDashboard () {
  const [form, setForm] = useState({});
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { refreshHook } = useRefreshHook();

  useEffect(() => {
    async function fetchTenantData() {
      try {
        const res = await refreshHook('get', '/tenant-data');
        console.log(res);
        const diasFunc = JSON.parse(res.data.diasFuncionamento);
        const newRes = { ...res.data, diasFuncionamento: diasFunc };
        setForm(newRes);

      } catch (err) {
        console.log(err);
        setError('Ocorreu um erro, reinicie a página ou tente novamente mais tarde.');
      }
    }
    
    fetchTenantData();
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    if (name === 'CEP') {
      processedValue = value.replace(/\D/g, '')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{3})\d+?$/, '$1');
      setForm(prev => ({ ...prev, [name]: processedValue }));
    } else if (name === 'whatsapp') {
      processedValue = value.replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1');
      setForm(prev => ({ ...prev, [name]: processedValue }));
    } else if (name === 'horarioFuncionamento') {
      processedValue = value.replace(/[^0-9]/g, '')
        .replace(/(\d{2})(\d)/, '$1:$2')
        .replace(/(\d{2}):(\d{2})(\d)/, '$1:$2-$3')
        .replace(/(\d{2}):(\d{2})-(\d{2})(\d)/, '$1:$2-$3:$4')
        .slice(0, 11);
      setForm(prev => ({ ...prev, [name]: processedValue }));
    } else if (name === 'pin') {
      processedValue = value.replace(/\D/g, '').slice(0, 6);
      setForm(prev => ({ ...prev, [name]: processedValue }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');

    if (form.complemento == '') form.complemento = null;
    
    try {
      await refreshHook('patch', '/tenant-data', form); 
      setMessage('Dados atualizados');
    } catch (err) {
      const error = err.response?.data?.validationError ?? false;
      if (error === true) {
        return setError(err.response.data.error.map(err => err.message).join(', '));
      }

      setError('Ocorreu um erro, reinicie a página ou tente mais tarde.');
      console.log(err);
    }
  }
  
  return(
    <div className="p-6 min-h-full font-sans">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dados da Loja</h1>
      <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Endereço */}
            <div className="md:col-span-4">
                <label htmlFor="endereco" className="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" id="endereco" name="endereco" value={form.endereco || ''} onChange={handleChange} className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors border-gray-300`} placeholder="Rua, Avenida, etc."/>
                </div>
            </div>

            {/* Número */}
            <div className="md:col-span-1">
                <label htmlFor="numero" className="block text-sm font-medium text-gray-700 mb-2">Número</label>
                 <div className="relative">
                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" id="numero" name="numero" value={form.numero || ''} onChange={handleChange} className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors border-gray-300`} placeholder="123"/>
                </div>
            </div>

            {/* Complemento */}
            <div className="md:col-span-3">
                <label htmlFor="complemento" className="block text-sm font-medium text-gray-700 mb-2">Complemento</label>
                <input type="text" id="complemento" name="complemento" value={form.complemento || ''} onChange={handleChange} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors border-gray-300`} placeholder="Apto, Bloco, etc."/>
            </div>

            {/* Bairro */}
            <div className="md:col-span-2">
                <label htmlFor="bairro" className="block text-sm font-medium text-gray-700 mb-2">Bairro</label>
                <input type="text" id="bairro" name="bairro" value={form.bairro || ''} onChange={handleChange} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors border-gray-300`} placeholder="Seu bairro"/>
            </div>

            {/* Municipio */}
            <div className="md:col-span-1">
                <label htmlFor="municipio" className="block text-sm font-medium text-gray-700 mb-2">Municipio</label>
                <input type="text" id="municipio" name="municipio" value={form.municipio || ''} onChange={handleChange} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors border-gray-300`} placeholder="Sua cidade"/>
            </div>

            {/* Estado */}
            <div className="md:col-span-1">
                <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                <select id="estado" name="estado" value={form.estado || ''} onChange={handleChange} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors border-gray-300 bg-white`}>
                    <option value="">UF</option>
                    <option value="AC">AC</option><option value="AL">AL</option><option value="AP">AP</option><option value="AM">AM</option><option value="BA">BA</option><option value="CE">CE</option><option value="DF">DF</option><option value="ES">ES</option><option value="GO">GO</option><option value="MA">MA</option><option value="MT">MT</option><option value="MS">MS</option><option value="MG">MG</option><option value="PA">PA</option><option value="PB">PB</option><option value="PR">PR</option><option value="PE">PE</option><option value="PI">PI</option><option value="RJ">RJ</option><option value="RN">RN</option><option value="RS">RS</option><option value="RO">RO</option><option value="RR">RR</option><option value="SC">SC</option><option value="SP">SP</option><option value="SE">SE</option><option value="TO">TO</option>
                </select>
            </div>
        </div>

        <hr />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Horário de Funcionamento */}
            <div>
                <label htmlFor="horarioFuncionamento" className="block text-sm font-medium text-gray-700 mb-2">Horário de Funcionamento</label>
                <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" id="horarioFuncionamento" name="horarioFuncionamento" value={form.horarioFuncionamento || ''} onChange={handleChange} className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors border-gray-300`} placeholder="Ex: 18:00-23:30"/>
                </div>
            </div>

            {/* Dias de Funcionamento */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dias de Funcionamento</label>
                <div className="flex flex-wrap gap-2">
                    {[
                        { label: 'Seg', value: 'seg' },
                        { label: 'Ter', value: 'ter' },
                        { label: 'Qua', value: 'qua' },
                        { label: 'Qui', value: 'qui' },
                        { label: 'Sex', value: 'sex' },
                        { label: 'Sáb', value: 'sab' },
                        { label: 'Dom', value: 'dom' }
                    ].map(day => (
                        <label key={day.value} className="cursor-pointer">
                            <input
                                type="checkbox"
                                name="diasFuncionamento"
                                value={day.value}
                                checked={Array.isArray(form.diasFuncionamento) && form.diasFuncionamento.includes(day.value)}
                                onChange={e => {
                                    let updatedDays = Array.isArray(form.diasFuncionamento) ? [...form.diasFuncionamento] : [];
                                    if (updatedDays.includes(day.value)) {
                                        updatedDays = updatedDays.filter(d => d !== day.value);
                                    } else {
                                        updatedDays.push(day.value);
                                    }
                                    setForm(prev => ({ ...prev, diasFuncionamento: updatedDays }));
                                }}
                                className="sr-only"
                            />
                            <div className={`px-4 py-2 border rounded-full text-sm font-medium transition-colors ${Array.isArray(form.diasFuncionamento) && form.diasFuncionamento.includes(day.value) ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                                {day.label}
                            </div>
                        </label>
                    ))}
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tempo de Preparo */}
            <div>
                <label htmlFor="tempoPreparo" className="block text-sm font-medium text-gray-700 mb-2">Tempo Médio de Preparo (min)</label>
                <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="number" id="tempoPreparo" name="tempoPreparo" value={form.tempoPreparo || ''} onChange={handleChange} className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors border-gray-300`} placeholder="30"/>
                </div>
            </div>

            {/* PIN */}
            <div>
                <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-2">PIN (6 dígitos)</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" id="pin" name="pin" value={form.pin || ''} onChange={handleChange} className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors border-gray-300`} placeholder="123456" maxLength="6"/>
                </div>
            </div>

            {/* WhatsApp */}
            <div>
                <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-2">WhatsApp para Pedidos</label>
                <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" id="whatsapp" name="whatsapp" value={form.whatsapp || ''} onChange={handleChange} className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors border-gray-300`} placeholder="(11) 98765-4321"/>
                </div>
            </div>
        </div>
        {error && (
          <h2 className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">{error}.</h2>
        )}
        {message && (
          <h2 className="bg-red-50 border border-red-200 text-black px-4 py-3 rounded-lg text-sm">{message}.</h2>
        )}
        <div className="flex justify-end pt-4">
            <button onClick={handleSubmit} className="flex items-center justify-center gap-2 w-full md:w-auto bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 ease-in-out">
                <Save size={20} />
                Salvar Alterações
            </button>
        </div>
      </div>
    </div>
  )
}

export default ConfiguracoesDashboard