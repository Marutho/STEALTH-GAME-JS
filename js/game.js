
//we expose the game variable to the global scope
//so we can access it from everywhere
var game;


var keysArray = {
	space:32,
	arrowRight:68,
	arrowLeft:65,
	arrowUp:87,
	arrowDown:83,
	arrowBoxUp:73,
	arrowBoxDown: 75,
	arrowBoxLeft: 74,
	arrowBoxRight: 76,
	attack: 72
}

var keysDown={};
var keysUp={};



//executed when the DOM is fully loaded
function init(){
	//variable that will hold all the variables for our game
	game = {
		enemies : [],
		canvas : undefined,
		ctx : undefined,
		lastTick : Date.now(),
		player : undefined,
		heightHUD : undefined,
		widthHUD : undefined,
		ctxHUD : undefined,
		HUD : undefined,
		gameAttack: false,
		boxesPlayer : [],
		walls: [],
		boxWin: undefined,
		collisionPoints:[],
		balasEnemy : [],
		//wallsProperties(x,y,width,height)
		wallsProperties : [	[0,20,window.innerWidth,50,"#ffffff",0], [0,0,25,window.innerHeight,"#ffffff",0], [0,window.innerHeight-25,window.innerWidth,50,"#ffffff",0], 
		[window.innerWidth-25,0,25,window.innerHeight,"#ffffff",0], /*dibuja en medio horizontal*/[0,window.innerHeight-350,window.innerWidth-500,20,"#ffffff",0],
		[500, window.innerHeight-350, 20, window.innerHeight-700,"#ffffff",0], [500, window.innerHeight-50, 20, window.innerHeight-700,"#ffffff",0],
		[1000, window.innerHeight-150, 20, window.innerHeight-700,"#ffffff",0], [1000, window.innerHeight-350, 20, window.innerHeight-800,"#ffffff",0],
		/*el win*/[150, window.innerHeight-650, 50, 50,"black",1], [500, window.innerHeight-350, 20, window.innerHeight-700,"#ffffff",0], 
		[1300, window.innerHeight-950, 20, 500,"#ffffff",0], [1400, window.innerHeight-650, 20, 500,"#ffffff",0], [500, window.innerHeight-950, 20, 500,"#ffffff",0],
		[500, window.innerHeight-450, 600, 20,"#ffffff",0],[1200,window.innerHeight-800, 20, 450,"#ffffff",0]
		
		 ],
		 
	}

	
	
	// Create canvas and get the context
	game.canvas = createFullScreenCanvas();
	game.ctx = game.canvas.getContext("2d");

	//voy a crear un enemy
	game.enemies.push(createEnemy(200,200,70,Math.PI,-Math.PI,0,Math.PI/2,-Math.PI/2,0,30,0,0));
	game.enemies.push(createEnemy(900,800,70,Math.PI/2,Math.PI/8,70,Math.PI/2,-Math.PI/2,0,30,Math.PI/2,0));
	game.enemies.push(createEnemy(900,800,70,Math.PI/2,Math.PI/8,70,Math.PI/2,-Math.PI/2,0,30,Math.PI/2,70));
	game.enemies.push(createEnemy(900,800,70,Math.PI/2,Math.PI/8,70,Math.PI/2,-Math.PI/2,0,30,Math.PI/2,-70));
	game.enemies.push(createEnemy(800,800,70,Math.PI,-Math.PI,0,Math.PI/2,-Math.PI/2,0,30,0,0));
	game.enemies.push(createEnemy(1200,800,70,Math.PI/2,Math.PI/8,0,Math.PI/2,-Math.PI/2,0,30,Math.PI/2,70));
	game.enemies.push(createEnemy(1400,890,70,-Math.PI/2,-Math.PI,0,Math.PI/2,-Math.PI/2,0,30,0,0));
	game.enemies.push(createEnemy(1500,800,70,Math.PI/2,Math.PI/8,0,Math.PI/2,-Math.PI/2,0,30,Math.PI/2,70));
	game.enemies.push(createEnemy(1600,600,70,Math.PI/2,Math.PI/8,70,Math.PI/2,-Math.PI/2,0,30,Math.PI/2,-70));
	game.enemies.push(createEnemy(1600,600,200,Math.PI/2,Math.PI/8,70,Math.PI/2,-Math.PI/2,0,50,Math.PI/2,-70));
	game.enemies.push(createEnemy(600,300,300,Math.PI,-Math.PI,0,Math.PI/2,-Math.PI/2,0,30,0,0));
	game.enemies.push(createEnemy(1300,550,70,-Math.PI/2,-Math.PI,0,Math.PI/2,-Math.PI/2,0,30,8,0));
	
	

	

	//Player que manejamos
	game.player = createPlayer(150,800,10,0.3);

	//paredes a crear
	for(var i=0;i<game.wallsProperties.length;i++){
		game.walls[i]=createWall(game.wallsProperties[i][0],game.wallsProperties[i][1],game.wallsProperties[i][2],game.wallsProperties[i][3], game.wallsProperties[i][4], 
		game.wallsProperties[i][5]);
	}	
	
	//creacion del hud
	game.HUD=document.createElement("canvas");
	game.HUD.style.position="absolute";
	game.HUD.setAttribute("id","HUD");
	game.ctxHUD=game.HUD.getContext("2d");
	game.HUD.width=window.innerWidth;
	game.HUD.height=window.innerHeight*5/100;
	document.body.appendChild(game.HUD);
	game.heightHUD=parseInt(document.getElementById("HUD").getAttribute("height"));
	game.widthHUD=parseInt(document.getElementById("HUD").getAttribute("width"));
	
	//Listeners de los input hacia abajo
	addEventListener("keydown", function (e) {
		keysDown[e.keyCode] = true;
		delete keysUp[e.keyCode];
	}, false);

	//Listeners de los input hacia arriba
	addEventListener("keyup", function (e) {
		keysUp[e.keyCode] = true;
		delete keysDown[e.keyCode];
	}, false);


	
	//start the loop
	window.requestAnimationFrame(loop);
}

function drawHud(){
	
	if(game.HUD.getContext){
		game.ctxHUD.fillStyle="black";
		game.ctxHUD.fillRect(0,0,game.widthHUD,game.heightHUD)
		game.ctxHUD.fillStyle="yellow";
		game.ctxHUD.fillRect(0,0,game.widthHUD*game.player.health/100,game.heightHUD)
	}
}





function loop(timestamp) {
	//delta from last execution of loop in ms
	var now = Date.now();
	var delta = now - game.lastTick;


	update(delta);
	render();


	game.lastTick = now;
	// Request to do this again ASAP
	window.requestAnimationFrame(loop);
	
}

//update everything
function update(delta){
	
	for(var i=0;i<game.enemies.length;i++)
	{
		game.enemies[i].update(delta);
		game.enemies[i].caught(game.ctx,game.player.x,game.player.y);
	}
	game.player.MovePlayer(delta);
}

// Draw everything
function render(){

	//clear
	
    game.ctx.fillStyle = "#999999";
	game.ctx.fillRect(0,0,game.canvas.width,game.canvas.height);
	drawHud();

	game.player.Draw(game.ctx);
	
	for(var i=0;i<game.boxesPlayer.length;i++)
	{
		game.boxesPlayer[i].draw(game.ctx);
	}
	for(i=0;i<game.walls.length;i++)
	{
		game.walls[i].draw(game.ctx);
	}
	for(var i=0;i<game.enemies.length;i++)
	{
		game.enemies[i].draw(game.ctx);
	}

	

	
	

	//para dibujar cada enemy
	//game.enemy.draw(game.ctx);
	
}

