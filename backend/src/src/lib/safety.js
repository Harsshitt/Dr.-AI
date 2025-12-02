// src/lib/safety.js
// Simple rule-based red-flag emergency detection

const RED_FLAG_KEYWORDS = [
  "chest pain", 
  "pressure in chest", 
  "difficulty breathing", 
  "cant breathe",
  "shortness of breath", 
  "black out", 
  "fainted", 
  "loss of consciousness",
  "stroke", 
  "slurred speech", 
  "weakness on one side", 
  "severe bleeding",
  "vomiting blood", 
  "blood in stool", 
  "severe abdominal pain",
  "severe headache", 
  "sudden vision loss", 
  "severe allergic", 
  "swelling of tongue",
  "tongue swelling", 
  "swelling of face", 
  "suicidal", 
  "self harm", 
  "overdose",
  "high fever and stiff neck", 
  "testicular pain", 
  "severe dehydration"
];

// Find if message contains red-flag symptoms
function findRedFlags(text){
  if(!text) return [];
  const lower = text.toLowerCase();
  return RED_FLAG_KEYWORDS.filter(keyword => lower.includes(keyword));
}

// Determine if emergency based on red flags found
function isEmergencyFromFlags(flags){
  return Array.isArray(flags) && flags.length > 0;
}

module.exports = { findRedFlags, isEmergencyFromFlags, RED_FLAG_KEYWORDS };