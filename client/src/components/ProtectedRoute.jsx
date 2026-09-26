import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore.js';

export const ProtectedRoute = ({ children, requiredRole }) => {
  const { authenticated, user, role, openAuthModal } = useAuthStore();

  if (!authenticated || !user) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 sm:p-12 text-center border border-slate-100 dark:border-slate-700 shadow-card max-w-xl mx-auto my-12 space-y-6 font-sans">
        <div className="w-16 h-16 rounded-2xl bg-orange-50 dark:bg-orange-500/10 text-orange-500 flex items-center justify-center mx-auto text-2xl">
          <i className="fa-solid fa-lock"></i>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
            Authentication Required
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
            Please log in or sign up to access this dashboard feature.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={openAuthModal}
            className="w-full sm:w-auto px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-full text-xs transition shadow-md shadow-orange-500/20 uppercase tracking-wider cursor-pointer"
          >
            Log In / Sign Up
          </button>
          <NavLink
            to={
              requiredRole === 'campus_ambassador' || window.location.pathname.includes('campus-ambassador')
                ? `/login?tab=campus_ambassador&redirect=${encodeURIComponent(window.location.pathname)}`
                : '/login'
            }
            className="w-full sm:w-auto px-6 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold rounded-full text-xs transition text-center"
          >
            Go to Account Portal
          </NavLink>
        </div>
      </div>
    );
  }

  const hasRole =
    !requiredRole ||
    role === requiredRole ||
    user?.role === requiredRole ||
    (Array.isArray(user?.roles) && user.roles.includes(requiredRole));

  if (!hasRole) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 sm:p-12 text-center border border-slate-100 dark:border-slate-700 shadow-card max-w-xl mx-auto my-12 space-y-6 font-sans">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto text-2xl">
          <i className="fa-solid fa-user-shield"></i>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
            Role Permission Required
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
            This section requires a <span className="font-bold text-orange-600 capitalize">{requiredRole}</span> account. You are currently logged in as <span className="font-bold capitalize">{role}</span>.
          </p>
        </div>

        <div className="pt-2">
          <NavLink
            to={role === 'guide' ? '/guide' : role === 'campus_ambassador' ? '/campus-ambassador/dashboard' : '/trips'}
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-full text-xs transition shadow-md shadow-orange-500/20 uppercase tracking-wider"
          >
            Go to My Dashboard ({role})
          </NavLink>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
