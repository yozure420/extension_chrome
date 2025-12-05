(() => {
    function setInputValue(input, value) {
        if (!input) return;
        input.value = value;
        input.dispatchEvent(new Event('input', { bubbles: true }));
    }
    function injectButton() {
        const headerContainer = document.querySelector('.ui-flex.a.e.f.g.h.i.j');
        if (!headerContainer) return false;
        if (document.getElementById("meeting_now_button")) return true;
        const btn = document.createElement("button");
        btn.id = "meeting_now_button";
        btn.textContent = "オンラインじゅぎょ★";
        btn.style.cssText = `
            background-color: #4a90e2;
            color: white;
            border: none;
            border-radius: 6px;
            padding: 8px 20px;   
            cursor: pointer;
            font-size: 14px;     
            line-height: 1; 
            white-space: nowrap;
            margin-left:500px;
            position: relative;
            z-index: 1000;
        `;
        btn.addEventListener("click", () => {
            const joinButton = document.querySelector('[data-tid="calendar_header_meet_now_join_with_id_button"]');
            if (joinButton) joinButton.click();
            setTimeout(() => {
                const meetingIdInput = document.querySelector('#meeting-code-input');
                const passcodeInput = document.querySelector('[data-tid="meet_flyout_meeting_join_from_code_passcode_field"]');
                fetch(chrome.runtime.getURL("config.json"))
                .then(res => res.json())
                .then(cfg => {
                    setInputValue(meetingIdInput, cfg.meetingID);
                    setInputValue(passcodeInput, cfg.passcode);
                    const submitBtn = document.querySelector('[data-tid="meet_now_calendar_flyout_join_meeting_from_code_button"]');
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.click();
                    }
                });
            }, 300);
        });
        headerContainer.appendChild(btn);
        return true;
    }
    // ページ遷移や描画後もボタン追加できるよう監視
    const observer = new MutationObserver(() => {
        // カレンダー画面のときだけ追加
        const calendarTitle = document.querySelector('[data-tid="calendar-app-header-title"]');
        if (calendarTitle) {
            injectButton();
        } else {
            const btn = document.getElementById("meeting_now_button");
            if (btn) btn.remove();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    
    injectButton();
})();
