// file: app/lab/[experimentId]/page.js
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from 'next/navigation';

import { EXPERIMENTS, INITIAL_TEMP } from "@/lib/constants";
import { calculateFinalState } from "@/lib/simulation";

import LabHeader from "@/components/LabHeader";
import Sidebar from "@/components/Sidebar";
import InstructionsPanel from "@/components/InstructionsPanel";
import LabBench from "@/components/LabBench";
import ConcentrationModal from "@/components/ConcentrationModal";
import QuizModal from "@/components/QuizModal";

export default function LabPage() {
    const router = useRouter();
    const params = useParams();
    const { experimentId } = params;

    const [labData, setLabData] = useState(null);
    const [logs, setLogs] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isInitialized, setIsInitialized] = useState(false);
    const [modalState, setModalState] = useState({ isOpen: false, chemicalId: null, beakerId: null });
    const [isQuizOpen, setIsQuizOpen] = useState(false);

    // This initialization effect runs once when the page loads
    useEffect(() => {
        let timer;
        const initializeExperiment = () => {
            if (!EXPERIMENTS[experimentId]) {
                router.push('/');
                return;
            }
            setLabData({ beaker1: null, beaker2: null, reaction: { chemicals: [], volume: 0, hasIndicator: false }, temperature: INITIAL_TEMP, pH: 7.0 });
            setCurrentStep(0);
            setLogs([`Experiment Started: ${EXPERIMENTS[experimentId].title}.`]);
            setIsInitialized(true);
            timer = setTimeout(() => setCurrentStep(1), 50);
        };
        initializeExperiment();
        return () => clearTimeout(timer);
    }, [experimentId]);

    // This effect reacts to changes in labData to update pH, temp, and advance the step
    useEffect(() => {
        // THE FIX, PART 1: The "Guard Clause"
        // If labData hasn't been initialized yet, do nothing. This prevents the error.
        if (!labData) {
            return;
        }

        const checkStepCompletion = () => {
            if (currentStep >= 3) return;
            let newStep = currentStep;
            switch (currentStep) {
                case 1:
                    const reqs = new Set(EXPERIMENTS[experimentId].requiredChemicals.filter(c => c !== 'phenolphthalein'));
                    const present = new Set([labData.beaker1?.id, labData.beaker2?.id, ...labData.reaction.chemicals.map(c => c.id)].filter(Boolean));
                    if ([...reqs].every(r => present.has(r))) newStep = 2;
                    break;
                case 2:
                    if (labData.reaction.chemicals.length >= 2) newStep = 3;
                    break;
            }
            if (newStep !== currentStep) {
                logObservation(`Step ${currentStep} Complete -> Advancing to Step ${newStep}.`);
                setCurrentStep(newStep);
            }
        };

        const { pH, temperature } = calculateFinalState(labData.reaction);

        // This check is crucial to prevent an infinite re-render loop.
        // We only update the state if the calculated values are actually different.
        if (pH !== labData.pH || temperature !== labData.temperature) {
            setLabData(prevData => ({ ...prevData, pH, temperature }));
        }

        checkStepCompletion();

        // THE FIX, PART 2: The Dependency Array
        // We depend on the entire labData object. The guard clause above handles the initial null case.
    }, [labData]);


    const resetExperiment = () => {
        let timer;
        setCurrentStep(0);
        setLabData({ beaker1: null, beaker2: null, reaction: { chemicals: [], volume: 0, hasIndicator: false }, temperature: INITIAL_TEMP, pH: 7.0 });
        setLogs([`Experiment reset. Please set up your solutions.`]);
        timer = setTimeout(() => setCurrentStep(1), 50);
        return () => clearTimeout(timer);
    };

    const goHome = () => router.push('/');
    const logObservation = (message) => setLogs(prev => [...prev, message]);

    if (!isInitialized || !labData) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p className="text-xl">Loading Lab Environment...</p>
            </div>
        );
    }

    return (
        <div className="flex h-screen w-full flex-col bg-muted/40">
            <LabHeader experimentId={experimentId} onReset={resetExperiment} onGoHome={goHome} />
            <main className="grid flex-1 gap-6 p-6 md:grid-cols-1 lg:grid-cols-4">
                <div className="flex flex-col gap-6 lg:col-span-3">
                    <div className="border border-gray-200 rounded-xl p-4 bg-gray-100">
                        <InstructionsPanel
                            experimentId={experimentId}
                            currentStep={currentStep}
                            onStartAnalysis={() => { setCurrentStep(4); setIsQuizOpen(true); }}
                        />
                        <div className="flex-grow">
                            <LabBench
                                labData={labData}
                                setLabData={setLabData}
                                logObservation={logObservation}
                                openModal={(chemicalId, beakerId) => setModalState({ isOpen: true, chemicalId, beakerId })}
                            />
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-1">
                    <Sidebar experimentId={experimentId} labData={labData} logs={logs} />
                </div>
            </main>
            <ConcentrationModal
                isOpen={modalState.isOpen}
                onClose={() => setModalState({ isOpen: false, chemicalId: null, beakerId: null })}
                chemicalId={modalState.chemicalId}
                beakerId={modalState.beakerId}
                setLabData={setLabData}
                logObservation={logObservation}
            />
            <QuizModal
                isOpen={isQuizOpen}
                experimentId={experimentId}
                onFinish={goHome}
                onRestart={resetExperiment}
            />
        </div>
    );
}