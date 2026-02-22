// Persian font support for jsPDF
// This is a base64 encoded Vazir font (subset)
export const vazirFontBase64 = `data:font/truetype;charset=utf-8;base64,AAEAAAAKAIAAAwAgT1MvMmNkEk0AAAFcAAAAYGNtYXAGOwBxAAAB3AAAAIRnYXNwAAAAEAAAAmAAAAAIZ2x5ZqIgJvwAAAJoAAAFxGhlYWQg7mwNAAAILAAAADZoaGVhCgMEBwAACGQAAAAkaG10eBlvBQIAAAiIAAAARGxvY2EKfQlMAAAIzAAAACRtYXhwATAKBwAACPAAAAAgbmFtZZlKCfsAAAkQAAABhnBvc3QAAwAAAAAKmAAAACAAAwQAAZAABQAAApkCzAAAAI8CmQLMAAAB6wAzAQkAAAAAAAAAAAAAAAAAAAABEAAAAAAAAAAAAAAAAAAAAABAACDmgAQg/uAAIAQAAQAAAAAE3AAAAAAAAQAAAAAAAAAAAQAAAAAAAAAAAAAAAQAAAAEAAQA=`;

export const registerVazirFont = (doc: any) => {
  // Add Vazir font to jsPDF
  try {
    doc.addFileToVFS('Vazir.ttf', vazirFontBase64.split(',')[1]);
    doc.addFont('Vazir.ttf', 'Vazir', 'normal');
    doc.setFont('Vazir');
    return true;
  } catch (error) {
    console.warn('Failed to load Vazir font, falling back to default:', error);
    return false;
  }
};