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