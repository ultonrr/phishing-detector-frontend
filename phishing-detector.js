document.addEventListener("DOMContentLoaded", function () {
    const inputField = document.getElementById("url-input");
    const checkButton = document.getElementById("check-button");
    const loadingIndicator = document.getElementById("loading-indicator");
    const resultContainer = document.getElementById("result-container");
    const resultIndicator = document.getElementById("result-indicator");
    const resultMessage = document.getElementById("result-message");
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

    function analyzeUrl(url) {
        const apiUrl = "https://phishing-it.onrender.com/predict"; // Change to your backend API

        // Show loading state
        loadingIndicator.classList.remove("hidden");
        resultContainer.classList.add("hidden");

        fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: url })
        })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            return response.json();
        })
        .then(data => {
            loadingIndicator.classList.add("hidden");
            resultContainer.classList.remove("hidden");

            displayResult(url, data);
            addToHistory(url, data.status);
        })
        .catch(error => {
            loadingIndicator.classList.add("hidden");
            showNotification("Error", "Failed to connect to the backend.", "error");
            console.error("Error:", error);
        });
    }

    function displayResult(url, data) {
        let statusColor = "green";
        if (data.status === "suspicious") statusColor = "orange";
        if (data.status === "danger") statusColor = "red";

        resultIndicator.innerHTML = `
            <p>URL: <strong>${url}</strong></p>
            <p>Status: <span style="color:${statusColor}; font-weight:bold;">${data.status}</span></p>
            <p>Confidence Score: ${data.confidence ? (data.confidence * 100).toFixed(2) + "%" : "N/A"}</p>
            <p>${data.message}</p>
        `;
    }

    function addToHistory(url, status) {
        historySection.classList.remove("hidden");
        const listItem = document.createElement("li");
        listItem.innerHTML = `<strong>${url}</strong> - <span style="color:${status === "danger" ? "red" : "green"}">${status}</span>`;
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
