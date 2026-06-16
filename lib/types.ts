export interface MCQOption {
  label: string; // "A", "B", "C", "D"
  text: string;
}

export interface MCQExplanation {
  correct: string;
  incorrect: string[]; // index matches options array (skip correct index)
}

export type ImageType =
  | "chest-xray"
  | "ecg"
  | "brain-ct"
  | "hand-xray"
  | "knee-xray"
  | "abdominal-xray"
  | "thyroid-scan"
  | "histology"
  | "fundoscopy"
  | "urine-dipstick"
  | "mri-knee"
  | "peripheral-smear";

export interface MCQImage {
  type: ImageType;
  caption: string;
  finding?: string; // highlighted finding to describe
}

export interface MCQ {
  id: string;
  caseStudy: string;
  image: MCQImage;
  options: MCQOption[];
  correctIndex: number; // 0-based index into options[]
  explanation: MCQExplanation;
}

export interface Block {
  id: string;
  title: string;
  specialty: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  color: string; // Tailwind gradient string
  icon: string; // emoji
  mcqs: MCQ[];
}

export interface MCQAnswer {
  mcqIndex: number;
  selectedIndex: number;
  isCorrect: boolean;
  timeTakenSeconds: number;
}

export interface BlockSession {
  id: string; // uuid-like
  blockId: string;
  blockTitle: string;
  answers: MCQAnswer[];
  score: number; // percentage
  correctCount: number;
  totalMcqs: number;
  completedAt: string; // ISO string
  timeTakenSeconds: number;
}

export interface CSVSessionRow {
  id: string;
  blockId: string;
  blockTitle: string;
  score: number;
  correctCount: number;
  totalMcqs: number;
  completedAt: string;
  timeTakenSeconds: number;
  // individual answers as JSON string
  answersJson: string;
}
