// Problem definitions
// Each problem has: id, name, shortDesc, url, description, and solver function

const PROBLEMS = [
  {
    // Unique identifier for this problem (used internally)
    id: 'problem1',
    
    // Full name shown in the dropdown menu
    name: 'Problem 1: Greenhouse Calendly',
    
    // Short description shown next to the problem name
    shortDesc: 'React-Select location form',
    
    // Target URL that will be opened when user clicks SOLVE
    url: 'https://job-boards.greenhouse.io/calendly/jobs/8171767002',
    
    // Detailed description shown in the problem info box
    description: 'Fills Greenhouse job application form with React-Select v5 location field (Istanbul, Turkey)',
    
    // Name of the solver function (must match function name in solutions/problem1.js)
    solver: 'solveProblem1'
  }
];

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PROBLEMS };
}
