// file: components/Sidebar.js
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import ChemicalShelf from "./ChemicalShelf";

// A small component to mimic the sliders in the reference image
function StatusDisplay({ label, value, unit, max }) {
    const percentage = (value / max) * 100;
    return (
        <div>
            <div className="flex justify-between text-sm mb-1">
                <Label>{label}</Label>
                <span>{value.toFixed(2)} {unit}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
}

export default function Sidebar({ experimentId, labData, logs }) {
    return (
        <aside className="h-full space-y-2 overflow-y-auto p-1 pr-2">
            <Card>
                <CardHeader>
                    <CardTitle>Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <StatusDisplay label="pH Level" value={labData.pH} unit="" max={14} />
                    <StatusDisplay label="Temperature" value={labData.temperature} unit="°C" max={100} />
                </CardContent>
            </Card>

            <ChemicalShelf experimentId={experimentId} />

            {/* <Card>
                <CardHeader>
                    <CardTitle>Observation Log</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-sm space-y-2 h-48 overflow-y-auto p-2 bg-muted rounded-md">
                        {logs.map((log, index) => <p key={index} className="text-muted-foreground">{log}</p>)}
                    </div>
                </CardContent>
            </Card> */}
        </aside>
    );
}