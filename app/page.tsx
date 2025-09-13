import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-xl text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold">ChatGPT Daily Use Cases</h1>
        <p className="text-muted-foreground">Open the interactive, persona-based deck.</p>
        <Link href="/deck" className="inline-block px-4 py-2 bg-black text-white rounded-lg">Open Deck</Link>
      </div>
    </main>
  );
}
