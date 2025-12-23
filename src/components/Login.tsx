
import React, { useState } from 'react';
import { AuthUser } from '../types';

interface LoginProps {
  onLogin: (user: AuthUser) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [matricule, setMatricule] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulation d'authentification
    setTimeout(() => {
      onLogin({
        id: '1',
        name: 'Jean OKOMBI',
        matricule: matricule || 'HUISS-CG-2024-089',
        email: 'etude.okombi@justice.cg'
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[120px]"></div>
      </div>
      
      <div className="w-full max-w-md p-4 relative z-10 animate-in fade-in zoom-in duration-700">
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200">
          <div className="bg-slate-50 p-10 text-center border-b border-slate-100">
            <div className="w-20 h-20 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-500/20 transform -rotate-6">
              <i className="fas fa-balance-scale text-3xl text-slate-900"></i>
            </div>
            <h1 className="text-3xl font-black text-slate-900 legal-title tracking-tight mb-2">HuissierPro Congo</h1>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.2em]">Ministère de la Justice</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-10 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Matricule Professionnel</label>
              <div className="relative">
                <i className="fas fa-id-badge absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"></i>
                <input 
                  type="text" 
                  required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none transition-all font-bold text-slate-700"
                  placeholder="ex: HUISS-CG-000"
                  value={matricule}
                  onChange={(e) => setMatricule(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Mot de Passe</label>
              <div className="relative">
                <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"></i>
                <input 
                  type="password" 
                  required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none transition-all font-bold text-slate-700"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl hover:bg-slate-800 transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 disabled:bg-slate-400"
            >
              {isLoading ? (
                <i className="fas fa-spinner fa-spin text-xl"></i>
              ) : (
                <>
                  <i className="fas fa-key text-amber-500"></i>
                  Accéder à l'Étude
                </>
              )}
            </button>

            <div className="text-center pt-4">
              <a href="#" className="text-xs font-bold text-slate-400 hover:text-amber-600 transition-colors">
                Mot de passe oublié ? Contactez le Greffe
              </a>
            </div>
          </form>
          
          <div className="p-6 bg-slate-50 text-center border-t border-slate-100">
             <p className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">
               Session sécurisée conforme aux protocoles OHADA
             </p>
          </div>
        </div>
        
        <p className="text-center mt-8 text-slate-500 text-xs font-medium">
          © 2024 HuissierPro Congo — République du Congo
        </p>
      </div>
    </div>
  );
};

export default Login;
