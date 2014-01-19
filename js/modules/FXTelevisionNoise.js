var FXTelevisionNoise = function () {

	FRAME.Module.call( this );

	this.parameters.input = {
	};

	var camera, scene, material, uniforms;

	this.init = function ( parameters ) {

		camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );

		scene = new THREE.Scene();

		uniforms = {
          time: {type:"f",value:1.0}
		};

		fragmentShaderTV= document.getElementById( 'fragmentShaderTV' ).textContent;

		var material = new THREE.ShaderMaterial( {
			vertexShader: [

                "varying vec2 vUv;",

                "void main() {",

                "vUv = vec2( uv.x, uv.y );",
                "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

                "}"

			].join("\n"), 
			fragmentShader: [

				"precision mediump float;",

				"varying vec2 surfacePosition;",
				"uniform float time;",
				"uniform vec2 resolution;",

				"float hash( float n )",
				"{",
				    "return fract( sin(n)* 43758.5453123 );",
				"}",

				"float noise1( float x )",
				"{",
				    "float p = floor(x);",
				    "float f = fract(x);",

				    "f = f*f*(3.0-2.0*f);",

				    "return mix( hash(p+0.0), hash(p+1.0), f );",
				"}",

				"float fbm( float p )",
				"{",
				    "float f = 0.0;",

				    "f += 0.5000*noise1( p ); p = p*2.02;",
				    "f += 0.2500*noise1( p ); p = p*2.03;",
				    "f += 0.1250*noise1( p ); p = p*2.01;",
				    "f += 0.0625*noise1( p );",

				    "return f/0.9375;",
				"}",

				// war of the ants, i vote for the black ones
				"float random(float p) {",
				  "return fract(sin(fract(tan(p)))*12345.);",
				"}",

				"float noise(vec2 p) {",
				  "return random(mod(asin(-2.0+time)/(p.x*p.x)+p.y, fract(acos(-1.0+time)/(p.y*p.y)+p.x)));",
				"}",

			    "varying vec2 vUv;",

				"void main(void)",
				"{",

					"float c = dot( vec3( fbm( vUv.y * 5.134 + time * 2.013 ),",
							             "fbm( vUv.y * 15.002 + time * 3.591 ),",
										 "fbm( vUv.y * 25.922 + time * 4.277 ) ),",
						   "vec3( .85, .35, .17 ) );",

					"c*=noise(gl_FragCoord.xy*time/300.0+304.0);",
					"float scanline = sin(vUv.y*800.0)*0.1;",
					"c -= scanline;",
				  	
					"gl_FragColor = vec4( c, c, c, 1.);",
				"}"

			].join("\n"), 
			uniforms: uniforms} );

		var object = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), material );
		scene.add( object );

	};

	this.update = function ( t ) {
		
		uniforms.time.value = t * 100;

		if (this.renderToTexture)
			renderer.render( scene, camera, this.fbo, this.clearBuffer );
		else
			renderer.render( scene, camera );

	};

};