// file: components/InstructionsPanel.js
import { EXPERIMENTS } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export default function InstructionsPanel({ experimentId, currentStep, onStartAnalysis }) {
    const exp = EXPERIMENTS[experimentId];
    // CHANGE #1: Add a mapping for step 0
    const progressLevels = { 0: 0, 1: 0, 2: 35, 3: 75, 4: 100 };
    const stepNames = { 0: "Initializing", 1: "Setup", 2: "React", 3: "Observe", 4: "Analyze" };

    let instructionText = "";
    // CHANGE #2: Add a case for step 0 in the switch statement
    switch (currentStep) {
        case 0:
            instructionText = "Getting the lab equipment ready...";
            break;
        case 1:
            instructionText = "Drag the required chemicals from the shelf to a beaker on the bench to set their properties.";
            break;
        case 2:
            instructionText = "Click on a beaker containing a chemical to pour its contents into the main Reaction Vessel.";
            break;
        case 3:
            instructionText = "The reaction is complete! Observe the final results in the log and on the vessel. When ready, proceed to the final analysis.";
            break;
        case 4:
            instructionText = "The quiz is now active. Answer the questions to complete the experiment and test your knowledge.";
            break;
        default:
            instructionText = "Welcome to the lab!";
    }

    return (
        <Card className="glass-card mb-6">
            <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-blue-600">{exp.title}</span>
                    <span className="font-semibold text-slate-600">Step {currentStep}: {stepNames[currentStep]}</span>
                </div>
                {/* The Progress component will now smoothly animate from 0 to 25 */}
                <Progress value={progressLevels[currentStep]} className="w-full mb-4" />
                <p className="text-slate-600 text-center min-h-[40px] flex items-center justify-center">{instructionText}</p>
                {currentStep === 3 && (
                    <div className="text-center mt-4">
                        <Button onClick={onStartAnalysis} className="bg-purple-600 hover:bg-purple-700">
                            Begin Analysis
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}