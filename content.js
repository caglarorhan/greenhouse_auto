// Content script - runs on web pages
console.log('Greenhouse Auto extension loaded');

// Check if there's a pending solver to run immediately
chrome.storage.local.get(['pendingSolver', 'problemName'], function(result) {
  if (result.pendingSolver) {
    console.log('Found pending solver:', result.pendingSolver);
    
    // Wait for page to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => executeSolver(result.pendingSolver, result.problemName), 1500);
      });
    } else {
      // DOM is already ready, wait a bit more for dynamic content
      setTimeout(() => executeSolver(result.pendingSolver, result.problemName), 2000);
    }
    
    // Clear the pending solver
    chrome.storage.local.remove(['pendingSolver', 'problemName']);
  }
});

// Execute the solver function
async function executeSolver(solverName, problemName) {
  console.log('Executing solver:', solverName);
  
  try {
    // Dynamically call the solver based on name
    let result;
    
    switch(solverName) {
      case 'solveProblem1':
        result = await solveProblem1();
        break;
      default:
        throw new Error('Unknown solver: ' + solverName);
    }
    
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

// ===== SOLVER FUNCTIONS =====
// Include all solver functions directly in content script

/**
 * Problem 1 Solver: Greenhouse Calendly Job Application
 */
async function solveProblem1() {
  console.log('🤖 Solving Problem 1: Greenhouse Calendly Application');

  try {
    // Wait for form to be ready
    console.log('⏳ Waiting for form...');
    await waitForElement('form[id*="application"]', 3000);
    
    console.log('✅ Form found, starting to fill...');

    // Fill basic text fields
    console.log('📝 Filling basic fields...');
    await fillBasicFields();

    // Handle React-Select location field
    console.log('🌍 Setting location to Istanbul...');
    await setLocation('Istanbul');

    // Fill other fields
    console.log('📋 Filling additional fields...');
    await fillAdditionalFields();

    console.log('✨ All done!');
    return {
      success: true,
      message: 'Greenhouse application form filled successfully! Location: Istanbul, Turkey'
    };

  } catch (error) {
    console.error('❌ Error solving Problem 1:', error);
    return {
      success: false,
      message: 'Error: ' + error.message
    };
  }
}

// Helper functions for Problem 1

function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector);
    if (element) return resolve(element);

    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    setTimeout(() => {
      observer.disconnect();
      reject(new Error('Element not found: ' + selector));
    }, timeout);
  });
}

async function fillBasicFields() {
  const fields = [
    { selector: '#first_name', value: 'John' },
    { selector: '#last_name', value: 'Doe' },
    { selector: '#email', value: 'john.doe@example.com' },
    { selector: '#phone', value: '+90 555 123 4567' }
  ];

  fields.forEach(({ selector, value }) => {
    const field = document.querySelector(selector);
    if (field) {
      field.value = value;
      field.dispatchEvent(new Event('input', { bubbles: true }));
      field.dispatchEvent(new Event('change', { bubbles: true }));
      console.log(`Filled ${selector}`);
    }
  });

  await new Promise(resolve => setTimeout(resolve, 300));
}

async function setLocation(cityName) {
  console.log('Setting location:', cityName);
  
  const input = document.querySelector("#candidate-location");
  if (!input) {
    console.log("Location input not found");
    throw new Error("Location input not found");
  }

  // Focus the input first
  input.focus();
  input.click();
  
  // Clear any existing value
  input.value = '';
  
  // Simulate typing character by character with keyboard events
  for (let i = 0; i < cityName.length; i++) {
    const char = cityName[i];
    
    // Dispatch keydown event
    input.dispatchEvent(new KeyboardEvent('keydown', {
      key: char,
      code: 'Key' + char.toUpperCase(),
      charCode: char.charCodeAt(0),
      keyCode: char.charCodeAt(0),
      bubbles: true,
      cancelable: true
    }));
    
    // Update the value
    input.value = cityName.substring(0, i + 1);
    
    // Dispatch input event (React listens to this)
    input.dispatchEvent(new InputEvent('input', { 
      bubbles: true,
      cancelable: true,
      data: char,
      inputType: 'insertText'
    }));
    
    // Dispatch keyup event
    input.dispatchEvent(new KeyboardEvent('keyup', {
      key: char,
      code: 'Key' + char.toUpperCase(),
      charCode: char.charCodeAt(0),
      keyCode: char.charCodeAt(0),
      bubbles: true,
      cancelable: true
    }));
    
    // Small delay between characters to mimic human typing
    await new Promise(resolve => setTimeout(resolve, 150));
  }

  console.log('Typing complete, waiting for dropdown options...');
  
  // Wait for the API call to complete
  await new Promise(resolve => setTimeout(resolve, 1500));

  const option = await waitForOption(cityName);

  if (option) {
    // Scroll the option into view if needed
    option.scrollIntoView({ block: 'nearest' });
    
    // Click the option
    option.click();
    console.log('Location selected:', option.innerText);
    
    await new Promise(resolve => setTimeout(resolve, 500));
  } else {
    throw new Error('Location option not found in dropdown');
  }
}

function waitForOption(text) {
  return new Promise((resolve) => {
    const existingOptions = [...document.querySelectorAll(".select__option")];
    const existing = existingOptions.find(opt => opt.innerText.includes(text));
    if (existing) {
      return resolve(existing);
    }

    const observer = new MutationObserver(() => {
      const options = [...document.querySelectorAll(".select__option")];
      const found = options.find(opt => opt.innerText.includes(text));
      if (found) {
        observer.disconnect();
        resolve(found);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    setTimeout(() => {
      observer.disconnect();
      resolve(null);
    }, 5000);
  });
}

async function fillAdditionalFields() {
  const linkedinField = document.querySelector('input[name*="linkedin"]');
  if (linkedinField) {
    linkedinField.value = 'https://linkedin.com/in/johndoe';
    linkedinField.dispatchEvent(new Event('input', { bubbles: true }));
    console.log('Filled LinkedIn');
  }

  const websiteField = document.querySelector('input[name*="website"]');
  if (websiteField) {
    websiteField.value = 'https://johndoe.com';
    websiteField.dispatchEvent(new Event('input', { bubbles: true }));
    console.log('Filled website');
  }

  const textareas = document.querySelectorAll('textarea');
  textareas.forEach(textarea => {
    if (!textarea.value) {
      textarea.value = 'I am excited to apply for this position. I have extensive experience in the field and believe I would be a great fit for your team.';
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      console.log('Filled textarea');
    }
  });

  await new Promise(resolve => setTimeout(resolve, 300));
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
