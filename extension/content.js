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

const AUDIO_WAVE_SVGS = [
    "https://gist.githubusercontent.com/ColabDog/166f74eafc06b13285cd4a38268f8d3e/raw/b868191314064d7120a1e8f5944b460c88fe63fa/audio-wave-5.svg",
    "https://gist.githubusercontent.com/ColabDog/4dcfb4e1ae34dd8f31930f5ade26b204/raw/3574168948e5a1b828584997e9941c86a8434f53/audio-wave-4.svg",
    "https://gist.githubusercontent.com/ColabDog/f860a07594eb306946568d01f2bdd877/raw/c3a3bc62cb2eb032040d67bf93a5d1ae3f154e82/audio-wave-3.svg",
    "https://gist.githubusercontent.com/ColabDog/54bdaf7e183d8cc80fbfc43aad738386/raw/355a3518d7506729d7977d5fc5f61049931fcbec/audio-wave-2.svg",
    "https://gist.githubusercontent.com/ColabDog/64d38f49798e52dc67006cc042a93c05/raw/8aed750cfa8a15173b93744343b4324758b34f60/audio-wave-1.svg"
]

async function playAudio(text, imageElement) {

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
        const duration = audioBuffer.duration * 1000;

        audioSource.buffer = audioBuffer;
        audioSource.connect(audioContext.destination);
        audioSource.start(0);
        // on ended hide
        // Add an event listener to hide the imageElement when the audio finishes playing
        setTimeout(() => {
            imageElement.style.display = 'none';
        }, duration);

    } else {
        throw new Error(`Error: ${response.statusText}`);
    }
}

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {

        console.log(request.message)

        fetchElementAndParentDupe(request.message);


        sendResponse({ status: 'success' });

    })

generateOutputs = (context, url) => {
    console.log(url)

    const player = document.getElementById("movie_player");
    console.log(player);  // This should log the player object or null.

    console.log(typeof player.seekTo);  // This should log "function" if it's available.


    // This is the code you'll be injecting into the page


    console.log("received message")

    var videoHighlight = {
        videoToHighlight: url,
        objective: context,
    };


    // Start loading state
    document.body.style.cursor = 'wait';

    fetch('https://166a-12-94-170-82.ngrok-free.app/videoHighlight/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(videoHighlight),
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);

            // End loading state
            document.body.style.cursor = 'default';

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
                let result = fetchElementAndParent(data.highlights, url);
                if (result) {
                    console.log("Filtered element:", result.filteredElement);
                    console.log("Parent of filtered element:", result.parentElement);
                } else {
                    console.log("Element not found");
                }
            }
        })
        .catch((error) => {
            // End loading state in case of error
            document.body.style.cursor = 'default';

            console.error('Error:', error);
        });


}






function fetchElementAndParent(highlights, url) {
    // Fetch the specific div element with the given class and ID
    let filteredElement = document.querySelector('div#neurolearn_container');
    if (!filteredElement) {
        filteredElement = document.querySelector('div.style-scope.ytd-watch-flexy#secondary');
    }

    console.log("inside function")

    if (filteredElement) {
        // Get the parent of the filtered element
        let parentElement = filteredElement.parentElement;

        // Remove the filtered element from the DOM
        console.log("boutta remove")
        filteredElement.remove();

        const neuroLearnElement = createNeuroLearnElement(highlights, url);
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

function createNeuroLearnElement(highlights, url) {
    const container = document.createElement('div');
    container.id = 'neurolearn_container';
    container.style.background = 'linear-gradient(to bottom right, #2596be, #183d6e)';  // Gradient from #2596be to #183d6e at the low bottom right
    container.style.borderRadius = '10px';
    container.style.width = '28%';  // Adjust width as needed
    container.style.marginBottom = '20px';
    container.style.zIndex = '31';

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

    const holdingDiv = document.createElement('div');
    holdingDiv.style.width = '100%';


    const contextInput = document.createElement('input');
    contextInput.type = 'text';
    contextInput.name = 'context';
    contextInput.id = 'context';
    contextInput.placeholder = 'Enter new context here';
    contextInput.style.background = 'rgba(255, 255, 255, 0.5)';
    contextInput.style.borderRadius = '20px';
    contextInput.style.padding = '10px 20px';
    contextInput.style.marginTop = '15px';
    contextInput.style.fontSize = '16px';
    contextInput.style.fontFamily = 'Poppins, sans-serif'; // Make the font Poppins
    contextInput.style.margin = 'auto'; // Center the input horizontally
    contextInput.style.width = '80%';
    contextInput.style.display = 'flex';
    contextInput.style.alignItems = 'center';
    contextInput.style.justifyContent = 'center';
    contextInput.style.height = '100%'; // Add this line to make the text vertically centered
    contextInput.style.boxShadow = '0px 4px 8px 0px rgba(0, 0, 0, 0.2)'; // Add drop shadow
    contextInput.style.padding = '10px 20px';
    contextInput.style.marginBottom = '10px';

    holdingDiv.appendChild(contextInput);

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Submit';
    submitButton.addEventListener('click', function () {
        generateOutputs(contextInput.value, url);
    });

    submitButton.style.background = '#00d4ff';
    submitButton.style.color = 'white';
    submitButton.style.borderRadius = '20px';
    submitButton.style.padding = '10px 20px';
    submitButton.style.marginTop = '15px';
    submitButton.style.margin = 'auto'; // Center the button horizontally
    submitButton.style.fontSize = '20px';
    submitButton.style.border = 'none';
    submitButton.style.cursor = 'pointer';
    submitButton.style.outline = 'none';
    submitButton.style.fontWeight = 'bold';
    contextInput.style.display = 'flex';
    contextInput.style.alignItems = 'center';
    contextInput.style.justifyContent = 'center';
    contextInput.style.height = '100%'; // Add this line to make the text vertically centered
    submitButton.style.transition = 'all 0.3s ease'; // Add transition for smooth animation
    submitButton.style.boxShadow = '0px 4px 8px 0px rgba(0, 0, 0, 0.2)'; // Add drop shadow
    submitButton.style.marginLeft = '20px';

    submitButton.style.width = '90%';


    holdingDiv.appendChild(submitButton);

    holdingDiv.style.marginBottom = '20px';

    container.appendChild(holdingDiv);
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
        highlight.style.marginLeft = '20px';
        highlight.style.marginRight = '20px';
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
        description.style.marginLeft = '30px';
        description.style.marginRight = '20px';
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
        container.appendChild(description);

        const questionButton = document.createElement('button');
        questionButton.innerHTML = 'Quiz yourself';
        questionButton.style.background = '#00d4ff';
        questionButton.style.color = 'white';
        questionButton.style.paddingRight = '10px';
        questionButton.style.borderRadius = '20px';
        questionButton.style.marginTop = '5px';
        questionButton.style.border = '0px';
        questionButton.style.marginBottom = '15px';
        questionButton.style.marginLeft = '30px';
        questionButton.style.transition = 'all 0.3s ease'; // Add transition for smooth animation


        questionButton.onmouseover = function () {
            this.style.transform = 'scale(1.1)'; // Grow by 10% on hover
        }
        questionButton.onmouseout = function () {
            this.style.transform = 'scale(1.0)'; // Reset size when not hovering
        }

        questionButton.addEventListener('click', function () {

            var video = document.getElementsByTagName('video')[0];
            video.pause();

            // Display the audio SVG images when audio is played
            const images = AUDIO_WAVE_SVGS;
            let currentImageIndex = 0;
            const imageElement = document.createElement('img');
            imageElement.src = images[currentImageIndex];
            imageElement.style.opacity = '1'; // Set initial opacity to 1
            imageElement.style.width = '500px'; // Set the width of the image to 500px
            container.appendChild(imageElement);

            // Set an interval to change the image source every 4 seconds (2 seconds for fading out and 2 seconds for fading in)
            setInterval(function () {
                currentImageIndex = (currentImageIndex + 1) % images.length; // Loop through the images

                // Fade out the current image
                imageElement.style.transition = 'opacity 20s ease-in-out';
                imageElement.style.opacity = '0';

                // After the current image fades out, change the image source and start fading it in
                setTimeout(function () {
                    imageElement.src = images[currentImageIndex];
                    imageElement.style.opacity = '1';
                }, 400); // Trigger after 2 seconds (2000 milliseconds), which is the time it takes for the current image to fade out
            }, 120); // Change image every 4 seconds (4000 milliseconds)

            playAudio(item.questions[0], imageElement);

        });

        container.appendChild(questionButton);

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
    aiCoach.style.marginLeft = '20px';
    aiCoach.style.width = '100%';
    aiCoach.style.display = 'flex';
    aiCoach.style.alignItems = 'center';
    aiCoach.style.justifyContent = 'center';
    aiCoach.style.height = '100%'; // Add this line to make the text vertically centered
    aiCoach.style.boxShadow = '0px 4px 8px 0px rgba(0, 0, 0, 0.2)'; // Add drop shadow
    aiCoach.style.padding = '10px 20px';
    flexDiv.style.marginRight = '20px';



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

    // Assuming 'createCircularElement' is defined somewhere in your content.js
    // or in another JS file that gets loaded before content.js.

    // Create a new section for the circular element
    const newSection = document.createElement('div');
    newSection.style.display = 'flex';
    newSection.style.justifyContent = 'center';
    newSection.style.alignItems = 'center';
    newSection.style.marginTop = '20px';
    newSection.style.position = 'fixed';
    newSection.style.bottom = '0';
    newSection.style.right = '0';
    newSection.style.left = 'auto';

    // Create and append the initial circular element
    let circleElement = createCircularElement(5);
    newSection.appendChild(circleElement);

    // Append the new section to the body, ensuring it's visible
    document.body.appendChild(newSection);

    // Listen for messages from the background script
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if (request && request.focusProbability !== undefined) {
            console.log("Content script received focus probability:", request.focusProbability);

            // Create a new circular element based on the received focus probability
            const newCircleElement = createCircularElement(Math.round(request.focusProbability * 100));

            // Replace the old circle with the new one
            newSection.replaceChild(newCircleElement, circleElement);

            // Update our reference to the current circle element
            circleElement = newCircleElement;
        }
    });

    flexDiv.appendChild(aiCoach);
    flexDiv.appendChild(aiCoachButton);

    container.appendChild(flexDiv);
    container.appendChild(newSection);
    // // Create an array of images
    // const images = AUDIO_WAVE_SVGS;

    // let currentImageIndex = 0;

    // // Create an image element, set its initial source, and style it
    // const imageElement = document.createElement('img');
    // imageElement.src = images[currentImageIndex];
    // imageElement.style.opacity = '1'; // Set initial opacity to 1
    // imageElement.style.width = '500px'; // Set the width of the image to 60px
    // container.appendChild(imageElement);

    // // Set an interval to change the image source every 2 seconds
    // setInterval(function () {
    //     currentImageIndex = (currentImageIndex + 1) % images.length; // Loop through the images
    //     // Fade out the current image
    //     imageElement.style.transition = 'opacity 1s ease-in-out';
    //     imageElement.style.opacity = '1';
    //     // After the half of the fade out transition ends, change the image source and start fading it in
    //     setTimeout(function () {
    //         imageElement.src = images[currentImageIndex];
    //         // imageElement.style.opacity = '1';
    //     }, 5); // Changed from 1000 to 500 for overlapping transitions
    // }, 120);



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







function fetchElementAndParentDupe(url) {
    // Fetch the specific div element with the given class and ID
    let filteredElement = document.querySelector('div.style-scope.ytd-watch-flexy#secondary');
    console.log("inside function")

    if (filteredElement) {
        // Get the parent of the filtered element
        let parentElement = filteredElement.parentElement;

        // Remove the filtered element from the DOM
        console.log("boutta remove")
        filteredElement.remove();

        const neuroLearnElement = createNeuroLearnElementDupe(url);
        parentElement.appendChild(neuroLearnElement);

        return {
            filteredElement: filteredElement,
            parentElement: parentElement
        };
    } else {
        return null;
    }
}

function createNeuroLearnElementDupe(url) {
    const container = document.createElement('div');
    container.id = 'neurolearn_container';
    container.style.background = 'linear-gradient(to bottom right, #2596be, #183d6e)';  // Gradient from #2596be to #183d6e at the low bottom right
    container.style.borderRadius = '10px';
    container.style.width = '28%';  // Adjust width as needed
    container.style.marginBottom = '20px';
    container.style.zIndex = '31';

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

    const holdingDiv = document.createElement('div');
    holdingDiv.style.width = '100%';


    const contextInput = document.createElement('input');
    contextInput.type = 'text';
    contextInput.name = 'context';
    contextInput.id = 'context';
    contextInput.placeholder = 'Enter new context here';
    contextInput.style.background = 'rgba(255, 255, 255, 0.5)';
    contextInput.style.borderRadius = '20px';
    contextInput.style.padding = '10px 20px';
    contextInput.style.marginTop = '15px';
    contextInput.style.fontSize = '16px';
    contextInput.style.fontFamily = 'Poppins, sans-serif'; // Make the font Poppins
    contextInput.style.margin = 'auto'; // Center the input horizontally
    contextInput.style.width = '80%';
    contextInput.style.display = 'flex';
    contextInput.style.alignItems = 'center';
    contextInput.style.justifyContent = 'center';
    contextInput.style.height = '100%'; // Add this line to make the text vertically centered
    contextInput.style.boxShadow = '0px 4px 8px 0px rgba(0, 0, 0, 0.2)'; // Add drop shadow
    contextInput.style.padding = '10px 20px';
    contextInput.style.marginBottom = '10px';

    holdingDiv.appendChild(contextInput);

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Submit';
    submitButton.addEventListener('click', function () {
        generateOutputs(contextInput.value, url);
    });

    submitButton.style.background = '#00d4ff';
    submitButton.style.color = 'white';
    submitButton.style.borderRadius = '20px';
    submitButton.style.padding = '10px 20px';
    submitButton.style.marginTop = '15px';
    submitButton.style.margin = 'auto'; // Center the button horizontally
    submitButton.style.fontSize = '20px';
    submitButton.style.border = 'none';
    submitButton.style.cursor = 'pointer';
    submitButton.style.outline = 'none';
    submitButton.style.fontWeight = 'bold';
    contextInput.style.display = 'flex';
    contextInput.style.alignItems = 'center';
    contextInput.style.justifyContent = 'center';
    contextInput.style.height = '100%'; // Add this line to make the text vertically centered
    submitButton.style.transition = 'all 0.3s ease'; // Add transition for smooth animation
    submitButton.style.boxShadow = '0px 4px 8px 0px rgba(0, 0, 0, 0.2)'; // Add drop shadow
    submitButton.style.marginLeft = '20px';

    submitButton.style.width = '90%';


    holdingDiv.appendChild(submitButton);

    holdingDiv.style.marginBottom = '20px';

    container.appendChild(holdingDiv);


    return container;
}

