// Content script - runs on web pages
console.log('Greenhouse Auto extension loaded');

// Import solver functions by injecting them into the page
const solverScripts = [
  chrome.runtime.getURL('solutions/problem1.js')
];

// Inject solver scripts into page context
solverScripts.forEach(scriptUrl => {
  const script = document.createElement('script');
  script.src = scriptUrl;
  (document.head || document.documentElement).appendChild(script);
});

// Check if there's a pending solver to run immediately
chrome.storage.local.get(['pendingSolver', 'problemName'], function(result) {
  if (result.pendingSolver) {
    console.log('Found pending solver:', result.pendingSolver);
    
    // Wait for page to be fully loaded AND for scripts to be injected
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => executeSolver(result.pendingSolver, result.problemName), 2000);
      });
    } else {
      // DOM is already ready, wait a bit more for scripts to load and dynamic content
      setTimeout(() => executeSolver(result.pendingSolver, result.problemName), 2500);
    }
    
    // Clear the pending solver
    chrome.storage.local.remove(['pendingSolver', 'problemName']);
  }
});

// Execute the solver function
async function executeSolver(solverName, problemName) {
  console.log('Executing solver:', solverName);
  
  try {
    // Check if solver function exists in window (injected from external script)
    if (typeof window[solverName] !== 'function') {
      throw new Error(`Solver function ${solverName} not found. Make sure solutions script is loaded.`);
    }
    
    // Call the solver function
    const result = await window[solverName]();
    
    console.log('Solver result:', result);
    
    // Show notification to user
    showNotification(result.success ? 'success' : 'error', result.message);
    
    // Send result to background
    chrome.runtime.sendMessage({
      action: 'solverComplete',
      problemName: problemName,
      result: result
    });
    
  } catch (error) {
    console.error('Error executing solver:', error);
    showNotification('error', 'Error: ' + error.message);
  }
}

// Show notification overlay on page
function showNotification(type, message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    background-color: ${type === 'success' ? '#4CAF50' : '#f44336'};
    color: white;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 999999;
    font-family: 'Segoe UI', Arial, sans-serif;
    font-size: 14px;
    max-width: 300px;
    animation: slideIn 0.3s ease-out;
  `;
  notification.textContent = '🤖 ' + message;
  
  document.body.appendChild(notification);
  
  // Remove after 5 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Listen for messages from popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'executeSolver') {
    executeSolver(request.solver, request.problemName)
      .then(result => sendResponse({ success: true, result: result }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep channel open for async response
  }
});
