export const CHEMICALS = {
    HCl: { name: "Hydrochloric Acid", type: "acid", strength: "strong", pKa: -6.3, color: "rgba(239, 68, 68, 0.5)" },
    CH3COOH: { name: "Acetic Acid", type: "acid", strength: "weak", pKa: 4.76, color: "rgba(245, 158, 11, 0.5)" },
    NaOH: { name: "Sodium Hydroxide", type: "base", strength: "strong", pKb: -0.7, color: "rgba(59, 130, 246, 0.5)" },
    NH3: { name: "Ammonia", type: "base", strength: "weak", pKb: 4.75, color: "rgba(74, 222, 128, 0.5)" },
    phenolphthalein: { name: "Phenolphthalein", type: "indicator", color: "rgba(168, 85, 247, 0.2)" },
};

export const EXPERIMENTS = {
    "strong-acid-strong-base": { title: "Strong Acid + Strong Base", requiredChemicals: ["HCl", "NaOH"] },
    "weak-acid-strong-base": { title: "Weak Acid + Strong Base", requiredChemicals: ["CH3COOH", "NaOH"] },
    "strong-acid-weak-base": { title: "Strong Acid + Weak Base", requiredChemicals: ["HCl", "NH3"] },
    "indicator-test": { title: "Indicator Testing", requiredChemicals: ["HCl", "NaOH", "phenolphthalein"] },
};

export const QUIZ_DATA = {
    "strong-acid-strong-base": [
        { question: "When equal moles of a strong acid (HCl) and a strong base (NaOH) are mixed, what is the approximate pH at the equivalence point?", options: ["Less than 7", "Exactly 7", "Greater than 7"], correctAnswer: "Exactly 7", explanation: "The reaction between a strong acid and a strong base produces a neutral salt (NaCl) and water, resulting in a pH of 7.0 at 25°C." },
        { question: "The neutralization reaction between HCl and NaOH is exothermic. What does this mean?", options: ["It absorbs heat.", "It releases heat.", "It has no temperature change."], correctAnswer: "It releases heat.", explanation: "Exothermic reactions release energy, usually as heat, causing the temperature of the solution to increase." },
    ],
    "weak-acid-strong-base": [
        { question: "In the titration of a weak acid (CH₃COOH) with a strong base (NaOH), what is the pH at the equivalence point?", options: ["Less than 7", "Exactly 7", "Greater than 7"], correctAnswer: "Greater than 7", explanation: "At the equivalence point, all the weak acid has been converted to its conjugate base (CH₃COO⁻), which is basic and hydrolyzes water to produce OH⁻ ions, making the solution's pH greater than 7." },
        { question: "At the half-equivalence point (when half the weak acid has been neutralized), what is the relationship between pH and pKa?", options: ["pH > pKa", "pH < pKa", "pH = pKa"], correctAnswer: "pH = pKa", explanation: "According to the Henderson-Hasselbalch equation, at the half-equivalence point, the concentrations of the weak acid and its conjugate base are equal, so pH = pKa." },
    ],
    "strong-acid-weak-base": [
        { question: "When titrating a weak base (NH₃) with a strong acid (HCl), what is the expected pH at the equivalence point?", options: ["Less than 7", "Exactly 7", "Greater than 7"], correctAnswer: "Less than 7", explanation: "At the equivalence point, the weak base has been fully converted to its conjugate acid (NH₄⁺). This conjugate acid is acidic, resulting in a solution pH below 7." },
        { question: "What is the primary chemical species in the beaker at the equivalence point when NH₃ is titrated with HCl?", options: ["NH₃ and Cl⁻", "NH₄⁺ and Cl⁻", "H⁺ and OH⁻"], correctAnswer: "NH₄⁺ and Cl⁻", explanation: "The neutralization reaction produces ammonium (NH₄⁺), the conjugate acid of ammonia, and chloride (Cl⁻) ions." },
    ],
    "indicator-test": [
        { question: "In which type of solution does phenolphthalein indicator turn pink?", options: ["Acidic (pH < 7)", "Neutral (pH = 7)", "Basic (pH > 8.2)"], correctAnswer: "Basic (pH > 8.2)", explanation: "Phenolphthalein is colorless in acidic and neutral solutions but turns a vibrant pink/fuchsia in basic solutions with a pH above approximately 8.2." },
        { question: "Why is an indicator useful in a titration?", options: ["It speeds up the reaction.", "It provides a visual signal of the endpoint.", "It increases the temperature."], correctAnswer: "It provides a visual signal of the endpoint.", explanation: "The sharp color change of an indicator signals that the reaction has reached its equivalence point (or endpoint), allowing for precise measurement." },
    ],
};

export const INITIAL_TEMP = 25.0;
export const ENTHALPY_NEUTRALIZATION = -57100;
export const WATER_SPECIFIC_HEAT = 4.184;
export const MAX_BEAKER_VOL = 100;
export const MAX_REACTION_VOL = 200;