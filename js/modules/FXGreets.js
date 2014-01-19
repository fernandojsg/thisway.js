var FXGreets = function () {

	FRAME.Module.call( this );

	this.parameters.input = {
		map: null, 
		x:200, 
		y:300, 
		width:300,
		height:30,
		numQuads:60
	};

	var camera, scene, material;
	var letters = [];
	var GREET_INDURATION=1500;
	var GREET_STAYDURATION=2000;
	var GREET_OUTDURATION=1500;

	this.init = function ( parameters ) {

		this.parameters = this.parameters.input;

		camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );
		
		scene = new THREE.Scene();

		var material = new THREE.SpriteMaterial( { 
						map: resourceManager.getTexture( this.parameters.map ), 
						useScreenCoordinates: true, 
						color: 0xffffff, 
						fog: false} );

		sprite = new THREE.Sprite( material );

		sprite.position.set( this.parameters.x, this.parameters.y, 3 );
		sprite.scale.set( this.parameters.width, this.parameters.height, 1 );
		
		scene.add( sprite );

	};

	this.update = function ( t ) {
		
		renderer.render( scene, camera );
	};

};