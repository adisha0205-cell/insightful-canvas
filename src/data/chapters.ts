export type Priority = "high" | "med" | "std";
export type UnitTag = "reproduction" | "genetics" | "welfare" | "biotech" | "ecology";

export interface Chapter {
  num: number;
  title: string;
  unit: string;
  tag: UnitTag;
  marks: string;
  tip: string;
  priority: Priority;
  /** Editable: replace with real Google Doc / PDF / Notion URL when ready. */
  notesUrl: string;
  /** Optional additional notes (supplementary PDFs, schematics, etc.) */
  extraNotes?: { label: string; url: string }[];
}

export const chapters: Chapter[] = [
  { num: 1, title: "Reproduction in Organisms", unit: "Reproduction", tag: "reproduction", marks: "Part of 16", tip: "Focus on asexual vs sexual reproduction types, examples of each. Learn all terminology — gametogenesis, parthenogenesis, sporogenesis.", priority: "high", notesUrl: "/notes/chapter-1-reproduction-in-organisms.pdf" },
  { num: 2, title: "Sexual Reproduction in Flowering Plants", unit: "Reproduction", tag: "reproduction", marks: "~6 marks", tip: "Master the structure of flower, double fertilisation, endosperm types & fruit formation. Draw anther/ovule diagrams from memory.", priority: "high", notesUrl: "/notes/chapter-2-sexual-reproduction-flowering-plants.pdf", extraNotes: [{ label: "Angiosperm Schematic", url: "/notes/chapter-2-angiosperm-schematic.pdf" }] },
  { num: 3, title: "Human Reproduction", unit: "Reproduction", tag: "reproduction", marks: "~6 marks", tip: "Study male & female reproductive systems with labelled diagrams. Spermatogenesis vs oogenesis is a recurring 5-mark question. Note: 'Secondary Oocyte' now replaces 'Ovum' regarding the stage of release from the ovary.", priority: "high", notesUrl: "/notes/chapter-3-human-reproduction.pdf", extraNotes: [{ label: "Stages of Reproduction (Visual)", url: "/notes/chapter-3-reproduction-stages.png" }, { label: "Comprehensive Class XII Study Guide", url: "/notes/chapter-3-comprehensive-study-guide.pdf" }] },
  { num: 4, title: "Reproductive Health", unit: "Reproduction", tag: "reproduction", marks: "~4 marks", tip: "Focus on STDs, contraception methods (MTP, IUD), infertility treatments (IVF, ZIFT, GIFT). Concise 2–3 mark questions.", priority: "med", notesUrl: "/notes/chapter-4-reproductive-health.pdf", extraNotes: [{ label: "Comprehensive Study Guide", url: "/notes/chapter-4-comprehensive-study-guide.pdf" }, { label: "Contraception & ART Visual Guide", url: "/notes/chapter-4-contraception-art-guide.png" }] },
  { num: 5, title: "Principles of Inheritance and Variation", unit: "Genetics & Evolution", tag: "genetics", marks: "~8 marks", tip: "Mendelian laws, dihybrid cross, chromosomal theory. Practice all Punnett squares. Linkage, crossing over, and sex determination are high-yield.", priority: "high", notesUrl: "/notes/chapter-5-principles-of-inheritance.pdf", extraNotes: [{ label: "Comprehensive Study Guide", url: "/notes/chapter-5-comprehensive-study-guide.pdf" }, { label: "Chromosomal Basis Visual Guide", url: "/notes/chapter-5-chromosomal-basis-visual.png" }] },
  { num: 6, title: "Molecular Basis of Inheritance", unit: "Genetics & Evolution", tag: "genetics", marks: "~6 marks", tip: "DNA structure, replication, transcription, translation — know every enzyme and its role. Lac operon model is a must-draw diagram.", priority: "high", notesUrl: "/notes/chapter-6-molecular-basis-inheritance.pdf", extraNotes: [{ label: "Comprehensive Study Guide", url: "/notes/chapter-6-comprehensive-study-guide.pdf" }, { label: "Molecular Basis Visual Guide", url: "/notes/chapter-6-molecular-basis-visual.png" }] },
  { num: 7, title: "Evolution", unit: "Genetics & Evolution", tag: "genetics", marks: "~4 marks", tip: "Origin of life (universe now officially updated to 13.8 billion years old), Darwin vs Lamarck, industrial melanism, Hardy-Weinberg principle, divergent vs convergent evolution.", priority: "med", notesUrl: "/notes/chapter-7-evolution.pdf", extraNotes: [{ label: "The Tree of Time", url: "/notes/chapter-7-tree-of-time.pdf" }, { label: "Grand Timeline of Life Visual", url: "/notes/chapter-7-grand-timeline.png" }] },
  { num: 8, title: "Human Health and Disease", unit: "Biology & Human Welfare", tag: "welfare", marks: "~5 marks", tip: "Diseases caused by pathogens (malaria cycle — draw it!), immunity types, AIDS, cancer. Typhoid, amoebiasis life cycles are examiners' favourites.", priority: "high", notesUrl: "/notes/chapter-8-human-health-disease.pdf", extraNotes: [{ label: "Comprehensive Study Guide", url: "/notes/chapter-8-comprehensive-study-guide.pdf" }, { label: "Immunity & Pathogens Visual Guide", url: "/notes/chapter-8-immunity-pathogens-visual.png" }] },
  { num: 9, title: "Strategies for Enhancement in Food Production", unit: "Biology & Human Welfare", tag: "welfare", marks: "~4 marks", tip: "Plant breeding steps, biofortification, SCP, tissue culture. Animal husbandry basics. Mostly 1–2 mark questions; easy scoring opportunity.", priority: "med", notesUrl: "/notes/chapter-9-food-production.pdf", extraNotes: [{ label: "Comprehensive Study Guide", url: "/notes/chapter-9-comprehensive-study-guide.pdf" }, { label: "Food Strategies Visual Guide", url: "/notes/chapter-9-food-strategies-visual.png" }] },
  { num: 10, title: "Microbes in Human Welfare", unit: "Biology & Human Welfare", tag: "welfare", marks: "~5 marks", tip: "Microbes in food (cheese, bread), industrial products (antibiotics, ethanol), biogas, STP process, biofertilisers. A reliable source of marks.", priority: "med", notesUrl: "/notes/chapter-10-microbes-human-welfare.pdf", extraNotes: [{ label: "Comprehensive Study Guide", url: "/notes/chapter-10-comprehensive-study-guide.pdf" }, { label: "Microbes Visual Guide", url: "/notes/chapter-10-microbes-visual.png" }] },
  { num: 11, title: "Biotechnology: Principles and Processes", unit: "Biotechnology", tag: "biotech", marks: "~5 marks", tip: "Tools of rDNA technology, PCR steps and diagram, cloning vectors, gel electrophoresis. Restriction enzymes & their nomenclature is always asked.", priority: "high", notesUrl: "/notes/chapter-11-biotechnology-principles.pdf", extraNotes: [{ label: "Comprehensive Study Guide", url: "/notes/chapter-11-comprehensive-study-guide.pdf" }, { label: "Biotech Visual Guide", url: "/notes/chapter-11-biotech-visual.png" }] },
  { num: 12, title: "Biotechnology and its Applications", unit: "Biotechnology", tag: "biotech", marks: "~5 marks", tip: "Bt cotton, golden rice, insulin production, GEAC, biopiracy. RNAi mechanism is a modern addition. Learn ethical issues for 2-mark answers.", priority: "med", notesUrl: "/notes/chapter-12-biotechnology-applications.pdf", extraNotes: [{ label: "Biotech Applications Visual Guide", url: "/notes/chapter-12-biotech-applications-visual.png" }] },
  { num: 13, title: "Organisms and Populations", unit: "Ecology & Environment", tag: "ecology", marks: "~4 marks", tip: "Population interactions (all 6 types with examples), logistic vs exponential growth curves, ecological adaptations. Graph interpretation questions common.", priority: "med", notesUrl: "/notes/chapter-13-organisms-populations.pdf", extraNotes: [{ label: "The Living Blueprint", url: "/notes/chapter-13-living-blueprint.pdf" }, { label: "Ecology Essentials Visual Guide", url: "/notes/chapter-13-ecology-essentials.png" }] },
  { num: 14, title: "Ecosystem", unit: "Ecology & Environment", tag: "ecology", marks: "~4 marks", tip: "Energy flow, food chains, trophic levels, ecological pyramids (all 3 types), nutrient cycles (Carbon & Phosphorus). Productivity definitions — memorise all.", priority: "med", notesUrl: "/notes/chapter-14-ecosystem.pdf", extraNotes: [{ label: "Mechanics of Life Visual Guide", url: "/notes/chapter-14-mechanics-of-life.png" }] },
  { num: 15, title: "Biodiversity and Conservation", unit: "Ecology & Environment", tag: "ecology", marks: "~2 marks", tip: "Types of biodiversity, hotspots (India's 4 hotspots), IUCN categories, ex-situ vs in-situ conservation methods. Mostly 1–2 mark questions.", priority: "std", notesUrl: "#chapter-15-notes" },
  { num: 16, title: "Environmental Issues", unit: "Ecology & Environment", tag: "ecology", marks: "~2 marks", tip: "Pollution types, global warming, ozone depletion, biomagnification examples, e-waste. Montreal Protocol, Kyoto Protocol — remember the agreements.", priority: "std", notesUrl: "#chapter-16-notes" },
];

export const filterOptions: { label: string; value: "all" | UnitTag }[] = [
  { label: "All Chapters", value: "all" },
  { label: "Reproduction", value: "reproduction" },
  { label: "Genetics & Evolution", value: "genetics" },
  { label: "Human Welfare", value: "welfare" },
  { label: "Biotechnology", value: "biotech" },
  { label: "Ecology", value: "ecology" },
];

export const priorityStyles: Record<Priority, { bg: string; text: string; label: string }> = {
  high: { bg: "bg-danger-soft", text: "text-danger", label: "Must Do" },
  med:  { bg: "bg-amber-soft",  text: "text-amber",  label: "Important" },
  std:  { bg: "bg-primary-soft",text: "text-primary",label: "Standard" },
};
