import { useState, useEffect } from "react";
import { useRefreshHook } from "../utils/refresh-hook";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

// ─── Ícones inline (sem dependência externa) ────────────────────────────────

function FlameIcon({ size = 28 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 2C12 2 6 8 6 13C6 16.3137 8.68629 19 12 19C15.3137 19 18 16.3137 18 13C18 10 16 8 16 8C16 8 15.5 11 13 11C13 11 14 8.5 12 2Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M12 22C10.3431 22 9 20.6569 9 19H15C15 20.6569 13.6569 22 12 22Z"
        fill="currentColor"
        opacity="0.6"
      />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

// ─── Stat no painel esquerdo ─────────────────────────────────────────────────

function Stat({ value, label }) {
  return (
    <div>
      <p className="text-zinc-100 text-xl font-bold">{value}</p>
      <p className="text-zinc-500 text-xs mt-0.5">{label}</p>
    </div>
  );
}

// ─── Componente principal ────────────────────────────────────────────────────

function AdminLogin() {
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [mounted, setMounted]         = useState(false);
  const { refreshHook } = useRefreshHook();
  const redirect = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const link = document.createElement("link");
    link.rel   = "stylesheet";
    link.href  = "https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap";
    document.head.appendChild(link);

    const t = setTimeout(() => setMounted(true), 60);
    return () => {
      clearTimeout(t);
      document.head.removeChild(link);
    };
  }, []);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Preencha e-mail e senha para continuar.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await refreshHook('post', '/api/admin/login', { email, senha: password });
      login(res.data.token);
      console.log(res);
      redirect('/admin/dashboard');

    } catch (err) {
      setError(err.message || "Erro ao entrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div
      className="min-h-screen flex bg-zinc-950"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* ── Painel esquerdo — branding ─────────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between w-2/5 xl:w-1/3 p-12 bg-zinc-900 border-r border-zinc-800 relative overflow-hidden">

        {/* Brilho decorativo de fogo no canto inferior */}
        <div className="pointer-events-none absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-red-700 opacity-20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-orange-600 opacity-10 blur-2xl" />

        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="text-red-600">
            <FlameIcon size={30} />
          </div>
          <span
            className="text-2xl font-extrabold text-zinc-100 tracking-tight"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Eldur
          </span>
        </div>

        {/* Tagline central */}
        <div className="space-y-5">
          <h2
            className="text-3xl xl:text-4xl font-extrabold text-zinc-100 leading-snug"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Gerencie seu<br />
            restaurante com<br />
            <span className="text-red-500">precisão total.</span>
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
            Cardápio digital, KDS em tempo real, controle de pedidos e
            relatórios de vendas — tudo em um painel unificado.
          </p>
        </div>

        {/* Métricas */}
        <div className="flex gap-8 border-t border-zinc-800 pt-8">
          <Stat value="99.9%" label="Uptime garantido" />
          <Stat value="< 50ms" label="Latência do KDS" />
          <Stat value="∞"      label="Pedidos simultâneos" />
        </div>
      </div>

      {/* ── Painel direito — formulário ────────────────────────────── */}
      <div className="flex flex-1 items-center justify-center p-6 sm:p-10 relative">

        {/* Brilho sutil atrás do card */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-red-800 opacity-5 blur-3xl" />

        <div
          className={`relative z-10 w-full max-w-sm transition-all duration-500 ease-out
            ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}
        >
          {/* Logo mobile */}
          <div className="flex lg:hidden items-center gap-2 mb-10 justify-center">
            <div className="text-red-600"><FlameIcon size={26} /></div>
            <span
              className="text-xl font-extrabold text-zinc-100"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Eldur
            </span>
          </div>

          {/* Cabeçalho */}
          <div className="mb-8">
            <h1
              className="text-2xl font-bold text-zinc-100 mb-1"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Acessar painel
            </h1>
            <p className="text-zinc-500 text-sm">
              Acesso restrito a administradores.
            </p>
          </div>

          {/* Campos */}
          <div className="space-y-5">

            {/* E-mail */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-zinc-400 uppercase tracking-widest mb-2"
              >
                E-mail
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="admin@restaurante.com"
                className="
                  w-full bg-zinc-900 border border-zinc-800 rounded-xl
                  px-4 py-3 text-sm text-zinc-100 placeholder-zinc-700
                  outline-none focus:border-red-700 focus:ring-2 focus:ring-red-700/10
                  transition-colors
                "
              />
            </div>

            {/* Senha */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="text-xs font-medium text-zinc-400 uppercase tracking-widest"
                >
                  Senha
                </label>
                <button
                  type="button"
                  className="text-xs text-zinc-500 hover:text-red-500 transition-colors"
                >
                  Esqueceu a senha?
                </button>
              </div>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="••••••••"
                  className="
                    w-full bg-zinc-900 border border-zinc-800 rounded-xl
                    px-4 py-3 pr-11 text-sm text-zinc-100 placeholder-zinc-700
                    outline-none focus:border-red-700 focus:ring-2 focus:ring-red-700/10
                    transition-colors
                  "
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  className="
                    absolute right-3.5 top-1/2 -translate-y-1/2
                    text-zinc-600 hover:text-zinc-300 transition-colors
                  "
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Mensagem de erro */}
            {error && (
              <div
                role="alert"
                className="flex items-center gap-2 text-red-500 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5"
              >
                <AlertIcon />
                <span>{error}</span>
              </div>
            )}

            {/* Botão de envio */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="
                w-full flex items-center justify-center gap-2
                bg-red-700 hover:bg-red-600 active:scale-[0.98]
                disabled:opacity-60 disabled:cursor-not-allowed
                text-white text-sm font-medium
                py-3 rounded-xl transition-all duration-150
                mt-1
              "
            >
              {loading ? (
                <>
                  <Spinner />
                  Entrando…
                </>
              ) : (
                "Entrar"
              )}
            </button>
          </div>

          {/* Rodapé */}
          <p className="text-center text-zinc-700 text-xs mt-10">
            Eldur &copy; {new Date().getFullYear()} — Uso interno restrito
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;