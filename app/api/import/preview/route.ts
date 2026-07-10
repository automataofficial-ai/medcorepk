import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { csvText } = await req.json();

    if (!csvText) {
      return NextResponse.json(
        { error: "No CSV text provided" },
        { status: 400 }
      );
    }

    const lines = csvText.trim().split("\n");

    if (lines.length < 2) {
      return NextResponse.json(
        { error: "CSV must have at least header and one data row" },
        { status: 400 }
      );
    }

    const headers = lines[0].split(",").map(h => h.trim());

    // Helper to parse CSV line with proper quoted field handling
    const parseCSVLine = (line: string): string[] => {
      const values: string[] = [];
      let current = "";
      let inQuotes = false;

      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        const nextChar = line[j + 1];

        if (char === '"') {
          if (inQuotes && nextChar === '"') {
            current += '"';
            j++; // Skip next quote
          } else {
            inQuotes = !inQuotes;
          }
        } else if (char === "," && !inQuotes) {
          values.push(current.trim().replace(/^"|"$/g, ""));
          current = "";
        } else {
          current += char;
        }
      }
      values.push(current.trim().replace(/^"|"$/g, ""));
      return values;
    };

    // Parse first 5 rows to show preview
    const preview = [];
    for (let i = 1; i < Math.min(6, lines.length); i++) {
      if (!lines[i].trim()) continue;

      const values = parseCSVLine(lines[i]);
      const mcq: any = {};

      headers.forEach((header, index) => {
        mcq[header] = values[index] || null;
      });

      preview.push({
        row: i,
        data: mcq,
        warnings: []
      });

      // Validate correct_answer
      if (mcq.correct_answer && !["a", "b", "c", "d"].includes(mcq.correct_answer?.toLowerCase())) {
        preview[preview.length - 1].warnings.push(
          `Invalid correct_answer: "${mcq.correct_answer}" (expected: a, b, c, or d)`
        );
      }

      // Check for misaligned columns
      if (!mcq.question || !mcq.option_a) {
        preview[preview.length - 1].warnings.push(
          `Missing critical fields: question="${mcq.question}", option_a="${mcq.option_a}"`
        );
      }
    }

    return NextResponse.json({
      headers,
      totalRows: lines.length - 1,
      preview,
      issues: preview.filter(p => p.warnings.length > 0).map(p => ({
        row: p.row,
        warnings: p.warnings
      }))
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to preview CSV" },
      { status: 500 }
    );
  }
}
