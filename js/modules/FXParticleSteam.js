var SParticle = function () {
	
	this.fNormRand = 0.0;
	this.position = new THREE.Vector3( 0, 0, 0 );
	this.normaldir = new THREE.Vector3();

};

var pos = new THREE.Vector3();
var normal = new THREE.Vector3();

var FXParticleSteam = function () {

	FRAME.Module.call( this );

	var  MIN_SIZE	= 1;
	var  MAX_SIZE	= 2;
	var  MIN_Y		= -200;
	var  MAX_Y		= 200;
	var  MIN_SPEED	= 0.008;
	var  MAX_SPEED	= 0.015;

	this.parameters.input = {
		type: 0
	};

	var width = renderer.domElement.width;
	var height = renderer.domElement.height;

	var spheres = [];
	var camera = new THREE.PerspectiveCamera( 60, width / height, 1, 5000 );

	var scene=new THREE.Scene;

  	var ambientLight = new THREE.AmbientLight( 0x22222222 );
    scene.add(ambientLight);

	var light1 = new THREE.PointLight( 0xffffff, 5, 300 );
	
	light1.position.set ( -20, 30, 250 );
	scene.add( light1 );

	this.numParticles = 400;
	this.radius = 200;

	this.particleGeometry = new THREE.Geometry();

	this.particleMaterial = new THREE.ShaderMaterial( 
	{
		uniforms: 
		{
			texture:   { type: "t", value: resourceManager.getTexture("particle_steam") },
		},
		attributes:     
		{
			customVisible:	{ type: 'f',  value: [] },
			customSize:		{ type: 'f',  value: [] },
			customColor:	{ type: 'c',  value: new THREE.Color( 0xffffff ) },
			customOpacity:	{ type: 'f',  value: [] }
		},
		vertexShader: [

			"attribute float customSize;",
			"void main()",
			"{",
				"vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
				"gl_PointSize = customSize * ( 300.0 / length( mvPosition.xyz ) );",     // scale particles as objects in 3D space
				"gl_Position = projectionMatrix * mvPosition;",
			"}"
			].join("\n"),

		fragmentShader: [

			"uniform sampler2D texture;",
			"uniform float opacity;",
			"void main()", 
			"{",
				"gl_FragColor = texture2D( texture,  gl_PointCoord );",    
			"}"
			].join("\n"),

		transparent: true, 
		blending: THREE.NormalBlending, 
		depthTest: true,
		depthWrite: false
	});

	this.particleMesh = new THREE.ParticleSystem( this.particleGeometry, this.particleMaterial );

	this.particleMesh.dynamic = true;
	this.particleMesh.sortParticles = true;

	scene.add( this.particleMesh );
	this.randomizer = new THREE.Randomizer();
		
	this.particles = [];

	camera.position.set( 0, 0, 10 );
	var type;

	this.init = function ( parameters ) {

		type = parameters.type;

		if ( type == 1 )
			camera.rotation.z = 0.7;
		
		this.lasttime = 0;
		var height = MAX_Y - MIN_Y;

		for( var i = 0; i < this.numParticles; i++ )
		{
			var particle = new SParticle();
			this.resetParticle( particle );
			particle.position.y = MIN_Y + this.randomizer.randFloat( 0.0, height );
			this.particleGeometry.vertices.push( particle.position.clone() );

			this.particleMaterial.attributes.customOpacity.value[ i ] = 0.5;

			this.particles.push( particle );
		}
	},

	this.resetParticle = function (particle) {

		var x = this.randomizer.randFloat( -this.radius * 0.5, this.radius * 0.5 );
		var z = this.randomizer.randFloat( -this.radius * 0.5, this.radius * 0.5 );

		var xd = this.randomizer.randFloat( -5.0, 5.0 );
		var yd = this.randomizer.randFloat( -5.0, 5.0 );

		if ( type == 0 )
			particle.fNormRand = this.randomizer.randFloat( 0.0, 1.0 );
		else
			particle.fNormRand = this.randomizer.randFloat( -5,0 );

		particle.position.set( x, MAX_Y, z );
		particle.normaldir.set( xd, yd, 0.0 );
		particle.normaldir.normalize();

	},

	this.animate = function (t, perc) 
	{
		var inc = t-this.lasttime;
		this.lasttime = t;

		for(var i = 0; i < this.numParticles; i++)
		{
			var particle = this.particles[i];

			// Update pos
			particle.position.y += ( MIN_SPEED + ( MAX_SPEED - MIN_SPEED ) * particle.fNormRand ) * inc * 1000;

			if( particle.position.y > MAX_Y )
				particle.position.y = MIN_Y + ( particle.position.y - MAX_Y );

			pos.copy( particle.position );
			normal.copy( particle.normaldir );

			var f = Math.sin( t + ( particle.fNormRand * THREE.Math.PI2 ) ) * 10;

			pos.add( normal.multiplyScalar( f ) );

			var size = 3 + Math.sin( ( t * 2 ) + ( particle.fNormRand * THREE.Math.PI2 ) );
			this.particleGeometry.vertices[ i ].copy( pos );
			this.particleMaterial.attributes.customSize.value[ i ] = size;
		}
	}

	this.update = function ( t, perc ) {

		this.animate( t, perc );

		if ( this.renderToTexture )
			renderer.render( scene, camera, this.fbo, this.clearBuffer );
		else
			renderer.render( scene, camera );

	};

};