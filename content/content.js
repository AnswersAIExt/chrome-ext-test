// content.js

// Create a tooltip element
const tooltip = document.createElement('div');
tooltip.style = `
    text-overflow: ellipsis;
    max-width: 200px;
    overflow: hidden;
    position: absolute;
    padding: 6px 10px;
    background: rgba(0, 0, 0, 0.8);
    color: #fff;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    pointer-events: auto;
    z-index: 9999;
    display: none;
    white-space: nowrap;
`;
document.body.appendChild(tooltip);

let selectedTextGlobal = '';

// Function to show tooltip
function showTooltip(text, x, y) {
    tooltip.textContent = text;
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
    tooltip.style.display = 'block';
    selectedTextGlobal = text;

    chrome.runtime.sendMessage({textSelected: text});
}

// Function to hide tooltip
function hideTooltip() {
    tooltip.style.display = 'none';
    selectedTextGlobal = '';
}

// Listen for text selection
document.addEventListener('mouseup', async (event) => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    if (selectedText.length > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        const tooltipX = rect.left + window.scrollX + rect.width / 2;
        const tooltipY = rect.top + window.scrollY - 40; // Position 40px above selection

        showTooltip(selectedText, tooltipX, tooltipY);
    } else {
        hideTooltip();
    }
});

// Hide tooltip when clicking outside
document.addEventListener('mousedown', (event) => {
    if (!tooltip.contains(event.target)) {
        hideTooltip();
    }
});

// Tooltip click action
tooltip.addEventListener('click', (event) => {
    event.stopPropagation(); // Prevent event bubbling
    tooltipAction(selectedTextGlobal);
});

// Define your custom action here
function tooltipAction(text) {
    chrome.runtime.sendMessage({fromSelect: tooltip.textContent});
    hideTooltip();
}