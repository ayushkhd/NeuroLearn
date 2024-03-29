const checkForKey = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['openai-key'], (result) => {
      resolve(result['openai-key']);
    });
  });
};

const encode = (input) => {
  return btoa(input);
};

const saveKey = () => {
  const input = document.getElementById('key_input');

  if (input) {
    const { value } = input;

    // Encode String
    const encodedValue = encode(value);

    // Save to google storage
    chrome.storage.local.set({ 'openai-key': encodedValue }, () => {
      document.getElementById('key_needed').style.display = 'none';
      document.getElementById('key_entered').style.display = 'block';
    });
  }
};

const getKey = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['openai-key'], (result) => {
      if (result['openai-key']) {
        const decodedKey = atob(result['openai-key']);
        resolve(decodedKey);
      }
    });
  });
};


const submitQuestion = async () => {
  const question = document.getElementById('question_input').value;
  const key = await getKey();

  try {
    let activeTab = await getActiveTabUrl();
    console.log(question);
    console.log(key);
    console.log(activeTab);
  } catch (error) {
    console.error('Error getting active tab URL:', error);
  }
}



const getActiveTabUrl = () => {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (chrome.runtime.lastError) {
        return reject(new Error(chrome.runtime.lastError));
      }
      resolve(tabs[0].url);
    });
  });
}

const submitTimestamps = () => {

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0].id;
    console.log("sending message")
    chrome.tabs.sendMessage(
      activeTab,
      { message: tabs[0].url, },
      (response) => {
        if (response) {
          if (response.status === 'failed') {
            console.log('injection failed.');
          }
        } else {
          console.log('No response received.');
        }
      }
    );
    //console.log(tabs[0].url);
  });




}


// const changeKey = () => {
//   document.getElementById('key_needed').style.display = 'block';
//   document.getElementById('key_entered').style.display = 'none';
// };

// document.getElementById('save_key_button').addEventListener('click', saveKey);
// document
//   .getElementById('change_key_button')
//   .addEventListener('click', changeKey);

// document.getElementById('submit-question').addEventListener('click', submitQuestion);

document.getElementById('start-button').addEventListener('click', submitTimestamps);

// checkForKey().then((response) => {
//   if (response) {
//     document.getElementById('key_needed').style.display = 'none';
//     document.getElementById('key_entered').style.display = 'block';
//   }
// });


// const { Neurosity } = require("@neurosity/sdk");
// require("dotenv").config();

// const deviceId = process.env.NEUROSITY_DEVICE_ID || ""
// const email = process.env.NEUROSITY_EMAIL || "";
// const password = process.env.NEUROSITY_PASSWORD || "";

// const neurosity = new Neurosity({
//   deviceId
// });

// const main = async () => {
//   await neurosity
//     .login({
//       email,
//       password
//     })
//     .catch((error) => {
//       console.log(error);
//       throw new Error(error);
//     });
//   console.log("Logged in");

//   neurosity.focus().subscribe((focus) => {
//     if (focus.probability > 0.3) {
//       console.log("Hello World! ", focus.probability);
//       chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//         chrome.tabs.sendMessage(tabs[0].id, { focusProbability: focus.probability });
//       });
//     }
//   });

// };


// main();