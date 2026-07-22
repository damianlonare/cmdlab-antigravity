import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Shield, Mail, Lock, X, UserPlus, LogIn, Sparkles } from 'lucide-react';

export const AuthModal = ({ isOpen, onClose, onSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isSignUp) {
        // Sign Up flow
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name: name || 'Artista CMD Lab' }
          }
        });

        if (error) {
          setErrorMsg(error.message);
        } else {
          setSuccessMsg('¡Cuenta registrada con éxito! Ya puedes iniciar sesión.');
          setIsSignUp(false);
        }
      } else {
        // Login flow
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) {
          setErrorMsg(error.message || 'Credenciales incorrectas.');
        } else {
          onSuccess(data.user);
          onClose();
        }
      }
    } catch (err) {
      setErrorMsg('Error de conexión con el servicio de autenticación.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-950 border border-purple-800 text-purple-300">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">
                {isSignUp ? 'Crear Cuenta de Artista' : 'Acceso Privado CMD Lab'}
              </h2>
              <p className="text-xs text-neutral-400">
                {isSignUp ? 'Registra tu perfil en el colectivo' : 'Inicia sesión o crea tu cuenta'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-full bg-neutral-800/80"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher - Highlighted */}
        <div className="flex bg-neutral-950 p-1.5 rounded-2xl border border-neutral-800">
          <button
            type="button"
            onClick={() => { setIsSignUp(false); setErrorMsg(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              !isSignUp 
                ? 'bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-lg' 
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Iniciar Sesión</span>
          </button>
          <button
            type="button"
            onClick={() => { setIsSignUp(true); setErrorMsg(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              isSignUp 
                ? 'bg-gradient-to-r from-cyan-600 to-cyan-800 text-white shadow-lg' 
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5 text-cyan-300" />
            <span>Registrarse (Nuevo Artista)</span>
          </button>
        </div>

        {/* Error / Success Alerts */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-medium">
            {successMsg}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="text-xs font-medium text-neutral-300 block mb-1">Nombre Completo / Artístico *</label>
              <input
                type="text"
                required
                placeholder="ej. Mateo Sonidos"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-white text-xs"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-neutral-300 block mb-1">Correo Electrónico *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-3 py-2.5 text-white text-xs"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-neutral-300 block mb-1">Contraseña *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-3 py-2.5 text-white text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg transition-all"
          >
            {loading ? 'Procesando...' : isSignUp ? 'Crear Mi Cuenta de Artista' : 'Iniciar Sesión'}
          </button>
        </form>

        {/* Footer Toggle Link */}
        <div className="text-center pt-2 border-t border-neutral-800/80">
          {isSignUp ? (
            <button
              type="button"
              onClick={() => setIsSignUp(false)}
              className="text-xs text-neutral-400 hover:text-white transition-colors"
            >
              ¿Ya tienes cuenta? <span className="text-purple-400 font-semibold underline">Inicia Sesión aquí</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsSignUp(true)}
              className="text-xs text-neutral-400 hover:text-white transition-colors"
            >
              ¿Eres un nuevo artista? <span className="text-cyan-400 font-semibold underline">Regístrate como Artista</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
