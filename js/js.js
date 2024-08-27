class Coordinates {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Sector {
    constructor(coordinates, state, img) {
        this.coordinates = coordinates;
        this.state = state;
        this.img = img;
    }
}

const chargingStation = document.getElementById('chargingStation');
const aspiradora = document.getElementById('aspiradora');

let trash = 0;

const board = [
    {
        sector: [
            new Sector(new Coordinates(document.getElementById("trashA1").offsetParent.offsetLeft + document.getElementById("trashA1").offsetLeft - 25, document.getElementById("trashA1").offsetParent.offsetTop + document.getElementById("trashA1").offsetTop - 20), false, document.getElementById("trashA1")),
            new Sector(new Coordinates(document.getElementById("trashA2").offsetParent.offsetLeft + document.getElementById("trashA2").offsetLeft - 25, document.getElementById("trashA2").offsetParent.offsetTop + document.getElementById("trashA2").offsetTop - 20), false, document.getElementById("trashA2")),
            new Sector(new Coordinates(document.getElementById("trashA3").offsetParent.offsetLeft + document.getElementById("trashA3").offsetLeft - 25, document.getElementById("trashA3").offsetParent.offsetTop + document.getElementById("trashA3").offsetTop - 20), false, document.getElementById("trashA3")),
            new Sector(new Coordinates(document.getElementById("trashA4").offsetParent.offsetLeft + document.getElementById("trashA4").offsetLeft - 25, document.getElementById("trashA4").offsetParent.offsetTop + document.getElementById("trashA4").offsetTop - 20), false, document.getElementById("trashA4"))
        ],
        state: false
    },
    {
        sector: [
            new Sector(new Coordinates(document.getElementById("trashB1").offsetParent.offsetLeft + document.getElementById("trashB1").offsetLeft - 25, document.getElementById("trashB1").offsetParent.offsetTop + document.getElementById("trashB1").offsetTop - 20), false, document.getElementById("trashB1")),
            new Sector(new Coordinates(document.getElementById("trashB2").offsetParent.offsetLeft + document.getElementById("trashB2").offsetLeft - 25, document.getElementById("trashB2").offsetParent.offsetTop + document.getElementById("trashB2").offsetTop - 20), false, document.getElementById("trashB2")),
            new Sector(new Coordinates(document.getElementById("trashB3").offsetParent.offsetLeft + document.getElementById("trashB3").offsetLeft - 25, document.getElementById("trashB3").offsetParent.offsetTop + document.getElementById("trashB3").offsetTop - 20), false, document.getElementById("trashB3")),
            new Sector(new Coordinates(document.getElementById("trashB4").offsetParent.offsetLeft + document.getElementById("trashB4").offsetLeft - 25, document.getElementById("trashB4").offsetParent.offsetTop + document.getElementById("trashB4").offsetTop - 20), false, document.getElementById("trashB4"))
        ],
        state: false
    }
];

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function moveTo(x, y) {
    document.getElementById("messages").innerHTML = "<p>En movimiento...</p>";
    const step = 1;
    let xi = document.getElementById('aspiradora').offsetLeft;
    let yi = document.getElementById('aspiradora').offsetTop;
    const epsilon = 1; // Tolerancia para evitar rebote

    // Move horizontally
    while (Math.abs(xi - x) > epsilon) {
        xi += xi < x ? step : -step;
        document.getElementById('aspiradora').style.left = xi + "px";
        await sleep(10);
    }

    // Move vertically
    while (Math.abs(yi - y) > epsilon) {
        yi += yi < y ? step : -step;
        document.getElementById('aspiradora').style.top = yi + "px";
        await sleep(10);
    }

    // Correct final position
    document.getElementById('aspiradora').style.left = x + "px";
    document.getElementById('aspiradora').style.top = y + "px";

    document.getElementById("messages").innerHTML = ""; // Clear message after moving
}

async function moveToSector(indice, sector) {
    const target = board[indice].sector[sector].coordinates;
    await moveTo(target.x, target.y);
}

function updateSectorState(x) {
    const sector = board[x].sector;
    board[x].state = sector.some(s => s.state);
}

async function cleanSector(indice, sector) {
    await moveToSector(indice, sector);
    const sectorObj = board[indice].sector[sector];
    if (sectorObj.state) {
        sectorObj.img.style.visibility = "hidden";
        displayMessage(`Limpiando sector ${sector + 1} en habitación ${indice + 1}`);
        trash--;
        sectorObj.state = false; // Marcar el sector como limpio
    } else {
        displayMessage(`Sector ${sector + 1} en habitación ${indice + 1} ya está limpio`);
    }
    updateSectorState(indice);
    await sleep(500);
}

function createTrash() {
    const sectors = [0, 1, 2, 3];
    sectors.forEach(sector => {
        const indice = Math.floor(Math.random() * 2);
        board[indice].sector[sector].state = true;
        board[indice].sector[sector].img.style.visibility = "visible";
    });
}

function displayMessage(message) {
    const messagesDiv = document.getElementById("messages");
    messagesDiv.innerHTML = `<p>${message}</p>` + messagesDiv.innerHTML;
}

async function start() {
    document.getElementById("start").disabled = true;
    document.getElementById("messages").innerHTML = "";

    // Set initial position of aspiradora to the charging station
    const startPos = chargingStation.getBoundingClientRect();
    document.getElementById('aspiradora').style.left = startPos.left + "px";
    document.getElementById('aspiradora').style.top = startPos.top + "px";

    // Create trash initially
    createTrash();
    trash = 8;

    // Clean sectors in order
    for (let room = 0; room < 2; room++) {
        for (let sector = 0; sector < 4; sector++) {
            await cleanSector(room, sector);
        }
    }

    // Move back to the charging station
    await moveTo(startPos.left, startPos.top);
    displayMessage("La simulación ha terminado");
    alert("La simulación ha terminado");
    document.getElementById("start").disabled = false;
}

// Make sure to position the aspiradora at the charging station on page load
window.onload = () => {
    const startPos = chargingStation.getBoundingClientRect();
    document.getElementById('aspiradora').style.left = startPos.left + "px";
    document.getElementById('aspiradora').style.top = startPos.top + "px";
}
