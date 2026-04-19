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
}

export const chapters: Chapter[] = [
  { num: 1, title: "Reproduction in Organisms", unit: "Reproduction", tag: "reproduction", marks: "Part of 16", tip: "Focus on asexual vs sexual reproduction types, examples of each. Learn all terminology — gametogenesis, parthenogenesis, sporogenesis.", priority: "high", notesUrl: "#chapter-1-notes" },
  { num: 2, title: "Sexual Reproduction in Flowering Plants", unit: "Reproduction", tag: "reproduction", marks: "~6 marks", tip: "Master the structure of flower, double fertilisation, endosperm types & fruit formation. Draw anther/ovule diagrams from memory.", priority: "high", notesUrl: "/notes/chapter-2-sexual-reproduction-flowering-plants.pdf" },
  { num: 3, title: "Human Reproduction", unit: "Reproduction", tag: "reproduction", marks: "~6 marks", tip: "Study male & female reproductive systems with labelled diagrams. Spermatogenesis vs oogenesis is a recurring 5-mark question. Note: 'Secondary Oocyte' now replaces 'Ovum' regarding the stage of release from the ovary.", priority: "high", notesUrl: "#chapter-3-notes" },
  { num: 4, title: "Reproductive Health", unit: "Reproduction", tag: "reproduction", marks: "~4 marks", tip: "Focus on STDs, contraception methods (MTP, IUD), infertility treatments (IVF, ZIFT, GIFT). Concise 2–3 mark questions.", priority: "med", notesUrl: "#chapter-4-notes" },
  { num: 5, title: "Principles of Inheritance and Variation", unit: "Genetics & Evolution", tag: "genetics", marks: "~8 marks", tip: "Mendelian laws, dihybrid cross, chromosomal theory. Practice all Punnett squares. Linkage, crossing over, and sex determination are high-yield.", priority: "high", notesUrl: "#chapter-5-notes" },
  { num: 6, title: "Molecular Basis of Inheritance", unit: "Genetics & Evolution", tag: "genetics", marks: "~6 marks", tip: "DNA structure, replication, transcription, translation — know every enzyme and its role. Lac operon model is a must-draw diagram.", priority: "high", notesUrl: "#chapter-6-notes" },
  { num: 7, title: "Evolution", unit: "Genetics & Evolution", tag: "genetics", marks: "~4 marks", tip: "Origin of life (universe now officially updated to 13.8 billion years old), Darwin vs Lamarck, industrial melanism, Hardy-Weinberg principle, divergent vs convergent evolution.", priority: "med", notesUrl: "#chapter-7-notes" },
  { num: 8, title: "Human Health and Disease", unit: "Biology & Human Welfare", tag: "welfare", marks: "~5 marks", tip: "Diseases caused by pathogens (malaria cycle — draw it!), immunity types, AIDS, cancer. Typhoid, amoebiasis life cycles are examiners' favourites.", priority: "high", notesUrl: "#chapter-8-notes" },
  { num: 9, title: "Strategies for Enhancement in Food Production", unit: "Biology & Human Welfare", tag: "welfare", marks: "~4 marks", tip: "Plant breeding steps, biofortification, SCP, tissue culture. Animal husbandry basics. Mostly 1–2 mark questions; easy scoring opportunity.", priority: "med", notesUrl: "#chapter-9-notes" },
  { num: 10, title: "Microbes in Human Welfare", unit: "Biology & Human Welfare", tag: "welfare", marks: "~5 marks", tip: "Microbes in food (cheese, bread), industrial products (antibiotics, ethanol), biogas, STP process, biofertilisers. A reliable source of marks.", priority: "med", notesUrl: "#chapter-10-notes" },
  { num: 11, title: "Biotechnology: Principles and Processes", unit: "Biotechnology", tag: "biotech", marks: "~5 marks", tip: "Tools of rDNA technology, PCR steps and diagram, cloning vectors, gel electrophoresis. Restriction enzymes & their nomenclature is always asked.", priority: "high", notesUrl: "#chapter-11-notes" },
  { num: 12, title: "Biotechnology and its Applications", unit: "Biotechnology", tag: "biotech", marks: "~5 marks", tip: "Bt cotton, golden rice, insulin production, GEAC, biopiracy. RNAi mechanism is a modern addition. Learn ethical issues for 2-mark answers.", priority: "med", notesUrl: "#chapter-12-notes" },
  { num: 13, title: "Organisms and Populations", unit: "Ecology & Environment", tag: "ecology", marks: "~4 marks", tip: "Population interactions (all 6 types with examples), logistic vs exponential growth curves, ecological adaptations. Graph interpretation questions common.", priority: "med", notesUrl: "#chapter-13-notes" },
  { num: 14, title: "Ecosystem", unit: "Ecology & Environment", tag: "ecology", marks: "~4 marks", tip: "Energy flow, food chains, trophic levels, ecological pyramids (all 3 types), nutrient cycles (Carbon & Phosphorus). Productivity definitions — memorise all.", priority: "med", notesUrl: "#chapter-14-notes" },
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
