var NUMJELLIES=12;

var JellyObject = function (randomizer) {
	
	this.f1 = 0;
	this.f2 = 0;
	this.obj = null;
	var boxSize = 40;

	this.fMult = randomizer.randFloat(0.8, 1.2);

	this.startPos=new THREE.Vector3(
			randomizer.randFloat( -80, 80 ),
			randomizer.randFloat( -100, 100 ),
			randomizer.randFloat( -50, 200 )
			);

	this.speedY = randomizer.randFloat( 10, 30 );
	this.movementPhase = randomizer.random() * Math.PI * 2;

	this.endPos = this.startPos.clone();
	this.endPos.y += 30;
	
	this.animate = function ( t ) {

		this.obj.position.lerp2( this.startPos, this.endPos, t );
		this.obj.material.uniforms[ 'time' ].value = t;

	}
};

var FXJellyScene = function () {

	FRAME.Module.call( this );

	var NUMSPHERES = 12;

	this.parameters.input = {
		cameraId: null,
		randomizer: 0,
	};

	var width = renderer.domElement.width;
	var height = renderer.domElement.height;

	var spheres = [];
	var scene = new THREE.Scene;
	var obj;
	var material;
	var camera;
	var jellies = [];
	var randomizer;

	this.init = function ( parameters ) {

		var cameras = [
			{ fov: 55, pos: [ -20, 80, 250 ], rotationZ: 0.7 },
			{ fov: 50, pos: [ 0, 50, 200 ], rotationZ: 0.7 },
			{ fov: 50, pos: [ -30, 70, 250 ], rotationZ: 0.7 },
			{ fov: 50, pos: [ 0, 90, 220 ], rotationZ: 0.7 },
		];

		var cameraParams = cameras[ parameters.cameraId ];
		
		randomizer = new THREE.Randomizer( parameters.randomizer );
		camera = new THREE.PerspectiveCamera( cameraParams.fov, width / height, 0.1, 10000 );
		
		camera.position.fromArray( cameraParams.pos );
		camera.rotation.z = cameraParams.rotationZ;

		geometry = resourceManager.getGeometry( "jellyfish" );

		for( var i = 0; i < NUMJELLIES; i++ )
		{
			jelly = new JellyObject( randomizer );

			var material = new THREE.ShaderMaterial( {
				uniforms: { 
					time: { type:"f", value: 0.0 },
					phase: { type:"f", value: jelly.movementPhase },
					tMaterialCoat: { type: "t", value: resourceManager.getTexture("fisheye") }
				},
	    		vertexShader: [
					"precision mediump float;",

					"uniform float time;",
					"uniform float phase;",
					
					"#define JELLY_ELASTICY 0.013",
					"#define JELLY_SCALEFACTOR 1.8",
					"#define PI 3.14159265358979323846264",

					"varying vec3 vNormal;",
					"varying vec3 vEyeView;	",

					"void main() {",
				    	
						"float offset = time - length( position ) * JELLY_ELASTICY;",
						"float tm = time * 5.0 + position.y * 0.1;",
						"float sx = 1.0 + sin( tm + 3.78 + phase ) / JELLY_SCALEFACTOR*.9;",

						"tm = sin( 5.0 * offset + phase );",
						"float angle = offset * 1.2;",

						"vec3 pos=vec3( position.x * cos( angle ) - position.z * sin( angle ), position.y, position.x * sin( angle ) + position.z * cos( angle ) );",
						"vNormal = vec3( normal.x * cos( angle ) - normal.z * sin( angle ), normal.y, normal.x * sin( angle ) + normal.z * cos( angle ) );",

						"pos *= vec3( sx, 1, sx );", // Scale

						"pos.y += sin( tm ) * 10.; ", // Translate up/down

						"vec4 positionView = modelViewMatrix * vec4( pos, 1.0 );",
				    	"gl_Position = projectionMatrix * positionView;",
				    	"vNormal = normalize( normalMatrix * vNormal );",
				    	"vEyeView = normalize(-positionView.xyz);",
					"}"
	    		].join("\n"),
	    		fragmentShader: [
					
					"precision mediump float;",

					"uniform float time;",

					"varying vec3 vNormal;",
					"varying vec3 vEyeView;	",
					"uniform sampler2D tMaterialCoat;",

					"vec2 SphereMap(const in vec3 ecPosition3, const in vec3 normal)",
					"{",
						"float m;",
						"vec3 r, u;",
						"u = normalize(ecPosition3);",
						"r = reflect(u, normal);",
						"r.z += 1.0;",
						"m = 0.5 * inversesqrt( dot(r,r) );",
						"return r.xy * m + 0.5;",
					"}",

					"void main() {",
						"vec3 finalNormal = normalize(vNormal);",
						"vec3 base = texture2D(tMaterialCoat, SphereMap(-vEyeView, finalNormal)).rgb;",
						"float angle = 1.0 - pow(dot (vEyeView, vNormal),2.5);",
						"gl_FragColor = vec4(1.4*base, angle*angle);",
					"}"

	    		].join("\n"),
				shading: THREE.SmoothShading,
				transparent: true,
				blending: THREE.AdditiveBlending

			} );
			
			geometry.computeVertexNormals();
			obj = new THREE.Mesh( geometry, material );

			jelly.obj = obj;

			jelly.initialverts = [];

			for( j = 0; j < jelly.obj.geometry.vertices.length; j++ )
				jelly.initialverts[ j ] = jelly.obj.geometry.vertices[ j ].clone();

			jelly.obj.position = jelly.startPos.clone();
				
			jellies.push( jelly );
			
			scene.add( jelly.obj );
		}

	};

	this.animate = function ( t ) {

		for ( var i = 0; i < jellies.length; i++ )
		{
			jellies[ i ].animate( t / 2 );
		}
	};

	this.update = function ( t ) {

		renderer.setClearColor( 0x29363f, 1 );

		this.animate( t );
		
		if (this.renderToTexture)
			renderer.render( scene, camera, this.fbo, false ); // fix
		else
			renderer.render( scene, camera );

		renderer.setClearColor( 0x000000, 1 );
	};

};