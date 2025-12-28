(() => {
    function setInputValue(input, value) {
        if (!input) return;
        input.value = value;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function injectButton() {
        // 【重要】新しいTeams V2のタイトルバー周辺にあるコンテナをターゲットにします
        // カレンダー画面が表示されている時に存在する操作エリアを探します
        const headerContainer = document.querySelector('[data-tid="calendar-app-header-controls"]') || 
                                document.querySelector('.fui-Flex.___1qrnbyp'); // Titlebar End Slot

        if (!headerContainer) return false;
        if (document.getElementById("meeting_now_button")) return true;

        const btn = document.createElement("button");
        btn.id = "meeting_now_button";
        btn.textContent = "オンラインじゅぎょ★";
        
        // Teams V2のUIに合わせたスタイル調整
        btn.style.cssText = `
            background-color: #4a90e2;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 0 15px;   
            cursor: pointer;
            font-size: 13px;     
            font-weight: 600;
            height: 32px;
            margin: 0 8px;
            white-space: nowrap;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: background-color 0.2s;
        `;
        
        btn.onmouseover = () => btn.style.backgroundColor = "#357abd";
        btn.onmouseout = () => btn.style.backgroundColor = "#4a90e2";

        btn.addEventListener("click", () => {
            // 「今すぐ会議」ボタンをdata-tidで探す
            const meetNowBtn = document.querySelector('[data-tid="calendar_header_meet_now_join_with_id_button"]');
            if (meetNowBtn) {
                meetNowBtn.click();
                
                // ダイアログが出るのを待つ
                setTimeout(() => {
                    fetch(chrome.runtime.getURL("config.json"))
                    .then(res => res.json())
                    .then(cfg => {
                        const idInput = document.querySelector('#meeting-code-input');
                        const passInput = document.querySelector('[data-tid="meet_flyout_meeting_join_from_code_passcode_field"]');
                        
                        if (idInput && passInput) {
                            setInputValue(idInput, cfg.meetingID);
                            setInputValue(passInput, cfg.passcode);
                            
                            // 「参加」ボタン（青いボタン）を探してクリック
                            const submitBtn = document.querySelector('[data-tid="meet_now_calendar_flyout_join_meeting_from_code_button"]');
                            if (submitBtn) {
                                submitBtn.disabled = false;
                                submitBtn.click();
                            }
                        }
                    }).catch(e => console.error("config load error", e));
                }, 600); // ネットワーク遅延を考慮して少し長めに
            } else {
                alert("カレンダー画面の『会議 ID で参加』ボタンが見つかりません。");
            }
        });

        // 既存の要素の邪魔をしないように挿入
        headerContainer.prepend(btn);
        return true;
    }

    // 監視ロジック
    const observer = new MutationObserver(() => {
        // カレンダーアプリが選択されているか、または特定のヘッダーがあるか
        const calendarActive = document.querySelector('[data-tid="ef56c0de-36fc-4ef8-b417-3d82ba9d073c"][aria-pressed="true"]') || 
        document.querySelector('[data-tid="calendar-app-header-controls"]');
        
        if (calendarActive) {
            injectButton();
        } else {
            const oldBtn = document.getElementById("meeting_now_button");
            if (oldBtn) oldBtn.remove();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    
    // 初回実行
    setTimeout(injectButton, 2000); 
})();