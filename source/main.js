var windowWidth = 640,
windowHeight = 960;

var topLeft = "topLeft";
var topRight = "topRight";
var right = "right";
var left = "left";
var bottomLeft = "bottomLeft";
var bottomRight = "bottomRight";
var game;
var renderer;
var boardConfig;
var canvas


var windowWidthVar = window.innerWidth,
windowHeightVar = window.innerHeight;
var renderer = PIXI.autoDetectRenderer(windowWidth, windowHeight);

var initialize = function(){
	var config = [{type:'hex'},{dimensions_i:'4'},
	{dimensions_j:'10'}]
	boardConfig = config;
	// cria o renter
	// renderer = PIXI.autoDetectRenderer(windowWidth, windowHeight);
	// // adiciona o render
	// document.body.appendChild(renderer.view);

	// //inicia o game e da um build
	PIXI.BaseTexture.SCALE_MODE =0;// PIXI.BaseTexture.SCALE_MODE.NEAREST;
	// adiciona o render
	document.body.appendChild(renderer.view);

	var tempRation =  (window.innerHeight/windowHeight);
	var ratio = tempRation < (window.innerWidth/windowWidth)?tempRation:(window.innerWidth/windowWidth);
	windowWidthVar = windowWidth * ratio;
	windowHeightVar = windowHeight * ratio;

	renderer.view.style.width = windowWidthVar+'px';
	renderer.view.style.height = windowHeightVar+'px';
	// //chama o loop da aplicação

	// // Optimize for Retina Display
	// canvas = document.querySelector("canvas"),
	// devicePixelRatio = window.devicePixelRatio;
	// canvas.style.width = (canvas.width / devicePixelRatio) + "px";
	// canvas.style.height = (canvas.height / devicePixelRatio) + "px";

	requestAnimFrame( update );

	game = new Game(windowWidth, windowHeight);
	game.build();
}

//initialize();

//loop da aplicação
function update() {
	requestAnimFrame( update );
	game.update();
	renderer.render(game.stage);
}



