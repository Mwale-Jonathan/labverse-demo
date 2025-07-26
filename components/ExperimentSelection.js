import { EXPERIMENTS } from "@/lib/constants";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function ExperimentSelection({ onSelectExperiment }) {
    const experimentIds = Object.keys(EXPERIMENTS);

    const cardColors = {
        "strong-acid-strong-base": "bg-red-50 hover:bg-red-100",
        "weak-acid-strong-base": "bg-green-50 hover:bg-green-100",
        "strong-acid-weak-base": "bg-teal-50 hover:bg-teal-100",
        "indicator-test": "bg-purple-50 hover:bg-purple-100",
    };

    const textColors = {
        "strong-acid-strong-base": "text-red-800",
        "weak-acid-strong-base": "text-green-800",
        "strong-acid-weak-base": "text-teal-800",
        "indicator-test": "text-purple-800",
    }

    return (
        <div className="animate-in fade-in duration-500">
            <div className="glass-card mb-6 text-center">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
                    Modern Chemistry Lab
                </h1>
                <p className="text-lg text-slate-600">Interactive Acid-Base Neutralization Experiments</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="text-center text-2xl">Choose Your Experiment</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {experimentIds.map((id) => (
                            <div
                                key={id}
                                onClick={() => onSelectExperiment(id)}
                                className={`p-4 rounded-xl cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${cardColors[id]}`}
                            >
                                <h3 className={`font-semibold text-lg mb-2 ${textColors[id]}`}>
                                    {EXPERIMENTS[id].title}
                                </h3>
                                <p className={`text-sm opacity-80 ${textColors[id]}`}>
                                    {EXPERIMENTS[id].requiredChemicals.map(c => c === 'phenolphthalein' ? 'Indicator' : c).join(' + ')}
                                </p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}