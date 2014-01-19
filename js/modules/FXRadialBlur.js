var FXRadialBlur = function () {

	FRAME.Module.call( this );

	this.parameters.input = {

		effects: [],
		alphaBuffer: false,
		multiplier: 1.0,
		strength: 0.45,
		mode: null,
		center: [0.5,0.5]
	};

	var width = renderer.domElement.width;
	var height = renderer.domElement.height;

	var scene = new THREE.Scene();
	var camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, -10, 10);
	var mode;
	var quadmaterial;
	var quad;
	var strength, multiplier;

	this.init = function ( parameters ) {

		mode = parameters.mode;
		strength = parameters.strength;
		multiplier = parameters.multiplier;

		this.parameters.input = parameters;
	    var quadgeometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);

	    var v2 = new THREE.Vector2( parameters.center[0], parameters.center[1] );
	    
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

    	// Initialize FBOs
    	if (parameters.alphaBuffer)
	    	renderTargetParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat, stencilBuffer: false };
		else
			renderTargetParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false };
    	
		this.fboBaseTexture = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, renderTargetParameters );
		this.fboGlowTexture = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, renderTargetParameters );

    	// Link scenes
    	this.effects=[];

		for (var i=0;i<this.parameters.input.effects.length;i++)
    	{
    		var fx=timeline.getModuleById(this.parameters.input.effects[i]);
			this.effects.push(fx);
		}

 		this.zoomBlurShader = new THREE.ShaderMaterial({
 			uniforms: 
			{
				tDiffuse: {	type: "t", value: this.fboBaseTexture},
				resolution: {type: "v2", value: new THREE.Vector2(window.innerWidth, window.innerHeight)},
                center: { type: "v2", value: v2 },
				strength: {type: "f",value: parameters.strength},
				multiplier: {type: "f",value: parameters.multiplier}
			},
 			vertexShader: document.getElementById('vertexShader').textContent,
 			fragmentShader: document.getElementById('fs_ZoomBlur').textContent,
			transparent: true,
 		});
    	
    	this.compositeShader = new THREE.ShaderMaterial({
    		uniforms: 
    			{	
    				tBase: {type: "t",value: 0,texture: this.fboBaseTexture},
    				tGlow: {type: "t",value: 1,texture: this.fboGlowTexture}
			},
    		vertexShader: document.getElementById('vertexShader').textContent,
    		fragmentShader: document.getElementById('fs_Composite').textContent,
			transparent: true,
			depthTest: false,
			depthWrite: false,
			blending: THREE.AdditiveBlending 
    	});

		quad = new THREE.Mesh(quadgeometry, this.quadmaterial, this.compositeShader);
    	scene.add(quad);

		camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, -100, 100);

	};

	this.start = function ( t, parameters ) {

		for ( var i = 0; i < this.effects.length; i++ )
		{
			this.effects[ i ].renderToTexture = true;
			this.effects[ i ].fbo = this.fboBaseTexture;
		}

		this.effects[ 0 ].clearBuffer = true;
	};

	this.end = function ( ) {
		
		for ( var i = 0; i < this.effects.length; i++ )
			this.effects[ i ].renderToTexture = false;

	};	

	this.update = function ( t, perc ) {

		if ( mode == "animateStrength" )
			this.zoomBlurShader.uniforms.multiplier.value = (Math.cos( (2*perc+1)*Math.PI)+1)* multiplier;
		
		renderer.setClearColor( 0x000000, 1 );

		quad.material = this.zoomBlurShader;
	    quad.material.uniforms[ 'tDiffuse' ].value = this.fboBaseTexture;
	    renderer.render( scene, camera, this.fboGlowTexture, false );
	    quad.material = this.compositeShader;
	    
	    quad.material.uniforms[ 'tBase' ].value = this.fboBaseTexture;
	    quad.material.uniforms[ 'tGlow' ].value = this.fboGlowTexture;
	    renderer.render( scene, camera );
	    renderer.clearTarget( this.fboBaseTexture, true, true, true );
	};

};
