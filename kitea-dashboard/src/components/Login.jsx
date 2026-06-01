import { useState } from "react"

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    setTimeout(() => {
      if (email === "mezz63928@gmail.com" && password === "123456") {
        onLoginSuccess({
          email: email,
          nom_complet: 'EZZOUKHRY Mouhssine',
          role: 'Agent Administratif Supply Chain'
        });
      } else {
        setError('Identifiants incorrects ou compte non synchronisé avec Active Directory (AD).');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4 font-sans">
      
      {/* MASTER CARD WRAPPER - SPLIT SCREEN */}
      <div className="bg-white w-full max-w-4xl min-h-[500px] rounded-2xl shadow-2xl flex overflow-hidden border border-gray-200">
        
        {/* LEFT PANE: USER INPUT FORM INTERFACE */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-between bg-white">
          
          {/* Top Brand Logo Asset */}
          <div className="flex justify-center mt-2">
            <div className="bg-[#E30613] text-white font-black text-3xl px-6 py-3 rounded-2xl tracking-tighter shadow-md">
              KITEA
            </div>
          </div>

          {/* Form Processing Center */}
          <form onSubmit={handleSubmit} className="space-y-4 my-auto px-4">
            <div className="text-center mb-6">
              <p className="text-xs text-gray-400 font-medium">
                Veuillez remplir vos informations pour continuer
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-700 p-2.5 rounded-xl text-[11px] font-semibold text-center">
                ⚠️ {error}
              </div>
            )}

            <div className="relative">
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email"
                className="w-full px-4 py-2.5 bg-gray-50 border border-emerald-500 rounded-xl text-xs focus:outline-none focus:bg-white transition-all text-gray-800 font-medium"
              />
            </div>

            <div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe d'entreprise"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#E30613] focus:bg-white transition-all text-gray-800 font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full font-bold text-xs py-2.5 rounded-xl transition-all shadow-xs text-white ${
                loading ? 'bg-red-300 cursor-not-allowed' : 'bg-red-400 hover:bg-[#E30613]'
              }`}
            >
              {loading ? "Connecting ..." : "S'authentifier"}
            </button>
          </form>

          <div className="text-[10px] text-gray-400 text-center max-w-xs mx-auto leading-relaxed mt-4">
            En vous connectant, vous acceptez nos #conditions d'utilisation.
          </div>
        </div>

        <div className="hidden md:flex w-1/2 bg-[#B12024] relative p-12 items-center overflow-hidden">
          
          <div className="absolute w-64 h-64 bg-white/5 rounded-full -top-10 -left-10 pointer-events-none" />
          
          {/* Center Left Floating Graphic Circle */}
          <div className="absolute w-56 h-56 bg-white/5 rounded-full top-12 -left-12 pointer-events-none" />
          
          {/* Bottom Right Floating Graphic Circle */}
          <div className="absolute w-48 h-48 bg-white/5 rounded-full bottom-16 -right-8 pointer-events-none" />

          {/* Core Bold Welcome Greeting Overlay */}
          <div className="relative z-10">
            <h2 className="text-white text-3xl font-extrabold tracking-tight leading-snug max-w-sm">
              Bienvenue chez KITEA
            </h2>
          </div>
        </div>

      </div>
    </div>
  )
}