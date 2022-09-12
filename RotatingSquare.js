"use strict";
var width;  
var height; 
var vtx = new Float32Array([
    -0.5, -0.5, 0.5,
    -0.5, 0.5, 0.5,
    -0.5, -0.5, 0.5,
    0.5, -0.5, 0.5,
]);
var sq1 = new Float32Array([ 
    -0.6, -0.6, 0.6,
    -0.6, 0.6, 0.6,
    -0.6, -0.6, 0.6,
    0.6, -0.6, 0.6,
]);
var numPoints = vtx.length / 2;
var ANGLE_INCREMENT = 30.0;
var last_time = Date.now();
function mapToViewport (x, y, n = 5) {
    return [((x + n / 2) * width) / n, ((-y + n / 2) * height) / n];
}
function getVertex (i) {
    let j = (i % numPoints) * 2;
    return [vtx[j], vtx[j + 1]];
}
function getVertexSq1 (i) {
    let j = (i % numPoints) * 2;
    return [sq1[j], sq1[j + 1]];
}
function draw (ctx, angle, index) {
    ctx.fillStyle = "rgba(0, 204, 204, 1)";
    ctx.rect(0, 0, width, height);
    ctx.fill();
    let [x, y] = mapToViewport(...getVertex(index));
    ctx.translate(x, y);
    ctx.rotate(-angle * Math.PI / 180);
    ctx.translate(-x, -y)
	var grad;
    if (0 === index) {
        grad = ctx.createLinearGradient(203, 150, x, y);
        grad.addColorStop(0, 'rgba(12, 0, 255, 1)');
        grad.addColorStop(1, 'rgba(255, 0, 0, 1)');
    } else if (2 === index) {
        grad = ctx.createLinearGradient(167, 200, x, y);
        grad.addColorStop(0, 'rgba(255, 0, 0, 1)');
        grad.addColorStop(1, 'rgba(12, 0, 255, 1)');
    } else if (5 === index) {
        grad = ctx.createLinearGradient(210, 270, x, y);
        grad.addColorStop(0, 'rgba(0, 255, 4, 1)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 1)');
    } else if (1 === index) {
        grad = ctx.createLinearGradient(167, 200, x, y);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(1, 'rgba(0, 255, 4, 1)');
    }
	ctx.beginPath();
    for (let i = 0; i < numPoints; i++) {
        if (i == 3 || i == 4) continue;
        let [x, y] = mapToViewport(...getVertexSq1(i).map((x) => x));
        if (i == 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.closePath();
	ctx.fillStyle = "grey";
    ctx.fill();
    ctx.beginPath();
    for (let i = 0; i < numPoints; i++) {
        if (i == 3 || i == 4) continue;
        let [x, y] = mapToViewport(...getVertex(i).map((x) => x));
        if (i == 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
	ctx.beginPath();
	let [xa, ya] = mapToViewport(...getVertex(0));
	ctx.rect(xa-5, ya-3, 8, 8);
	ctx.fillStyle = 'red';
    ctx.fill();
	ctx.closePath();
	ctx.beginPath();
	let [xb, yb] = mapToViewport(...getVertex(1));
	ctx.rect(xb-3, yb-3, 8, 8);
	ctx.fillStyle = 'green';
    ctx.fill();
	ctx.closePath();
	ctx.beginPath();
	let [xc, yc] = mapToViewport(...getVertex(2));
	ctx.rect(xc-3, yc-5, 8, 8);
	ctx.fillStyle = 'blue';
    ctx.fill();
	ctx.closePath();
	ctx.beginPath();
	let [xd, yd] = mapToViewport(...getVertex(5));
	ctx.rect(xd-5, yd-4, 8, 8);
	ctx.fillStyle = 'white';
    ctx.fill();
	ctx.closePath();
}
function calculateAngle (angle) {
    var now = Date.now();
    var elapsed = now - last_time;
    last_time = now;
    var newAngle = angle + (ANGLE_INCREMENT * elapsed) / 1000.0;
    return newAngle %= 360;
};
function mainEntrance () {
    var canvas = document.getElementById('theCanvas');
    var ctx = canvas.getContext("2d");
    width = canvas.width;
    height = canvas.height;
    var currentIndex = 0; 
    document.addEventListener("keydown", (e) => {
        switch (e.key) {
            case "r":
                currentIndex = 0;
                break;
            case "g":
                currentIndex = 1;
                break;
            case "b":
                currentIndex = 2;
                break;
            case "w":
                currentIndex = 5;
                break;
        }
    });
    var currentAngle = 2.0; 
    var runanimation = (() => {
        currentAngle = calculateAngle(currentAngle);
        return () => {
            draw(ctx, currentAngle, currentIndex);
            requestAnimationFrame(runanimation);
        };
    })();
    runanimation();
};