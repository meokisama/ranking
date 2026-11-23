"use client";
import { useEffect, useState } from "react";
import { VOTING, votingState } from "@/lib/config";
import type { VotingState } from "@/lib/config";
import { store } from "@/lib/storage";
import Ballot from "./ballot";
import Gate from "./gate";
import type { VoteStep } from "./types";

export default function VoteFlow({ steps, periodLabel }: { steps: VoteStep[]; periodLabel: string }) {
  const [state, setState] = useState<VotingState | null>(null);
  const [preview, setPreview] = useState(false);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    setState(votingState());
    setPreview(new URLSearchParams(window.location.search).has("preview"));
    setVoted(store.get(VOTING.storageKey) === "done");
  }, []);

  if (state === null) return <main className="min-h-svh" />;
  if (voted) return <Gate tone="done" periodLabel={periodLabel} />;
  if (state !== "open" && !preview) return <Gate tone={state} periodLabel={periodLabel} />;
  return <Ballot steps={steps} periodLabel={periodLabel} preview={state !== "open"} onDone={() => setVoted(true)} />;
}
