import type { ChartConfig } from "@/components/ui/chart";

export const app1User = {
  name: "Sarah Al-Ghamdi",
  initials: "SG",
  email: "s.ghamdi@assetflow.io",
  avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
};

export const app1ChartConfig = {
  opened: {
    label: "Opened Issues",
    color: "#1d68bd", // AssetFlow Deep Blue
  },
  completed: {
    label: "Resolved Work Orders",
    color: "#2eaf7d", // AssetFlow Emerald
  },
} satisfies ChartConfig;

export const app1Chart = [
  { week: "W1", opened: 42, completed: 38 },
  { week: "W2", opened: 36, completed: 44 },
  { week: "W3", opened: 51, completed: 49 },
  { week: "W4", opened: 29, completed: 35 },
  { week: "W5", opened: 45, completed: 52 },
  { week: "W6", opened: 38, completed: 46 },
  { week: "W7", opened: 55, completed: 58 },
  { week: "W8", opened: 32, completed: 48 },
];

export const app1Projects = [
  {
    id: "proj-1",
    name: "Desalination Pump Grid #04 Overhaul",
    status: "In progress" as const,
    description: "Predictive bearing replacement & SCADA vibration recalibration.",
    progress: 74,
    dueDate: "Tomorrow, 14:00",
    team: [
      {
        name: "Omar Tariq",
        initials: "OT",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      },
      {
        name: "Khaled Mansour",
        initials: "KM",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      },
    ],
  },
  {
    id: "proj-2",
    name: "ICU Medical Oxygen Dual Pipeline Safety",
    status: "In progress" as const,
    description: "Redundant cryogenic valve sensor telemetry certification.",
    progress: 92,
    dueDate: "Oct 18, 2026",
    team: [
      {
        name: "Lina Hadad",
        initials: "LH",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80",
      },
      {
        name: "Rayan Fawzi",
        initials: "RF",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
      },
    ],
  },
  {
    id: "proj-3",
    name: "Standby 1200kVA Turbine Generator Sync",
    status: "In review" as const,
    description: "Automatic transfer switch load testing & diesel filtration check.",
    progress: 58,
    dueDate: "Oct 22, 2026",
    team: [
      {
        name: "Tariq Ziyad",
        initials: "TZ",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
      },
    ],
  },
  {
    id: "proj-4",
    name: "Cleanroom HVAC Filter Pressure Sensors",
    status: "Planning" as const,
    description: "HEPA differential pressure differential telemetry migration.",
    progress: 25,
    dueDate: "Nov 02, 2026",
    team: [
      {
        name: "Nour Salem",
        initials: "NS",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
      },
    ],
  },
];

export const app1Activity = [
  {
    id: "act-1",
    person: {
      name: "Omar Tariq",
      initials: "OT",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    },
    action: "completed work order #WO-8910 (Vibration damping recalibrated on Desalination Pump #04)",
    time: "8 minutes ago",
  },
  {
    id: "act-2",
    person: {
      name: "AssetFlow AI Engine",
      initials: "AI",
      avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    },
    action: "flagged temperature threshold spike on Generator Unit #02 (Bearing B)",
    time: "24 minutes ago",
  },
  {
    id: "act-3",
    person: {
      name: "Lina Hadad",
      initials: "LH",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80",
    },
    action: "certified Oxygen cryogenic pressure valve #OX-03 as 100% compliant",
    time: "1 hour ago",
  },
  {
    id: "act-4",
    person: {
      name: "Khaled Mansour",
      initials: "KM",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    },
    action: "logged 12 replacement O-rings into Critical Spare Parts Registry",
    time: "2 hours ago",
  },
];
