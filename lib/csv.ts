import fs from "fs";
import path from "path";
import type { BlockSession } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const SESSIONS_FILE = path.join(DATA_DIR, "sessions.csv");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function ensureSessionsFile() {
  ensureDataDir();
  if (!fs.existsSync(SESSIONS_FILE)) {
    const header =
      "id,blockId,blockTitle,score,correctCount,totalMcqs,completedAt,timeTakenSeconds,answersJson\n";
    fs.writeFileSync(SESSIONS_FILE, header, "utf-8");
  }
}

function escapeCsv(value: string | number): string {
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function appendSession(session: BlockSession): void {
  ensureSessionsFile();
  const row = [
    escapeCsv(session.id),
    escapeCsv(session.blockId),
    escapeCsv(session.blockTitle),
    escapeCsv(session.score),
    escapeCsv(session.correctCount),
    escapeCsv(session.totalMcqs),
    escapeCsv(session.completedAt),
    escapeCsv(session.timeTakenSeconds),
    escapeCsv(JSON.stringify(session.answers)),
  ].join(",");
  fs.appendFileSync(SESSIONS_FILE, row + "\n", "utf-8");
}

export function readAllSessions(): BlockSession[] {
  ensureSessionsFile();
  const raw = fs.readFileSync(SESSIONS_FILE, "utf-8").trim();
  const lines = raw.split("\n").slice(1); // skip header
  const sessions: BlockSession[] = [];

  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      // Parse CSV respecting quoted fields
      const fields = parseCsvLine(line);
      if (fields.length < 9) continue;

      sessions.push({
        id: fields[0],
        blockId: fields[1],
        blockTitle: fields[2],
        score: parseFloat(fields[3]),
        correctCount: parseInt(fields[4], 10),
        totalMcqs: parseInt(fields[5], 10),
        completedAt: fields[6],
        timeTakenSeconds: parseInt(fields[7], 10),
        answers: JSON.parse(fields[8]),
      });
    } catch {
      // skip malformed lines
    }
  }
  return sessions;
}

function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let i = 0;
  while (i < line.length) {
    if (line[i] === '"') {
      // quoted field
      let field = "";
      i++; // skip opening quote
      while (i < line.length) {
        if (line[i] === '"' && line[i + 1] === '"') {
          field += '"';
          i += 2;
        } else if (line[i] === '"') {
          i++; // skip closing quote
          break;
        } else {
          field += line[i++];
        }
      }
      fields.push(field);
      if (line[i] === ",") i++;
    } else {
      const end = line.indexOf(",", i);
      if (end === -1) {
        fields.push(line.slice(i));
        break;
      } else {
        fields.push(line.slice(i, end));
        i = end + 1;
      }
    }
  }
  return fields;
}
