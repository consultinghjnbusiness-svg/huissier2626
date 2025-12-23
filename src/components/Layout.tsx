import React from 'react';
import { AppView, UserProfile } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  profile: UserProfile;
  onLogout: () => void;
  isSyncing?: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  activeView,
  setActiveView,
  profile,
  onLogout,
  isSyncing = false,
}) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex w-64 bg-slate-900 text-white flex-col">
        <div className="p-6 border-b border-slate-800/50">
          <div className="flex items-center gap-3 mb-2">
            {profile.logo ? (
              <img
                src={profile.logo}
                alt="Logo Étude"
                className="w-10 h-10 rounded-lg object-cover border border-slate-700"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center text-slate-900 shadow-lg">
                <i className="fas fa-balance-scale text-xl" />
              </div>
            )}
            <h1 className="text-xl font-bold tracking-tight truncate">
              {profile.name.split(' ').pop()}Pro
            </h1>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
              République du Congo
            </p>
            {isSyncing ? (
              <i className="fas fa-sync-alt text-[8px] text-amber-500 animate-spin" />
            ) : (
              <i className="fas fa-cloud text-[8px] text-emerald-500" />
            )}
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavItem
            icon="fas fa-th-large"
            label="Tableau de bord"
            active={activeView === 'dashboard'}
            onClick={() => setActiveView('dashboard')}
          />
          <NavItem
            icon="fas fa-plus-circle"
            label="Nouvel Acte"
            active={activeView === 'new-act'}
            onClick={() => setActiveView('new-act')}
          />
          <NavItem
            icon="fas fa-edit"
            label="Éditeur"
            active={activeView === 'editor'}
            onClick={() => setActiveView('editor')}
          />
          <NavItem
            icon="fas fa-cog"
            label="Paramètres"
            active={activeView === 'settings'}
            onClick={() => setActiveView('settings')}
          />
        </nav>

        <div className="p-4 space-y-4">
          <div className="px-4 py-2 bg-slate-800/50 rounded-lg flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-slate-400 font-bold uppercase">
              Étude connectée
            </span>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-red-400 hover:bg-red-500/10 hover:text-red-300 font-bold text-sm"
          >
            <i className="fas fa-power-off w-5 text-center" />
            Déconnexion
          </button>

          <div className="p-4 bg-slate-800/30 rounded-xl text-[10px] text-slate-500 border border-slate-800">
            <p className="font-bold text-slate-400 mb-1 truncate">
              {profile.studyName}
            </p>
            <p>© 2025 HuissierPro Congo</p>
            <p>SÉCURISÉ AES-256 Cloud</p>
          </div>
        </div>
      </aside>

      {/* Navbar mobile */}
      <nav className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center sticky top-0 z-50 shadow-xl">
        <div className="flex items-center gap-2">
          {profile.logo ? (
            <img
              src={profile.logo}
              alt="Logo"
              className="w-8 h-8 rounded object-cover"
            />
          ) : (
            <i className="fas fa-balance-scale text-amber-500 text-xl" />
          )}
          <h1 className="text-lg font-bold tracking-tight">HuissierPro</h1>
        </div>
        <div className="flex gap-4 items-center">
          {isSyncing && (
            <i className="fas fa-sync-alt text-xs text-amber-500 animate-spin" />
          )}
          <MobileNavButton
            icon="fas fa-th-large"
            active={activeView === 'dashboard'}
            onClick={() => setActiveView('dashboard')}
          />
          <MobileNavButton
            icon="fas fa-plus-circle"
            active={activeView === 'new-act'}
            onClick={() => setActiveView('new-act')}
          />
          <MobileNavButton
            icon="fas fa-edit"
            active={activeView === 'editor'}
            onClick={() => setActiveView('editor')}
          />
          <MobileNavButton
            icon="fas fa-cog"
            active={activeView === 'settings'}
            onClick={() => setActiveView('settings')}
          />
          <button
            onClick={onLogout}
            className="p-2 text-red-400 hover:text-red-300 rounded-lg transition-colors"
          >
            <i className="fas fa-power-off" />
          </button>
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="flex-1 overflow-y-auto bg-slate-50">
        {children}
      </main>
    </div>
  );
};

interface NavItemProps {
  icon: string;
  label: string;
  active: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${
      active
        ? 'bg-amber-500 text-slate-900 font-bold shadow-lg shadow-amber-500/20'
        : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
    }`}
  >
    <i className={`${icon} w-5 text-center flex-shrink-0`} />
    <span className="text-sm">{label}</span>
  </button>
);

interface MobileNavButtonProps {
  icon: string;
  active: boolean;
  onClick: () => void;
}

const MobileNavButton: React.FC<MobileNavButtonProps> = ({
  icon,
  active,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-lg transition-colors ${
      active
        ? 'text-amber-500 bg-amber-500/10'
        : 'text-slate-400 hover:text-amber-400'
    }`}
  >
    <i className={icon} />
  </button>
);

export default Layout;
