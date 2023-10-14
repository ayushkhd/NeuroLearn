

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
  
        timestamp1 = request.timestamp1;
        timestamp2 = request.timestamp2;

        const progressBarContainer = document.getElementsByClassName('ytp-progress-bar-container');

        const highlight = document.createElement('div');
        highlight.style.position = 'absolute';
        highlight.style.backgroundColor = 'green';
        highlight.style.height = '5px';
    }
  );