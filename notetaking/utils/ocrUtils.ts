// Mock implementation of OCR functionality
// In a real app, you would use a real OCR service like Google Cloud Vision or Tesseract

export const convertToText = async (canvasRef: any): Promise<string> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // In a real implementation, this would:
  // 1. Get the canvas image data
  // 2. Send it to an OCR service
  // 3. Return the recognized text
  
  // For this demo, we'll just return a mock result
  const mockResults = [
    "This is a sample of converted handwritten text.",
    "The quick brown fox jumps over the lazy dog.",
    "Hello world! This is a test of the OCR system.",
    "Important meeting notes: Follow up with team by Friday.",
    "Remember to buy milk, eggs, and bread."
  ];
  
  return mockResults[Math.floor(Math.random() * mockResults.length)];
};