// file: components/Beaker.js
import { CHEMICALS, MAX_BEAKER_VOL } from "@/lib/constants";

export default function Beaker({ solution, label, onPour }) {
    const solutionHeight = solution ? (solution.volume / MAX_BEAKER_VOL) * 100 : 0;
    const solutionColor = solution ? CHEMICALS[solution.id].color : 'transparent';

    return (
        <div className="text-center">
            <div
                className="relative w-[100px] h-[120px] border-4 border-slate-400 border-t-0 rounded-b-[40px] bg-gradient-to-r from-white/10 via-white/40 to-white/10 mx-auto cursor-pointer transition-transform hover:scale-105"
                onClick={onPour}
                title={`Click to pour ${label}`}
            >
                <div
                    className="absolute bottom-0 w-full rounded-b-[36px] transition-all duration-800 ease-in-out"
                    style={{
                        height: `${solutionHeight}%`,
                        backgroundColor: solutionColor
                    }}
                ></div>
            </div>
            <p className="text-sm font-semibold mt-2">{label}</p>
            <p className="text-xs text-slate-600 h-8">
                {solution
                    ? `${solution.volume}mL ${solution.concentration}M ${solution.id}`
                    : "Empty"}
            </p>
        </div>
    );
}