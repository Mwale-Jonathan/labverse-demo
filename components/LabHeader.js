// file: components/LabHeader.js
"use client";

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { EXPERIMENTS } from "@/lib/constants";
import { ArrowPathIcon, HomeIcon } from '@heroicons/react/24/outline'; // Run: npm install @heroicons/react

export default function LabHeader({ experimentId, onReset, onGoHome }) {
    const router = useRouter();
    const experiment = EXPERIMENTS[experimentId];

    const handleSwitchExperiment = (newExperimentId) => {
        if (newExperimentId) {
            router.push(`/lab/${newExperimentId}`);
        }
    };

    return (
        <header className="sticky z-50 top-0 flex h-16 items-center justify-between border-b bg-background/70 backdrop-blur-md px-6 shrink-0">
            <h1 className="text-xl font-semibold">{experiment?.title || "Chemistry Lab"}</h1>
            <div className="flex items-center gap-2">
                <Select onValueChange={handleSwitchExperiment}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Switch Experiment..." />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.entries(EXPERIMENTS).map(([id, exp]) => (
                            <SelectItem key={id} value={id}>
                                {exp.title}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button variant="outline" onClick={onReset} title="Reset Experiment">
                    <ArrowPathIcon className="h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={onGoHome} title="Back to Home">
                    <HomeIcon className="h-4 w-4" />
                </Button>
            </div>
        </header>
    );
}