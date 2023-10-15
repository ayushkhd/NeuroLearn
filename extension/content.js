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


async function playAudio(text) {
    const voiceId = 'RE41IpVvESKH1SkTq04p';
    const apiKey = '925011858db6abb00c9dacdbb13ef2c3';
    const apiEndpoint = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`;
    const requestOptions = {
        method: "POST",
        headers: new Headers({
            "xi-api-key": apiKey,
            "Content-Type": "application/json",
        }),
        body: JSON.stringify({ text: text }),
    };

    const response = await fetch(apiEndpoint, requestOptions);
    if (response.status === 200) {
        const audioArrayBuffer = await response.arrayBuffer();

        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const audioBuffer = await audioContext.decodeAudioData(audioArrayBuffer);
        const audioSource = audioContext.createBufferSource();
        audioSource.buffer = audioBuffer;
        audioSource.connect(audioContext.destination);
        audioSource.start(0);
    } else {
        throw new Error(`Error: ${response.statusText}`);
    }
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

function createCircularElement(number) {
    const circle = document.createElement('div');
    circle.style.width = '100px'; // Set the width
    circle.style.height = '100px'; // Set the height
    circle.style.borderRadius = '50%'; // Make it circular
    circle.style.backgroundColor = 'blue'; // Set the background color
    circle.style.display = 'flex'; // Use flexbox for centering
    circle.style.justifyContent = 'center'; // Center the content horizontally
    circle.style.alignItems = 'center'; // Center the content vertically
    circle.style.color = 'white'; // Set the text color
    circle.style.fontSize = '20px'; // Set the font size
    circle.textContent = number; // Set the number

    return circle;
}

function createNeuroLearnElement(highlights) {
    const container = document.createElement('div');
    container.id = 'neurolearn_container';
    container.style.background = 'linear-gradient(to bottom right, #2596be, #183d6e)';  // Gradient from #2596be to #183d6e at the low bottom right
    container.style.borderRadius = '10px';
    container.style.width = '28%';  // Adjust width as needed
    container.style.marginBottom = '20px';
    container.style.zIndex = '99999999';

    // Title
    const titleContainer = document.createElement('div');
    titleContainer.style.display = 'flex';
    titleContainer.style.justifyContent = 'space-between';
    titleContainer.style.alignItems = 'center';
    titleContainer.style.marginBottom = '20px';

    const title = document.createElement('h2');
    title.style.fontSize = '30px';
    title.style.marginTop = '10px';
    title.style.marginLeft = '10px';
    title.textContent = 'NeuroLearn';
    title.style.color = '#FFFFFF';  // Adjust title color as needed
    titleContainer.appendChild(title);
    titleContainer.style.marginRight = '10px';
    titleContainer.style.marginTop = '10px';

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
        highlight.style.background = 'rgba(255, 255, 255, 0.5)'; // More transparent than before
        highlight.style.borderRadius = '20px'; // More rounded corners
        highlight.style.padding = '10px 20px';
        highlight.style.marginBottom = '15px';
        highlight.style.display = 'flex';
        highlight.style.justifyContent = 'space-between';
        highlight.style.alignItems = 'center';
        highlight.style.boxShadow = '0px 5px 15px rgba(0, 0, 0, 0.3)'; // Add stronger drop shadow
        highlight.style.marginLeft = '10px';
        highlight.style.marginRight = '10px';
        highlight.style.transition = 'all 0.3s ease'; // Add transition for smooth animation

        // Add hover effect
        highlight.onmouseover = function () {
            this.style.transform = 'scale(1.02)'; // Grow less in size
            this.style.background = 'rgba(255, 255, 255, 0.8)'; // Make background brighter and less transparent
        };
        highlight.onmouseout = function () {
            this.style.transform = 'none'; // Reset size
            this.style.background = 'rgba(255, 255, 255, 0.5)'; // Reset background
        };
        start_time = secondsToTime(item.start_time);
        end_time = secondsToTime(item.end_time);

        const text = document.createElement('span');
        text.textContent = `Highlight ${index + 1}: ${start_time} - ${end_time}`;
        text.style.fontSize = '16px';
        text.style.fontFamily = 'Poppins, sans-serif'; // Make the font Poppins
        text.style.fontWeight = '600'; // Make the font semibold
        text.style.color = 'rgba(0, 0, 0, 0.5)'; // Make the text more transparent
        highlight.appendChild(text);

        const percentage = document.createElement('span');
        percentage.textContent = index === 0 ? '75%' : '20%';
        percentage.style.background = index === 0 ? 'limegreen' : 'red';
        percentage.style.borderRadius = '5px';
        percentage.style.padding = '5px 5px';
        percentage.style.color = 'white';
        percentage.style.fontSize = '18px';
        highlight.appendChild(percentage);

        highlight.addEventListener('click', function () {
            document.getElementsByTagName('video')[0].currentTime = item.start_time;
        });

        highlight.style.cursor = 'pointer';

        container.appendChild(highlight);

        const description = document.createElement('div');

        const fullText = "<b>Highlight</b>: " + item.highlight + "<br><b>Reason for highlight</b>: " + item.reason_for_highlight;
        const shortText = fullText.length > 100 ? fullText.substr(0, 97) + '...' : fullText;

        description.innerHTML = shortText; // Use innerHTML instead of textContent to parse HTML tags
        description.style.color = 'white';
        description.style.marginBottom = '15px';
        description.style.marginLeft = '20px';
        description.style.marginRight = '10px';
        description.style.fontSize = '12px';

        const readMore = document.createElement('span');
        readMore.textContent = ' Read More';
        readMore.style.display = fullText.length > 100 ? 'inline' : 'none';
        readMore.style.color = '#00d4ff';
        readMore.style.cursor = 'pointer';
        readMore.addEventListener('click', function () {
            description.innerHTML = fullText;
            readMore.style.display = 'none';
        });

        description.appendChild(readMore);
        const questionButton = document.createElement('button');
        questionButton.innerHTML = 'Quiz yourself';
        questionButton.style.background = '#00d4ff';
        questionButton.style.color = 'white';
        questionButton.style.float = 'right';
        questionButton.style.paddingRight = '10px';
        questionButton.style.borderRadius = '20px';
        questionButton.style.marginTop = '10px';
        questionButton.style.border = '0px';

        questionButton.onmouseover = function () {
            this.style.transform = 'scale(1.1)'; // Grow by 10% on hover
        }
        questionButton.onmouseout = function () {
            this.style.transform = 'scale(1.0)'; // Reset size when not hovering
        }

        questionButton.addEventListener('click', function () {

            var video = document.getElementsByTagName('video')[0];
            video.pause();
            playAudio(item.questions[0])

        });
        container.appendChild(questionButton);

        container.appendChild(description);
    }
    )



    const flexDiv = document.createElement('div');
    flexDiv.style.display = 'flex';
    flexDiv.style.justifyContent = 'space-between';
    flexDiv.style.alignItems = 'center';

    const aiCoach = document.createElement('input');
    aiCoach.id = 'chatQueryInput';
    aiCoach.style.background = 'rgba(255, 255, 255, 0.5)';
    aiCoach.style.borderRadius = '20px';
    aiCoach.style.padding = '10px 20px';
    aiCoach.style.marginTop = '15px';
    aiCoach.placeholder = 'Ask your AI coach...';
    aiCoach.style.fontSize = '16px';
    aiCoach.style.fontFamily = 'Poppins, sans-serif'; // Make the font Poppins
    aiCoach.style.marginLeft = '10px';
    aiCoach.style.width = '100%';
    aiCoach.style.display = 'flex';
    aiCoach.style.alignItems = 'center';
    aiCoach.style.justifyContent = 'center';
    aiCoach.style.height = '100%'; // Add this line to make the text vertically centered
    aiCoach.style.boxShadow = '0px 4px 8px 0px rgba(0, 0, 0, 0.2)'; // Add drop shadow
    aiCoach.style.padding = '10px 20px';



    // Event listener to auto-expand the textarea
    // aiCoach.addEventListener('input', function () {
    //     this.style.height = 'auto';
    //     this.style.height = (this.scrollHeight) + 'px';
    // });
    const aiCoachButton = document.createElement('button');
    aiCoachButton.innerHTML = '&#x27A4;'; // Unicode for rightwards arrow
    aiCoachButton.style.background = '#00d4ff';
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
    aiCoachButton.style.transition = 'all 0.3s ease'; // Add transition for smooth animation
    aiCoachButton.style.boxShadow = '0px 4px 8px 0px rgba(0, 0, 0, 0.2)'; // Add drop shadow

    aiCoachButton.addEventListener('mouseover', function () {
        this.style.transform = 'scale(1.1)'; // Increase size by 10% on hover
    });
    aiCoachButton.addEventListener('mouseout', function () {
        this.style.transform = 'scale(1.0)'; // Return to original size when not hovering
    });
    aiCoachButton.addEventListener('click', function () {
        pingAIQuestion(); // Call the function 'pingAIQuestion' when the button is clicked
    });

    const newSection = document.createElement('div');
    newSection.style.display = 'flex';
    newSection.style.justifyContent = 'center';
    newSection.style.alignItems = 'center';
    newSection.style.marginTop = '20px'; // Add some margin at the top for spacing
    newSection.style.position = 'fixed';
    newSection.style.bottom = '0';
    newSection.style.right = '0'; // Position the new section at the right of the screen
    newSection.style.left = 'auto'; // Override any existing left positioning

    let circleElement = createCircularElement(5); // Create the circular element with number 5

    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            if (request.focusProbability) {
                console.log("Content script received focus probability: " + request.focusProbability);
                // Update your circular element with the received data
                const newCircleElement = createCircularElement(Math.round(request.focusProbability * 100));
                // Replace the old circular element with the new one in your DOM
                newSection.replaceChild(newCircleElement, circleElement);
                circleElement = newCircleElement;
            }
        });
    flexDiv.style.marginRight = '10px';
    flexDiv.appendChild(aiCoach);
    flexDiv.appendChild(aiCoachButton);

    container.appendChild(flexDiv);
    container.appendChild(newSection);

    return container;
}


pingAIQuestion = () => {
    console.log("pinging AI")
    // If it exists, remove an element of id = 'aiCoachResponse'
    const oldResponse = document.getElementById('aiCoachResponse');
    if (oldResponse) {
        oldResponse.remove();
    }
    const input = document.getElementById('chatQueryInput');
    const question = input.value;
    let stuff = {
        "query": question
    };
    fetch('https://166a-12-94-170-82.ngrok-free.app/chatQuery/', {
        // fetch('http://localhost:8000/videoHighlight/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(stuff),
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);

            // Create a text element
            const textElement = document.createElement('p');
            textElement.style.marginLeft = '10px';
            textElement.id = 'aiCoachResponse';
            const container = document.getElementById('neurolearn_container');
            textElement.style.fontFamily = 'Poppins, sans-serif'; // Make the font Poppins
            textElement.style.fontSize = '16px';
            textElement.style.color = 'rgba(255, 255, 255, 0.5)'; // Make the text more transparent

            // Append the text element to the aiCoach section
            container.appendChild(textElement);

            // Type out the response iteratively
            const chunkSize = 5; // Define the size of the chunk to write at a time
            let i = 0;
            const typing = setInterval(() => {
                if (i < data.response.length) {
                    // Write a chunk of the response at a time
                    textElement.textContent += data.response.substring(i, i + chunkSize);
                    i += chunkSize;
                } else {
                    clearInterval(typing);
                }
            }, 100);

        })
        .catch((error) => {
            console.error('Error:', error);
        });

}
