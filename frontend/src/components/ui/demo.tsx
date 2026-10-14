import AgenticFactory3D from "@/components/ui/agentic-factory-3d";
import { GlowCard } from "@/components/ui/spotlight-card";

export function AgenticFactory3DDemo() {
  return <AgenticFactory3D height="100vh" />;
}

export function Default() {
  return (
    <div className="w-screen h-screen flex flex-row items-center justify-center gap-10 custom-cursor">
      <GlowCard />
      <GlowCard />
      <GlowCard />
    </div>
  );
}

export default AgenticFactory3DDemo;
