import api from '../../../intercepter/intercepter.js'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Phone, MapPin, Building, Hash, KeyRound, Briefcase, Clock, Globe, ArrowLeft } from 'lucide-react';

function Cadastro () {
    const [currentStep, setCurrentStep] = useState(1);
    const [form, setForm] = useState({
        // Passo 1 - Identificação
        nomeFantasia: '', // opcional
        razaoSocial: '',
        CNPJ: '',
        inscricaoEstadual: '', // opcional

        // Passo 2 - Representante Legal  
        nomeRepresentante: '',
        CPF: '',
        email: '',
        telefone: '',
        senha: '',
        confirmarSenha: '',

        // Passo 3 - Endereço
        CEP: '',
        endereco: '',
        numero: '',
        complemento: '', // opcional
        bairro: '',
        municipio: '',
        estado: '',

        // Passo 4 - Configurações
        tenantSlug: '',
        whatsapp: '',
        diasFuncionamento: [], // ['seg', 'ter', 'qua'...]
        horarioFuncionamento: '', // "18:00-23:00"
        tempoPreparo: '', // em minutos
        taxaEntrega: 0 // novo campo
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [apiMessage, setApiMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        let processedValue = value;

        if (name === 'nomeFantasia') {
            const tenantSlug = value.toLowerCase()
              .replace(/[^a-z0-9\s-]/g, '')
              .replace(/\s+/g, '-')
              .replace(/-+/g, '-')
              .trim();
            setForm(prev => ({
              ...prev,
              [name]: value,
              tenantSlug: tenantSlug
            }));
        } else if (["CNPJ", "CPF", "CEP", "telefone", "whatsapp"].includes(name)) {
            processedValue = value.replace(/\D/g, "");
            if (name === "CNPJ") {
                processedValue = processedValue
                    .replace(/(\d{2})(\d)/, "$1.$2")
                    .replace(/(\d{3})(\d)/, "$1.$2")
                    .replace(/(\d{3})(\d)/, "$1/$2")
                    .replace(/(\d{4})(\d)/, "$1-$2")
                    .replace(/(-\d{2})\d+?$/, "$1");
            } else if (name === "CPF") {
                processedValue = processedValue
                    .replace(/(\d{3})(\d)/, "$1.$2")
                    .replace(/(\d{3})(\d)/, "$1.$2")
                    .replace(/(\d{3})(\d)/, "$1-$2")
                    .replace(/(-\d{2})\d+?$/, "$1");
            } else if (name === "CEP") {
                processedValue = processedValue
                    .replace(/(\d{2})(\d)/, "$1.$2")
                    .replace(/(\d{3})(\d)/, "$1-$2")
                    .replace(/(-\d{3})\d+?$/, "$1");
            } else if (name === "whatsapp" || name === "telefone") {
                // Máscara dinâmica para WhatsApp/Telefone
                let onlyNumbers = processedValue.slice(0, 11);
                if (onlyNumbers.length === 11) {
                    processedValue = onlyNumbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
                } else if (onlyNumbers.length === 10) {
                    processedValue = onlyNumbers.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
                } else {
                    processedValue = onlyNumbers;
                }
            }
            setForm(prev => ({ ...prev, [name]: processedValue }));
        } else if (name === 'tempoPreparo') {
            const slicedValue = processedValue.slice(0, 3);
            setForm(prev => ({ ...prev, [name]: slicedValue }));

        } else if (name === 'horarioFuncionamento') {
            // Mascara: xx:xx-xx:xx
            processedValue = value
                .replace(/[^0-9]/g, '')
                .replace(/(\d{2})(\d)/, '$1:$2')
                .replace(/(\d{2}):(\d{2})(\d)/, '$1:$2-$3')
                .replace(/(\d{2}):(\d{2})-(\d{2})(\d)/, '$1:$2-$3:$4')
                .slice(0, 11);
            setForm(prev => ({ ...prev, [name]: processedValue }));
        } else if (name === 'diasFuncionamento') {
            const updatedDays = form.diasFuncionamento.includes(value)
                ? form.diasFuncionamento.filter(day => day !== value)
                : [...form.diasFuncionamento, value];
            setForm(prev => ({ ...prev, diasFuncionamento: updatedDays }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
        
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateStep = (step) => {
        const newErrors = {};
        switch (step) {
            case 1:
                if (!form.razaoSocial) newErrors.razaoSocial = 'Razão Social é obrigatória';
                if (!form.CNPJ) newErrors.CNPJ = 'CNPJ é obrigatório';
                break;
            case 2:
                if (!form.nomeRepresentante) newErrors.nomeRepresentante = 'Nome do representante é obrigatório';
                if (!form.CPF) newErrors.CPF = 'CPF é obrigatório';
                if (!form.email) newErrors.email = 'Email é obrigatório';
                else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email inválido';
                if (!form.telefone) newErrors.telefone = 'Telefone é obrigatório';
                if (!form.senha) newErrors.senha = 'Senha é obrigatória';
                else if (form.senha.length < 10) newErrors.senha = 'Senha deve ter pelo menos 10 caracteres';
                if (form.senha !== form.confirmarSenha) newErrors.confirmarSenha = 'As senhas não coincidem';
                break;
            case 3:
                if (!form.CEP) newErrors.CEP = 'CEP é obrigatório';
                if (!form.endereco) newErrors.endereco = 'Endereço é obrigatório';
                if (!form.numero) newErrors.numero = 'Número é obrigatório';
                if (!form.bairro) newErrors.bairro = 'Bairro é obrigatório';
                if (!form.municipio) newErrors.municipio = 'Município é obrigatório';
                if (!form.estado) newErrors.estado = 'Estado é obrigatório';
                break;
            case 4:
                if (!form.tenantSlug) newErrors.tenantSlug = 'Subdomínio é obrigatório';
                if (!form.whatsapp) newErrors.whatsapp = 'WhatsApp é obrigatório';
                if (form.diasFuncionamento.length === 0) newErrors.diasFuncionamento = 'Selecione ao menos um dia';
                if (!form.horarioFuncionamento) newErrors.horarioFuncionamento = 'Horário de funcionamento é obrigatório';
                if (!form.tempoPreparo) newErrors.tempoPreparo = 'Tempo de preparo é obrigatório';
                if (!form.taxaEntrega) newErrors.taxaEntrega = 'Taxa de entrega é obrigatória';
                break;
            default:
                break;
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => prev - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep(4)) return;

        delete form.confirmarSenha;
        if (form.tenantSlug) {
            form.tenantSlug = form.tenantSlug.replace(' ', '-');
        }
        form.taxaEntrega = Number(form.taxaEntrega);

        setIsLoading(true);
        setApiMessage("");
        try {
            const res = await api.post('/register', form);
            setApiMessage(res.data?.msg || "Cadastro realizado com sucesso!");
        } catch (err) {
            console.log(err);
            const fieldError = err.response?.data?.error;

            if (err.response.data.code === "VALIDATION_ERROR") {
                const message = err.response.data.error.map(err => err.message).join(', ');
                setErrors({ general: message });
                setApiMessage(message);
            } 
            if (err.status === 500 || err.response?.status === 500) {
                setErrors({ general: 'Ocorreu um erro, tente mais tarde' });
            }
            if (fieldError) {
                setErrors({ general: `Já existe uma conta com os dados inseridos no campo ${fieldError}` });
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label htmlFor="nomeFantasia" className="block text-sm font-medium text-gray-700 mb-2">Nome Fantasia (Opcional)</label>
                            <div className="relative">
                                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type="text" id="nomeFantasia" name="nomeFantasia" value={form.nomeFantasia} onChange={handleChange} className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors ${errors.nomeFantasia ? 'border-red-500' : 'border-gray-300'}`} placeholder="Ex: Pizzaria do Zé"/>
                            </div>
                            {errors.nomeFantasia && <p className="text-red-500 text-sm mt-1">{errors.nomeFantasia}</p>}
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="razaoSocial" className="block text-sm font-medium text-gray-700 mb-2">Razão Social *</label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type="text" id="razaoSocial" name="razaoSocial" value={form.razaoSocial} onChange={handleChange} className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors ${errors.razaoSocial ? 'border-red-500' : 'border-gray-300'}`} placeholder="Ex: José da Silva Pizzas ME"/>
                            </div>
                            {errors.razaoSocial && <p className="text-red-500 text-sm mt-1">{errors.razaoSocial}</p>}
                        </div>
                        <div>
                            <label htmlFor="CNPJ" className="block text-sm font-medium text-gray-700 mb-2">CNPJ *</label>
                            <div className="relative">
                                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type="text" id="CNPJ" name="CNPJ" value={form.CNPJ} onChange={handleChange} maxLength="18" className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors ${errors.CNPJ ? 'border-red-500' : 'border-gray-300'}`} placeholder="00.000.000/0000-00"/>
                            </div>
                            {errors.CNPJ && <p className="text-red-500 text-sm mt-1">{errors.CNPJ}</p>}
                        </div>
                        <div>
                            <label htmlFor="inscricaoEstadual" className="block text-sm font-medium text-gray-700 mb-2">Inscrição Estadual (Opcional)</label>
                            <div className="relative">
                                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type="text" id="inscricaoEstadual" name="inscricaoEstadual" value={form.inscricaoEstadual} onChange={handleChange} className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors ${errors.inscricaoEstadual ? 'border-red-500' : 'border-gray-300'}`} placeholder="123.456.789.110"/>
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label htmlFor="nomeRepresentante" className="block text-sm font-medium text-gray-700 mb-2">Nome do Representante *</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type="text" id="nomeRepresentante" name="nomeRepresentante" value={form.nomeRepresentante} onChange={handleChange} className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors ${errors.nomeRepresentante ? 'border-red-500' : 'border-gray-300'}`} placeholder="Seu nome completo"/>
                            </div>
                            {errors.nomeRepresentante && <p className="text-red-500 text-sm mt-1">{errors.nomeRepresentante}</p>}
                        </div>
                        <div>
                            <label htmlFor="CPF" className="block text-sm font-medium text-gray-700 mb-2">CPF *</label>
                            <div className="relative">
                                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type="text" id="CPF" name="CPF" value={form.CPF} onChange={handleChange} maxLength="15" className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors ${errors.CPF ? 'border-red-500' : 'border-gray-300'}`} placeholder="000.000.000-00"/>
                            </div>
                            {errors.CPF && <p className="text-red-500 text-sm mt-1">{errors.CPF}</p>}
                        </div>
                        <div>
                            <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-2">Seu Telefone *</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type="text" id="telefone" name="telefone" value={form.telefone} onChange={handleChange} maxLength="15" className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors ${errors.telefone ? 'border-red-500' : 'border-gray-300'}`} placeholder="(11) 99999-9999"/>
                            </div>
                            {errors.telefone && <p className="text-red-500 text-sm mt-1">{errors.telefone}</p>}
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Seu Email *</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type="email" id="email" name="email" value={form.email} onChange={handleChange} className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors ${errors.email ? 'border-red-500' : 'border-gray-300'}`} placeholder="seu.email@provedor.com"/>
                            </div>
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>
                        <div>
                            <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-2">Senha *</label>
                            <div className="relative">
                                <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type={showPassword ? 'text' : 'password'} id="senha" name="senha" value={form.senha} onChange={handleChange} className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors ${errors.senha ? 'border-red-500' : 'border-gray-300'}`} placeholder="Mínimo 8 caracteres"/>
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">{showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}</button>
                            </div>
                            {errors.senha && <p className="text-red-500 text-sm mt-1">{errors.senha}</p>}
                        </div>
                        <div>
                            <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700 mb-2">Confirmar Senha *</label>
                            <div className="relative">
                                <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type={showConfirmPassword ? 'text' : 'password'} id="confirmarSenha" name="confirmarSenha" value={form.confirmarSenha} onChange={handleChange} className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors ${errors.confirmarSenha ? 'border-red-500' : 'border-gray-300'}`} placeholder="Repita a senha"/>
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">{showConfirmPassword ? <EyeOff size={20}/> : <Eye size={20}/>}</button>
                            </div>
                            {errors.confirmarSenha && <p className="text-red-500 text-sm mt-1">{errors.confirmarSenha}</p>}
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="md:col-span-2">
                            <label htmlFor="CEP" className="block text-sm font-medium text-gray-700 mb-2">CEP *</label>
                            <input type="text" id="CEP" name="CEP" value={form.CEP} onChange={handleChange} maxLength="10" className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors ${errors.CEP ? 'border-red-500' : 'border-gray-300'}`} placeholder="00000-000"/>
                            {errors.CEP && <p className="text-red-500 text-sm mt-1">{errors.CEP}</p>}
                        </div>
                        <div className="md:col-span-4">
                            <label htmlFor="endereco" className="block text-sm font-medium text-gray-700 mb-2">Endereço *</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type="text" id="endereco" name="endereco" value={form.endereco} onChange={handleChange} className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors ${errors.endereco ? 'border-red-500' : 'border-gray-300'}`} placeholder="Rua, Avenida, etc."/>
                            </div>
                            {errors.endereco && <p className="text-red-500 text-sm mt-1">{errors.endereco}</p>}
                        </div>
                        <div className="md:col-span-1">
                            <label htmlFor="numero" className="block text-sm font-medium text-gray-700 mb-2">Número *</label>
                            <input type="text" id="numero" name="numero" value={form.numero} onChange={handleChange} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors ${errors.numero ? 'border-red-500' : 'border-gray-300'}`} placeholder="123"/>
                            {errors.numero && <p className="text-red-500 text-sm mt-1">{errors.numero}</p>}
                        </div>
                        <div className="md:col-span-3">
                            <label htmlFor="complemento" className="block text-sm font-medium text-gray-700 mb-2">Complemento (Opcional)</label>
                            <input type="text" id="complemento" name="complemento" value={form.complemento} onChange={handleChange} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors`} placeholder="Apto, Bloco, etc."/>
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="bairro" className="block text-sm font-medium text-gray-700 mb-2">Bairro *</label>
                            <input type="text" id="bairro" name="bairro" value={form.bairro} onChange={handleChange} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors ${errors.bairro ? 'border-red-500' : 'border-gray-300'}`} placeholder="Seu bairro"/>
                            {errors.bairro && <p className="text-red-500 text-sm mt-1">{errors.bairro}</p>}
                        </div>
                        <div className="md:col-span-1">
                            <label htmlFor="municipio" className="block text-sm font-medium text-gray-700 mb-2">Município *</label>
                            <input type="text" id="municipio" name="municipio" value={form.municipio} onChange={handleChange} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors ${errors.municipio ? 'border-red-500' : 'border-gray-300'}`} placeholder="Seu município"/>
                            {errors.municipio && <p className="text-red-500 text-sm mt-1">{errors.municipio}</p>}
                        </div>
                        <div className="md:col-span-1">
                            <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-2">Estado *</label>
                            <select id="estado" name="estado" value={form.estado} onChange={handleChange} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors ${errors.estado ? 'border-red-500' : 'border-gray-300'}`}>
                                <option value="">UF</option>
                                <option value="AC">AC</option><option value="AL">AL</option><option value="AP">AP</option><option value="AM">AM</option><option value="BA">BA</option><option value="CE">CE</option><option value="DF">DF</option><option value="ES">ES</option><option value="GO">GO</option><option value="MA">MA</option><option value="MT">MT</option><option value="MS">MS</option><option value="MG">MG</option><option value="PA">PA</option><option value="PB">PB</option><option value="PR">PR</option><option value="PE">PE</option><option value="PI">PI</option><option value="RJ">RJ</option><option value="RN">RN</option><option value="RS">RS</option><option value="RO">RO</option><option value="RR">RR</option><option value="SC">SC</option><option value="SP">SP</option><option value="SE">SE</option><option value="TO">TO</option>
                            </select>
                            {errors.estado && <p className="text-red-500 text-sm mt-1">{errors.estado}</p>}
                        </div>
                    </div>
                );
            case 4:
                const weekDays = [
                    { label: 'Seg', value: 'seg' }, { label: 'Ter', value: 'ter' }, { label: 'Qua', value: 'qua' },
                    { label: 'Qui', value: 'qui' }, { label: 'Sex', value: 'sex' }, { label: 'Sáb', value: 'sab' }, { label: 'Dom', value: 'dom' }
                ];
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label htmlFor="tenantSlug" className="block text-sm font-medium text-gray-700 mb-2">Subdomínio *</label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type="text" id="tenantSlug" name="tenantSlug" value={form.tenantSlug} onChange={handleChange} className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors ${errors.tenantSlug ? 'border-red-500' : 'border-gray-300'}`} placeholder="sua-empresa"/>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">seusite.com/{form.tenantSlug || 'sua-empresa'}</p>
                            {errors.tenantSlug && <p className="text-red-500 text-sm mt-1">{errors.tenantSlug}</p>}
                        </div>
                        <div>
                            <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-2">WhatsApp para Pedidos *</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type="text" id="whatsapp" name="whatsapp" value={form.whatsapp} onChange={handleChange} maxLength="15" className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors ${errors.whatsapp ? 'border-red-500' : 'border-gray-300'}`} placeholder="(11) 98765-4321"/>
                            </div>
                            {errors.whatsapp && <p className="text-red-500 text-sm mt-1">{errors.whatsapp}</p>}
                        </div>
                        <div>
                            <label htmlFor="tempoPreparo" className="block text-sm font-medium text-gray-700 mb-2">Tempo Médio de Preparo (min) *</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type="number" id="tempoPreparo" name="tempoPreparo" value={form.tempoPreparo} onChange={handleChange} className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors ${errors.tempoPreparo ? 'border-red-500' : 'border-gray-300'}`} placeholder="30"/>
                            </div>
                            {errors.tempoPreparo && <p className="text-red-500 text-sm mt-1">{errors.tempoPreparo}</p>}
                        </div>
                        <div className="md:col-span-2 flex gap-4">
                            <div className="w-1/2">
                                <label htmlFor="horarioFuncionamento" className="block text-sm font-medium text-gray-700 mb-2">Horário de Funcionamento *</label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        id="horarioFuncionamento"
                                        name="horarioFuncionamento"
                                        value={form.horarioFuncionamento}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors ${errors.horarioFuncionamento ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Ex: 18:00-23:30"
                                    />
                                </div>
                                {errors.horarioFuncionamento && <p className="text-red-500 text-sm mt-1">{errors.horarioFuncionamento}</p>}
                            </div>
                            <div className="w-1/2">
                                <label htmlFor="taxaEntrega" className="block text-sm font-medium text-gray-700 mb-2">Taxa de Entrega (R$)</label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="number"
                                        id="taxaEntrega"
                                        name="taxaEntrega"
                                        value={form.taxaEntrega}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors border-gray-300"
                                        placeholder="Ex: 5.00"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                {errors.taxaEntrega && <p className="text-red-500 text-sm mt-1">{errors.taxaEntrega}</p>}
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Dias de Funcionamento *</label>
                            <div className="flex flex-wrap gap-2">
                                {weekDays.map(day => (
                                    <label key={day.value} className="cursor-pointer">
                                        <input type="checkbox" name="diasFuncionamento" value={day.value} checked={form.diasFuncionamento.includes(day.value)} onChange={handleChange} className="sr-only"/>
                                        <div className={`px-4 py-2 border rounded-full text-sm font-medium transition-colors ${form.diasFuncionamento.includes(day.value) ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                                            {day.label}
                                        </div>
                                    </label>
                                ))}
                            </div>
                            {errors.diasFuncionamento && <p className="text-red-500 text-sm mt-1">{errors.diasFuncionamento}</p>}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    const stepTitles = ["Identificação da Empresa", "Representante Legal", "Endereço", "Configurações da Loja"];

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-3xl">
                <div className="text-center mb-8">
                    <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Building className="w-8 h-8 text-red-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">Crie sua Conta</h1>
                    <p className="text-gray-600 mt-2">{stepTitles[currentStep - 1]}</p>
                </div>

                <div className="mb-8 px-4">
                    <div className="relative h-2 w-full bg-gray-200 rounded-full">
                        <div className="absolute top-0 left-0 h-2 bg-red-600 rounded-full transition-all duration-500" style={{ width: `${((currentStep - 1) / (stepTitles.length - 1)) * 100}%` }}></div>
                        <div className="absolute w-full flex justify-between items-center top-1/2 -translate-y-1/2">
                            {stepTitles.map((_, index) => (
                                <div key={index} className={`h-4 w-4 rounded-full transition-colors duration-500 ${currentStep > index ? 'bg-red-600' : 'bg-gray-300'}`}></div>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                        {stepTitles.map((title, index) => (
                            <span key={index} className={`w-1/4 text-center ${currentStep === index + 1 ? 'font-bold text-red-600' : ''}`}>{title.split(' ')[0]}</span>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {errors.general && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">{errors.general}</div>}
                    {renderStepContent()}
                    <div className="flex items-center justify-between pt-6">
                        {currentStep > 1 ? (
                            <button type="button" onClick={handleBack} className="flex items-center gap-2 bg-transparent text-gray-600 py-3 px-6 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                                <ArrowLeft size={18} />
                                Voltar
                            </button>
                        ) : <div></div>}

                        {/* Mensagem da API */}
                        {apiMessage && (
                            <div className="flex-1 text-center mx-4">
                                <p className={`text-sm ${apiMessage.toLowerCase().includes('sucesso') ? 'text-green-600' : 'text-red-600'}`}>{apiMessage}</p>
                            </div>
                        )}

                        {currentStep < 4 ? (
                            <button type="button" onClick={handleNext} className="bg-red-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-md hover:shadow-lg">
                                Próximo Passo
                            </button>
                        ) : (
                            <button type="submit" disabled={isLoading} className="flex items-center gap-2 bg-red-600 hober:bg-red-700 text-white py-3 px-8 rounded-lg font-semibold shadow-md hover:from-red-700 hover:to-orange-600 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed">
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                                        Finalizando...
                                    </>
                                ) : (
                                    <>
                                        <KeyRound size={20} className="opacity-80" />
                                        Finalizar Cadastro
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </form>
                <div className="text-center mt-8">
                    <p className="text-sm text-gray-600">
                        Já tem uma conta? <Link to="/login" className="font-medium text-red-600 hover:text-red-500">Faça login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Cadastro;