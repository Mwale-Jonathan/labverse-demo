// file: components/ReactionVessel.js
import { CHEMICALS, MAX_REACTION_VOL } from "@/lib/constants";

export default function ReactionVessel({ reactionData, ph }) {
    const solutionHeight = reactionData.volume > 0 ? (reactionData.volume / MAX_REACTION_VOL) * 100 : 0;

    const getSolutionColor = () => {
        if (reactionData.volume === 0) return 'transparent';
        if (reactionData.hasIndicator) {
            return ph > 8.2 ? 'rgba(219, 39, 119, 0.6)' : 'rgba(255, 255, 255, 0.1)';
        }
        if (reactionData.chemicals.length > 1) {
            return 'rgba(203, 213, 225, 0.5)'; // Neutral mixed color
        }
        if (reactionData.chemicals.length === 1) {
            return CHEMICALS[reactionData.chemicals[0].id].color;
        }
        return 'transparent';
    };

    return (
        <div className="text-center">
            <div className="relative w-[120px] h-[150px] border-4 border-slate-500 border-t-0 rounded-b-[50px] bg-gradient-to-r from-white/10 via-white/40 to-white/10 mx-auto">
                <div
                    className="absolute bottom-0 w-full rounded-b-[46px] transition-all duration-800 ease-in-out"
                    style={{
                        height: `${solutionHeight}%`,
                        '--solution-color': getSolutionColor(),
                        background: 'var(--solution-color)'
                    }}
                ></div>
            </div>
            <p className="text-sm font-semibold mt-2">Reaction Vessel</p>
            <p className="text-xs text-slate-600 h-8">
                {reactionData.volume > 0
                    ? `Vol: ${reactionData.volume}mL | pH: ${ph.toFixed(2)}`
                    : "Ready for mixing"}
            </p>
        </div>
    );
}