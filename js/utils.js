function createFullScreenCanvas(){
	//create the element
	var canvas = document.createElement("canvas");
	//make it fullscreen
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	canvas.style.position = "absolute";
	//add to the DOM
	document.body.appendChild(canvas);
	return canvas;
}

//// EXTRA UTILS YOU WILL NEED IN CLASS:

function randomColor(){
	return "rgba("+randomInt(0,255)+","+randomInt(0,255)+","+randomInt(0,255)+",1)";
}

function randomInt(min,max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}



function createSquare(x,y,width,height,color){
	var temp =  {
		x : x,
		y : y,
		width : width,
		height : height,
		fill : color,
		draw : function(ctx){
			ctx.fillStyle = this.fill;		//notice the use of this!
			ctx.fillRect(this.x,this.y,this.width,this.height);
		},
		update : function(delta){
			this.x += 20 * delta/1000;
		}
	}
	return temp;
}

function createWall(posX,posY,widthh,heightt, color,win) {

	var wall = {
		x : posX,
		y : posY,
		width : widthh,
		height : heightt,
		path : new Path2D(),
		fill : color,
		win : win,
		init : function(){
			this.path.moveTo(this.x,this.y);
			this.path.lineTo(this.x,this.y+this.height);
			this.path.lineTo(this.x+this.width,this.y+this.height);
			this.path.lineTo(this.x+this.width, this.y);
			this.path.closePath(); 
		},
		collide : function(ctx,x,y) {
			return ctx.isPointInPath(this.path,x,y);
		},
		draw : function(ctx) {
			ctx.fillStyle = this.fill;
			ctx.fill(this.path);
		}
	}
	wall.init();
	return wall;
}


function createRectPath(x,y,width,height){
	var temp = {
		x : x,
		y : y,
		width : width,
		height : height,
		path : new Path2D,
		initPath : function(){
			this.path = new Path2D();
			this.path.rect(this.x,this.y,this.width,this.height);
			this.path.closePath();
		},
		update : function(delta){
			this.x += 20*delta/1000;
			this.initPath();	//we create the path again based on new x
		},
		draw : function(ctx){
			ctx.fill(this.path);
		}
	}
	temp.initPath();	//we initialize the shape before returning it
	return temp;
}


function pointsOnCircle(x,y,radius){
	var points=[]
	points.push([x+Math.cos(0)*radius,y+Math.sin(0)*radius]);
	points.push([x+Math.cos(Math.PI/2)*radius,y+Math.sin(Math.PI/2)*radius]);
	points.push([x+Math.cos(Math.PI)*radius,y+Math.sin(Math.PI)*radius]);
	points.push([x+Math.cos(Math.PI*3/2)*radius,y+Math.sin(Math.PI*3/2)*radius]);
	return points;
}

function pointsOnRect(x,y,tam){
	var points=[]
	points.push([x+tam/4,y-tam/4]);
	points.push([x+tam/4,y+tam/4]);
	points.push([x-tam/4,y-tam/4]);
	points.push([x-tam/4,y+tam/4]);
	return points;
}


function createEnemy(x,y,radius,startAngle,endAngle,speedE, maxAngle, minAngle, turret, tam, velCono, speedV){
	var temp = {
		x : x,
		y : y,
		radius : radius,
		speedE : speedE,
		speedV : speedV,
		tam : tam,
		velCono:velCono,
		maxAngle : maxAngle,
		minAngle: minAngle,
        startAngle : startAngle,
		endAngle : endAngle,
		turret : turret,
		direction : 1,
		directionObject : 1,
		contador : 0,	
		colissionPoints:[],
		path : new Path2D,
		initPath : function(){
			this.path = new Path2D();
    		this.path.moveTo(this.x,this.y);       //move to the center
    		this.path.lineTo(this.x+this.radius*Math.cos(this.startAngle), this.y+this.radius*Math.sin(this.startAngle)); //draw first line
			this.path.arc(this.x,this.y,this.radius,this.startAngle,this.endAngle,true);  //draw arc
    		this.path.lineTo(this.x,this.y);       //draw second line from arc to center
    		this.path.closePath();       
    		          

		},
		collide : function(ctx,x,y) {
			return ctx.isPointInPath(this.path,x,y);
		},
		update : function(delta){

			if (this.turret==1)
			{		
				this.contador+=delta/1000;
				if(this.contador>=5)
				{
					console.log("hola");
					this.contador=0;
				}
			}

			var aux=[];
			auxX = this.x + this.speedE * delta/1000 * this.directionObject;
			auxY=this.y + this.speedV * delta/1000 * this.directionObject;
			
			if(this.startAngle>=this.maxAngle)
			{
				this.direction *= -1;
			}
			else if(this.startAngle<=this.minAngle)
			{
				this.direction *= -1;
			}
			
			this.startAngle += (this.velCono)*delta/1000*this.direction;
			this.endAngle += (this.velCono)*delta/1000*this.direction;

			this.collisionPoints=pointsOnRect(auxX,auxY,this.radius);
			var aux=checkCollisions(auxX,auxY,this);
			this.x=aux[0];
			this.y=aux[1];

			if(aux[2])
			{
				this.directionObject *= -1;
				
			}
			
			this.initPath();	//we create the path again based on new x
		},
		draw : function(ctx){
			ctx.fillStyle="rgba(235, 0, 0, 1)";
			ctx.strokeStyle = "black";
			ctx.strokeRect(this.x-this.tam/2,this.y-this.tam/2,this.tam,this.tam);
			ctx.fillRect(this.x-this.tam/2,this.y-this.tam/2,this.tam,this.tam);
			ctx.fillStyle = "rgba(65, 98, 151, 0.4)";
			ctx.fill(this.path);
			ctx.strokeStyle = "rgba(65, 98, 151, 1)";
			ctx.stroke(this.path);

			
				},
		caught: function(ctx,x,y){
			if(ctx.isPointInPath(this.path,x,y)&&!game.player.occult){
				
				if(turret!=1)
				{
					game.player.health-=1;
				}
				else{
					
				}
					
				
			}
		},
		Init : function(){
			this.colissionPoints=pointsOnRect(this.x,this.y,this.radius);
		}
	}
	temp.initPath();
	temp.Init();	//we initialize the shape before returning it
	return temp;
}



//PLAYER MOVIMIENTO Y CREACION

function createPlayer(x,y,radius,speed){
	var player = {
		health:100,
		x : x,
		y : y,
		radius : radius,
		speed : speed,
		occult : false,
		boxActive1 : false,
		boxActive2 : false,
		boxActive3 : false,
		boxActive4 : false,		
		colissionPoints:[],
		MovePlayer : function(mt){
			
			if(this.health==0)
			{
				document.location.reload();
			}

			if((keysArray.space in keysDown)){
				this.occult=true;
				var aux=[];
				}
				else{
					this.occult=false;
					auxX=this.x;
					auxY=this.y;
					if (keysArray.arrowUp in keysDown) { 
						console.log("Arriba");
						auxY = this.y - this.speed * mt;
					}
					if (keysArray.arrowDown in keysDown) { 
						console.log("Abajo");
						auxY = this.y + this.speed * mt;
					}
					if (keysArray.arrowRight in keysDown) { 
						console.log("Derecha");
						auxX = this.x + this.speed * mt;
					}
					if (keysArray.arrowLeft in keysDown) {
						console.log("Izquierda"); 
						auxX = this.x - this.speed * mt;
					}


					this.collisionPoints=pointsOnCircle(auxX,auxY,this.radius);
					var aux=checkCollisions(auxX,auxY,this);
					this.x=aux[0];
					this.y=aux[1];

					if(keysArray.attack in keysDown)
					{
						attackEnemy(auxX,auxY,this);
					}
					else if(keysArray.attack in keysUp){
						game.attackBol=false;
					}
					if (keysArray.arrowBoxUp in keysDown) {
						console.log("Crea caja1");
						if(this.boxActive1!=false)
						{
							game.boxesPlayer.push(createWall(this.x-radius,this.y-radius-10,20,5,"white"));
						}
						this.boxActive1=false;				
					}
					else if(keysArray.arrowBoxUp in keysUp){
						this.boxActive1=true;
					}

					if (keysArray.arrowBoxDown in keysDown) {
						console.log("Crea caja2");
						if(this.boxActive2!=false)
						{
							game.boxesPlayer.push(createWall(this.x-radius,this.y+radius+5,20,5,"white"));
						}
						this.boxActive2=false;				
					}
					else if(keysArray.arrowBoxDown in keysUp){
						this.boxActive2=true;
					}

					if (keysArray.arrowBoxLeft in keysDown) {
						console.log("Crea caja3");
						if(this.boxActive3!=false)
						{
							game.boxesPlayer.push(createWall(this.x-radius-10,this.y-radius,5,20,"white"));
						}
						this.boxActive3=false;				
					}
					else if(keysArray.arrowBoxLeft in keysUp){
						this.boxActive3=true;
					}

					if (keysArray.arrowBoxRight in keysDown) {
						console.log("Crea caja3");
						if(this.boxActive4!=false)
						{
							game.boxesPlayer.push(createWall(this.x+radius+5,this.y-radius,5,20,"white"));
						}
						this.boxActive4=false;				
					}
					else if(keysArray.arrowBoxRight in keysUp){
						this.boxActive4=true;
					}
				}

		},
		collide : function(ctx,x,y) {
			return ctx.isPointInPath(this.path,x,y);
		},
		Draw : function(ctx){
			
			ctx.beginPath();
			ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
			if(!this.occult)	
			{
				ctx.fillStyle="#ffffff";
				ctx.fill(this.path);
				ctx.stroke();
				//console.log("no se pinta cojones?")
				
			}
			else {
				ctx.fillStyle="#003366";
				ctx.fill(this.path);
				ctx.stroke();
				//console.log("nO VAAAAA");				
			}			
			
		},
		Init : function(){
			this.colissionPoints=pointsOnCircle(this.x,this.y,this.radius);
		}
	}
	player.Init();
	player.boxActive=false;
	player.occult=false; 	
	return player;
}

function updateBalas(deltaMs)
{
    for (var i=0;i<SpaceInvader.balas.length;i++)
    {
            moveBullet(deltaMs,SpaceInvader.balas[i]);
    }
}

function checkCollisions(x,y,target){
	if(x<target.radius||x>game.canvas.width-target.radius){
		return [target.x,y,true];
	}
	for(var i=0;i<game.boxesPlayer.length;i++){
		//check if one of the points of the circle collides with a wall
		for(var j=0;j<target.collisionPoints.length;j++){
			if(game.boxesPlayer[i].collide(game.ctx,target.collisionPoints[j][0],target.collisionPoints[j][1])){
				return [target.x,target.y,true];
			}
		}
	}
	for(var i=0;i<game.walls.length;i++){
		//check if one of the points of the circle collides with a wall
		for(var j=0;j<target.collisionPoints.length;j++){
			if(game.walls[i].collide(game.ctx,target.collisionPoints[j][0],target.collisionPoints[j][1])){
				if(game.walls[i].win==1)
				{
					console.log("Has ganado!");
					document.location.reload();
				}
				return [target.x,target.y,true];
			}
		}
	}
	
	if(y<target.radius||y>game.canvas.height-target.radius){
		return [x,target.y,true];
	}
	return [x,y,false];
}

function attackEnemy(x,y,target){
	for(var i=0;i<game.enemies.length;i++){
		//check if one of the points of the circle collides with a wall
		for(var j=0;j<target.collisionPoints.length;j++){
			if(game.enemies[i].collide(game.ctx,target.collisionPoints[j][0],target.collisionPoints[j][1])){
					game.enemies.splice(i,1);
			}
		}
	}
}
