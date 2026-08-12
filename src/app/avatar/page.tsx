'use client';

// Three.js / R3F requires browser APIs — dynamically import the heavy 3D studio
// to prevent Next.js SSR from choking on WebGL globals.
import dynamic from 'next/dynamic';

const AvatarStudio3D = dynamic(
  () => import('@/components/avatar/AvatarStudio3D'),
  { ssr: false, loading: () => (
    <div className="h-screen w-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <span className="w-10 h-10 border-2 border-[#ff0055] border-t-transparent rounded-full animate-spin" />
        <p className="text-[#ff0055] font-mono text-xs tracking-widest uppercase">Loading 3D Engine...</p>
      </div>
    </div>
  )}
);

export default function AvatarPage() {
  return <AvatarStudio3D />;
}
