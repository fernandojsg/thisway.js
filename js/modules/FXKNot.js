var FXKNot = function () {

	FRAME.Module.call( this );

	this.parameters.input = {

		startPosition: [ 100, 100, 100 ],
		endPosition: [ -100, 100, 100 ]

	};

	var NUMBUMPSYNCS = 14;
	var TORUS_DIF = -100;
	var TORUS_SYNCINC = 440;

	var syncs = [
		{ "time": 0.35, "camera": 0 },
		{ "time": 0.954, "camera": 1 },
		{ "time": 1.435, "camera": 0 },
		{ "time": 1.854, "camera": 1 },
		{ "time": 2.294, "camera": 0 },
		{ "time": 2.737, "camera": 1 },
		{ "time": 3.141, "camera": 0 },
		{ "time": 3.572, "camera": 1 },
		{ "time": 4.007, "camera": 0 },
		{ "time": 4.46, "camera": 1 },
		{ "time": 4.913, "camera": 0 },
		{ "time": 5.347, "camera": 1 },
		{ "time": 5.785, "camera": 0 } ];

	var width = renderer.domElement.width;
	var height = renderer.domElement.height;

	var camera = new THREE.PerspectiveCamera( 45, width / height, 1, 5000 );
	camera.position.set( -25, 0, -4 );
	
	var obj = null;
	var scene = new THREE.Scene();

  	var ambientLight = new THREE.AmbientLight( 0x77777777 );
    scene.add( ambientLight );

	var light = new THREE.PointLight( 16777213, 3, 150 );
	light.position.set( 0, 0, 0 );
	scene.add( light );

	var geometry;
	
	var localInitialVerts=new Array();
	var group=new THREE.Object3D();
	var lensFlare;

	this.init = function()
	{
		this.vecActions=[];

		geometry = resourceManager.getGeometry("knot");

		var texture = resourceManager.getTexture("knot_diffuse");
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

		var textureNormal = resourceManager.getTexture("knot_normal");
		textureNormal.wrapS = textureNormal.wrapT = THREE.RepeatWrapping;

		geometry.computeFaceNormals();
		geometry.computeVertexNormals();

		var material = new THREE.MeshPhongMaterial( {
			color: 16580351,
			ambient: 0,
			emissive: 0,
			specular: 13027014,
			map: texture, 
			normalMap: textureNormal,
		} );

		obj = new THREE.Mesh( geometry, material );
		obj.position.set( -60, 0, -100 );
		scene.add( obj );

		var textureFlare0 = THREE.ImageUtils.loadTexture( "files/knot/flare.jpg" );
		var flareColor = new THREE.Color( 0xffffff );
		lensFlare = new THREE.LensFlare( textureFlare0, 1300, 0.0, THREE.AdditiveBlending, flareColor );

		lensFlare.position = obj.position.clone();
		lensFlare.position.z += 10;
		lensFlare.position.set( -60, 0, -90 );
		lensFlare.rotation = Math.PI / 2;
		
		lensFlare.lensFlares[ 0 ].rotation=0;

		scene.add( lensFlare );

	}


	this.animate = function (t) 
	{
		obj.rotation.set( t, t, t );

		for( var i = 0; i < syncs.length; i++ )
		{
			if ( syncs[ i ].time <= t && ( syncs[ i ].time + 0.5 ) > t )
			{
				if ( syncs[ i ].camera == 0 )
					camera.position.set( -33, 0, -25 );
				else
					camera.position.set( -25, 0, -4 );
			}
		}
	}

	this.update = function ( t ) {
		
		this.animate(t);
		renderer.render( scene, camera );
	};

};
