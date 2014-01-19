var FXSineBackground = function () {

	FRAME.Module.call( this );

	this.parameters.input = {
	};

	var scene = new THREE.Scene();
	var camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );

	this.init = function ( parameters ) {

		this.uniforms = {

			time: { type:"f", value: 1.0 }

		};

		var material = new THREE.ShaderMaterial( { 
			vertexShader: stdVertexShader, 
			fragmentShader: [
				
				"precision mediump float;",

				"uniform float time;",
				"uniform vec2 resolution;",
			    "varying vec2 vUv;",

			    "#define MAX_ITER 6",

				"void main(void)",
				"{",
					"vec2 p = vUv*8.0- vec2(20.0);",
					"vec2 i = p;",
					"float c = 1.0;",
					"float inten = .020;",

					"for (int n = 0; n < MAX_ITER; n++)",
					"{",
						"float t = time * (1.0 - (3.0 / float(n+1)));",
						"i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));",
						"c += 1.0/length(vec2(p.x / (sin(i.x+t)/inten),p.y / (cos(i.y+t)/inten)));",
					"}",
					"c /= float(MAX_ITER);",
					"c = 1.5-sqrt(c);",
					
					"gl_FragColor = vec4(vec3(c*c*c*c), 1.0) + vec4(0.02, 0.12, 0.18, 1.0);",
				"}"
			
			].join("\n"), 

			uniforms: this.uniforms,
			depthTest: false
		} );

		var object = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), material );
		scene.add( object );

	};

	this.update = function ( t ) {
		
		this.uniforms.time.value = t;
		
		if ( this.renderToTexture )
			renderer.render( scene, camera, this.fbo, this.clearBuffer );
		else		
			renderer.render( scene, camera );

	};

};