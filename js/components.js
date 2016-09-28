var TO_RADS = (Math.PI/180.0);
var count = 0;
var distanceToCamera =2; // distance to represents objects in front of the screen
var cameraHeight = 1.6;

// only get the vector corresponding at Y axis of rotation
function GetCameraLookVector()
{
	// GET CAMERA'S FORWARD VECTOR
  	var directionVector = new THREE.Vector3(0, 0, -1); // initial camera orientation
  	var rotationEuler = new THREE.Euler(0, 0, 0, 'YXZ');
  	var rotation =  document.querySelector("a-camera").getComputedAttribute("rotation"); // this.el.getComputedAttribute("rotation");

  	// Transform direction relative to heading
  	// rotationEuler.set(THREE.Math.degToRad(rotation.x), THREE.Math.degToRad(rotation.y), 0);
	// with pitch = 0 we keep the perfect circle spacing
	rotationEuler.set(THREE.Math.degToRad(0), THREE.Math.degToRad(rotation.y), 0);
	
	return directionVector.applyEuler(rotationEuler);	  	
}

/* DEBUGGING COMPONENT */
AFRAME.registerComponent('print-stats', {
  schema: {default: '' },
  init: function(){
  			
  			this.el.addEventListener('click', () => {
			
			var el = this.el;					
			el.emit("test", null, false);

			/*var elements =  el.querySelectorAll('a-sphere');
			var i =0;
			
			for(i =0; i < elements.length; i++)
			{	
				alert(elements[i]);

				//elements[i].emit("test");
			}*/

		});
  },

  tick: function () {

  	return 0;
  	//console.log(this.el.getComputedAttribute("position").y);

  	var directionVector = GetCameraLookVector();
  	directionVector = directionVector.normalize().multiplyScalar(distanceToCamera);
  	
  	var targetPos = new THREE.Vector3(0, 0, 0);  
  	targetPos.x = (directionVector.x ) + this.el.getComputedAttribute("position").x;
	targetPos.y = 1; 
	targetPos.z = (directionVector.z) + this.el.getComputedAttribute("position").z;			
  	
  	
  	var images =  document.querySelectorAll('a-sphere');
	var i;
	for(i = 0; i < images.length; i++ )
	{
		var oldPos = images[i].getComputedAttribute('position');
		images[i].setAttribute('position', {x: targetPos.x, y: targetPos.y, z: targetPos.z});
		
	}			
  }

});
/* CIRCLE LAYOUT COMPONENT */
AFRAME.registerComponent('circle-layout', {
  schema: {
  	index: {default: 0}, 
  	degrees: {default: 45.0},
  	radius: {default: 5},
  	debug: {default: false},
  	asignedPosition: {type: 'vec3'},		  			  	
  },
  
  init: function () {

  	var data = this.data;		  	
  	var el = this.el;
	var angle = 0;	
	
	
	// distribute the 360 space according to the numbers of elements of its class
	var distribution = document.querySelectorAll("."+el.className).length;
	if(distribution > 0)
		angle = (360 / distribution) * count * TO_RADS;		  	
	else
		angle = data.degrees * count * TO_RADS;
	
	// calc coords
  	var x1 = (Math.cos(angle) * data.radius).toFixed(2);
	var z1 = (Math.sin(angle) * data.radius).toFixed(2);
	var y1 = cameraHeight;

	count++;

	el.setAttribute('animation__fall', {
	      property: 'position',
	      startEvents: 'fall',
	      dir: 'both',
	      dur: 2500,
	      from: {x: x1, y:20, z: z1},
	      to:  {x: x1, y:cameraHeight, z: z1},
	      easing: 'easeOutCubic',
	      elasticity: 900,

	    });

	el.emit('fall');

	setTimeout(function()
	{ 
		el.setAttribute('position', {x: x1, y: y1, z: z1});		
		el.setAttribute('asignedPosition', el.getComputedAttribute('position').x.toString()+" "+el.getComputedAttribute('position').y.toString()+" "+el.getComputedAttribute('position').z.toString());

		//alert('asignedPosition = '+ el.getComputedAttribute('position').x.toString()+" "+el.getComputedAttribute('position').y.toString()+" "+el.getComputedAttribute('position').z.toString() );

	}, 2600);				




  }
});

/* bring up element applying animations and effects for it and its childs */
function bringUp(element)
{
	if(element == null) return;
	element.setAttribute("visible", true);

	var currentPos = element.parentNode.getComputedAttribute("position");
	// set it in front of the camera
	var directionVector = GetCameraLookVector();
	directionVector = directionVector.normalize().multiplyScalar(distanceToCamera);
	var cameraPos = document.querySelector("a-camera").getComputedAttribute("position");

	var targetPos = new THREE.Vector3(0, 0, 0);  
	targetPos.x = (directionVector.x ) + cameraPos.x;
	targetPos.y = cameraHeight; 
	targetPos.z = (directionVector.z) + cameraPos.z;						

	//el.parentNode.setAttribute('position', {x: targetPos.x, y: targetPos.y, z: targetPos.z});
	element.parentNode.setAttribute('animation__bring-up', {
		property: 'position',
		startEvents: 'bring-up',
		dir: 'normal',
		dur: 1200,
		from: {x: currentPos.x, y:currentPos.y, z: currentPos.z},
		to:  {x: targetPos.x, y: targetPos.y, z: targetPos.z},
		easing: 'easeOutCubic',
		elasticity: 900,

	});
	
	element.parentNode.emit('bring-up');
	//element.parentNode.emit('fade-in');

	setTimeout(function()
	{ 
		element.parentNode.setAttribute('position', {x: targetPos.x, y: targetPos.y, z: targetPos.z});		

	}, 1300);

	// OPEN UI element

	// info section
	var infoSection = element.parentNode.querySelector('.info_section');			
	infoSection.setAttribute('animation__open-up', {
		property: 'position',
		startEvents: 'open-up',
		dir: 'normal',
		dur: 1200,
		from: {x: 0, y:0, z: -1},
		to:  {x: 1, y: 0, z: 0},
		easing: 'easeOutCubic',
		elasticity: 900,
	});

	var heximg = element.parentNode.querySelector('.hexagon-image');			
	heximg.setAttribute('animation__open-up', {
		property: 'position',
		startEvents: 'open-up',
		dir: 'normal',
		dur: 1200,
		from: {x: 0, y:0, z: 0},
		to:  {x: -1, y: 0, z: 0},
		easing: 'easeOutCubic',
		elasticity: 900,
	});
	
	heximg.setAttribute('animation__open-up-rot', {
		property: 'rotation',
		startEvents: 'open-up-rot',
		dir: 'normal',
		dur: 1200,
		from: {x: 0, y:0, z: 0},
		to:  {x: 0, y: 15, z: 0},
		easing: 'easeOutCubic',
		elasticity: 900,
	});

	var button1 = element.parentNode.querySelector('.custom-button-class');			
	button1.setAttribute('animation__open-up', {
		property: 'position',
		startEvents: 'open-up',
		dir: 'normal',
		dur: 1200,
		from: {x: 0, y: -0.9, z: 0.1},
		to:  {x: -0.99, y: -0.9, z: 0.1},
		easing: 'easeOutCubic',
		elasticity: 900,
	});
	
	var button2 = element.parentNode.querySelector('.back-button-class');			
	


	// because delay in animation.js is not working 
	setTimeout(function()
	{
	 	infoSection.setAttribute("visible", true);
		infoSection.emit("open-up");
		infoSection.emit("unfold");
		heximg.emit('open-up');
		heximg.emit('open-up-rot');
		button1.emit('open-up');			
		button2.setAttribute("visible", true);

	}, 1300);




}

/* send back element applying animations and effects for it and its childs*/
function sendBack(element)
{
	if(element == null) return;
	
	var imgCurrentPos =element.getComputedAttribute("position");							
	var asignedPos = element.getAttribute('asignedPosition').split(" ");


	element.setAttribute('animation__send-back', {
		property: 'position',
		startEvents: 'send-back',
		dir: 'normal',
		dur: 1200,
		from: {x: imgCurrentPos.x, y:imgCurrentPos.y, z: imgCurrentPos.z},
		to:  {x: parseFloat(asignedPos[0]), y: parseFloat(asignedPos[1]), z: parseFloat(asignedPos[2])},
		easing: 'easeOutCubic',
		elasticity: 900,
		});

	//element.emit("fade-out");
	element.emit('send-back');
}

function fadeOut(element)
{	
	if(element == null) return;

	

	/*element.parentNode.setAttribute('animation__fade-in', {
		property: 'components.material.opacity',
		startEvents: 'fade-out',
		dir: 'normal',
		dur: 600,
		from: 0,
		to:  1,
		easing: 'easeOutCubic',

	});*/
	/*var heximage = element.parentNode.querySelector(".hexagon-image");			
	heximage.emit('fade-out');
	
	alert(heximage.getAttribute("src"));
	heximage.setAttribute("src", "#gallery1");
	/*alert(heximage.getAttribute("src"));*/
	element.setAttribute("visible", false);
}

function closeElement(element)
{	
	if(element == null) return;

	var ui_element = element.parentNode;

	// info section
	var infoSection = ui_element.querySelector('.info_section');			
	infoSection.setAttribute('animation__close', {
		property: 'position',
		startEvents: 'close',
		dir: 'normal',
		dur: 1200,
		from: {x: 1, y: 0, z: 0},
		to:  {x: 0, y:0, z: -1},
		easing: 'easeOutCubic',
		elasticity: 900,
	});
	

	var heximg = ui_element.querySelector('.hexagon-image');			
	heximg.setAttribute('animation__close', {
		property: 'position',
		startEvents: 'close',
		dir: 'normal',
		dur: 1200,
		from: {x: -1, y: 0, z: 0},
		to:  {x: 0, y:0, z: 0},
		easing: 'easeOutCubic',
		elasticity: 900,
	});
	
	heximg.setAttribute('animation__close-rot', {
		property: 'rotation',
		startEvents: 'close-rot',
		dir: 'normal',
		dur: 1200,
		from: {x: 0, y: 15, z: 0},
		to:  {x: 0, y:0, z: 0},
		easing: 'easeOutCubic',
		elasticity: 900,
	});

	var button1 = ui_element.querySelector('.custom-button-class');			
	button1.setAttribute('animation__close', {
		property: 'position',
		startEvents: 'close',
		dir: 'normal',
		dur: 1200,
		from: {x: -0.99, y: -0.9, z: 0.1},
		to:  {x: 0, y: -0.9, z: 0.1},
		easing: 'easeOutCubic',
		elasticity: 900,
	});
	
	var button2 = ui_element.querySelector('.back-button-class');			
	


	// because delay in animation.js is not working 
	setTimeout(function()
	{
	 	infoSection.emit("close");			 	
		heximg.emit('close');
		heximg.emit('close-rot');
		button1.emit('close');			
		

	}, 0);

	setTimeout(function()
	{	
		infoSection.setAttribute("visible", false);
		button2.setAttribute("visible", false);

	}, 1600);
	

}


/* CUSTOM BUTTON COMPONENT */
AFRAME.registerComponent('custom-button', {
	schema: {default:''},
	
	init: function(){

		
		this.el.addEventListener('click', () => {
			
			//alert("sending back");
			//sendBack(null);
			var el = this.el;					
			var currentOpacity = 1; //AFRAME.utils.entity.getComponentProperty(el.parentNode, 'material.opacity');
			//var currentOpacity = AFRAME.utils.entity.getComponentProperty(el.parentNode, 'material.opacity');
			
			// alert(currentOpacity + 2);
			//alert("sending back");
			
			var images =  document.querySelectorAll('.ui-hexagon');
			
			var i;
			// hide the others containers
			for(i = 0; i < images.length; i++ )
			{
				if(images[i] !==  el.parentNode)
				{	
					//Send-Back						
					sendBack(images[i]);
					fadeOut(images[i]);
			
				}						
			}
			el.setAttribute("visible", true);
			bringUp(el);
				

				        
 	});
}
});

/* CUSTOM BUTTON COMPONENT */
AFRAME.registerComponent('back-button', {
	schema: {default:''},
	
	init: function(){

		
		this.el.addEventListener('click', () => {
			
			//alert("sending back");
			//sendBack(null);
			var el = this.el;					
			var currentOpacity = 1; //AFRAME.utils.entity.getComponentProperty(el.parentNode, 'material.opacity');
			//var currentOpacity = AFRAME.utils.entity.getComponentProperty(el.parentNode, 'material.opacity');
			
			// alert(currentOpacity + 2);
			//alert("sending back");
			closeElement(el);
			

			setTimeout(function()
			{	
				var images =  document.querySelectorAll('.ui-hexagon');				

				var i;
				// hide the others containers
				for(i = 0; i < images.length; i++ )
				{
					//Send-Back						
					sendBack(images[i]);
					// fadeOut(images[i]);
					images[i].setAttribute("visible", true);						
				}
				

			}, 1600);

				

				        
 	});
}
});