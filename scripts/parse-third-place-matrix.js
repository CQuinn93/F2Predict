// Script to parse the full 495-combination matrix from Wikipedia table
// This will generate the complete matrix data file

// The table columns for match assignments are in order:
// 1A vs, 1B vs, 1D vs, 1E vs, 1G vs, 1I vs, 1K vs, 1L vs
// Which correspond to matches: 79, 85, 81, 74, 82, 77, 87, 80

// Matrix data extracted from Wikipedia table
// Format: Each row is an array where:
// - First 12 elements: groups A-L (1 = advancing, 0 = not advancing)
// - Last 8 elements: match assignments (3X format where X is group letter)

const matrixData = [
  // Row 1: E, F, G, H, I, J, K, L
  { groups: [0,0,0,0,1,1,1,1,1,1,1,1], matches: ['3E','3J','3I','3F','3H','3G','3L','3K'] },
  // Row 2: D, F, G, H, I, J, K, L
  { groups: [0,0,0,1,0,1,1,1,1,1,1,1], matches: ['3H','3G','3I','3D','3J','3F','3L','3K'] },
  // Row 3: D, E, G, H, I, J, K, L
  { groups: [0,0,0,1,1,0,1,1,1,1,1,1], matches: ['3E','3J','3I','3D','3H','3G','3L','3K'] },
  // Row 4: D, E, F, H, I, J, K, L
  { groups: [0,0,0,1,1,1,0,1,1,1,1,1], matches: ['3E','3J','3I','3D','3H','3F','3L','3K'] },
  // Row 5: D, E, F, G, I, J, K, L
  { groups: [0,0,0,1,1,1,1,0,1,1,1,1], matches: ['3E','3G','3I','3D','3J','3F','3L','3K'] },
  // Row 6: D, E, F, G, H, J, K, L
  { groups: [0,0,0,1,1,1,1,1,0,1,1,1], matches: ['3E','3G','3J','3D','3H','3F','3L','3K'] },
  // Row 7: D, E, F, G, H, I, K, L
  { groups: [0,0,0,1,1,1,1,1,1,0,1,1], matches: ['3E','3G','3I','3D','3H','3F','3L','3K'] },
  // Row 8: D, E, F, G, H, I, J, L
  { groups: [0,0,0,1,1,1,1,1,1,1,0,1], matches: ['3E','3G','3J','3D','3H','3F','3L','3I'] },
  // Row 9: D, E, F, G, H, I, J, K
  { groups: [0,0,0,1,1,1,1,1,1,1,1,0], matches: ['3E','3G','3J','3D','3H','3F','3I','3K'] },
  // ... Continue for all 495 rows
];

// Match number mapping based on table column order
const matchNumbers = [79, 85, 81, 74, 82, 77, 87, 80]; // 1A, 1B, 1D, 1E, 1G, 1I, 1K, 1L

function parseMatrix() {
  const result = {};
  
  matrixData.forEach((row, index) => {
    // Get advancing groups
    const advancingGroups = [];
    const groupLetters = ['A','B','C','D','E','F','G','H','I','J','K','L'];
    
    row.groups.forEach((val, idx) => {
      if (val === 1) {
        advancingGroups.push(groupLetters[idx]);
      }
    });
    
    // Sort groups to create key
    const key = advancingGroups.sort().join('');
    
    // Parse match assignments
    const assignments = row.matches.map((match, idx) => {
      const groupName = match.replace('3', ''); // Extract group letter from "3X"
      return {
        matchNumber: matchNumbers[idx],
        groupName: groupName
      };
    });
    
    result[key] = assignments;
  });
  
  return result;
}

// Generate TypeScript code
function generateTypeScript(matrix) {
  let code = '// Third-place combination matrix - Full 495 combinations\n';
  code += '// Auto-generated from FIFA World Cup 2026 Round of 32 schedule matrix\n\n';
  code += 'import { ThirdPlaceMatchAssignment } from \'./third-place-combinations\';\n\n';
  code += 'export const THIRD_PLACE_COMBINATIONS_DATA: Record<string, ThirdPlaceMatchAssignment[]> = {\n';
  
  Object.keys(matrix).sort().forEach(key => {
    const assignments = matrix[key];
    code += `  '${key}': [\n`;
    assignments.forEach(assignment => {
      code += `    { matchNumber: ${assignment.matchNumber}, groupName: '${assignment.groupName}' },\n`;
    });
    code += '  ],\n\n';
  });
  
  code += '};\n';
  
  return code;
}

// This script needs to be run with the full matrix data
// For now, it's a template that shows the parsing logic
console.log('Matrix parser template created. Full data needs to be added.');
