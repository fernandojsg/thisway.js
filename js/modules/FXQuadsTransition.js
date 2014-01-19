var AnimQuad = function ( geom, dir )
{
	this.normRand = Math.random();
	this.geom = geom;
	this.dir = dir;
	this.center = geom.position.clone();
};


var FXQuadsTransition = function () {

	
	FRAME.Module.call( this );

	this.parameters.input = {

		startEffects: [],
		numQuadsX: 10,
		numQuadsY: 20,
		type: "scale",
		image: null
	};

	var inc = new THREE.Vector3();
	var width = renderer.domElement.width;
	var height = renderer.domElement.height;

	var scene = new THREE.Scene();

	var camera = new THREE.OrthographicCamera(0, window.innerWidth, window.innerHeight, 0, -5000, 5000);

	var quadmaterial;
	var numQuadsX,numQuadsY;
	var quads = [];

	this.init = function ( parameters ) {

		this.parameters.input = parameters;
	    
		numQuadsX = parameters.numQuadsX;
		numQuadsY = parameters.numQuadsY;

		var quadWidth  = 1 / numQuadsX;
		var quadHeight = 1 / numQuadsY;

		quadWidth *= window.innerWidth;
		quadHeight *= window.innerHeight;

		var texture=null;
		if (parameters.image)
			texture = resourceManager.getTexture( parameters.image );

		quadmaterial = new THREE.MeshBasicMaterial( {
			//map: THREE.ImageUtils.loadTexture( 'files/arrow/background.png' ),
			map: texture,
			side: THREE.DoubleSide
		} );

		for(var i = 0; i < numQuadsX; i++)
		{
			for(var j = 0; j < numQuadsY; j++)
			{
				var quadGeometry = new THREE.PlaneGeometry(quadWidth, quadHeight);
				
				var quad = new THREE.Mesh( quadGeometry, quadmaterial );
				quad.position.set( i*quadWidth+quadWidth/2,j*quadHeight+quadHeight/2, 0);

				var dir=new THREE.Vector3(i - numQuadsX / 2, numQuadsY - j - numQuadsY / 2, 0 );
				dir.normalize();

				var animQuad=new AnimQuad(quad, dir);

				quads.push( animQuad );

				scene.add( quad );
				
				quadGeometry.faceVertexUvs[ 0 ][ 0 ][ 0 ].set( i / numQuadsX, (j+1) / numQuadsY ); // 0 1
				quadGeometry.faceVertexUvs[ 0 ][ 0 ][ 1 ].set( i / numQuadsX, j / numQuadsY );	// 0 0
				quadGeometry.faceVertexUvs[ 0 ][ 0 ][ 2 ].set( (i+1) / numQuadsX, (j+1) / numQuadsY ); // 1 1

				quadGeometry.faceVertexUvs[ 0 ][ 1 ][ 0 ].set( i / numQuadsX, j / numQuadsY ); // 0 0
				quadGeometry.faceVertexUvs[ 0 ][ 1 ][ 1 ].set( (i+1) / numQuadsX, j / numQuadsY ); // 1 0
				quadGeometry.faceVertexUvs[ 0 ][ 1 ][ 2 ].set( (i+1) / numQuadsX, (j+1) / numQuadsY ); // 1 1

			}
		}

		this.startEffects=[];

		if (this.parameters.input.startEffects && this.parameters.input.startEffects.length>0)
		{
			renderTargetParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false };
			this.fboStart = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, renderTargetParameters );

			quadmaterial.map=this.fboStart;

	    	// Link scenes
	    
			for (var i=0;i<this.parameters.input.startEffects.length;i++)
	    	{
	    		var fx=timeline.getModuleById(this.parameters.input.startEffects[i]);
				this.startEffects.push(fx);
			}
		}

		if (parameters.type=="scale")
			this.anim=this.animScale;
		else
			this.anim=this.animExplode; 
	};

	this.start = function ( t, parameters ) {

		if ( this.startEffects.length == 0 )
			return;

		for (var i = 0; i < this.startEffects.length; i++ )
		{
			this.startEffects[ i ].renderToTexture = true;
			this.startEffects[ i ].fbo = this.fboStart;
		}

		this.startEffects[0].clearBuffer = true;
	};

	this.end = function ( ) {
		
		if (this.startEffects.length==0)
			return;

		for (var i=0; i < this.startEffects.length; i++ )
			this.startEffects[i].renderToTexture = false;

	};	

	this.animExplode = function (t, perc) {
		
		var distance = perc * 400;

		for (var i = 0; i < quads.length; i++ )
		{
			var angle = perc * ( 0.1 + ( 0.7 * quads[ i ].normRand ) );
			angle *= 5;

			quads[ i ].geom.rotation.set( angle, angle, angle );

			var pos = quads[ i ].center.clone();

			inc.set( 	quads[ i ].dir.x * distance * 2, 
						-quads[ i ].dir.y * distance, 
						perc * distance);

			quads[ i ].geom.position = pos.add( inc );
		}

	};

	this.animScale = function (t, perc) {

		for ( var i = 0; i < quads.length; i++ )
		{
			var fScale = 1.0 - perc;
			quads[ i ].geom.scale.set( fScale, fScale, 1.0 );
		}

	};

	this.update = function ( t, perc ) {

		renderer.setClearColor( 0x28363f, 1 );

		this.anim( t, perc );

    	renderer.render( scene, camera );

	};

};
