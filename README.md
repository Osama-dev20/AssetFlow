Core Architectural Modules & Functional Interfaces
1. Public Landing Page
Announcement Ticker: Dynamic, moving ticker highlighting major system updates and release notes.

Navigation Mega Menu: Structured multi-column dropdown designed for seamless exploration of platform capabilities.

Interactive Hero Section: High-fidelity dashboard interface mockup demonstrating live operational data.

Priority Formula Calculator: Interactive simulation tool allowing visitors to adjust weighting sliders and instantly observe dynamic priority score recalibrations.

Critical Sector Showcase: Dedicated architectural breakdowns for water utilities, hospitals, and heavy industrial facilities.

2. Authentication & Demo Personas
Quick Access Portal: One-click role impersonation allowing instant login as an Organization Administrator (Tariq Nabulsi) or Senior Mechanical Technician (Ahmad Khalil).

Secure Recovery Flow: Streamlined password recovery mechanism with automated confirmation feedback.

Multi-Step Onboarding: Two-phase corporate registration workflow (facility profile followed by supervisor credentials) enhanced with celebratory visual feedback.

3. Executive Dashboard
Critical Service Banner: Real-time emergency alert banner tracking compromised vital services with direct deep-linking to active work orders.

Key Performance Indicators (KPIs): Core metric cards measuring operational assets, stable services, open work orders, and preventive maintenance compliance via dynamic progress bars.

Attention Matrix: Prioritized degradation queue visualized through conic gradient progress rings.

Live Pulse Indicators: Continuous heartbeat telemetry monitoring critical infrastructure health alongside geographical asset mapping.

4. Intelligent Asset Registry
Multi-Parameter Search: Instantaneous filtering by asset identification code, nomenclature, or facility designation.

Advanced State Filtering: Granular sorting capabilities based on operational status (active, under maintenance, decommissioned) and physical location.

Dual View Modes: Seamless toggling between structured tabular layouts and high-density card grids.

Multi-Step Provisioning Drawer: Guided 3-step asset registration wizard featuring real-time validation, critical service mapping, and standby asset assignment.

5. Asset Detail & Engineering Specifications
Technical Header Card: High-level specification summary featuring core reliability metrics including Mean Time Between Failures (MTBF), Mean Time to Repair (MTTR), and cumulative operating hours.

Tabular Modular Analytics:

Overview: Motor specifications, capacity metrics, warranty status, and associated critical services.

Maintenance History: Chronological audit trail of all prior work orders.

Spare Parts & Inventory: Compatible component inventory tracking with direct requisition workflows.

Field QR Code Generator: Dedicated utility modal for instant printing and deployment of field asset identification labels.

6. Work Orders & Priority Kanban Board
Interactive Kanban Workflow: Four-stage operational board (New, In Progress, Awaiting Parts, Completed) supporting instant drag-and-drop status updates.

Explainable Priority Modal: Transparent algorithmic breakdown triggered upon selecting any priority score, detailing quantitative impact factors:

Critical service disruption impact (+40)

Absence of redundant backup (+25)

Service Level Agreement (SLA) breach delay (+12)

Historical failure recurrence frequency (+9)

Work Order Dispatch Drawer: Rapid creation and technician assignment interface.

7. Critical Services Matrix & Failure Simulator
Interactive Vital Mapping: Geographical and topological layout of critical services (potable water, medical oxygen, emergency power, fire suppression) with real-time hourly downtime cost estimation.

Emergency Scenario Simulator: Interactive stress-testing tool enabling operators to simulate component failures (pumps, generators) to calculate operational impact propagation speeds across the facility.

8. Preventive Maintenance Management
Recurring Schedule Matrix: Structured cyclical maintenance timelines (weekly, monthly, quarterly).

Interactive Execution Checklists: Step-by-step digital verification lists guiding technicians through systematic inspection protocols with automated progress tracking.

9. Sites & Facilities Management
Facility Topology Cards: Comprehensive overview of geographical sites, asset distributions, and individual facility operational statuses.

Dynamic Provisioning Modal: Streamlined dialog for commissioning new operational sites or sub-stations.

10. Team Roles & Access Control
Personnel Directory: Engineer and technician profiles detailing institutional specializations and live connectivity states.

Role-Based Access Control (RBAC): Granular permission matrix tailored for Administrators, Operations Managers, Technicians, and Reporters.

Invitation Protocol: Secure member onboarding workflow featuring automated credential verification and token generation.

11. Advanced Analytics & Reporting
Temporal Flex-Reporting: Instantaneous switching between 90-day rolling windows and full annual compliance cycles.

SLA Compliance Tracking: Operational readiness scoring and SLA adherence analytics (maintaining a 94% benchmark).

Enterprise Export Suite: One-click generation and export of standardized CSV and PDF compliance reports.

12. System Settings & Priority Customization
Dynamic Weight Sliders: Real-time configuration parameters allowing administrators to tune priority scoring algorithms with instant interface previews.

SLA Threshold Configuration: Customizable minute and hour-based response thresholds.

Localization & Preferences: Facility profile management, currency selectors, and notification routing rules.

13. System Audit Log
Chronological Traceability: Tamper-evident, timestamped event log tracking every system modification and administrative action, filterable by functional category.

14. Command Palette Utility
Global Navigation: Universal keyboard shortcut (Ctrl + K) enabling rapid, fuzzy-searched access to any asset, work order, or platform module from anywhere in the system.

Enterprise Technology Stack
Core Framework: React 19

Type Safety: TypeScript

Build System: Vite

Styling Architecture: Tailwind CSS v4 (@tailwindcss/vite)

Iconography: Lucide Icons

Visual Effects: Canvas Confetti

Typography: Google Fonts (IBM Plex Sans Arabic & IBM Plex Mono)

Persistence Layer: Local Storage State Persistence