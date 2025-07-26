// file: app/page.js
"use client";

import { useRouter } from 'next/navigation';
import ExperimentSelection from "@/components/ExperimentSelection";

export default function HomePage() {
  const router = useRouter();

  // This function will be called when a user clicks on an experiment card.
  // It navigates to the dynamic lab page with the chosen experiment's ID.
  const handleSelectExperiment = (experimentId) => {
    router.push(`/lab/${experimentId}`);
  };

  return (
    // The main container for the selection page
    <main className="flex items-center justify-center min-h-[calc(100vh-48px)]">
      <div className="w-full max-w-5xl">
        <ExperimentSelection onSelectExperiment={handleSelectExperiment} />
      </div>
    </main>
  );
}