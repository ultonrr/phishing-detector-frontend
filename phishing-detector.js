document.addEventListener("DOMContentLoaded", function () {
    const inputField = document.getElementById("url-input");
    const checkButton = document.getElementById("check-button");
    const loadingIndicator = document.getElementById("loading-indicator");
    const resultContainer = document.getElementById("result-container");
    const resultIndicator = document.getElementById("result-indicator");
    const historyList = document.getElementById("history-list");
    const historySection = document.getElementById("history-section");

    checkButton.addEventListener("click", function () {
        const url = inputField.value.trim();
        if (!url) {
            showNotification("Error", "Please enter a valid URL.", "error");
            return;
        }

        analyzeUrl(url);
    });

    async function analyzeUrl(url) {
        const apiUrl = "https://phishing-api.onrender.com/predict"; // Backend API URL

        loadingIndicator.classList.remove("hidden");
        resultContainer.classList.add("hidden");

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: url })
            });

            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

            const data = await response.json();
            loadingIndicator.classList.add("hidden");
            resultContainer.classList.remove("hidden");

            displayResult(url, data);
            addToHistory(url, data.malicious); // Use "malicious" instead of "status"
        } catch (error) {
            loadingIndicator.classList.add("hidden");
            showNotification("Error", "Failed to connect to the backend.", "error");
            console.error("Error:", error);
        }
    }

    function displayResult(url, data) {
        let statusColor = data.malicious ? "red" : "green"; // Change based on "malicious" key

        resultIndicator.innerHTML = `
            <p>URL: <strong>${url}</strong></p>
            <p>Status: <span style="color:${statusColor}; font-weight:bold;">
                ${data.malicious ? "⚠️ Phishing Detected!" : "✅ Safe URL"}
            </span></p>
        `;
    }

    function addToHistory(url, malicious) {
        historySection.classList.remove("hidden");
        const listItem = document.createElement("li");
        listItem.innerHTML = `<strong>${url}</strong> - <span style="color:${malicious ? "red" : "green"}">
            ${malicious ? "Phishing" : "Safe"}
        </span>`;
        historyList.appendChild(listItem);
    }

    function showNotification(title, message, type) {
        const notificationContainer = document.getElementById("notification-container");
        const notification = document.createElement("div");
        notification.className = `notification ${type}`;
        notification.innerHTML = `<strong>${title}:</strong> ${message}`;

        notificationContainer.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 4000);
    }
});
