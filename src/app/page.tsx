'use client';

import { PrivateTipsApp } from '../components/PrivateTipsApp';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.3),_transparent_50%)]" />
      <div className="relative z-10 pt-14 pb-24">
        <div className="max-w-5xl mx-auto">
          <PrivateTipsApp />
        </div>
      </div>
    </div>
  );
}
