var FXWaveDistortion = function () {

	FRAME.Module.call( this );

	this.parameters.input = {

		effects: [],
	};

	var width = renderer.domElement.width;
	var height = renderer.domElement.height;

	var scene = new THREE.Scene();

	var camera = new THREE.OrthographicCamera( window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, -10, 10 );

	var quadmaterial;
	
	this.init = function ( parameters ) {

		this.parameters.input = parameters;
	    var quadgeometry = new THREE.PlaneGeometry( window.innerWidth, window.innerHeight );

		this.quadmaterial = new THREE.ShaderMaterial({
	        uniforms: {

	                tDiffuse: {
	                    type: "t",
	                    value: null
	                },
	                time: {
	                	type: "f",
	                	value: null
	                },
	                strength: {
	                	type: "f",
	                	value: 0.03
	                }
	        },
	        vertexShader: [

	                "varying vec2 vUv;",

	                "void main() {",

	                "vUv = vec2( uv.x, uv.y );",
	                "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

	                "}"

	        ].join("\n"),
	        fragmentShader: [

	                "uniform sampler2D tDiffuse;",
					"uniform float time;",
					"uniform float strength;",

	                "varying vec2 vUv;",

	                "void main() {",

						"vec2 dir = vUv - vec2(.5);",
						"float dist = distance(vUv, vec2(.5));",
						
						"vec2 offset = dir * (sin(dist * 80.0 - time*15.0) + 0.5) * strength;",
						"vec2 texCoord = vUv + offset;",

		                "vec4 texelStart = texture2D( tDiffuse, texCoord );",

	                    "gl_FragColor = texelStart;",
	        		"}"

	        ].join("\n")
	    });

		var quad = new THREE.Mesh( quadgeometry, this.quadmaterial );
    	scene.add( quad );

    	// Initialize FBOs
		renderTargetParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false };
		this.fboStart = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, renderTargetParameters );
		this.fboEnd = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, renderTargetParameters );

		this.quadmaterial.uniforms.tDiffuse.value = this.fboStart;

    	// Link scenes
    	this.startEffects = [];

		for ( var i = 0; i < this.parameters.input.effects.length; i++ )
    	{
    		var fx = timeline.getModuleById( this.parameters.input.effects[ i ] );
			this.startEffects.push( fx );
		}

	};

	this.start = function ( t, parameters ) {

		for (var i = 0; i < this.startEffects.length; i++ )
		{
			this.startEffects[i].renderToTexture = true;
			this.startEffects[i].fbo=this.fboStart;
		}

		this.startEffects[0].clearBuffer=true;
	};

	this.end = function ( ) {
		
		for (var i=0; i < this.startEffects.length; i++ )
			this.startEffects[i].renderToTexture = false;

	};	

	this.update = function ( t, perc ) {

		this.quadmaterial.uniforms.time.value = t * 1.0;
		this.quadmaterial.uniforms.strength.value = Math.sin( Math.PI * perc ) * 0.05;
    	
		renderer.render( scene, camera, null, true );

	};

};
