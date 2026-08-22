import { SkillPathExplorer } from '@/components/skill-path-explorer';

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">SkillPath</h1>
        <p className="mt-2 max-w-2xl opacity-70">
          Pick where you are and where you want to be. SkillPath compares what the target role requires against
          what you already have, then shows what to learn and in what order.
        </p>
      </header>

      <SkillPathExplorer />
    </main>
  );
}
