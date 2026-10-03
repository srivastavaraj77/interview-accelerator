import * as pdfjsLib from 'pdfjs-dist';

// Configure pdfjs worker
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
} catch (e) {
  console.warn('PDF.js worker initialization notice:', e);
}

/**
 * Extracts plain text from an uploaded File (.pdf, .txt, .md, .json)
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const fileExtension = file.name.split('.').pop()?.toLowerCase();

  if (fileExtension === 'pdf') {
    return extractTextFromPdf(file);
  }

  // Plain text / Markdown / Source files
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      resolve(content || '');
    };
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
}

/**
 * Parses PDF text page by page
 */
async function extractTextFromPdf(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdfDoc = await loadingTask.promise;
    let fullText = '';

    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => ('str' in item ? item.str : ''))
        .join(' ');
      fullText += pageText + '\n\n';
    }

    return fullText.trim();
  } catch (error) {
    console.error('Error parsing PDF file:', error);
    // Fallback if worker/binary parsing encounters format restrictions
    return `[Uploaded File: ${file.name} (Size: ${(file.size / 1024).toFixed(1)} KB)]\nPlease paste the text directly if detailed text parsing fails in this browser environment.`;
  }
}

/**
 * Extracts filler words from transcript
 */
export const FILLER_WORDS = ['um', 'uh', 'like', 'basically', 'actually', 'you know', 'sort of', 'kind of', 'i mean', 'literally', 'so yeah'];

export function analyzeSpeechTelemetry(text: string, durationSecs: number) {
  const words = text.toLowerCase().match(/\b[a-z']+\b/g) || [];
  const wordCount = words.length;
  const minutes = Math.max(durationSecs / 60, 0.05);
  const wpm = Math.round(wordCount / minutes);

  const fillerCounts: Record<string, number> = {};
  let totalFillers = 0;

  const lowerText = text.toLowerCase();
  for (const filler of FILLER_WORDS) {
    const regex = new RegExp(`\\b${filler}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches && matches.length > 0) {
      fillerCounts[filler] = matches.length;
      totalFillers += matches.length;
    }
  }

  // Pacing verdict
  let pacingVerdict = 'Optimal Pacing';
  if (wpm < 100) {
    pacingVerdict = 'Slightly Slow / Deliberate';
  } else if (wpm > 175) {
    pacingVerdict = 'Fast-Paced (Try to slow down)';
  } else if (wpm >= 120 && wpm <= 160) {
    pacingVerdict = 'Ideal Conversational Speed (120-160 WPM)';
  }

  return {
    wordCount,
    wpm,
    totalFillers,
    fillerCounts,
    pacingVerdict
  };
}
