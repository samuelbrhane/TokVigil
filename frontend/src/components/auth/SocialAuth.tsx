import { Button } from "@/components/ui";

export default function SocialAuth({ mode = "login" }: { mode?: "login" | "signup" }) {
  const verb = mode === "login" ? "Continue" : "Sign up";
  return (
    <>
      <div className="mt-6 flex items-center gap-3">
        <div className="flex-1 h-px bg-surface-800/60" />
        <span className="text-xs text-surface-600 font-mono">or</span>
        <div className="flex-1 h-px bg-surface-800/60" />
      </div>
      <div className="mt-6 space-y-2.5">
        <Button variant="secondary" className="w-full">
          <span className="mr-2">◆</span> {verb} with GitHub
        </Button>
        <Button variant="secondary" className="w-full">
          <span className="mr-2">◉</span> {verb} with Google
        </Button>
      </div>
    </>
  );
}
