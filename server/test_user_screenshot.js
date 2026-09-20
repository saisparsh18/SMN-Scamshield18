import dotenv from 'dotenv';
import { analyzeScreenshotWithAI } from './services/aiService.js';

dotenv.config();

// We'll create a PNG image using node or a test canvas/drawing
// In Windows PowerShell we can create the exact PNG with System.Drawing and pass its base64 here
console.log('Testing analyzeScreenshotWithAI availability...');
