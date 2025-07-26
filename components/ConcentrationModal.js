// file: components/ConcentrationModal.js
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CHEMICALS, MAX_BEAKER_VOL, MAX_REACTION_VOL } from '@/lib/constants';

export default function ConcentrationModal({ isOpen, onClose, chemicalId, beakerId, setLabData, logObservation }) {
    const [concentration, setConcentration] = useState("1.0");
    const [volume, setVolume] = useState("50");

    const chemical = chemicalId ? CHEMICALS[chemicalId] : null;

    // Reset fields when a new chemical is selected
    useEffect(() => {
        setConcentration("1.0");
        setVolume("50");
    }, [chemicalId]);

    const addIndicator = () => {
        setLabData(prev => {
            if (prev.reaction.hasIndicator) {
                logObservation("Indicator has already been added.", "orange");
                return prev;
            }
            logObservation("Phenolphthalein indicator added to the reaction vessel.");
            return {
                ...prev,
                reaction: { ...prev.reaction, hasIndicator: true }
            }
        });
        onClose();
    }

    const handleConfirm = () => {
        if (chemical.type === 'indicator') {
            addIndicator();
            return;
        }

        const conc = parseFloat(concentration);
        const vol = parseFloat(volume);

        if (isNaN(conc) || conc <= 0 || isNaN(vol) || vol <= 0) {
            alert("Please enter valid, positive numbers for concentration and volume.");
            return;
        }

        const maxVol = beakerId === "reaction" ? MAX_REACTION_VOL : MAX_BEAKER_VOL;
        if (vol > maxVol) {
            alert(`Volume for this vessel cannot exceed ${maxVol} mL.`);
            return;
        }

        const newChemical = {
            id: chemicalId,
            concentration: conc,
            volume: vol,
            moles: conc * (vol / 1000),
        };

        setLabData(prevData => {
            const targetBeaker = beakerId === "reaction" ? "reaction" : `beaker${beakerId}`;
            if (targetBeaker === 'reaction') {
                return {
                    ...prevData,
                    reaction: {
                        ...prevData.reaction,
                        chemicals: [...prevData.reaction.chemicals, newChemical],
                        volume: prevData.reaction.volume + vol,
                    }
                }
            }
            return { ...prevData, [targetBeaker]: newChemical };
        });

        logObservation(`${vol}mL of ${conc}M ${chemicalId} added to ${beakerId === 'reaction' ? 'Reaction Vessel' : 'Beaker ' + beakerId}.`);
        onClose();
    };

    if (!chemical) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Set Solution Properties</DialogTitle>
                    <DialogDescription>
                        Configure the properties for <span className="font-bold text-primary">{chemical.name}</span>.
                    </DialogDescription>
                </DialogHeader>
                {chemical.type !== 'indicator' ? (
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="concentration" className="text-right">Concentration (M)</Label>
                            <Input
                                id="concentration"
                                type="number"
                                value={concentration}
                                onChange={(e) => setConcentration(e.target.value)}
                                min="0.01" max="5.0" step="0.01"
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="volume" className="text-right">Volume (mL)</Label>
                            <Input
                                id="volume"
                                type="number"
                                value={volume}
                                onChange={(e) => setVolume(e.target.value)}
                                min="1" max="100" step="1"
                                className="col-span-3"
                            />
                        </div>
                    </div>
                ) : (
                    <p className="py-4 text-center">Add a few drops of indicator to the reaction vessel.</p>
                )}
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleConfirm}>Confirm</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}