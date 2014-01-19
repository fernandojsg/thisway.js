var FXBackground = function () {

	FRAME.Module.call( this );

	this.parameters.input = {
		image : null,
		transparent: false,
	};

	var scene=scene = new THREE.Scene();
	var camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );

	this.init = function ( parameters ) {

		var material = new THREE.MeshBasicMaterial( {

			color: 0xffffffff,
			opacity: 1.0,
			map: resourceManager.getTexture(parameters.image),
			depthTest: false,
			depthWrite: false,
			transparent: parameters.transparent

		} );

		var object = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), material );
		scene.add( object );

	};

	this.update = function ( t ) {
		
		if ( this.renderToTexture )
			renderer.render( scene, camera, this.fbo,this.clearBuffer );
		else
			renderer.render( scene, camera );

	};

};