const canvas = document.getElementById("canvas");
const toolbar = document.querySelector(".toolbar");
const increaseBtn = document.getElementById("increase");
const decreaseBtn = document.getElementById("decrease");
const sizeEl = document.getElementById("size");
const colorEl = document.getElementById("color");
const clearEl = document.getElementById("clear");
const undoButton = document.querySelector(".undo");
const redoButton = document.querySelector(".redo");
const eraseButton = document.querySelector(".erase");
const zoomIn = document.querySelector('.fas.fa-search-plus');
const zoomOut = document.querySelector('.fas.fa-search-minus');
const grid = document.querySelector('.grid');
const colorButton = document.querySelector('.filter');
const inputButton = document.querySelector('.file');
const ctx = canvas.getContext("2d");


let size = 30;
let isPressed = false;
let isFile = false;
let isErase = false;
let color = "black";
let x = undefined;
let y = undefined;
let zoomArray = [];
let restoreArray = [];
let redoArray = [];
let index = -1;
let startBackgroundColor = "#ecf0f1";


var zoomLevel = 1.00;



canvas.height = window.innerHeight;
canvas.width = window.innerWidth;



canvas.addEventListener("touchstart", start, false);
canvas.addEventListener("touchmove", draw, false);
canvas.addEventListener("mousedown", start, false);
canvas.addEventListener("mousemove", draw, false);

canvas.addEventListener("touchend", stop, false);
canvas.addEventListener("mouseup", stop, false);
canvas.addEventListener("mouseout", stop, false);
canvas.addEventListener("mousemove", rubPart, false);

const fileButton = document.getElementById('upload-photo');
fileButton.addEventListener('change', function (e) {
    isFile = !isFile;
    let imageFile = e.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onloadend = function (e) {
        var myImage = new Image(); // Creates image object
        star_img.src = e.target.result; // Assigns converted image to image object
    }
})


var star_img = new Image();
var isDraggable = false;

var currentX = 0;
var currentY = 0;

window.onload = function () {
    // canvas = document.getElementById("canvas");
    // ctx = canvas.getContext("2d");
    if(isFile==false){
        currentX = canvas.width / 2;
        currentY = canvas.height / 2;
    
        star_img.onload = function () {
            _Go();
        };
    }
    //star_img.src = "data:image/png;base64,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";
    //star_img.src = 'download.jpg';
};

function _Go() {
    if (isFile == true) {
        _MouseEvents();

        setInterval(function () {
            _ResetCanvas();
            _DrawImage();
        }, 1000 / 30);
    }
}
function _ResetCanvas() {
    ctx.fillStyle = startBackgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
function _MouseEvents() {
    canvas.onmousedown = function (e) {

        var mouseX = e.pageX - this.offsetLeft;
        var mouseY = e.pageY - this.offsetTop;


        if (mouseX >= (currentX - star_img.width / 2) &&
            mouseX <= (currentX + star_img.width / 2) &&
            mouseY >= (currentY - star_img.height / 2) &&
            mouseY <= (currentY + star_img.height / 2)) {
            isDraggable = true;
            //currentX = mouseX;
            //currentY = mouseY;
        }
    };
    canvas.onmousemove = function (e) {

        if (isDraggable) {
            currentX = e.pageX - this.offsetLeft;
            currentY = e.pageY - this.offsetTop;
        }
    };
    canvas.onmouseup = function (e) {
        isDraggable = false;
    };
    canvas.onmouseout = function (e) {
        isDraggable = false;
    };
}
function _DrawImage() {
    ctx.drawImage(star_img, currentX - (star_img.width / 2), currentY - (star_img.height / 2));
}




function start(event) {
    if (isErase == false && isDraggable == false) {
        isPressed = true;
        ctx.beginPath();
        ctx.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
        event.preventDefault();
    }
}

function draw(event) {
    if (isPressed == true && isDraggable == false) {
        ctx.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
        ctx.strokeStyle = color;
        ctx.lineWidth = size;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();
    }
    event.preventDefault();
}

function stop(event) {
    if (isPressed == true && isDraggable == false) {
        ctx.stroke();
        ctx.closePath();
        isPressed = false;
    }
    event.preventDefault();
    if (event.type != 'mouseout') {
        restoreArray.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        index += 1;
    }
    console.log(restoreArray);
}




increaseBtn.addEventListener("click", () => {
    size += 5;

    if (size > 50) {
        size = 50;
    }

    updateSizeOnScreen();
});

decreaseBtn.addEventListener("click", () => {
    size -= 5;

    if (size < 5) {
        size = 5;
    }

    updateSizeOnScreen();
});

colorEl.addEventListener("change", (e) => {
    color = e.target.value;
});

clearEl.addEventListener("click", clearCanvas);
undoButton.addEventListener('click', undo_last);

redoButton.addEventListener("click", redo_last);
eraseButton.addEventListener("click", erase);
zoomIn.addEventListener("click", function () {
    if (zoomLevel < 2) {
        zoomLevel += 0.5;
    }

    ctx.scale(zoomLevel, zoomLevel);
    let cvSave = canvas.toDataURL("image/png");
    var img = new Image;
    //context.clearRect(0, 0, canvas.width, canvas.height);
    img.onload = function () {
        ctx.drawImage(img, 0, 0); // Or at whatever offset you like
    };
    img.src = cvSave;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
})

zoomOut.addEventListener('click', function () {
    if (zoomLevel > 1) {
        zoomLevel -= 0.5;
    }
    ctx.scale(0.5, 0.5);

    let cvSave = canvas.toDataURL("image/png");

    var img = new Image;
    //context.clearRect(0, 0, canvas.width, canvas.height);
    img.onload = function () {
        ctx.drawImage(img, 0, 0); // Or at whatever offset you like
    };
    img.src = cvSave;
    ctx.clearRect(100, 100, canvas.width, canvas.height);


})

grid.addEventListener('click', function () {
    for (let x = 0.5; x < canvas.width; x += 10) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.width);
    }

    for (let y = 0.5; y < canvas.height; y += 10) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
    }

    ctx.moveTo(0, 0);


    ctx.strokeStyle = "#ddd";
    ctx.stroke();
})

colorButton.addEventListener('click', function (e) {
    let taskFilter = e.target;
    let colorArr = ["pink", "blue", "green", "black"];
    let cColor = taskFilter.classList[1];
    let idx = colorArr.indexOf(cColor);
    let newColor = colorArr[(idx + 1) % 4];
    taskFilter.classList.remove(cColor);
    taskFilter.classList.add(newColor);
    canvas.style.background = cColor;
})

function updateSizeOnScreen() {
    sizeEl.innerText = size;
}

function clearCanvas() {
    ctx.fillStyle = startBackgroundColor;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    restoreArray = [];
    index = -1;
}

function undo_last() {
    if (index <= 0) {
        clearCanvas();
    } else {
        index -= 1;
        redoArray.push(restoreArray.pop());
        ctx.putImageData(restoreArray[index], 0, 0);
    }
}

function redo_last() {
    if (redoArray.length == 0) {
        console.log(redoArray)
        return;
    } else {
        let data = redoArray.pop();
        restoreArray.push(data);
        index += 1;
        ctx.putImageData(data, 0, 0);
    }
}

function erase() {
    isErase = !isErase;
}

function rubPart(event) {
    if (isErase == true) {
        let x = event.clientX - canvas.offsetLeft;
        let y = event.clientY - canvas.offsetTop;
        redoArray.push(ctx.getImageData(x, y, canvas.width, canvas.height));
        ctx.fillStyle = startBackgroundColor;
        ctx.clearRect(x, y, canvas.width, canvas.height);
        ctx.fillRect(x, y, canvas.width, canvas.height);
        restoreArray.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    }
}



