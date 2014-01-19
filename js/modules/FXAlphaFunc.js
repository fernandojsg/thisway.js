var FXAlphaFunc = function () {

	FRAME.Module.call( this );

	this.parameters.input = {

		startEffects: [],
		endEffects: [],
		transitionMap: null, // If null it will be just standard crossfade
        textureThreshold: 0.1
	};

	var width = renderer.domElement.width;
	var height = renderer.domElement.height;

	var scene = new THREE.Scene();

	var camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, -10, 10);

	var quadmaterial;
	
	this.init = function ( parameters ) {

		this.parameters.input = parameters;
	    var quadgeometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);

		if ( parameters.transitionMap )
		{
			this.quadmaterial = new THREE.ShaderMaterial({
		        uniforms: {

		                tDiffuseStart: {
		                        type: "t",
		                        value: null
		                },
		                tDiffuseEnd: {
		                        type: "t",
		                        value: null
		                },
		                mixRatio: {
		                        type: "f",
		                        value: 0.0
		                },
		                threshold: {
		                        type: "f",
		                        value: 0.1
		                },
		                tMixTexture: {
		                        type: "t",
		                        value: resourceManager.getTexture( parameters.transitionMap )
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

		                "uniform float mixRatio;",

		                "uniform sampler2D tDiffuseStart;",
		                "uniform sampler2D tDiffuseEnd;",
		                "uniform sampler2D tMixTexture;",
		                
		                "uniform int useTexture;",
		                "uniform float threshold;",

		                "varying vec2 vUv;",

		                "void main() {",

		                "vec4 texelStart = texture2D( tDiffuseStart, vUv );",
		                "vec4 texelEnd = texture2D( tDiffuseEnd, vUv );",
		                
                        "vec4 transitionTexel = texture2D( tMixTexture, vUv );",
                        "float r = mixRatio * (1.0 + threshold * 2.0) - threshold;",
                        "float mixf=clamp((r- transitionTexel.r)*(1.0/threshold), 0.0, 1.0);",
                        
                        "gl_FragColor = mix( texelStart, texelEnd, mixf );",
		        "}"

		        ].join("\n")
		    });
		}
		else
		{
			this.quadmaterial = new THREE.ShaderMaterial({
		        uniforms: {

		                tDiffuseStart: {
		                        type: "t",
		                        value: null
		                },
		                tDiffuseEnd: {
		                        type: "t",
		                        value: null
		                },
		                mixRatio: {
		                        type: "f",
		                        value: 0.0
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

		                "uniform float mixRatio;",

		                "uniform sampler2D tDiffuseStart;",
		                "uniform sampler2D tDiffuseEnd;",
		                "uniform sampler2D tMixTexture;",
		                
		                "varying vec2 vUv;",

		                "void main() {",

		                	"vec4 texelStart = texture2D( tDiffuseStart, vUv );",
		                	"vec4 texelEnd = texture2D( tDiffuseEnd, vUv );",
		                
							"gl_FragColor = mix( texelStart, texelEnd, mixRatio );",
		        		"}"

		        ].join("\n")
		    });
		}

		var quad = new THREE.Mesh(quadgeometry, this.quadmaterial);
    	scene.add(quad);

    	// Initialize FBOs
		renderTargetParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false };
		this.fboStart = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, renderTargetParameters );
		this.fboEnd = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, renderTargetParameters );

		this.quadmaterial.uniforms.tDiffuseStart.value = this.fboStart;
        this.quadmaterial.uniforms.tDiffuseEnd.value = this.fboEnd;

    	// Link scenes
    	this.startEffects=[];
    	this.endEffects=[];

		for (var i=0;i<this.parameters.input.startEffects.length;i++)
    	{
    		var fx=timeline.getModuleById(this.parameters.input.startEffects[i]);
			this.startEffects.push(fx);
		}

		for (var i=0;i<this.parameters.input.endEffects.length;i++)
    	{
    		var fx=timeline.getModuleById(this.parameters.input.endEffects[i]);
			this.endEffects.push(fx);
		}

	};

	this.start = function ( t, parameters ) {

		for (var i = 0; i < this.startEffects.length; i++ )
		{
			this.startEffects[i].renderToTexture = true;
			this.startEffects[i].fbo=this.fboStart;
		}

		for (var i = 0; i < this.endEffects.length; i++ )
		{
			this.endEffects[i].renderToTexture = true;
    		this.endEffects[i].fbo=this.fboEnd;
    	}

		this.endEffects[0].clearBuffer=this.startEffects[0].clearBuffer=true;
	};

	this.end = function ( ) {
		
		for (var i=0; i < this.startEffects.length; i++ )
			this.startEffects[i].renderToTexture = false;

		for (var i = 0; i < this.endEffects.length; i++ )
			this.endEffects[i].renderToTexture = false;

	};	

	this.update = function ( t, perc ) {

		this.quadmaterial.uniforms.mixRatio.value = perc;
    	
		renderer.render(scene, camera,null,true);

	};

};
