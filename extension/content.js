console.log("Content script has loaded and is running!");

function timeToSeconds(timeString) {
    const [minutes, seconds] = timeString.split(":").map(Number);
    return minutes * 60 + seconds;
}


chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {

        console.log(request.url)

        console.log("received message")

        var videoHighlight = {
            videoToHighlight: request.url,
            objective: 'Generate a summary suitable for a software engineer building video search.',
        };


        // fetch('https://30a0-12-94-170-82.ngrok-free.app/videoHighlight/', {
        fetch('http://localhost:8000/videoHighlight/', {
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




                        let result = fetchElementAndParent();
                        if (result) {
                            console.log("Filtered element:", result.filteredElement);
                            console.log("Parent of filtered element:", result.parentElement);
                        } else {
                            console.log("Element not found");
                        }





                    });
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });


        sendResponse({ status: 'success' });
    }
);

function skipToTime(time) {
    document.getElementById("movie_player").seekTo(time, true);
}

function fetchElementAndParent() {
    // Fetch the specific div element with the given class and ID
    let filteredElement = document.querySelector('div.style-scope.ytd-watch-flexy#secondary');
    console.log("inside function")

    if (filteredElement) {
        // Get the parent of the filtered element
        let parentElement = filteredElement.parentElement;

        // Remove the filtered element from the DOM
        console.log("boutta remove")
        filteredElement.remove();

        const neuroLearnElement = createNeuroLearnElement();
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
    container.style.background = 'linear-gradient(#8B5DF8, white)';  // Gradient from purple to white
    container.style.padding = '10px';
    container.style.borderRadius = '10px';
    container.style.width = '300px';  // Adjust width as needed
    container.style.marginBottom = '20px';
    container.style.zIndex = '99999999';

    // Title
    const title = document.createElement('h2');
    title.style.fontSize = '30px';
    title.style.marginTop = '10px';
    title.style.marginLeft = '10px';
    title.textContent = 'NeuroLearn';
    title.style.color = '#FFFFFF';  // Adjust title color as needed
    container.appendChild(title);

    const blobSvg = document.createElement('div');
    blobSvg.id = 'blob_svg';
    blobSvg.style.display = 'block'; // Ensure the SVG is displayed

    const blobImage = document.createElement('img');
    blobImage.id = 'blob_image';
    blobImage.src = 'https://gist.githubusercontent.com/ColabDog/be2c2c3dae7d31fd668783c480e7ebec/raw/14f5ebb6957e5ace159b5d05e986f36e2a32f801/blue_blob.svg';
    blobImage.alt = 'Blob SVG';

    blobSvg.appendChild(blobImage);
    container.appendChild(blobSvg);


    // Highlights
    for (let i = 0; i < highlights.length; i++) {
        const highlight = document.createElement('button');
        highlight.id = `highlight-${i}`; // Assign a unique id to each button

        // Set the translucent bubble styles for each highlight
        highlight.style.background = 'rgba(255, 255, 255, 0.8)'; // More opaque than before
        highlight.style.borderRadius = '20px'; // More rounded corners
        highlight.style.padding = '10px 20px';
        highlight.style.marginBottom = '15px';
        highlight.style.display = 'flex';
        highlight.style.justifyContent = 'space-between';
        highlight.style.alignItems = 'center';
        highlight.style.transition = 'transform 0.3s ease'; // Add transition for smooth hover effect

        // Add hover effect to elevate the highlight
        highlight.addEventListener('mouseover', () => {
            highlight.style.transform = 'scale(1.05)'; // Slightly enlarge the highlight
            highlight.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)'; // Add shadow for elevation effect
        });

        highlight.addEventListener('mouseout', () => {
            highlight.style.transform = 'scale(1.0)'; // Reset the size of the highlight
            highlight.style.boxShadow = 'none'; // Remove the shadow
        });

        highlight.addEventListener('click', () => {
            skipToTime(highlights[i].start_time);
        });

        const text = document.createElement('button');
        text.textContent = highlights[i].highlight; // Use the highlight text from the response
        text.style.fontSize = '18px';
        highlight.appendChild(text);

        const percentage = document.createElement('button');
        percentage.textContent = i === 0 ? '75%' : '20%'; // Replace this with actual data if available
        percentage.style.background = i === 0 ? 'limegreen' : 'red';
        percentage.style.borderRadius = '50%';
        percentage.style.padding = '5px 15px';
        percentage.style.color = 'white';
        percentage.style.fontSize = '18px';
        highlight.appendChild(percentage);

        container.appendChild(highlight);
    }

    const aiCoach = document.createElement('div');
    aiCoach.style.background = 'rgba(255, 255, 255, 0.8)';
    aiCoach.style.borderRadius = '20px';
    aiCoach.style.padding = '10px 20px';
    aiCoach.style.marginTop = '15px';
    aiCoach.textContent = 'Ask your AI coach...';
    aiCoach.style.fontSize = '20px';
    aiCoach.style.textAlign = 'center';

    container.appendChild(aiCoach);

    return container;
}


