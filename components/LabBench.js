// file: components/LabBench.js
import { useState } from 'react';
import Beaker from './Beaker';
import ReactionVessel from './ReactionVessel';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MAX_REACTION_VOL } from '@/lib/constants';
import { calculateFinalState } from '@/lib/simulation';

export default function LabBench({ labData, setLabData, logObservation, openModal }) {
    const [activeDropZone, setActiveDropZone] = useState(null);

    const handleDragOver = (e, beakerId) => {
        e.preventDefault();
        setActiveDropZone(beakerId);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setActiveDropZone(null);
    };

    const handleDrop = (e, beakerId) => {
        e.preventDefault();
        setActiveDropZone(null);
        const chemicalId = e.dataTransfer.getData("chemicalId");
        if (chemicalId) {
            openModal(chemicalId, beakerId);
        }
    };

    const handlePour = (sourceBeakerNum) => {
        const sourceBeakerId = `beaker${sourceBeakerNum}`;
        const sourceChemical = labData[sourceBeakerId];

        if (!sourceChemical) {
            logObservation(`Beaker ${sourceBeakerNum} is empty.`);
            return;
        }
        if (labData.reaction.volume + sourceChemical.volume > MAX_REACTION_VOL) {
            logObservation(`Cannot pour, reaction vessel would overflow.`);
            return;
        }

        logObservation(`Pouring from Beaker ${sourceBeakerNum} into the reaction vessel.`);

        // Create new state immutably
        const newReactionChemicals = [...labData.reaction.chemicals, sourceChemical];
        const newReactionVolume = labData.reaction.volume + sourceChemical.volume;

        const intermediateLabData = {
            ...labData,
            [sourceBeakerId]: null, // Empty the source beaker
            reaction: {
                ...labData.reaction,
                chemicals: newReactionChemicals,
                volume: newReactionVolume,
            }
        };

        // Calculate the final pH and temperature
        const { pH, temperature } = calculateFinalState(intermediateLabData.reaction);

        setLabData({
            ...intermediateLabData,
            pH,
            temperature,
        });

        logObservation(`Reaction complete. Final pH: ${pH.toFixed(2)}, Final Temp: ${temperature.toFixed(1)}°C.`);
    };

    return (
        <Card className="bg-gradient-to-br from-slate-100 to-slate-200 shadow-inner">
            <CardHeader>
                <CardTitle className="text-center text-slate-800">Laboratory Bench</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Beaker 1 Drop Zone */}
                    <div
                        className={`drop-zone p-4 min-h-[200px] flex flex-col items-center justify-end ${activeDropZone === '1' ? 'drag-over' : ''}`}
                        onDragOver={(e) => handleDragOver(e, '1')}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, '1')}
                        data-beaker="1"
                    >
                        <Beaker solution={labData.beaker1} label="Beaker 1" onPour={() => handlePour(1)} />
                    </div>

                    {/* Reaction Vessel Drop Zone */}
                    <div
                        className={`drop-zone p-4 min-h-[200px] flex flex-col items-center justify-end ${activeDropZone === 'reaction' ? 'drag-over' : ''}`}
                        onDragOver={(e) => handleDragOver(e, 'reaction')}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, 'reaction')}
                        data-beaker="reaction"
                    >
                        <ReactionVessel reactionData={labData.reaction} ph={labData.pH} />
                    </div>

                    {/* Beaker 2 Drop Zone */}
                    <div
                        className={`drop-zone p-4 min-h-[200px] flex flex-col items-center justify-end ${activeDropZone === '2' ? 'drag-over' : ''}`}
                        onDragOver={(e) => handleDragOver(e, '2')}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, '2')}
                        data-beaker="2"
                    >
                        <Beaker solution={labData.beaker2} label="Beaker 2" onPour={() => handlePour(2)} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}