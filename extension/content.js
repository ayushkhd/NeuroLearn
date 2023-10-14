

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {

        console.log("received message")
  
        timestamp1 = request.timestamp1;
        timestamp2 = request.timestamp2;

        const progressBarContainer = document.getElementsByClassName('ytp-progress-bar-container');

        const highlight = document.createElement('div');
        highlight.style.position = 'absolute';
        highlight.style.backgroundColor = 'green';
        highlight.style.height = '5px';
        highlight.style.width = '100%';
        highlight.style.top = '0px';
        highlight.style.left = '0px';
        highlight.style.zIndex = '1000';
        highlight.style.height = '100%';

        console.log("appending highlight")
        progressBarContainer.appendChild(highlight);

        console.log("returning true")
        sendResponse({ status: 'success' });
    }
  );