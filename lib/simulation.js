import { CHEMICALS, INITIAL_TEMP, ENTHALPY_NEUTRALIZATION, WATER_SPECIFIC_HEAT } from './constants';

export function calculateSingleSolutionPH(chemical) {
    if (!chemical) return 7.0;
    const info = CHEMICALS[chemical.id];
    const C = chemical.concentration;
    if (info.type === "acid") {
        if (info.strength === "strong") return -Math.log10(C);
        return 0.5 * (info.pKa - Math.log10(C));
    } else { // base
        if (info.strength === "strong") return 14 + Math.log10(C);
        const pKb = info.pKb;
        return 14 - 0.5 * (pKb - Math.log10(C));
    }
}

export function calculateFinalState(reactionData) {
    const acids = reactionData.chemicals.filter((c) => CHEMICALS[c.id].type === "acid");
    const bases = reactionData.chemicals.filter((c) => CHEMICALS[c.id].type === "base");
    const totalVolumeL = reactionData.volume / 1000;

    if (totalVolumeL === 0) {
        return { pH: 7.0, temperature: INITIAL_TEMP };
    }

    // --- Temperature Calculation ---
    const totalAcidMoles = acids.reduce((sum, a) => sum + a.moles, 0);
    const totalBaseMoles = bases.reduce((sum, b) => sum + b.moles, 0);
    const molesReacted = Math.min(totalAcidMoles, totalBaseMoles);
    let newTemperature = INITIAL_TEMP;

    if (molesReacted > 0) {
        const heatGenerated = molesReacted * ENTHALPY_NEUTRALIZATION * -1;
        const solutionMass = reactionData.volume; // Assuming density of 1g/mL
        const tempChange = heatGenerated / (solutionMass * WATER_SPECIFIC_HEAT);
        newTemperature = INITIAL_TEMP + tempChange;
    }

    // --- pH Calculation ---
    if (acids.length === 0 && bases.length === 0) {
        return { pH: 7.0, temperature: newTemperature };
    }
    if (acids.length > 0 && bases.length === 0) {
        return { pH: calculateSingleSolutionPH(acids[0]), temperature: newTemperature };
    }
    if (bases.length > 0 && acids.length === 0) {
        return { pH: calculateSingleSolutionPH(bases[0]), temperature: newTemperature };
    }

    const acid = acids[0];
    const base = bases[0];
    const acidInfo = CHEMICALS[acid.id];
    const baseInfo = CHEMICALS[base.id];
    let newPH = 7.0;

    if (acidInfo.strength === "strong" && baseInfo.strength === "strong") {
        const excessMoles = totalAcidMoles - totalBaseMoles;
        if (Math.abs(excessMoles) < 1e-9) newPH = 7.0;
        else if (excessMoles > 0) newPH = -Math.log10(excessMoles / totalVolumeL);
        else newPH = 14 + Math.log10(-excessMoles / totalVolumeL);
    } else if (acidInfo.strength === "weak" && baseInfo.strength === "strong") {
        const molesHA = totalAcidMoles - totalBaseMoles; // Remaining weak acid
        const molesA_ = totalBaseMoles; // Formed conjugate base
        if (molesHA > 0) { // Buffer region or before equivalence
            newPH = acidInfo.pKa + Math.log10(molesA_ / molesHA);
        } else { // Equivalence point or excess strong base
            newPH = 14 + Math.log10(Math.abs(molesHA) / totalVolumeL);
        }
    } else if (acidInfo.strength === "strong" && baseInfo.strength === "weak") {
        const pKa_conj = 14 - baseInfo.pKb;
        const molesH_excess = totalAcidMoles - totalBaseMoles;
        if (molesH_excess > 0) { // Excess strong acid
            newPH = -Math.log10(molesH_excess / totalVolumeL);
        } else {
            const molesB = totalBaseMoles - totalAcidMoles; // Remaining weak base
            const molesBH_ = totalAcidMoles; // Formed conjugate acid
            if (molesB < 1e-9) { // Equivalence point
                const concBH_ = molesBH_ / totalVolumeL;
                newPH = 0.5 * (pKa_conj - Math.log10(concBH_));
            } else { // Buffer region
                newPH = pKa_conj + Math.log10(molesB / molesBH_);
            }
        }
    } else {
        newPH = 7.0; // Weak acid + weak base, simplified to neutral
    }

    return { pH: newPH, temperature: newTemperature };
}