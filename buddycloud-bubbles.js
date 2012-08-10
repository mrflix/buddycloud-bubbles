var transitionEnd = 'webkitTransitionEnd';
var transformString = 'webkitTransform';
var transitionString = 'webkitTransition';

function Bubble(id, x, y, vx, vy, removeFunction){
  this.canvas = document.createElement('canvas');
  this.canvas.id = id;
  this.ctx = this.canvas.getContext('2d');
  this.startX = this.x = x;
  this.startY = this.y = y;
  this.vx = vx;
  this.vy = vy;
  this.remove = removeFunction;
  this.colors = ['#fa9e1d', '#ed2d4f', '#d4ca9d', '#86c12c', '#fbdf1d', '#1c5e3d', '#2d9ad3', '#fab9ff', '#997830'];
  this.generate();
}

Bubble.prototype = {
  generate : function(){
    var angle = Math.PI * Math.random();
    
    this.targetDistance = 10 + Math.random() * 144;
    this.distance = 0;
    
    this.targetX = this.x - 0.5*-Math.sin(angle) * this.targetDistance + this.vx * 100;
    this.targetY = this.y + 0.5*Math.cos(angle) * this.targetDistance + this.vy * 100;
    
    this.radius = 13 + Math.random()*55;
    
    this.isX = Math.random() > 0.5 ? true : false;
    this.filled = Math.random() > 0.5 ? true : false;
    this.targetStrokeSize = Math.round(Math.random() * this.radius/2);
    //this.color = 'red';
    this.color = this.colors[ Math.floor(Math.random()*this.colors.length) ];
    this.draw();
    
    this.canvas.style[ transitionString ] = "1.5s linear";
  },
  animate : function(){
    this.canvas.addEventListener(transitionEnd, this.targetArrived.bind(this));
    
    document.redraw();
    
    this.canvas.style[transformString] = 'translate3d('+ this.targetX +'px,'+ this.targetY +'px,0) scale(1)'; 
    this.canvas.style.opacity = 0;
  },
  draw : function(){
    var center = this.radius+this.targetStrokeSize/2;
    
    this.canvas.width = center*2;
    this.canvas.height = center*2;
    
    this.canvas.style[ transformString ] = 'translate3d('+ this.x +'px,'+ this.y +'px,0) scale(0.1)'; 
    this.canvas.style.margin = -center+"px 0 0 "+ (-center) + "px";
    
    this.ctx.beginPath();
    this.ctx.arc(center, center, this.radius, 0, 2 * Math.PI, true);
    if(!this.isX){
      this.ctx.lineWidth = this.targetStrokeSize;
      this.ctx.strokeStyle = this.color;
      this.ctx.stroke();
    }
    if(this.isX && this.filled){
      this.ctx.fillStyle = this.color;
      this.ctx.fill();
    }
    if(this.isX){
      var v = 0.47*this.radius;
      
      this.ctx.beginPath();
      this.ctx.lineWidth = this.radius/4;
      this.ctx.lineCap = "round";
      
      if(this.filled){
        this.ctx.strokeStyle = "black";
        this.ctx.globalCompositeOperation = "destination-out";
      } else {
        this.ctx.strokeStyle = this.color;
      }
      
      // draw the x
      this.ctx.moveTo(center-v, center-v);
      this.ctx.lineTo(center+v, center+v);
      this.ctx.moveTo(center+v, center-v);
      this.ctx.lineTo(center-v, center+v);
      
      this.ctx.stroke();
      this.ctx.restore();
    }
  },
  targetArrived : function(event){
    if(event.propertyName === 'opacity')
      this.remove(this);
  },
  is : function(bubble){
    return bubble.canvas.id === this.canvas.id;
  }
};

function BuddycloudBubbles(element){
  this.element = element;
  
  this.idCount = 0;
  
  this.positionX = this.element.innerWidth/2;
  this.positionY = this.element.innerHeight/2;
  
  this.velocityX = 0;
  this.velocityY = 0;
  
  this.speed = 4;
  
  this.distanceToLastBubble = 0;
  
  this.bubbles = new Array();
  
  this.inputPressed = false;
}

BuddycloudBubbles.prototype = {
  start : function(){
    document.addEventListener(isTouchDevice ? 'touchmove' : 'mousemove', this.moveHandler.bind(this));
    document.addEventListener(isTouchDevice ? 'touchstart' : 'mousedown', this.inputDown.bind(this));
    document.addEventListener(isTouchDevice ? 'touchend' : 'mouseup', this.inputUp.bind(this));
  },
  stop : function(){
    document.removeEventListener(isTouchDevice ? 'touchmove' : 'mousemove', this.moveHandler.bind(this));
    document.removeEventListener(isTouchDevice ? 'touchstart' : 'mousedown', this.inputDown.bind(this));
    document.removeEventListener(isTouchDevice ? 'touchend' : 'mouseup', this.inputUp.bind(this));
  },
  removeBubble : function(bubble){
    this.element.removeChild( document.getElementById(bubble.canvas.id) );
    for(var i=0; i<this.bubbles.length; i++)
      if(this.bubbles[i].is(bubble)) this.bubbles.splice(i,1)[0];
  },
  newId : function(){
    return this.idCount++;
  },
  newBubble : function(){
    this.distanceToLastBubble++;
    
    if(this.inputPressed || Math.random() < this.distanceToLastBubble/50){
      var id = this.newId();
      var bubble = new Bubble(id, this.positionX, this.positionY, this.velocityX, this.velocityY, this.removeBubble.bind(this));
      this.bubbles.push(bubble);
      
      this.element.appendChild(bubble.canvas);
      bubble.canvas = document.getElementById(id);
      bubble.animate();
      
      this.distanceToLastBubble = 0;
    }
  },
  inputDown : function(event){
    event.preventDefault();
    this.inputPressed = true;
    this.moveHandler(event);
  },
  inputUp : function(){
    this.inputPressed = false;
  },
  moveHandler : function(event){
    var x = normalizedX(event);
    var y = normalizedY(event);
    
    this.velocityX = Math.max(-0.5, Math.min(0.5, x - this.positionX));
    this.velocityY = Math.max(-0.5, Math.min(0.5, y - this.positionY));
    
    this.positionX = x;
    this.positionY = y;
    
    this.newBubble();
  }
};