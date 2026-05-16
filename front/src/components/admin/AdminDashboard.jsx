import { useEffect, useState } from "react";
import { useRefreshHook } from '../utils/refresh-hook';

// ─── Tipos esperados da API ────────────────────────────────────────────────
// {
//   id: string
//   tenantSlug: string
//   isOpen: boolean
//   diasFuncionamento: string  →  ex: "[seg,ter,qua,qui,sex]"
//   horarioFuncionamento: string -> ex: "18:00-20:00" 
// }
//
// Nota: active não está no tipo da API ainda. O componente gerencia
// esse campo localmente até que o backend o exponha.
// ──────────────────────────────────────────────────────────────────────────

// Ordem canônica de exibição e chaves esperadas na string
const ORDEM_DIAS = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"];
const LABEL_DIAS = { dom: "Dom", seg: "Seg", ter: "Ter", qua: "Qua", qui: "Qui", sex: "Sex", sab: "Sáb" };

// Normaliza variações como "sáb" → "sab", espaços extras, etc.
function normalizarDia(dia) {
  return String(dia)
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// Converte a string "[seg,ter,qua]" ou um array real em Set { "seg", "ter", "qua" }
function parseDias(diasRaw) {
  if (!diasRaw) return new Set();

  let diasArray = [];

  if (Array.isArray(diasRaw)) {
    // Se a API ou um interceptor já tiver convertido para array
    diasArray = diasRaw;
  } else if (typeof diasRaw === "string") {
    // Remove colchetes, aspas e espaços extras, depois divide por vírgula
    const stringLimpa = diasRaw.replace(/[\[\]"' ]/g, "");
    if (stringLimpa) {
      diasArray = stringLimpa.split(",");
    }
  }

  return new Set(diasArray.map(normalizarDia));
}

// Dados mock atualizados com os formatos de string em diasFuncionamento e o horarioFuncionamento
// const MOCK_TENANTS = [
//   {
//     id: "1",
//     tenantSlug: "pizzaria-do-ze",
//     isOpen: true,
//     diasFuncionamento: "[seg,ter,qua,qui,sex,sab]",
//     horarioFuncionamento: "18:00-23:30",
//     active: true,
//   },
//   {
//     id: "2",
//     tenantSlug: "burguer-top",
//     isOpen: false,
//     diasFuncionamento: "[ter,qua,qui,sex,sab]",
//     horarioFuncionamento: "18:00-22:00",
//     active: true,
//   },
//   {
//     id: "3",
//     tenantSlug: "sushi-nakamura",
//     isOpen: false,
//     diasFuncionamento: "[qua,qui,sex,sab,dom]",
//     horarioFuncionamento: "19:00-23:00",
//     active: false,
//   },
//   {
//     id: "4",
//     tenantSlug: "cantina-da-nonna",
//     isOpen: true,
//     diasFuncionamento: "[seg,ter,qua,qui,sex]",
//     horarioFuncionamento: "11:30-15:00",
//     active: true,
//   },
// ];

// ─── Componente: Tags de dias ─────────────────────────────────────────────
function DiasTag({ diasFuncionamento }) {
  const diasAtivos = parseDias(diasFuncionamento);

  return (
    <div className="flex flex-wrap gap-1">
      {ORDEM_DIAS.map((chave) => {
        const ativo = diasAtivos.has(chave);
        return (
          <span
            key={chave}
            className={`text-xs px-1.5 py-0.5 rounded font-medium select-none transition-colors ${
              ativo ? "bg-red-700 text-white" : "bg-zinc-800 text-zinc-500"
            }`}
          >
            {LABEL_DIAS[chave]}
          </span>
        );
      })}
    </div>
  );
}

// ─── Componente: Badge de status ──────────────────────────────────────────
function StatusBadge({ label, active, colorActive, colorInactive }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
        active ? colorActive : colorInactive
      }`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

// ─── Componente: Botão de toggle ──────────────────────────────────────────
function ToggleButton({ isOn, onLabel, offLabel, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium
        border transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-red-700/50
        disabled:opacity-40 disabled:cursor-not-allowed
        ${
          isOn
            ? "bg-zinc-800 border-zinc-600 text-zinc-200 hover:border-red-700 hover:text-red-400"
            : "bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
        }
      `}
    >
      <span
        className={`w-2 h-2 rounded-full transition-colors ${
          isOn ? "bg-green-400" : "bg-zinc-600"
        }`}
      />
      {isOn ? onLabel : offLabel}
    </button>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────
function AdminDashboard() {
  const [tenants, setTenants] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [busca, setBusca] = useState("");
  const { refreshHook } = useRefreshHook();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await refreshHook('get', '/api/admin/tenants');
        // Usar res.data.tenants quando a API estiver pronta
        setTenants(res.data.tenants);
        // console.log(res);
      } catch (err) {
        // console.log('erro', err);
      }
    }

    fetch();
  }, []);

  async function handleToggle(id, campo, type) {
    setLoadingId(`${id}-${campo}`);
    const newStatus = !campo;
    try {
      type === 'isOpen'
      ? await refreshHook('patch', '/api/admin/tenants/store', { storeOpenStatus: newStatus, tenantId: id })
      : await refreshHook('patch', '/api/admin/tenants/active', { tenantActiveStatus: newStatus, tenantId: id });

      setTenants((prev) =>
        prev.map((t) => (t.id === id ? { ...t, [type]: !campo } : t))
      );
    } catch (err) {
      // console.error("Erro ao atualizar tenant:", err);
    } finally {
      setLoadingId(null);
    }
  }

  const tenantsFiltrados = tenants.filter((t) =>
    t.tenantSlug.toLowerCase().includes(busca.toLowerCase())
  );

  const stats = {
    total: tenants.length,
    ativos: tenants.filter((t) => t.active).length,
    abertos: tenants.filter((t) => t.isOpen && t.active).length,
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-2 h-6 bg-red-700 rounded-sm" />
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">
            Gerenciamento de Tenants
          </h1>
        </div>
        <p className="text-zinc-500 text-sm ml-5">Painel administrativo · Eldur</p>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total de tenants", valor: stats.total, cor: "text-zinc-100" },
          { label: "Contas ativas",    valor: stats.ativos, cor: "text-green-400" },
          { label: "Lojas abertas",    valor: stats.abertos, cor: "text-red-400" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4"
          >
            <p className="text-xs text-zinc-500 mb-1">{s.label}</p>
            <p className={`text-3xl font-bold ${s.cor}`}>{s.valor}</p>
          </div>
        ))}
      </div>

      {/* Busca */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por slug..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full sm:w-80 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-700/50 focus:border-red-700/60 transition"
        />
      </div>

      {/* Tabela */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                {["Tenant", "Dias de funcionamento", "Loja", "Conta", "Ações"].map((h) => (
                  <th
                    key={h}
                    className="text-left text-xs font-semibold text-zinc-500 uppercase tracking-widest px-5 py-3.5"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tenantsFiltrados.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-zinc-600 text-sm py-10">
                    Nenhum tenant encontrado.
                  </td>
                </tr>
              )}

              {tenantsFiltrados.map((tenant, idx) => {
                const isLast = idx === tenantsFiltrados.length - 1;
                const loadingOpen   = loadingId === `${tenant.id}-isOpen`;
                const loadingActive = loadingId === `${tenant.id}-active`;

                return (
                  <tr
                    key={tenant.id}
                    className={`transition-colors hover:bg-zinc-800/40 ${
                      !isLast ? "border-b border-zinc-800/70" : ""
                    }`}
                  >
                    {/* Tenant */}
                    <td className="px-5 py-4">
                      <p className="font-mono text-sm text-zinc-100 font-medium">
                        {tenant.tenantSlug}
                      </p>
                      {/* Adicionado: Horário de funcionamento abaixo do slug */}
                      {tenant.horarioFuncionamento && (
                        <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          {tenant.horarioFuncionamento}
                        </p>
                      )}
                      <p className="text-xs text-zinc-600 mt-1">id: {tenant.id}</p>
                    </td>

                    {/* Dias */}
                    <td className="px-5 py-4">
                      <DiasTag diasFuncionamento={tenant.diasFuncionamento} />
                    </td>

                    {/* Status loja */}
                    <td className="px-5 py-4">
                      <StatusBadge
                        label={tenant.isOpen ? "Aberta" : "Fechada"}
                        active={tenant.isOpen}
                        colorActive="bg-green-950 text-green-400 border border-green-800"
                        colorInactive="bg-zinc-800 text-zinc-400 border border-zinc-700"
                      />
                    </td>

                    {/* Status conta */}
                    <td className="px-5 py-4">
                      <StatusBadge
                        label={tenant.active ? "Ativa" : "Inativa"}
                        active={tenant.active}
                        colorActive="bg-blue-950 text-blue-400 border border-blue-800"
                        colorInactive="bg-red-950 text-red-400 border border-red-900"
                      />
                    </td>

                    {/* Ações */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <ToggleButton
                          isOn={tenant.isOpen}
                          onLabel={loadingOpen ? "Salvando..." : "Fechar loja"}
                          offLabel={loadingOpen ? "Salvando..." : "Abrir loja"}
                          disabled={!tenant.active || loadingOpen}
                          onClick={() => handleToggle(tenant.id, tenant.isOpen, 'isOpen')}
                        />
                        <ToggleButton
                          isOn={tenant.active}
                          onLabel={loadingActive ? "Salvando..." : "Desativar conta"}
                          offLabel={loadingActive ? "Salvando..." : "Ativar conta"}
                          disabled={loadingActive}
                          onClick={() => handleToggle(tenant.id, tenant.active, 'active')}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="border-t border-zinc-800 px-5 py-3 flex items-center justify-between">
          <p className="text-xs text-zinc-600">
            {tenantsFiltrados.length} de {tenants.length} tenants
          </p>
          <p className="text-xs text-zinc-700">Eldur Admin · v1.0</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;