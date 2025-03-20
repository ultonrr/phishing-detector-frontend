document.addEventListener('DOMContentLoaded', function() {
    const urlInput = document.getElementById('url-input');
    const checkButton = document.getElementById('check-button');
    const loadingIndicator = document.getElementById('loading-indicator');
    const resultContainer = document.getElementById('result-container');
    const resultIndicator = document.getElementById('result-indicator');
    const resultMessage = document.getElementById('result-message');
    const historySection = document.getElementById('history-section');
    const historyList = document.getElementById('history-list');
    const notificationContainer = document.getElementById('notification-container');
    
    let urlHistory = [];
    
    // Check URL function
    checkButton.addEventListener('click', function() {
        const url = urlInput.value.trim();
        
        // Basic URL validation
        if (!url || !url.includes('.')) {
            showNotification('Error', 'Please enter a valid URL', 'error');
            return;
        }
        
        // Show loading indicator
        loadingIndicator.classList.remove('hidden');
        resultContainer.classList.add('hidden');
        checkButton.disabled = true;
        
        // Simulate API request with setTimeout (in a real app, this would be a fetch to /predict)
        setTimeout(() => {
            analyzeUrl(url);
        }, 2000);
    });
    
    // URL input event listener
    urlInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkButton.click();
        }
    });
    
    urlInput.addEventListener('input', function() {
        if (resultContainer.classList.contains('hidden') === false) {
            resultContainer.classList.add('hidden');
        }
    });
    
    // Function to analyze the URL and show results
    function analyzeUrl(url) {
        // In a real application, this would be a fetch request to the backend API
        // For demo purposes, we're simulating the response based on the URL content
        
        let result = {
            status: 'safe',
            confidence: 0.95,
            message: 'This URL appears to be legitimate and safe to visit.'
        };
        
        // Simple detection logic for demo purposes
        if (url.includes('phish') || url.includes('scam')) {
            result.status = 'danger';
            result.confidence = 0.97;
            result.message = 'This URL is likely a phishing attempt. Do not proceed.';
        } else if (url.includes('login') || url.includes('secure') || url.includes('bank')) {
            result.status = 'suspicious';
            result.confidence = 0.75;
            result.message = 'This URL looks suspicious. Proceed with caution.';
        }
        
        // Hide loading indicator
        loadingIndicator.classList.add('hidden');
        checkButton.disabled = false;
        
        // Show the result
        displayResult(url, result);
        
        // Add to history
        addToHistory(url, result.status);
        
        // Show notification
        if (result.status === 'safe') {
            showNotification('URL Analyzed', 'This URL appears to be safe', 'success');
        } else if (result.status === 'suspicious') {
            showNotification('URL Analyzed', 'This URL looks suspicious', 'warning');
        } else {
            showNotification('URL Analyzed', 'This URL is likely a phishing attempt', 'error');
        }
    }
    
    // Function to display the scan result
    function displayResult(url, result) {
        resultContainer.classList.remove('hidden');
        
        // Clear previous result
        resultIndicator.innerHTML = '';
        resultIndicator.className = 'result-indicator';
        
        // Add appropriate class based on result
        resultIndicator.classList.add(`result-${result.status}`);
        
        // Create result icon and text
        let iconPath = '';
        let resultText = '';
        
        if (result.status === 'safe') {
            iconPath = 'M9 12L11 14L15 10M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z';
            resultText = 'Safe';
        } else if (result.status === 'suspicious') {
            iconPath = 'M12 8V12M12 16H12.01M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z';
            resultText = 'Suspicious';
        } else {
            iconPath = 'M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22ZM12 8V12M12 16H12.01';
            resultText = 'Phishing';
        }
        
        const resultHTML = `
            <svg class="result-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="${iconPath}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <div class="result-text">${resultText}</div>
        `;
        
        resultIndicator.innerHTML = resultHTML;
        resultMessage.textContent = result.message;
    }
    
    // Function to add URL to history
    function addToHistory(url, status) {
        // Add to the beginning of the array
        urlHistory.unshift({ url, status });
        
        // Keep only the last 5 items
        if (urlHistory.length > 5) {
            urlHistory = urlHistory.slice(0, 5);
        }
        
        // Update the history section
        updateHistoryUI();
    }
    
    // Function to update the history UI
    function updateHistoryUI() {
        // Clear current history
        historyList.innerHTML = '';
        
        // If we have history items, show the history section
        if (urlHistory.length > 0) {
            historySection.classList.remove('hidden');
            
            // Add each history item
            urlHistory.forEach((item) => {
                const li = document.createElement('li');
                li.className = 'history-item';
                
                const statusText = item.status === 'safe' ? 'Safe' : 
                                  item.status === 'suspicious' ? 'Suspicious' : 'Phishing';
                
                li.innerHTML = `
                    <span class="history-url">${item.url}</span>
                    <span class="history-result result-badge-${item.status}">${statusText}</span>
                `;
                
                historyList.appendChild(li);
            });
        } else {
            historySection.classList.add('hidden');
        }
    }
    
    // Function to show notifications
    function showNotification(title, message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        let iconPath = '';
        
        if (type === 'success') {
            iconPath = 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
        } else if (type === 'warning') {
            iconPath = 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
        } else {
            iconPath = 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z';
        }
        
        notification.innerHTML = `
            <svg class="notification-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="${iconPath}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
        `;
        
        notificationContainer.appendChild(notification);
        
        // Remove notification after 4 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 4000);
    }
});