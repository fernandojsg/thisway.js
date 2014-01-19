var FXFlash = function () {

	FRAME.Module.call( this );

	this.parameters.input = {

		color: 0xffffff,
		middlePoint: 0.5,

	};

	var camera, scene, material, middlePoint;

	this.init = function ( parameters ) {

		camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );

		material = new THREE.MeshBasicMaterial( {
			color: parameters.color,
			transparent: true
		} );

		scene = new THREE.Scene();

		middlePoint = parameters.middlePoint;

		var object = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), material );
		scene.add( object );
		
	};
	
	this.update = function ( t, perc ) {

		if ( perc < middlePoint )
			material.opacity = perc / middlePoint;
		else
			material.opacity = - ( perc - middlePoint ) / ( 1 - middlePoint ) + 1;

		renderer.render( scene, camera );
	};

};
