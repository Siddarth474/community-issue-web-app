import {
  Trash2,
  AlertTriangle,
  Droplet,
  LightbulbOff,
  Car,
  ShieldAlert,
  Dog,
  CloudRain,
  CheckCircle, 
  Clock, 
  Hammer,
  MoreHorizontal,
  TrafficCone
} from "lucide-react";


export const status = [
    {name: "open", icon: <Hammer className="w-4 h-4 mr-2 text-orange-500" />},
    {name: "in-progress", icon: <Clock className="w-4 h-4 mr-2 text-yellow-500" />},
    {name: "resolved", icon: <CheckCircle className="w-4 h-4 mr-2 text-green-500" />}
];

export const statusIcons = {
    "open" : <Hammer size={20} />,
    "in-progress" : <Clock size={20}  />,
    "resolved" : <CheckCircle size={20} />
}

export const commonIssues = [
    { name: "Garbage Dump", icon: <Trash2 className="w-4 h-4 mr-2 text-green-600" /> },
    { name: "Pothole / Damaged Road", icon: <TrafficCone className="w-4 h-4 mr-2 text-yellow-600" /> },
    { name: "Electricity Problem", icon: <LightbulbOff className="w-4 h-4 mr-2 text-orange-500" /> },
    { name: "Water Leakage", icon: <Droplet className="w-4 h-4 mr-2 text-blue-500" /> },
    { name: "Broken Drain / Sewer", icon: <AlertTriangle className="w-4 h-4 mr-2 text-red-500" /> },
    { name: "Illegal Parking", icon: <Car className="w-4 h-4 mr-2 text-gray-700" /> },
    { name: "Flooding / Waterlogging", icon: <CloudRain className="w-4 h-4 mr-2 text-sky-600" /> },
    { name: "Animal Menace / Stray Dogs", icon: <Dog className="w-4 h-4 mr-2 text-amber-700" /> },
    { name: "Health / Sanitation Hazard", icon: <ShieldAlert className="w-4 h-4 mr-2 text-rose-600" /> },
    { name: "Other", icon: <MoreHorizontal className="w-4 h-4 mr-2 text-gray-400" /> }
];

export const issueIcons = {
    "Garbage Dump": <Trash2 className="w-4 h-4 mr-2 text-green-600 shrink-0" />,
    "Pothole / Damaged Road": <TrafficCone className="w-4 h-4 mr-2 text-yellow-600 shrink-0" />,
    "Electricity Problem": <LightbulbOff className="w-4 h-4 mr-2 text-orange-500 shrink-0" />,
    "Water Leakage": <Droplet className="w-4 h-4 mr-2 text-blue-500 shrink-0" />,
    "Broken Drain / Sewer": <AlertTriangle className="w-4 h-4 mr-2 text-red-500 shrink-0" />,
    "Illegal Parking": <Car className="w-4 h-4 mr-2 text-gray-600 shrink-0" />,
    "Flooding / Waterlogging": <CloudRain className="w-4 h-4 mr-2 text-sky-600 shrink-0" />,
    "Animal Menace / Stray Dogs": <Dog className="w-4 h-4 mr-2 text-amber-700 shrink-0" />,
    "Health / Sanitation Hazard": <ShieldAlert className="w-4 h-4 mr-2 text-rose-600 shrink-0" />,
    "Other": <MoreHorizontal className="w-4 h-4 mr-2 text-gray-400 shrink-0" />,
};

