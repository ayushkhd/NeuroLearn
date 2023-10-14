console.log("Content script has loaded and is running!");

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {

        console.log("received message")
  
        timestamp1 = request.message;
        timestamp2 = request.content;


        const progressBarContainer = document.getElementsByClassName('ytp-progress-bar-container');

        const highlight = document.createElement('div');
highlight.style.position = 'absolute';
highlight.style.backgroundColor = 'green';
highlight.style.height = '100%'; // Note: You've assigned this property twice
highlight.style.width = '100%';
highlight.style.top = '0px';
highlight.style.left = '0px';
highlight.style.zIndex = '1000';
highlight.style.touchAction = 'none';
highlight.role = 'slider';
highlight.tabIndex = '0';  
highlight.draggable = true; // Prefer boolean values when applicable


        console.log("appending highlight")
        if(progressBarContainer.length > 0) {
            progressBarContainer[0].appendChild(highlight);
          }

        console.log("returning true")
        sendResponse({ status: 'success' });
    }
  );