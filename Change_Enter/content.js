document.addEventListener("keydown", (e) =>{
    if (e.key === "Enter" && !e.isComposing && !e.shiftKey) {
        if (e.ctrlKey) return;
        e.preventDefault();
        e.stopImmediatePropagation();
        const target = e.target;
        if (target.isContentEditable) {
            document.execCommand('insertLineBreak');
        }
        const shiftEnter = new KeyboardEvent("keydown",{
            key: "Enter",
            code: "Enter",
            shiftKey: true,
            bubbles: true
        });
        e.target.dispatchEvent(shiftEnter);
    }
}, true)