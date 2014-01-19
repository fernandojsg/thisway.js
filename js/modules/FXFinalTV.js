var FXFinalTV = function () {

	FRAME.Module.call( this );

	this.parameters.input = {

		startPosition: [100, 100, 100],
		effects: null

	};

	var width = renderer.domElement.width;
	var height = renderer.domElement.height;

	var camera = new THREE.PerspectiveCamera( 55, width / height, 0.1, 5000 );
	
	var obj;
	var scene = new THREE.Scene();

  	var ambientLight = new THREE.AmbientLight( 0x333333 );
    scene.add( ambientLight );

	var light = new THREE.PointLight( 0x555555, 3, 200 );
	var tvQuad;

	var matrixScale = new THREE.Matrix4;

	var fboStart;
	this.init = function ( parameters ) {
	
		// Initialize FBOs
		renderTargetParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false };
		fboStart = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, renderTargetParameters );
		
    	// Link scenes
    	this.startEffects=[];

		for ( var i = 0; i < parameters.effects.length; i++ )
    	{
    		var fx = timeline.getModuleById( parameters.effects[ i ] );
			this.startEffects.push( fx );
		}

		var sceneJs = resourceManager.getGeometry( "finaltv" );

		for ( var i = 0; i < sceneJs.children[0].children.length; i++ )
		{
			var obj = sceneJs.children[ 0 ].children[ i ];

			if ( obj instanceof THREE.Mesh )
			{
				obj.material.opacity = 0.8;

				if ( obj.name.indexOf( "wire" ) !== -1 )
					obj.material.map = resourceManager.getTexture( "wires" );
				else if ( obj.name.indexOf( "tube" ) !==-1 )
					obj.material.map = resourceManager.getTexture( "tubes" );
				else if ( obj.name.indexOf( "wall" ) !==-1 )
					obj.material.map = resourceManager.getTexture( "walls" );
				else if ( ( obj.name.indexOf( "techo" )!==-1 ) || ( obj.name.indexOf( "suelo" ) !== -1 ) )
				{
					obj.material.map = resourceManager.getTexture( "suelo_techo" );
					//if ( obj.name !== "suelo_transparent" )
					{
						obj.material.opacity = 1.0;
						obj.material.transparent = false;
					}
				}
				else if ( ( obj.name.indexOf( "tv" ) !== -1 ) )
					obj.material.map = resourceManager.getTexture( "tv" );
			}
		}

		scene.add( sceneJs );

		var material = new THREE.MeshBasicMaterial( {
			color: 0xffffff, 
			map: fboStart,
			side: 2, 
		} ); 

		tvQuad = scene.getObjectByName( "pantalla", true );
		tvQuad.material = material;
	}

	this.end = function ( t, parameters ) {

		for (var i=0; i < this.startEffects.length; i++ )
			this.startEffects[ i ].renderToTexture = false;

	};

	this.start = function ( t, parameters ) {

		for (var i = 0; i < this.startEffects.length; i++ )
		{
			this.startEffects[ i ].renderToTexture = true;
			this.startEffects[ i ].fbo = fboStart;
		}

	};

	this.update = function ( t, perc ) {

		var inc = -t * 0.03;

		camera.position.set( 0.58 + inc * 3, -0.03, -( 0.58 + inc ) );

		camera.lookAt( tvQuad.position );

		renderer.render( scene, camera );
	};

};
