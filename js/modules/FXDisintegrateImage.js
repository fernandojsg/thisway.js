var FXDisintegrateImage = function () {

	FRAME.Module.call( this );

	var MAXNUMQUADS=60;
	var GREET_INDURATION = 1.5;
	var GREET_STAYDURATION = 2.0;
	var GREET_OUTDURATION = 1.5;

    this.parameters.input = {

            text: "empty",
            color: 0xffffff,
            startPosition: [0, 0, 0],
            endPosition: null,
            size: 0.1,
            fadeSpeed: 0.25,
            align: "center",
            width: 1.0,
            height: 1.0,
            image: null
    };

	height=2.0;

	var disintegrateQuads=[];
	for(var i = 0; i < MAXNUMQUADS; i++)
		disintegrateQuads.push(Math.random());


    var startPosition = new THREE.Vector2();
    var endPosition = new THREE.Vector2();

	var camera, scene, material, object;
	
	this.init = function ( parameters ) {

		camera = new THREE.OrthographicCamera( 0, 1, 1, 0, 0, 1 ); 	

		this.parameters=parameters;

		this.uniforms = {
			
			texture1: { type: "t", value: resourceManager.getTexture( parameters.image ) },
			time: {type:"f",value:1.0},
			numquads: {type:"i",value:60},
			quadheight: {type:"f",value:1.0},
			quads: { type: "fv1", value: [ ] },    // float array (plain)

		};

		var fadeMaterial = new THREE.ShaderMaterial( { 
			
			vertexShader: [
				"varying vec2 vUv;",
				"uniform float time;",

			    "void main() {",
			        "vUv = uv;",
			        "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
			    "}"
			].join("\n"), 
			fragmentShader: [
				"uniform sampler2D texture1;",

				"uniform float time;",
				"uniform int numquads;",
				"uniform float quadheight;",
				"uniform float quads[60];",

				"uniform vec2 resolution;",
			    "varying vec2 vUv;",
				"float PI = 3.14159265358979323846264;",
				"const int MAX_QUADS=60;",

				"void main(void)",
				"{",
					"vec2 uv = vUv;",
					"vec4 col=texture2D(texture1, uv);",

					"bool found=false;",
					"for (int i=0;i<MAX_QUADS;i++)",
					"{",
						"if (i<numquads)",
						"{",
							"float fY = cos(quads[i] * PI*2.0+time);",
							"found=found||((uv.y> (fY - quadheight)) && (uv.y< (fY + quadheight)));",
						"}",
					"}",
					"if (found)",
						"col=vec4(0.0);",

					"gl_FragColor = col;",
				"}"
			].join("\n"), 
			uniforms: this.uniforms, 
			depthTest: false,
			depthWrite: false

		} );

		fadeMaterial.transparent = true;

		object = new THREE.Mesh( new THREE.PlaneGeometry( 1, 1 ), fadeMaterial );
		object.scale.set( parameters.width, parameters.height, 1 );
		scene = new THREE.Scene();

		startPosition.fromArray( parameters.startPosition );
        
        if ( parameters.endPosition != null )
        {
            if ( endPosition.equals( startPosition ) )
                endPosition=null;
            else
                endPosition.fromArray( parameters.endPosition );
        }
        else
            endPosition=null;

        object.position.fromArray( parameters.startPosition );
        this.parameters.fadeSpeed = parameters.fadeSpeed;

		scene.add( object );
	};

    this.animate = function ( t, perc ) {
        
        var alpha = 1.0;

        if( perc < this.parameters.fadeSpeed )
        {
            alpha = perc / this.parameters.fadeSpeed;
        }
        else if ( perc > 1.0 - this.parameters.fadeSpeed )
        {
            alpha = ( 1.0 - perc ) / this.parameters.fadeSpeed;
            if( alpha < 0.0 ) 
                alpha = 0.0;
        }

        if ( endPosition != null )
            object.position.lerp ( startPosition, endPosition, perc );
    }

	this.update = function ( t, perc ) {
		
		this.animate( t, perc );

		if( t < GREET_INDURATION )
		{
			nNumQuads = parseInt( MAXNUMQUADS * ( t / GREET_INDURATION ) );
			if( nNumQuads < 1 ) nNumQuads = 1;
		}
		else if( t < ( GREET_INDURATION + GREET_STAYDURATION ) )
			nNumQuads = 0;
		else
		{
			nNumQuads = parseInt( MAXNUMQUADS - (MAXNUMQUADS * ( ( t - ( GREET_INDURATION + GREET_STAYDURATION ) ) / GREET_OUTDURATION ) ) );
			if( nNumQuads < 1 ) nNumQuads = 1;
		}

		this.uniforms.time.value = t;
		this.uniforms.quadheight.value = ( ( height * 5 ) / nNumQuads ) * ( ( MAXNUMQUADS - nNumQuads ) / MAXNUMQUADS );
		this.uniforms.numquads.value = nNumQuads;
		this.uniforms.quads.value = disintegrateQuads;

		renderer.render( scene, camera );
	};

};