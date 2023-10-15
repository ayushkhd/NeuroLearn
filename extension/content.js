console.log("Content script has loaded and is running!");

// chrome.runtime.onMessage.addListener(
//     (request, sender, sendResponse) => {

//         console.log("received message")
  
//         // const timestamp1 = request.message;
//         // const timestamp2 = request.content;

//         const timeDuration = document.getElementsByClassName('ytp-time-duration')[0].innerHTML;

//         const [minutes, seconds] = timeDuration.split(":").map(Number);
//         const totalSeconds = minutes * 60 + seconds;


//         // Assuming progressBar is the element representing the progress bar and its width can be used to calculate the position and size of the highlight
//         const progressBar = document.getElementsByClassName('ytp-progress-bar-container')[0];

//         // Assuming timestamp1 and timestamp2 are in seconds and represent a portion of the video's total duration
//         const timestamp1 = timeToSeconds(request.message); 
//     const timestamp2 = timeToSeconds(request.content); 

//         // Assuming totalDuration represents the total duration of the video in seconds
//         const totalDuration = totalSeconds; // Example value in seconds

//         // Calculate position and width of the highlight based on timestamps
//         const highlightPosition = (timestamp1 / totalDuration) * progressBar.offsetWidth;
//         const highlightWidth = ((timestamp2 - timestamp1) / totalDuration) * progressBar.offsetWidth;

//         // Create and style the highlight element
//         const highlight = document.createElement('div');
//         highlight.style.position = 'absolute';
//         highlight.style.backgroundColor = 'green';
//         highlight.style.height = '100%';
//         highlight.style.width = `${highlightWidth}px`;
//         highlight.style.left = `${highlightPosition}px`;
//         highlight.style.zIndex = '1000';
//         highlight.style.touchAction = 'none';
//         highlight.role = 'slider';
//         highlight.tabIndex = '0';  
//         highlight.draggable = true; // Prefer boolean values when applicable

//         console.log("appending highlight")
//         // Append the highlight element to the progress bar
//         progressBar.appendChild(highlight);



        
//         console.log("returning true")
//         sendResponse({ status: 'success' });
//     }
//   );

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
        
  
        fetch('https://30a0-12-94-170-82.ngrok-free.app/videoHighlight/', {
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
            if(data.highlights && Array.isArray(data.highlights)) {
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
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });


        sendResponse({ status: 'success' });
    }
  );