var FXCubesRoom = function () {

	FRAME.Module.call( this );

	this.parameters.input = {

		startPosition: [100, 100, 100],
		endPosition: [-100, 100, 100]

	};

	var width = renderer.domElement.width;
	var height = renderer.domElement.height;

	var camera = new THREE.PerspectiveCamera( 138, width / height, 0.1, 5000 );


	var obj;
	var scene = new THREE.Scene();

  	var ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);

	var light = new THREE.PointLight( 0x555555, 5, 6 );
	scene.add( light );

	model = resourceManager.getGeometry( "cubes_room" ).scene;
	scene.add( model );

	this.update = function ( t ) {

		camera.rotation.y = t/2;
		camera.rotation.x = t/4;
		camera.rotation.z = t/8;

		if ( this.renderToTexture )
			renderer.render( scene, camera, this.fbo,this.clearBuffer );
		else
			renderer.render( scene, camera );
	};

};
