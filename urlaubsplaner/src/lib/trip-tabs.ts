/**
 * Die Kind-Screens des Trip-Dashboards aus der Sitemap.
 *
 * Das Dashboard ist laut CLAUDE.md der Navigations-Hub des Projekts — deshalb
 * steht die Tab-Struktur hier zentral statt im JSX. Ein neuer Screen wird
 * gebaut und bekommt hier `ready: true`; die Navigation zieht automatisch nach.
 */
export interface TripTab {
  /** Pfadsegment unter /trips/[id] — leer für die Übersicht selbst. */
  segment: string;
  label: string;
  phase: 1 | 2 | 3;
  ready: boolean;
}

export const tripTabs: TripTab[] = [
  { segment: "", label: "Übersicht", phase: 1, ready: true },
  { segment: "ausgaben", label: "Ausgaben", phase: 1, ready: true },
  { segment: "teilnehmer", label: "Teilnehmer", phase: 1, ready: true },
  { segment: "terminplan", label: "Terminplan", phase: 2, ready: false },
  { segment: "packliste", label: "Packliste", phase: 2, ready: false },
  { segment: "tagebuch", label: "Tagebuch", phase: 2, ready: false },
  { segment: "dokumente", label: "Dokumente", phase: 3, ready: false },
];
