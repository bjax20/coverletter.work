import jsPDF from 'jspdf';

export const generatePdfDoc = (content: string) => {
  // Create a new A4 PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  // Set font styling (Times is standard for professional cover letters)
  doc.setFont('times', 'normal');
  doc.setFontSize(12);

  // A4 size in points is approx 595 x 842. 
  // We want standard 1-inch margins (72 points).
  const margin = 72;
  const pageWidth = doc.internal.pageSize.getWidth();
  const maxLineWidth = pageWidth - margin * 2;

  // Split text to fit within the margins
  const lines = doc.splitTextToSize(content, maxLineWidth);

  // Add the text to the document, supporting pagination if it's very long
  let cursorY = margin;
  const pageHeight = doc.internal.pageSize.getHeight();
  const lineHeight = 16; // 12pt font with some spacing

  lines.forEach((line: string) => {
    // If we reach the bottom margin, add a new page
    if (cursorY + lineHeight > pageHeight - margin) {
      doc.addPage();
      cursorY = margin;
    }
    doc.text(line, margin, cursorY);
    cursorY += lineHeight;
  });

  return doc;
};

export const downloadAsPdf = (content: string, filename: string = 'Cover_Letter.pdf') => {
  const doc = generatePdfDoc(content);
  doc.save(filename);
};

export const generatePdfBlobUrl = (content: string): string => {
  const doc = generatePdfDoc(content);
  return doc.output('bloburl').toString();
};
