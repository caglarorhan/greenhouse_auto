/**
 * Problem 1 Solver: Greenhouse Calendly Job Application
 * 
 * Target URL: https://job-boards.greenhouse.io/calendly/jobs/8171767002
 * 
 * Description:
 * Fills Greenhouse job application form that uses React-Select v5 for location field.
 * React-Select requires special handling - we must trigger keyboard events and wait for the
 * dropdown to render, then click the actual option element.
 * 
 * Solution Steps:
 * 1. Wait for form to load completely
 * 2. Fill basic text fields (name, email, phone, etc.)
 * 3. Handle React-Select location field:
 *    - Focus and type into the input character by character
 *    - Trigger proper keyboard and input events to make React-Select search
 *    - Wait for dropdown options to appear in DOM
 *    - Click the matching option
 * 4. Fill resume/cover letter fields if needed
 * 5. Show completion message
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

// ===== HELPER FUNCTIONS =====

/**
 * Wait for an element to appear in the DOM
 */
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

/**
 * Fill basic form fields
 */
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

/**
 * Set location using React-Select v5
 * This is the critical function that handles React-Select properly
 * 
 * React-Select requires:
 * 1. Proper keyboard events (keydown, keyup)
 * 2. InputEvent with inputType: 'insertText'
 * 3. Character-by-character typing simulation
 * 4. Waiting for API response and dropdown rendering
 */
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

/**
 * Wait for React-Select dropdown option to appear
 * This uses MutationObserver to watch for dynamic content
 */
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

/**
 * Fill additional fields like LinkedIn, website, etc.
 */
async function fillAdditionalFields() {
  // LinkedIn profile
  const linkedinField = document.querySelector('input[name*="linkedin"]');
  if (linkedinField) {
    linkedinField.value = 'https://linkedin.com/in/johndoe';
    linkedinField.dispatchEvent(new Event('input', { bubbles: true }));
    console.log('Filled LinkedIn');
  }

  // Website
  const websiteField = document.querySelector('input[name*="website"]');
  if (websiteField) {
    websiteField.value = 'https://johndoe.com';
    websiteField.dispatchEvent(new Event('input', { bubbles: true }));
    console.log('Filled website');
  }

  // Cover letter / Additional info (if textarea exists)
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
