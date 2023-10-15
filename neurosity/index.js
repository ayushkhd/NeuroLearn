const { Neurosity } = require("@neurosity/sdk");
require("dotenv").config();
const focusEmitter = require('./server.js');

const deviceId = process.env.NEUROSITY_DEVICE_ID || "";
const email = process.env.NEUROSITY_EMAIL || "";
const password = process.env.NEUROSITY_PASSWORD || "";

const neurosity = new Neurosity({ deviceId });

let focusSubscription = null;

const main = async () => {
    try {
        await neurosity.login({
            email,
            password
        });
        console.log("Logged in");

        // Subscribe to focus data from Neurosity
        focusSubscription = neurosity.focus().subscribe((focus) => {
            if (focus.probability > 0.1) {
                console.log(focus.probability);
                focusEmitter.emit('newFocusScore', focus.probability); // Emit the focus score to the server
            }
        });

    } catch (error) {
        console.error("Error during login:", error);
    }
};

main();
