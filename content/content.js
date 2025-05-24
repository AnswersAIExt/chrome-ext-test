// content.js

// Create a tooltip element

const confettiSvg = `
<svg height="12" fill="none" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#a)" fill="#fff">
<path d="m2.5 7c0.27614 0 0.5-0.22386 0.5-0.50001 0-0.27614-0.22386-0.5-0.5-0.5s-0.5 0.22386-0.5 0.5c0 0.27615 0.22386 0.50001 0.5 0.50001z"/>
<path d="m0.5 5c0.27614 0 0.5-0.22386 0.5-0.5s-0.22386-0.5-0.5-0.5-0.5 0.22386-0.5 0.5 0.22386 0.5 0.5 0.5z"/>
<path d="m2.5 3c0.27614 0 0.5-0.22386 0.5-0.5s-0.22386-0.5-0.5-0.5-0.5 0.22386-0.5 0.5 0.22386 0.5 0.5 0.5z"/>
<path d="m0.5 1c0.27614 0 0.5-0.22386 0.5-0.5s-0.22386-0.5-0.5-0.5-0.5 0.22386-0.5 0.5 0.22386 0.5 0.5 0.5z"/>
<path d="m11.5 7c0.2761 0 0.5-0.22386 0.5-0.50001 0-0.27614-0.2239-0.5-0.5-0.5s-0.5 0.22386-0.5 0.5c0 0.27615 0.2239 0.50001 0.5 0.50001z"/>
<path d="m9.5 5c0.27615 0 0.5-0.22386 0.5-0.5s-0.22385-0.5-0.5-0.5c-0.27614 0-0.5 0.22386-0.5 0.5s0.22386 0.5 0.5 0.5z"/>
<path d="m11.5 3c0.2761 0 0.5-0.22386 0.5-0.5s-0.2239-0.5-0.5-0.5-0.5 0.22386-0.5 0.5 0.2239 0.5 0.5 0.5z"/>
<path d="m9.5 1c0.27615 0 0.5-0.22386 0.5-0.5s-0.22385-0.5-0.5-0.5c-0.27614 0-0.5 0.22386-0.5 0.5s0.22386 0.5 0.5 0.5z"/>
<path d="m7 12c0.27615 0 0.50001-0.2239 0.50001-0.5s-0.22386-0.5-0.50001-0.5c-0.27614 0-0.5 0.2239-0.5 0.5s0.22386 0.5 0.5 0.5z"/>
<path d="m5 10c0.27614 0 0.5-0.22385 0.5-0.5 0-0.27614-0.22386-0.5-0.5-0.5s-0.5 0.22386-0.5 0.5c0 0.27615 0.22386 0.5 0.5 0.5z"/>
<path d="m7 8c0.27615 0 0.50001-0.22386 0.50001-0.50001 0-0.27614-0.22386-0.5-0.50001-0.5-0.27614 0-0.5 0.22386-0.5 0.5 0 0.27615 0.22386 0.50001 0.5 0.50001z"/>
<path d="m5 6c0.27614 0 0.5-0.22386 0.5-0.50001 0-0.27614-0.22386-0.5-0.5-0.5s-0.5 0.22386-0.5 0.5c0 0.27615 0.22386 0.50001 0.5 0.50001z"/>
<path d="M7.49999 1.5C7.23478 1.5 6.98042 1.39464 6.79289 1.20711C6.60535 1.01957 6.5 0.765216 6.5 0.5C6.5 0.367392 6.44732 0.240215 6.35355 0.146447C6.25978 0.0526784 6.1326 0 6 0C5.86739 0 5.74021 0.0526784 5.64644 0.146447C5.55268 0.240215 5.5 0.367392 5.5 0.5V0.5C5.5 0.765216 5.39464 1.01957 5.2071 1.20711C5.01957 1.39464 4.76522 1.5 4.5 1.5C4.36739 1.5 4.24021 1.55268 4.14645 1.64645C4.05268 1.74021 4 1.86739 4 2C4 2.13261 4.05268 2.25979 4.14645 2.35355C4.24021 2.44732 4.36739 2.5 4.5 2.5V2.5C4.76522 2.5 5.01957 2.60536 5.2071 2.79289C5.39464 2.98043 5.5 3.23478 5.5 3.5C5.5 3.63261 5.55268 3.75979 5.64644 3.85355C5.74021 3.94732 5.86739 4 6 4C6.1326 4 6.25978 3.94732 6.35355 3.85355C6.44732 3.75979 6.5 3.63261 6.5 3.5C6.5 3.23478 6.60535 2.98043 6.79289 2.79289C6.98042 2.60536 7.23478 2.5 7.49999 2.5C7.6326 2.5 7.75978 2.44732 7.85355 2.35355C7.94731 2.25979 7.99999 2.13261 7.99999 2C7.99999 1.86739 7.94731 1.74021 7.85355 1.64645C7.75978 1.55268 7.6326 1.5 7.49999 1.5V1.5Z"/>
<path d="M3.5 9.5C3.23478 9.5 2.98043 9.39464 2.79289 9.2071C2.60536 9.01957 2.5 8.76522 2.5 8.5C2.5 8.36739 2.44732 8.24021 2.35355 8.14645C2.25979 8.05268 2.13261 8 2 8C1.86739 8 1.74021 8.05268 1.64645 8.14645C1.55268 8.24021 1.5 8.36739 1.5 8.5V8.5C1.5 8.76522 1.39464 9.01957 1.20711 9.2071C1.01957 9.39464 0.765216 9.5 0.5 9.5C0.367392 9.5 0.240215 9.55268 0.146447 9.64644C0.0526784 9.74021 0 9.86739 0 10C0 10.1326 0.0526784 10.2598 0.146447 10.3535C0.240215 10.4473 0.367392 10.5 0.5 10.5V10.5C0.765216 10.5 1.01957 10.6054 1.20711 10.7929C1.39464 10.9804 1.5 11.2348 1.5 11.5C1.5 11.6326 1.55268 11.7598 1.64645 11.8535C1.74021 11.9473 1.86739 12 2 12C2.13261 12 2.25979 11.9473 2.35355 11.8535C2.44732 11.7598 2.5 11.6326 2.5 11.5C2.5 11.2348 2.60536 10.9804 2.79289 10.7929C2.98043 10.6054 3.23478 10.5 3.5 10.5V10.5C3.63261 10.5 3.75979 10.4473 3.85355 10.3535C3.94732 10.2598 4 10.1326 4 10C4 9.86739 3.94732 9.74021 3.85355 9.64644C3.75979 9.55268 3.63261 9.5 3.5 9.5Z"/>
<path d="M11.5 9.5C11.2348 9.5 10.9804 9.39464 10.7929 9.2071C10.6054 9.01957 10.5 8.76522 10.5 8.5C10.5 8.36739 10.4473 8.24021 10.3535 8.14645C10.2598 8.05268 10.1326 8 10 8C9.86739 8 9.74021 8.05268 9.64644 8.14645C9.55268 8.24021 9.5 8.36739 9.5 8.5C9.5 8.76522 9.39464 9.01957 9.2071 9.2071C9.01957 9.39464 8.76522 9.5 8.5 9.5C8.36739 9.5 8.24021 9.55268 8.14645 9.64644C8.05268 9.74021 8 9.86739 8 10C8 10.1326 8.05268 10.2598 8.14645 10.3535C8.24021 10.4473 8.36739 10.5 8.5 10.5C8.76522 10.5 9.01957 10.6054 9.2071 10.7929C9.39464 10.9804 9.5 11.2348 9.5 11.5C9.5 11.6326 9.55268 11.7598 9.64644 11.8535C9.74021 11.9473 9.86739 12 10 12C10.1326 12 10.2598 11.9473 10.3535 11.8535C10.4473 11.7598 10.5 11.6326 10.5 11.5C10.5 11.2348 10.6054 10.9804 10.7929 10.7929C10.9804 10.6054 11.2348 10.5 11.5 10.5V10.5C11.6326 10.5 11.7598 10.4473 11.8535 10.3535C11.9473 10.2598 12 10.1326 12 10C12 9.86739 11.9473 9.74021 11.8535 9.64644C11.7598 9.55268 11.6326 9.5 11.5 9.5Z"/>
</g>
<defs>
<clipPath id="a">
<rect width="12" height="12" fill="#fff"/>
</clipPath>
</defs>
</svg>`




const tooltipContainer = document.createElement('div');
tooltipContainer.classList.add('answer-ai-tooltip-container');
const tooltip = document.createElement('div');
tooltip.classList.add('answer-ai-tooltip');

tooltip.innerHTML = `
    ${confettiSvg} Get Answer AI
`;

tooltipContainer.appendChild(tooltip);
document.body.appendChild(tooltipContainer);

// let selectedTextGlobal = '';

// Function to show tooltip
function showTooltip(text, x, y) {
    tooltipContainer.style.left = `${x}px`;
    tooltipContainer.style.top = `${y}px`;
    tooltipContainer.style.display = 'block';
    tooltipContainer.setAttribute("answer-ai-selected", text);
    // selectedTextGlobal = text;

    chrome.runtime.sendMessage({textSelected: text});
}

// Function to hide tooltip
function hideTooltip() {
    tooltipContainer.style.display = 'none';
    // selectedTextGlobal = '';
}

// Listen for text selection
document.addEventListener('mouseup', async (event) => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    console.log(event.target);
    
    if (event.target === tooltip) {
        tooltipAction();
        hideTooltip();

        return;
    }

    if (selectedText.length > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const tooltipX = rect.left + window.scrollX + rect.width / 2;
        const tooltipY = rect.top + window.scrollY - 40;

        showTooltip(selectedText, tooltipX, tooltipY);
    } else {
        hideTooltip();
    }
});

// Hide tooltip when clicking outside
// document.addEventListener('mousedown', (event) => {
//     if (!tooltip.contains(event.target)) {
//         hideTooltip();
//     }
// });

// Tooltip click action
// tooltip.addEventListener('click', (event) => {
//     // event.preventDefault();
//     // event.stopImmediatePropagation();
//     // event.stopPropagation(); // Prevent event bubbling
//     tooltipAction();
//         hideTooltip();
// });

// Define your custom action here
function tooltipAction() {
    const text = tooltipContainer.getAttribute("answer-ai-selected");
    console.log(text);
    
    chrome.runtime.sendMessage({fromSelect: text});
}