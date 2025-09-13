import dynamic from "next/dynamic";

const InteractivePersonaDeck = dynamic(() => import("@/components/InteractivePersonaDeck"), { ssr: false });

export default function Page(){
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <InteractivePersonaDeck />
      </div>
    </main>
  );
}
