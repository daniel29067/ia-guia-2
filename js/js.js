class coordinates {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
class sector {
    constructor(coordinates, state, img) {
        this.coordinates = coordinates;
        this.state = state;
        this.img = img;
    }

}

const aspiradora = [new coordinates(document.getElementById('aspiradora').offsetLeft, document.getElementById('aspiradora').offsetTop), 0];

var attemptCounter=0;
var trash = 0;

const board = [{
    sector: [
        new sector(new coordinates(document.getElementById("trashA1").offsetParent.offsetLeft + document.getElementById("trashA1").offsetLeft - 25, document.getElementById("trashA1").offsetParent.offsetTop + document.getElementById("trashA1").offsetTop - 20), false, document.getElementById("trashA1")),
        new sector(new coordinates(document.getElementById("trashA2").offsetParent.offsetLeft + document.getElementById("trashA2").offsetLeft - 25, document.getElementById("trashA2").offsetParent.offsetTop + document.getElementById("trashA2").offsetTop - 20), false, document.getElementById("trashA2")),
        new sector(new coordinates(document.getElementById("trashA3").offsetParent.offsetLeft + document.getElementById("trashA3").offsetLeft - 25, document.getElementById("trashA3").offsetParent.offsetTop + document.getElementById("trashA3").offsetTop - 20), false, document.getElementById("trashA3")),
        new sector(new coordinates(document.getElementById("trashA4").offsetParent.offsetLeft + document.getElementById("trashA4").offsetLeft - 25, document.getElementById("trashA4").offsetParent.offsetTop + document.getElementById("trashA4").offsetTop - 20), false, document.getElementById("trashA4"))
    ],
    state: false
}, {
    sector: [
        new sector(new coordinates(document.getElementById("trashB1").offsetParent.offsetLeft + document.getElementById("trashB1").offsetLeft - 25, document.getElementById("trashB1").offsetParent.offsetTop + document.getElementById("trashB1").offsetTop - 20), false, document.getElementById("trashB1")),
        new sector(new coordinates(document.getElementById("trashB2").offsetParent.offsetLeft + document.getElementById("trashB2").offsetLeft - 25, document.getElementById("trashB2").offsetParent.offsetTop + document.getElementById("trashB2").offsetTop - 20), false, document.getElementById("trashB2")),
        new sector(new coordinates(document.getElementById("trashB3").offsetParent.offsetLeft + document.getElementById("trashB3").offsetLeft - 25, document.getElementById("trashB3").offsetParent.offsetTop + document.getElementById("trashB3").offsetTop - 20), false, document.getElementById("trashB3")),
        new sector(new coordinates(document.getElementById("trashB4").offsetParent.offsetLeft + document.getElementById("trashB4").offsetLeft - 25, document.getElementById("trashB4").offsetParent.offsetTop + document.getElementById("trashB4").offsetTop - 20), false, document.getElementById("trashB4"))
    ],
    state: false
}]

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function moveToLeft(x) {
    var step = 1;
    var xi = document.getElementById('aspiradora').offsetLeft;
    while (xi > x) {
        xi = xi - step;
        document.getElementById('aspiradora').style.left = xi + "px";
        await sleep(10);
    }
}

async function moveToRight(x) {
    var step = 1;
    var xi = document.getElementById('aspiradora').offsetLeft;

    while (xi < x) {
        xi = xi + step;
        document.getElementById('aspiradora').style.left = xi + "px";
        await sleep(10);
    }

}

async function moveToDown(y) {

    var step = 1;
    var yi = document.getElementById('aspiradora').offsetTop;
    while (yi < y) {
        yi = yi + step;
        document.getElementById('aspiradora').style.top = yi + "px";
        await sleep(10);
    }

}

async function moveToUp(y) {
    var step = 1;
    var yi = document.getElementById('aspiradora').offsetTop;
    while (yi > y) {
        yi = yi - step;
        document.getElementById('aspiradora').style.top = yi + "px";
        await sleep(10);
    }

}

async function moverAspiradora(indice, sector) {

    const xi = document.getElementById('aspiradora').offsetLeft;
    const yi = document.getElementById('aspiradora').offsetTop;
    const x = board[indice].sector[sector].coordinates.x;
    const y = board[indice].sector[sector].coordinates.y;

    if (xi > x) {
        await moveToLeft(x);
    }
    if (xi < x) {
        await moveToRight(x);
    }
    if (yi < y) {
        await moveToDown(y);
    }
    if (yi > y) {
        await moveToUp(y);
    }

}

function updateStateSector(x) {
    state = false;
    board[x].sector.forEach((n, i) => {
        if (n.state) {
            board[x].state = true;
            state = true;
        }
    });

    if (!state) {
        board[x].state = false;
    }

}

async function cleaner(indice, sector) {
    await moverAspiradora(indice, sector);
    board[indice].sector[sector].state = false;
    await updateStateSector(indice);
    await sleep(500);
    board[indice].sector[sector].img.style.visibility = "hidden";
    console.log("sector aspidaro...");
    trash = trash - 1;
}

async function creartrash() {
    var indice = Math.floor(Math.random() * (2 - 0) + 0);
    var sector = Math.floor(Math.random() * (4 - 0) + 0);
    var tmp = board[indice].sector[sector];

    if (trash == 8) {
        console.log('error...');
        return
    }

    if (tmp.state == false) {
        tmp.img.style.visibility = true;
        tmp.state = true;
        tmp.img.style.visibility = "visible";
        updateStateSector(indice);
        return
    }

    creartrash();
}

async function fillInBoard(x) {
    var valori = 1;
    while (valori <= x) {
        while (trash == 8) {
            console.log("Espere 10 seg mientras se la aspiradora limpia...");
            await sleep(10000);
        }

        await creartrash();

        trash = trash + 1;
        valori = valori + 1;
        tiempo = (Math.floor(Math.random() * (5 - 3) + 3)) * 1000
        console.log(tiempo);
        await sleep(tiempo);
    }
}

function changeSector() {
    if (aspiradora[1] == 1) {
        aspiradora[1] = 0;
        return
    }
    aspiradora[1] = 1;
}

function start() {
    document.getElementById("start").disabled=true;
    let attempt = document.getElementById("intentosAspirar").value;
    let trashCounter = document.getElementById("cantidadBasuras").value;
    fillInBoard(parseInt(trashCounter));
    findAllTrash(parseInt(attempt));
    document.getElementById("instentosAspirar").innerHTML=0;
    attemptCounter=0;
    
}

async function findAllTrash(attempt) {

    var sector = null;
    

    for (var i = 0; i <= 3; i++) {
        if (board[aspiradora[1]].sector[i].state) {
            sector = i;
            break;
        }
    }

    if (sector != null) {
        await cleaner(aspiradora[1], sector);
        sector=null;
    }

    if (!board[aspiradora[1]].state) {
        await changeSector();
    }

    if (trash == 0) {
        await sleep(5000);
        console.log("No se encontró basuras");
        sector = null;
        attemptCounter+=1;
        console.log(attemptCounter);
        document.getElementById("instentosAspirar").innerHTML=attemptCounter;
    }

    if(attemptCounter>=attempt){
        alert("Limpieza terminada");
        document.getElementById("start").disabled=false;
        return;
    }

    findAllTrash(attempt);

}