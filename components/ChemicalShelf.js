import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { EXPERIMENTS, CHEMICALS } from "@/lib/constants";

const ChemicalBottle = ({ chemicalId }) => {
    const chem = CHEMICALS[chemicalId];
    return (
        <div className="text-center">
            <div
                className="chemical-bottle relative w-[55px] h-[75px] border-4 border-slate-500 rounded-lg mx-auto bg-gradient-to-r from-white/20 via-white/60 to-white/20 cursor-grab active:cursor-grabbing transition-transform hover:scale-110"
                draggable="true"
                onDragStart={(e) => {
                    e.dataTransfer.setData("chemicalId", chemicalId);
                }}
            >
                <div className="absolute inset-0 top-[-10px] left-1/2 -translate-x-1/2 w-6 h-[7px] bg-slate-700 rounded-t-sm"></div>
                <div className="absolute bottom-0 w-full h-[70%] rounded-b-sm" style={{ backgroundColor: chem.color.replace('0.5', '0.2') }}></div>
            </div>
            <label className="text-xs font-medium mt-1 block">{chemicalId}</label>
        </div>
    );
};

export default function ChemicalShelf({ experimentId }) {
    const required = EXPERIMENTS[experimentId].requiredChemicals;
    const grouped = { acid: [], base: [], indicator: [] };
    required.forEach((id) => {
        const type = CHEMICALS[id].type;
        if (grouped[type]) grouped[type].push(id);
    });

    return (
        <Card className="border-0 shadow-none bg-background">
            <CardHeader>
                <CardTitle className="text-center text-lg">Chemicals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {grouped.acid.length > 0 && (
                    <div>
                        <h3 className="text-md font-medium mb-3 text-center text-red-700">Acids</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {grouped.acid.map(id => <ChemicalBottle key={id} chemicalId={id} />)}
                        </div>
                    </div>
                )}
                {grouped.base.length > 0 && (
                    <div>
                        <h3 className="text-md font-medium mb-3 text-center text-blue-700">Bases</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {grouped.base.map(id => <ChemicalBottle key={id} chemicalId={id} />)}
                        </div>
                    </div>
                )}
                {grouped.indicator.length > 0 && (
                    <div>
                        <h3 className="text-md font-medium mb-3 text-center text-purple-700">Indicators</h3>
                        <div className="flex justify-center">
                            {grouped.indicator.map(id => <ChemicalBottle key={id} chemicalId={id} />)}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}