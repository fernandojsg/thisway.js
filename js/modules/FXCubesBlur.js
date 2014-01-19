var FXCubesBlur = function () {

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
	var composer;

	this.init = function ( parameters ) {

		mode = parameters.mode;
		strength = parameters.strength;
		multiplier = parameters.multiplier;

		this.parameters.input = parameters;

    	// Initialize FBOs
    	if (parameters.alphaBuffer)
	    	renderTargetParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat, stencilBuffer: false };
		else
			renderTargetParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false };
  	
		this.fboBaseTexture = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, renderTargetParameters );
		this.fboGlowTexture = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, renderTargetParameters );

    	// Link scenes
    	this.effects = [];

		for ( var i = 0; i < this.parameters.input.effects.length; i++ )
    	{
    		var fx = timeline.getModuleById(this.parameters.input.effects[i]);
			this.effects.push(fx);
		}


	    var quadgeometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);

		this.quadmaterial = new THREE.MeshBasicMaterial( {
			color: 0xffffff,
			opacity: 1.0,
			fog: false,
			side: THREE.DoubleSide,
			map: this.fboBaseTexture,
		} );

		quad = new THREE.Mesh( quadgeometry, this.quadmaterial );
    	scene.add( quad );

		camera = new THREE.OrthographicCamera( window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, -100, 100 );

		var renderTarget = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, renderTargetParameters );

		effectSave = new THREE.SavePass( new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, renderTargetParameters ) );

		effectBasicTexture = new THREE.ShaderPass( THREE.BasicTextureShader );
		effectBasicTexture.uniforms[ 'tDiffuse1' ].value = this.fboBaseTexture;

		effectBasicTexture2 = new THREE.ShaderPass( THREE.BasicTextureShader );
		effectBasicTexture2.uniforms[ 'tDiffuse1' ].value = effectSave.renderTarget;

		effectBlend = new THREE.ShaderPass( THREE.BlendShader, "tDiffuse1" );
		effectBlend.uniforms[ 'tDiffuse2' ].value = effectSave.renderTarget;
		effectBlend.uniforms[ 'mixRatio' ].value = 0.8;

		radialBlur = new THREE.ShaderPass( THREE.MyRadialBlurShader );
		radialBlur.uniforms[ 'strength' ].value = 0.15;
		radialBlur.uniforms[ 'multiplier' ].value = 1.0;
		radialBlur.renderToScreen = true;

		composer = new THREE.EffectComposer( renderer, renderTarget );

		composer.addPass( effectBasicTexture );
		composer.addPass( effectBlend );
		composer.addPass( effectSave );
		composer.addPass( radialBlur );

	};

	this.start = function ( t, parameters ) {

		for (var i = 0; i < this.effects.length; i++ )
		{
			this.effects[i].renderToTexture = true;
			this.effects[i].fbo = this.fboBaseTexture;
		}

		this.effects[0].clearBuffer = true;
	};

	this.end = function ( ) {
		
		for ( var i = 0; i < this.effects.length; i++ )
			this.effects[i].renderToTexture = false;

	};	

	this.update = function ( t, perc ) {

		composer.render();

	};

};
