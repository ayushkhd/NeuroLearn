console.log("Content script has loaded and is running!");

function timeToSeconds(timeString) {
    const [minutes, seconds] = timeString.split(":").map(Number);
    return minutes * 60 + seconds;
}

function secondsToTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}


chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {

        console.log(request.url)

        const player = document.getElementById("movie_player");
        console.log(player);  // This should log the player object or null.

        console.log(typeof player.seekTo);  // This should log "function" if it's available.


        // This is the code you'll be injecting into the page


        console.log("received message")

        var videoHighlight = {
            videoToHighlight: request.url,
            objective: request.message,
        };


        fetch('https://166a-12-94-170-82.ngrok-free.app/videoHighlight/', {
            // fetch('http://localhost:8000/videoHighlight/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(videoHighlight),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);

                // Check if "highlights" array is present in the data
                if (data.highlights && Array.isArray(data.highlights)) {
                    data.highlights.forEach((highlight, index) => {
                        console.log(`Highlight ${index + 1}:`);
                        console.log(`Start Time: ${highlight.start_time}`);
                        console.log(`End Time: ${highlight.end_time}`);

                        const timeDuration = document.getElementsByClassName('ytp-time-duration')[0].innerHTML;

                        const [minutes, seconds] = timeDuration.split(":").map(Number);
                        const totalSeconds = minutes * 60 + seconds;

                        const progressBar = document.getElementsByClassName('ytp-progress-bar-container')[0];


                        const totalDuration = totalSeconds; // Example value in seconds

                        const timestamp1 = highlight.start_time;
                        const timestamp2 = highlight.end_time;

                        // Calculate position and width of the highlight based on timestamps
                        const highlightPosition = (timestamp1 / totalDuration) * progressBar.offsetWidth;
                        const highlightWidth = ((timestamp2 - timestamp1) / totalDuration) * progressBar.offsetWidth;

                        // Create and style the highlight element
                        const greenHighlight = document.createElement('div');
                        greenHighlight.style.position = 'absolute';
                        greenHighlight.style.backgroundColor = 'green';
                        greenHighlight.style.height = '100%';
                        greenHighlight.style.width = `${highlightWidth}px`;
                        greenHighlight.style.left = `${highlightPosition}px`;
                        greenHighlight.style.zIndex = '1000';
                        greenHighlight.style.touchAction = 'none';
                        greenHighlight.role = 'slider';
                        greenHighlight.tabIndex = '0';
                        greenHighlight.draggable = true; // Prefer boolean values when applicable

                        console.log("appending highlight")
                        // Append the highlight element to the progress bar
                        progressBar.appendChild(greenHighlight);










                    });
                    let result = fetchElementAndParent(data.highlights);
                    if (result) {
                        console.log("Filtered element:", result.filteredElement);
                        console.log("Parent of filtered element:", result.parentElement);
                    } else {
                        console.log("Element not found");
                    }
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });


        sendResponse({ status: 'success' });
    }
);

function fetchElementAndParent(highlights) {
    // Fetch the specific div element with the given class and ID
    let filteredElement = document.querySelector('div.style-scope.ytd-watch-flexy#secondary');
    console.log("inside function")

    if (filteredElement) {
        // Get the parent of the filtered element
        let parentElement = filteredElement.parentElement;

        // Remove the filtered element from the DOM
        console.log("boutta remove")
        filteredElement.remove();

        const neuroLearnElement = createNeuroLearnElement(highlights);
        parentElement.appendChild(neuroLearnElement);

        return {
            filteredElement: filteredElement,
            parentElement: parentElement
        };
    } else {
        return null;
    }
}

// Example usage:
console.log("calling func")

function createNeuroLearnElement(highlights) {
    const container = document.createElement('div');
    container.style.background = 'linear-gradient(#13142f 30%, black)';  // Gradient from purple to black, with purple extending further
    container.style.padding = '10px';
    container.style.borderRadius = '10px';
    container.style.width = '300px';  // Adjust width as needed
    container.style.marginBottom = '20px';
    container.style.zIndex = '99999999';

    // Title
    const titleContainer = document.createElement('div');
    titleContainer.style.display = 'flex';
    titleContainer.style.justifyContent = 'space-between';
    titleContainer.style.alignItems = 'center';

    const title = document.createElement('h2');
    title.style.fontSize = '30px';
    title.style.marginTop = '10px';
    title.style.marginLeft = '10px';
    title.textContent = 'NeuroLearn';
    title.style.color = '#FFFFFF';  // Adjust title color as needed
    titleContainer.appendChild(title);

    const blobSvg = document.createElement('div');
    blobSvg.id = 'blob_svg';
    blobSvg.style.display = 'block'; // Ensure the SVG is displayed

    const blobImage = document.createElement('img');
    blobImage.id = 'blob_image';
    blobImage.src = 'https://gist.githubusercontent.com/ColabDog/be2c2c3dae7d31fd668783c480e7ebec/raw/d63bc5aaa982da97bf083b391ca54638b6fbc4f7/blue_blob.svg';
    blobImage.alt = 'Blob SVG';

    // Add CSS animation to make the SVG zoom in and out
    blobImage.style.animation = 'zoomInOut 2s infinite';

    blobSvg.appendChild(blobImage);
    titleContainer.appendChild(blobSvg);

    container.appendChild(titleContainer);


    // Highlights
    highlights.forEach((item, index) => {
        const highlight = document.createElement('div');

        // Set the translucent bubble styles for each highlight
        highlight.style.background = 'rgba(255, 255, 255, 0.8)'; // More opaque than before
        highlight.style.borderRadius = '20px'; // More rounded corners
        highlight.style.padding = '10px 20px';
        highlight.style.marginBottom = '15px';
        highlight.style.display = 'flex';
        highlight.style.justifyContent = 'space-between';
        highlight.style.alignItems = 'center';

        start_time = secondsToTime(item.start_time);
        end_time = secondsToTime(item.end_time);

        const text = document.createElement('span');
        text.textContent = `Highlight ${index + 1}: ${start_time} - ${end_time}`;
        text.style.fontSize = '18px';
        highlight.appendChild(text);

        const percentage = document.createElement('span');
        percentage.textContent = index === 0 ? '75%' : '20%';
        percentage.style.background = index === 0 ? 'limegreen' : 'red';
        percentage.style.borderRadius = '5px';
        percentage.style.padding = '5px 5px';
        percentage.style.color = 'white';
        percentage.style.fontSize = '18px';
        highlight.appendChild(percentage);

        highlight.addEventListener('click', function() {
            document.getElementsByTagName('video')[0].currentTime = item.start_time;
        });

        highlight.style.cursor = 'pointer';

        container.appendChild(highlight);
    }
    )

    const flexDiv = document.createElement('div');
    flexDiv.style.display = 'flex';
    flexDiv.style.justifyContent = 'space-between';
    flexDiv.style.alignItems = 'center';

    const aiCoach = document.createElement('textarea');
    aiCoach.style.background = 'rgba(255, 255, 255, 0.8)';
    aiCoach.style.borderRadius = '20px';
    aiCoach.style.padding = '10px 20px';
    aiCoach.style.marginTop = '15px';
    aiCoach.placeholder = 'Ask your AI coach...';
    aiCoach.style.fontSize = '20px';
    aiCoach.style.textAlign = 'center';
    aiCoach.style.overflow = 'hidden';
    aiCoach.style.resize = 'none';

    // Event listener to auto-expand the textarea
    aiCoach.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
    const aiCoachButton = document.createElement('button');
    aiCoachButton.innerHTML = '&#x27A4;'; // Unicode for rightwards arrow
    aiCoachButton.style.background = '#8B5DF8';
    aiCoachButton.style.color = 'white';
    aiCoachButton.style.borderRadius = '20px';
    aiCoachButton.style.padding = '10px 20px';
    aiCoachButton.style.marginTop = '15px';
    aiCoachButton.style.marginLeft = '10px'; // Added padding between text area and the button
    aiCoachButton.style.fontSize = '20px';
    aiCoachButton.style.border = 'none';
    aiCoachButton.style.cursor = 'pointer';
    aiCoachButton.style.outline = 'none';
    aiCoachButton.style.fontWeight = 'bold';


    flexDiv.appendChild(aiCoach);
    flexDiv.appendChild(aiCoachButton);

    container.appendChild(flexDiv);
    return container;
}


