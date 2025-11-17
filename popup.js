// Popup script
document.addEventListener('DOMContentLoaded', function() {
  const problemSelect = document.getElementById('problemSelect');
  const problemInfo = document.getElementById('problemInfo');
  const problemName = document.getElementById('problemName');
  const problemDesc = document.getElementById('problemDesc');
  const problemUrl = document.getElementById('problemUrl');
  const solveBtn = document.getElementById('solveBtn');
  const wikiBtn = document.getElementById('wikiBtn');
  const status = document.getElementById('status');

  let selectedProblem = null;

  // Load problems into dropdown
  PROBLEMS.forEach(problem => {
    const option = document.createElement('option');
    option.value = problem.id;
    option.textContent = problem.name;
    problemSelect.appendChild(option);
  });

  // Handle problem selection
  problemSelect.addEventListener('change', function() {
    const problemId = this.value;
    
    if (!problemId) {
      problemInfo.classList.add('hidden');
      solveBtn.disabled = true;
      selectedProblem = null;
      return;
    }

    selectedProblem = PROBLEMS.find(p => p.id === problemId);
    
    if (selectedProblem) {
      problemName.textContent = selectedProblem.shortDesc;
      problemDesc.textContent = selectedProblem.description;
      problemUrl.textContent = '🔗 ' + selectedProblem.url;
      problemInfo.classList.remove('hidden');
      solveBtn.disabled = false;
    }
  });

  // Handle SOLVE button
  solveBtn.addEventListener('click', async function() {
    if (!selectedProblem) return;

    showStatus('Opening problem page...', 'info');

    try {
      // Create or update tab with the problem URL
      const [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // Check if we should open in current tab or new tab
      if (currentTab.url === 'chrome://newtab/' || currentTab.url === 'about:blank') {
        // Update current tab
        await chrome.tabs.update(currentTab.id, { url: selectedProblem.url });
      } else {
        // Create new tab
        await chrome.tabs.create({ url: selectedProblem.url });
      }

      // Save the selected problem to storage
      chrome.storage.local.set({
        pendingSolver: selectedProblem.solver,
        problemName: selectedProblem.name
      });

      showStatus('Problem page opened! Waiting for page to load...', 'success');
      
      // Close popup after a delay
      setTimeout(() => {
        window.close();
      }, 1500);

    } catch (error) {
      showStatus('Error: ' + error.message, 'error');
    }
  });

  // Handle Wiki button
  wikiBtn.addEventListener('click', function() {
    chrome.tabs.create({ url: 'wiki.html' });
  });

  // Helper function to show status messages
  function showStatus(message, type = 'info') {
    status.textContent = message;
    status.className = 'status show ' + type;
  }

  // Load last used problem
  chrome.storage.local.get(['lastProblem'], function(result) {
    if (result.lastProblem) {
      problemSelect.value = result.lastProblem;
      problemSelect.dispatchEvent(new Event('change'));
    }
  });

  // Save selected problem on change
  problemSelect.addEventListener('change', function() {
    if (this.value) {
      chrome.storage.local.set({ lastProblem: this.value });
    }
  });
});
