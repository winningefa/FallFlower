// @author G.Wang 
// ================================
// final version 2015.03.05



(function($) {
	
	 'use strict';
	
	var NAME = 'flowerfall';
	
	var DEFAULTS = {
		isXmove			: false,				// Items move straightly on X axis (true = move, false = static)
		isYmove			: true,					// Items move straightly on Y axis (true = move, false = static)
		waveRangeX		: 0,					// The value that items can wave in X axis 
		waveRangeY		: 0,					// THe value that items can wave in Y axis
		xDirection		: 0,					// Items' moving direction of x axis (-1 = left, 0 = middle, 1 = right)
		yDirection		: 1,					// Items' moving direction of y axis (-1 = up, 0 = middle, 1 = down)
		delayInterval	: 200,					// Interval of each item
		delayGroup		: 1,					// Every interval time fall down items' amount
		angleMin		: 0,					// Range of rotate(2D) axis angle 
		angleMax		: 90,					
		xRangeMin		: 0,					// Range of width that items can appear
		xRangeMax		: $(window).width(),	
		yRangeMin		: 0,					// Range of height that items can appear
		yRangeMax		: 0.05,
		imgWidth		: '100%',				// Items size
		imgHeight		: '100%',
		xSpeed			: 1,					// Items' moving speed of x axis 
		ySpeed			: 1,					// Items' moving speed of y axis
		waveSpeed		: 1,					// Items' rolling speed
		sum				: 0,					// Items amount
		imgURL			: null,					// Item image URL
	};
	
	//use this function to initiate
	Plugin = function(options,element){
		var sOption = $.extend(true, {}, DEFAULTS, options);
		Plugin.property.init(sOption,element);
		return this;
	};
	Plugin.property = {};
	Plugin.property.implement = function(){};
	Plugin.property.implement.prototype = {};
	
	Plugin.util = {};
	
	Plugin.property.MAX = 50;
	
	//regulate speed internal parameters
	var speed = 0.001;//Plugin.util.random(1,10);
	
	
	Plugin.util.random = function(min,max){
		return Math.floor(Math.random() * (max - min + 1) + min);
	};
	
	Plugin.util.angle = function(angle){
		var rotate = {rotX : 1, rotY : 1};
		rotate.rotX = Math.sin(angle * (Math.PI / 180));
		rotate.rotY = Math.cos(angle * (Math.PI / 180));
		return rotate;
	};
	
	Plugin.property.implement.prototype.create = function(options,element,groupMember){
		var elem = $('<div>');
		var img = $('<img>');
		this.s = options;
		
		this.top = Plugin.util.random(this.s.yRangeMin, this.s.yRangeMax);
		this.left = Plugin.util.random(this.s.xRangeMin, this.s.xRangeMax);
		
		elem.css('position','absolute');//absolute
		elem.css('text-align','center');
		elem.css('top',this.top);
		elem.css('left',this.left);
		elem.css('visibility','hidden');
		
		img.attr({"src":this.s.imgURL});
		img.css('text-align','center');
		img.css('width', this.s.imgWidth);
		img.css('height', this.s.imgHeight);
		
		this.agl = Plugin.util.random(this.s.angleMin, this.s.angleMax);//Default range from 0~90
//		this.agl = 45;
		this.rot = Plugin.util.angle(this.agl);//caculate x and y for angle
		this.delay = Plugin.util.random(this.s.delayInterval*(groupMember - 1), this.s.delayInterval*groupMember);
		this.elem = elem;
		this.moveX = Plugin.util.random(1,10);
		this.moveY = 5;
		this.rotX = this.rot.rotX;
		this.rotY = this.rot.rotY;
		this.rotate = Plugin.util.random(0,30);
		this.angleSpd = Math.random() * 10;
		this.direction = 1;
		this.x = this.s.isXmove == true ? 1 : 0;
		this.y = this.s.isYmove == true ? 1 : 0; 
		this.varAngle = 0;
		
		$(element).append(this.elem);
		$(this.elem).append(img);

	};
	
	Plugin.property.implement.prototype.execute = function(){
		// speed for forward is between 0 and 10
		// rotate angle for move toward should not be bigger than 45?(waiting for test)
		if(this.left + this.moveX > $(window).innerWidth() 
			|| this.left + this.moveX < 0 
			|| this.top + this.moveY > $(window).innerHeight() 
			|| this.top + this.moveY < 0){
			this.moveX = Plugin.util.random(1,10);
			this.moveY = 5;	
			this.agl = Plugin.util.random(this.s.angleMin, this.s.angleMax);
			this.rot = Plugin.util.angle(this.agl);
			this.rotX = this.rot.rotX;
			this.rotY = this.rot.rotY;
			this.rotate = Plugin.util.random(0,30);	
			this.angleSpd = Math.random() * 10;
			this.direction = 1;
			this.varAngle = 0;
			
		}else{
			//change the direction of rotate axis' moving
			if(this.agl < this.s.angleMin){
				this.direction = 1;
			}
			if(this.agl > this.s.angleMax){
				this.direction = -1;
			}
			
			//change the direction of wave
			this.varAngle += 1;
			this.moveX = Plugin.util.random(1,1000)*speed* this.x* this.s.xSpeed* this.s.xDirection
				+ this.s.waveRangeX*Math.sin(this.varAngle* this.s.waveSpeed*(Math.PI/180))  
				+ this.x *this.moveX;
			this.moveY = Plugin.util.random(1,500)*speed* this.y* this.s.ySpeed* this.s.yDirection 
				+ this.s.waveRangeY*Math.sin(this.varAngle* this.s.waveSpeed*(Math.PI/180))
				+ this.y *this.moveY;
			
			//rotate operations
			this.rotate = Plugin.util.random(0,10)*this.angleSpd + this.rotate;
			this.agl = (Math.random() * (0.2 - 0)  + 0) * this.direction + this.agl;
			this.rot = Plugin.util.angle(this.agl);
			this.rotX = this.rot.rotX;
			this.rotY = this.rot.rotY;
 			
			this.elem.css(
				'-webkit-transform', 'translate('+this.moveX+'px,'+this.moveY+'px) '
				+'rotate3d('+this.rotX+','+this.rotY+', 0, '+this.rotate+'deg)'
				+'rotate('+(-this.agl)+'deg) '
			);
		}
	};
	
	Plugin.property.init = function(options,element){
		var amount = options.sum < Plugin.property.MAX ? options.sum : Plugin.property.MAX;
		var targets = [];
		var groupMember = options.delayGroup;
		
		for(var i = 0;i < amount;i++){
			targets[i] = new Plugin.property.implement();
			targets[i].create(options,element,groupMember);
			groupMember = groupMember > 1 ? groupMember -1 : options.delayGroup;		
		}
		
		window.setInterval(function(){
			Plugin.property.update(targets);
		},10);
	};
	
	Plugin.property.update = function(targets){
		for(var i = 0;i < targets.length;i++){
			if(targets[i].delay > 0){
				targets[i].delay -= 1;
			}else if(targets[i].elem.css('visibility') == 'hidden'){
				targets[i].elem.css('visibility','visible');
				targets[i].execute();
			}else{
				targets[i].execute();
			}
		}
	};
	
	var methods = {
		init	: Plugin
	};
	
	$.fn[NAME] = function(options){
		var args = arguments;
		var element = this;
		return this.each(function(){
			//TODO : write codes here
			/*init objects, parameter for objects amount*/
			
			var plugin = $(this).data(NAME);
		    if (!plugin) {
		      plugin = new Plugin(options,this);
		    }
			if(methods[options]){
				methods[options].apply(plugin,Array.prototype.slice.call(args, 1),this);
			}else if( typeof options === 'object' || ! options ){
				methods.init.apply(plugin,args,this);
			}else{
				$.error( 'Method ' +  options + ' does not exist on jQuery.' + NAME );
			}

		});
	};
})(jQuery); 
