var FXWavesBackground = function () {

	FRAME.Module.call( this );

	this.parameters.input = {
		timeoffset: 0
	};

	var scene=scene = new THREE.Scene();
	var camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );
	var timeoffset=0;
	
	this.init = function ( parameters ) {

		timeoffset = parameters.timeoffset;
		this.uniforms = {
          time: {type:"f",value:1.0}
		};

		var material = new THREE.ShaderMaterial( { 
			vertexShader: stdVertexShader,
			fragmentShader: [
				"#ifdef GL_ES",
				"precision mediump float;",
				"#endif",

				"varying vec2 vUv;",
				"uniform vec2 mouse;",
				"uniform float time;",

				"#define PI 3.1416",

				"void main(void)",
				"{",
					"vec2 p = vUv;",
					"p.x += 0.58;",
					"p.y -= 0.61;",
					"vec2 center = vec2(1., 1);",
					"float d = distance(p, center);",
					
					//bluish tint from top left
					"vec3 color = vec3(1.0-d*0.75) * vec3(0.15, 0.21, 0.24);",
					
					//add some green near centre
					"color += (1.0-distance(p, vec2(1.0, 0.0))*1.)*0.5 * vec3(0.35, 0.65, 0.45)/2.;",
					
					"vec3 lightColor = vec3(0.3, 0.45, 0.65);",
					
					//will be better as uniforms
					"for (int i=0; i<3; i++) {",
						//direction of light
						//float zr = sin(time*0.15*float(i))*0.5 - PI/3.0;
						"float zr = sin(time*0.5*float(i))*0.5 - PI/3.0;",
						"vec3 dir = vec3(cos(zr), sin(zr), 0.0);",
						
						"p.x -= 0.02;",
						
						//normalized spotlight vector
						"vec3 SpotDir = normalize(dir);",
						
						//
						"vec3 attenuation = vec3(0.5, 7.0, 10.0);",
						"float shadow = 1.0 / (attenuation.x + (attenuation.y*d) + (attenuation.z*d*d));",

						"vec3 pos = vec3(p, 0.0);",
						"vec3 delta = normalize(pos - vec3(center, 0.0));",
						
						"float cosOuterCone = cos(radians(1.0));",
						"float cosInnerCone = cos(radians(15.0 + float(i*2)));",
						"float cosDirection = dot(delta, SpotDir);",
						
						//light...
						"color += smoothstep(cosInnerCone, cosOuterCone, cosDirection) * shadow * lightColor;",
					"}",

					"color += sin(time*1.5)*0.05;",
					"gl_FragColor = vec4(vec3(color), 1.0);",
						
				"}",

			].join("\n"),

			uniforms: this.uniforms,
			depthTest: false
		} );

		var object = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), material );
		scene.add( object );

	};

	this.update = function ( t ) {
		
		this.uniforms.time.value = t + timeoffset;
		
		if (this.renderToTexture)
			renderer.render(scene, camera, this.fbo,this.clearBuffer);
		else		
			renderer.render( scene, camera );

	};

};