var FXFade = function () {

	FRAME.Module.call( this );

	this.parameters.input = {

		color: 0x000000,
		opacity : 1,
		fadeIn: true

	};

	var camera, scene, material, fadeIn;
	var opacity = 1;

	this.init = function ( parameters ) {

		fadeIn = parameters.fadeIn;

		camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );

		material = new THREE.MeshBasicMaterial( {
			color: parameters.color,
			opacity: parameters.opacity,
			transparent: true
		} );

		scene = new THREE.Scene();

		var object = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), material );
		scene.add( object );

	};

	this.update = function ( effectTime, perc, demoTime ) {

		if (fadeIn)
			material.opacity = ( 1 - perc ) * opacity;
		else
			material.opacity = perc * opacity;	

		renderer.render( scene, camera );
	};

};