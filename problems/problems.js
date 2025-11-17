// Problem definitions
// Each problem has: id, name, shortDesc, url, description, and solver function

const PROBLEMS = [
  {
    id: 'problem1',
    name: 'Problem 1: Greenhouse Calendly',
    shortDesc: 'React-Select location form',
    url: 'https://job-boards.greenhouse.io/calendly/jobs/8171767002',
    description: 'Fills Greenhouse job application form with React-Select v5 location field (Istanbul, Turkey)',
    solver: 'solveProblem1'
  }
];

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PROBLEMS };
}
