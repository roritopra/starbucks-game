function mostrarPantalla2() {
    document.getElementById("pantalla1").style.display = "none";
    document.getElementById("pantalla2").style.display = "block";
  }
  
  function mostrarPantalla1() {
    document.getElementById("pantalla2").style.display = "none";
    document.getElementById("pantalla1").style.display = "block";
  }

//****** GAME LOOP, Inician el juego cuando todas las imagenes se hayan cargado y programa la funcion update pa que se llame ********//

var time = new Date();
var deltaTime = 0;

if(document.readyState === "complete" || document.readyState === "interactive"){
    setTimeout(Init, 1);
}else{
    document.addEventListener("DOMContentLoaded", Init); 
}

function Init() {
    time = new Date();
    start();
    Loop();
}

function Loop() {
    deltaTime = (new Date() - time) / 1000;
    time = new Date();
    update();
    requestAnimationFrame(Loop);
}


//Todas las variables globales para el juego
var floorY = 22;
var velY = 0;
var impulse = 900;
var gravity = 2500;

var playerPosX = 42
var playerPosY = floorY

var floorX = 0;
var velScenary = 1280/3;
var gameVel = 1;
var score = 0;

var stopped = false;
var jumping = false;

var timeToObstacle = 2;
var timeObstacleMin = 0.7;
var timeObstacleMax = 1.8;
var obstaclePosYY = 16;
var obstacles = [];

var container;
var player
var textScore;
var floor;
var gameOver;

//Recogiendo los elementos del html y cargando el evento de seleccionar tecla para saltar
function start() {
    gameOver = document.querySelector(".game-over");
    floor = document.querySelector(".floor");
    container = document.querySelector(".container");
    textScore = document.querySelector(".score");
    player = document.querySelector(".player");
    document.addEventListener("keydown", HandleKeydown);
}

//La tecla que se va a usar para saltar
function HandleKeydown(ev) {
    if(ev.keyCode == 32){
        jump();
    }
}

//Salto del personaje
function jump() {
    if(playerPosY === floorY) {
        jumping = true;
        velY = impulse;
    }
}

//Donde se mueve el escenario para que los obstacles avancen con el player
function update() {
    if(stopped) return;
    
    moveFloor();
    movePlayer();
    decideCreateObstacle();
    moveObstacles();
    detectCollision();

    velY -= gravity  * deltaTime;
    
}

//El moviemiento del suelo 
function moveFloor() {
    floorX += calculateDisplacement();
    floor.style.left = -(floorX % container.clientWidth) + "px";//Donde se da la sensaci??n que es infinito, lo que hace es que el suelo vuelve al principio
}

function calculateDisplacement() {
    return velScenary * deltaTime * gameVel;
}

//Donde el juego para cuando el personaje pierde
function shock() {
    stopped = true;
}

//Movimiento del jugador
function movePlayer() {
    playerPosY += velY * deltaTime;
    if(playerPosY < floorY){
        touchFloor();
    }
    player.style.bottom = playerPosY+"px";
}

//El personaje cuando esta en el suelo
function touchFloor() {
    playerPosY = floorY;
    velY = 0;
    jumping = false;
}

//La creacion de los obstaculos
function decideCreateObstacle() {
    timeToObstacle -= deltaTime;
    if(timeToObstacle <= 0){
        createObstacle();
    }
}

//Creacion de obstaculos y cada cuanto se crea uno
function createObstacle() {
    var obstacle = document.createElement("div");
    container.appendChild(obstacle);
    obstacle.classList.add("cactus");
    obstacle.posX = container.clientWidth;
    obstacle.style.left = container.clientWidth+"px"

    obstacles.push(obstacle);
    timeToObstacle = timeObstacleMin + Math.random() * (timeObstacleMax-timeObstacleMin) / gameVel; 
}

//Movimiento de los obstaculos a la par con el suelo
function moveObstacles() {
    for (var i = obstacles.length - 1; i >= 0; i--) {
        if(obstacles[i].posX < -obstacles[i].clientWidth) {
            obstacles[i].parentNode.removeChild(obstacles[i]);
            obstacles.splice(i, 1);
            winPoints();
        }else{
            obstacles[i].posX -= calculateDisplacement();
            obstacles[i].style.left = obstacles[i].posX+"px";
        }
    }
}

//Puntos
function winPoints() {
    score++;
    textScore.innerText  = score;
}

//La funcion que detecta cuando el personaje se estrelle con el obstaculo
function detectCollision()  {
    for (var i = 0; i < obstacles.length; i++) {
        if(obstacles[i].posX > playerPosX + player.clientWidth) {
            //EVADE en los saltos
            break; //al estar en orden, no puede chocar con m??s
        }else{
            if(IsCollision(player, obstacles[i], 10, 30, 15, 20)) {
                GameOver();
            }
        }
    }
}

function IsCollision(a, b, paddingTop, paddingRight, paddingBottom, paddingLeft) {
    var aRect = a.getBoundingClientRect();
    var bRect = b.getBoundingClientRect();

    return !(
        ((aRect.top + aRect.height - paddingBottom) < (bRect.top)) ||
        (aRect.top + paddingTop > (bRect.top + bRect.height)) ||
        ((aRect.left + aRect.width - paddingRight) < bRect.left) ||
        (aRect.left + paddingLeft > (bRect.left + bRect.width))
    );
}

//Cuando el personaje pierde
function  GameOver() {
    shock();
    gameOver.style.display = "block";
}

function getJob() {

}

