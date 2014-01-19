var FXWaterSphere = function (f1,f2,scene,group) {

	this.f1 = f1;
	this.f2 = f2;
	this.group = group;

	this.particleSystem = new ParticleSystem(scene);

	this.particleSystem.init(
				new THREE.Vector3( 0, 0, 0 ), // pos
				new THREE.Vector3( 0.001, -0.5, 0.001 ), // dir
				100.5, // accel
				0.3, // angleExpulsion
				100, // num
				6, // size
				1.2, // scaleFactor
				1.5, // life
				group // object3d
			);
};

FXWaterSphere.prototype =  {

    update: function (t) {

    	this.particlesystem.update( t );

    },
};


var FXWaterScene = function () {

	FRAME.Module.call( this );

	this.parameters.input = {

		cameraId: 0,

	};

	var width = renderer.domElement.width;
	var height = renderer.domElement.height;

	var spheres = [];
	var camera = new THREE.PerspectiveCamera( 60, width / height, 1, 1000 );

	var scene = new THREE.Scene;

  	var ambientLight = new THREE.AmbientLight( 0x22222222 );
    scene.add( ambientLight );

	var light1 = new THREE.PointLight( 0xffffff, 5, 300 );
	light1.position.z = 250;
	light1.position.y = 30;
	light1.position.x = -20;
	scene.add( light1 );

  	var group;
  	var randomizer;
	var particleSphere;
	var particlesSpheres = [];
	var lastTime = 0;

	this.init = function ( parameters ) {

		var NUMSPHERES = 5;

	  	var loader = new THREE.JSONLoader();

	  	var camerasData=[
			{"rand":17,"pos":[20,20,80],"lookat":null},
			{"rand":19,"pos":[10,40,90],"lookat":null},
			{"rand":20,"pos":[-20,40,70],"lookat":null},
			{"rand":59,"pos":[-40,55,40],"lookat":[-20,0,20]},
			{"rand":55,"pos":[-40,0,70],"lookat":[-20,40,20]},
			{"rand":82,"pos":[-10,80,50],"lookat":[0,40,20]},
		];
	
	  	cameraId=parameters.cameraId;
	  	
	  	var cameraData = camerasData[ cameraId ];

		randomizer = new THREE.Randomizer( cameraData.rand );
		camera.position.fromArray( cameraData.pos );

		if ( cameraData.lookat != null )
			camera.lookAt( new THREE.Vector3().fromArray( cameraData.lookat ) );

		var materialParticle = new THREE.SpriteMaterial( { 
			map: resourceManager.getTexture( "blackparticle" ),
			useScreenCoordinates: false, 
			color: 0xffffff, 
			fog: true } );

		var geometry = resourceManager.getGeometry("waterscene");

		group = new THREE.Object3D();

		var material = new THREE.MeshLambertMaterial( {
			shading: THREE.FlatShading,
			color:0xffffff,
			map: resourceManager.getTexture( "cell" ),
		} );

		obj = new THREE.Mesh( geometry, material);
		obj.name="sphere";
		group.add(obj);

		var materialSphere = new THREE.ShaderMaterial( {
			uniforms: { 
				tMaterialCoat: { type: "t", value:THREE.ImageUtils.loadTexture( 'files/watercell/TwilightFisheye1.jpg' ) }
			},				
    		vertexShader: document.getElementById( 'vertexShaderSphereWaterScene' ).textContent,
    		fragmentShader: document.getElementById( 'fragmentShaderSphereWaterScene' ).textContent,
			shading: 		THREE.SmoothShading,
			transparent: true,
			blending: THREE.AdditiveBlending
		} );			

		icosa = new THREE.Mesh( new THREE.IcosahedronGeometry( 6, 3 ), materialSphere );
		icosa.name = "envsphere";
		group.add( icosa );

		var icosaParticles = new THREE.IcosahedronGeometry( 8, 1 );
		particleSphere = new THREE.Object3D();

		for( var i = 0; i < icosaParticles.vertices.length; i++ )
		{
			var sprite = new THREE.Sprite( materialParticle );
			sprite.position.set( icosaParticles.vertices[i].x, icosaParticles.vertices[i].y, icosaParticles.vertices[i].z );
			particleSphere.add( sprite );
		}
		particleSphere.name="particlesphere";

		group.add(particleSphere);

		var boxSize = 100;
		for( var i = 0; i < NUMSPHERES; i++ )
		{
			var newGroup = group.clone();
			var f1 = randomizer.randInt( 0, 60 );
			var f2 = 120;

			newGroup.position.set( randomizer.randIntSpread( boxSize ), f1, randomizer.randIntSpread( boxSize ) );
			newGroup.updateMatrix();

			sphere = new FXWaterSphere( f1, f2, scene, newGroup );
			sphere.initialPosition = newGroup.position.clone();
			sphere.initialPhase = randomizer.random() * Math.PI;
			sphere.amplitudeX = 5;
			sphere.speedX = 1.5;

			sphere.particleSystem.attachToObject( newGroup );

			for( var t = 0; t < 50; t++ )
				sphere.particleSystem.update( 0.01 );
			
			spheres.push( sphere );
			scene.add( sphere.group );

			particlesSpheres.push(sphere.group.getObjectByName( "particlesphere", true ));
		}


	},

	this.animate = function ( t, perc ) 
	{
		for ( var i = 0; i < spheres.length; i++ )
		{
			var sphere = spheres[ i ];
			
			var rotation = ( t * 0.4 ) + ( i * 40 );
			
			sphere.group.children[ 0 ].rotation.x =- rotation * 2;
			sphere.group.children[ 0 ].rotation.y =- rotation * 3;

			sphere.group.rotation.set( rotation, rotation, rotation);

			sphere.group.position.y = sphere.f1 + (sphere.f2 - sphere.f1) * perc / 2;
			sphere.group.position.x = sphere.initialPosition.x + Math.cos( sphere.speedX * t + sphere.initialPhase ) * sphere.amplitudeX;

			sphere.particleSystem.update( t - lastTime );

			var particleSphere = particlesSpheres[ i ];
			
			for ( var c = 0; c < particleSphere.children.length; c ++ ) {

				var sprite = particleSphere.children[ c ];
				scale = ( Math.sin( 3 * t ) + 1.0 ) * 0.5 + 1.25;
				sprite.scale.set( scale, scale, 1.0 );
			}
		}

		lastTime = t;
	}

	this.update = function ( t, perc ) {

		renderer.setClearColor( 0x28363f, 1 );

		this.animate( t, perc );

		if ( this.renderToTexture )
			renderer.render( scene, camera, this.fbo, this.clearBuffer );
		else
			renderer.render( scene, camera );

		renderer.setClearColor( 0x000000, 1 );
	};

};
