function createGreenRing(percentage) {
    const greenRing = document.createElement('div');
    greenRing.style.width = '100px';
    greenRing.style.height = '100px';
    greenRing.style.border = '10px solid green';
    greenRing.style.borderRadius = '50%';
    greenRing.style.display = 'flex';
    greenRing.style.justifyContent = 'center';
    greenRing.style.alignItems = 'center';
    greenRing.style.backgroundImage = `conic-gradient(green ${percentage * 100}%, transparent 0)`;

    const number = document.createElement('p');
    number.textContent = percentage * 100 + '%';

    greenRing.appendChild(number);
    document.body.appendChild(greenRing);
}


