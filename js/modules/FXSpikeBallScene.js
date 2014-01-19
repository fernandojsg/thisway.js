var FXSpikeBallScene = function () {

	var ELASTICITY = 0.2;

	var tmX = new THREE.Matrix4;
	var tmY = new THREE.Matrix4;
	var tmZ = new THREE.Matrix4;
	var vec = new THREE.Vector3;

	FRAME.Module.call( this );

	this.parameters.input = {
	};

	var width = renderer.domElement.width;
	var height = renderer.domElement.height;

	var camera = new THREE.PerspectiveCamera( 60, width / height, 1, 5000 );
	camera.position.x = -102;
	camera.position.z = 202;

	var scene = new THREE.Scene();

  	var ambientLight = new THREE.AmbientLight( 0x22222222 );
    scene.add( ambientLight );

	var light1 = new THREE.PointLight( 0xffffff, 5, 200 );
	light1.position.set( 0, 0, 30 );
	scene.add( light1 );

	var loader = new THREE.JSONLoader();
	
	geometry = resourceManager.getGeometry( "spikeball" );
	
	var localInitialVerts = new Array();

	var material = new THREE.MeshLambertMaterial( {
		
		shading: THREE.FlatShading,
		ambient: 0x334d44,
		color: 0x334d44,

	} );
	
	geometry.dynamic = true;

	var obj = new THREE.Mesh( geometry, material );

	obj.position.set(0,0,-100);
	scene.add( obj );

	for( v = 0; v < obj.geometry.vertices.length; v++ )
		localInitialVerts[ v ] = obj.geometry.vertices[ v ].clone();

	this.animate = function (t) 
	{
		//return;

		var time = t * 40;

		for( v = 0; v < obj.geometry.vertices.length; v++ )
		{
			vec.copy( localInitialVerts[ v ] );

			var distance = vec.length();

			var timeRot  = time - ( distance * ELASTICITY );
			
			// Movement
			tmX.makeRotationX( timeRot * 0.05 );
			tmY.makeRotationY( timeRot * 0.02 );
			tmZ.makeRotationZ( timeRot * 0.06 );

			vec.applyMatrix4( tmX );
			vec.applyMatrix4( tmY );
			vec.applyMatrix4( tmZ );

			obj.geometry.vertices[ v ].copy( vec );
		}
		
		if ( t > 10 )
			obj.position.y = QuadraticInOut( ( t - 10 ) / 5 ) * -280;
			//obj.position.y = (t-10)*-80;

		obj.geometry.computeCentroids();
		obj.geometry.computeFaceNormals();
		obj.geometry.computeVertexNormals();

		obj.geometry.verticesNeedUpdate = true;
		obj.geometry.normalsNeedUpdate = true;		
	}

	this.update = function ( t ) {

		this.animate( t );

		if ( this.renderToTexture )
			renderer.render( scene, camera, this.fbo, this.clearBuffer );
		else
			renderer.render( scene, camera );

	};

};
