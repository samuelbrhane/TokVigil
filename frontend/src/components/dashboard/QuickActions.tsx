"use client";

import Link from "next/link";
import { Button } from "@/components/ui";
import Card from "@/components/ui/Card";

export default function QuickActions() {
  return (
    <Card className="p-6">
      <h3 className="text-sm font-mono font-bold text-white mb-4">
        Quick Actions
      </h3>
      <div className="flex flex-col gap-2">
        <Link href="/dashboard/policies" className="block">
          <Button
            variant="secondary"
            className="w-full justify-start"
            size="sm"
          >
            <span className="mr-2 text-brand-400">⬡</span> Create Policy
          </Button>
        </Link>
        <Link href="/dashboard/api-keys" className="block">
          <Button
            variant="secondary"
            className="w-full justify-start"
            size="sm"
          >
            <span className="mr-2 text-brand-400">⚿</span> Generate API Key
          </Button>
        </Link>
        <Link href="/dashboard/workspaces" className="block">
          <Button
            variant="secondary"
            className="w-full justify-start"
            size="sm"
          >
            <span className="mr-2 text-brand-400">⧈</span> Manage Workspaces
          </Button>
        </Link>
      </div>
    </Card>
  );
}
