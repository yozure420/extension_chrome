function findToolbarTarget() {
    const toolbar = document.querySelector('div[role="toolbar"]');
    if (!toolbar) return null;
    const newEventButton = toolbar.querySelector('[data-unique-id="ToolbarSplitButton_NewEventButton"]');
    if (newEventButton) {
        return newEventButton.closest('.fui-ToolbarGroup');
    }
    const joinButtonGroup = toolbar.querySelector('button[aria-label*="参加"]')?.closest('.fui-ToolbarGroup');
    if (joinButtonGroup) {
        return joinButtonGroup;
    }
    const firstGroup = toolbar.querySelector('.fui-ToolbarGroup');
    if (firstGroup) {
        return firstGroup;
    }
    return null;
}
function injectCustomButton() {
    if (document.getElementById('myCustomAction')) {
        return; 
    }
    const targetGroup = findToolbarTarget(); 
    if (!targetGroup) {
        return;
    }
    const referenceDiv = targetGroup.querySelector('[data-unique-id="ToolbarSplitButton_NewEventButton"]')?.closest('[data-overflow-item]'); 
    const customButtonDiv = document.createElement('div');
    customButtonDiv.className = 'fui-ToolbarItem'; 
    const customButton = document.createElement('button');
    customButton.id = 'myCustomAction'; 
    customButton.type = 'button'; 
    customButton.textContent = 'うんちっち'; 
    customButtonDiv.appendChild(customButton);
    if (referenceDiv) {
        targetGroup.insertBefore(customButtonDiv, referenceDiv);
    } else {
        targetGroup.appendChild(customButtonDiv);
    }
    customButton.addEventListener('click', () => {
        alert("俺もひまだった")
    });
}
const observer = new MutationObserver((mutations, observerInstance) => { 
    if (findToolbarTarget()) {
        injectCustomButton();
        observerInstance.disconnect();
    }
});
observer.observe(document.body, { childList: true, subtree: true });