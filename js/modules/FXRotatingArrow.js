var FX3DObjectActionBounce = function ( duration, size ) {

	this.duration = duration;
	this.size = size;

	this.doAction = function( object, actionTime, t )
	{
		var amplitude = ( this.duration - actionTime ) * 1.8;

		var offset = ( this.duration - actionTime ) / this.duration;
		object.position.y = Math.sin( 4 * offset * Math.PI ) * this.size * amplitude;
	}

	this.whenFinished = function( object )
	{
		object.position.y = 0;
	}
}

var FX3DObjectActionRotation = function ( duration, angle ) {

	this.duration = duration;
	this.angle = angle;
	this.mt = new THREE.Matrix4;

	this.doAction=function(object,actionTime,t)
	{
		
		this.mt.identity();
		var offset = ( this.duration - actionTime ) / this.duration;
		object.rotation.y = this.angle * offset;

	}

	this.whenFinished=function( object ) 
	{
		object.rotation.y = this.angle;
	}
}

var FXRotatingArrow = function () {

	FRAME.Module.call( this );

	this.parameters.input = {

		startPosition: [100, 100, 100],
		endPosition: [-100, 100, 100]

	};

	var width = renderer.domElement.width;
	var height = renderer.domElement.height;

	var syncs =
	[
		0.548,
		1.439,
		2.233,
		3.123,
		4.023,
		4.888,
		5.794,
		6.654,
		7.553,
		8.456,
		9.282,
		10.153,
		11.046,
		11.941,
		12.771,
		13.628
	];

	var camera = new THREE.PerspectiveCamera( 60, width / height, 1, 5000 );
	camera.rotation.x=-20*Math.PI/180;
	camera.rotation.z=-9*Math.PI/180;
	camera.position.set(80,60,190);

	var obj;
	var scene = new THREE.Scene();

  	var ambientLight = new THREE.AmbientLight(0x33333333);
    scene.add(ambientLight);

	var light1 = new THREE.PointLight( 16777213, 3, 300 );

	light1.position.set( 20, 30, 100 );
	
	var light1 = new THREE.PointLight( 16777213, 3, 350 );

	light1.position.set( 20, 30, 85 );
	scene.add( light1 );

	var localInitialVerts = new Array();
	var group = new THREE.Object3D();

	this.init = function()
	{
		this.vecActions = [];

		for ( var i = 0; i < syncs.length; i++ )
		{
			this.addAction( new FX3DObjectActionRotation( 0.25, Math.PI / 2 ), syncs[ i ] - 0.15, syncs[ i ] + 0.1 );
			this.addAction( new FX3DObjectActionBounce( 0.4, 15 ), syncs[ i ], syncs[ i ] + 0.4 );
		}

		var geometry = resourceManager.getGeometry( "arrow" );

		var textureNormal = resourceManager.getTexture( "arrow_normal" );
		textureNormal.wrapS = textureNormal.wrapT = THREE.RepeatWrapping;

		var material = new THREE.MeshPhongMaterial( {
			color: 16580351,
			ambient: 0,
			emissive: 0x333333,
			specular: 13027014,
			shininess: 16580351,
			map: resourceManager.getTexture( "arrow_diffuse" ), 
			normalMap: textureNormal, 
		} );

		for ( var i = 0; i < 4; i ++ ) {

			obj = new THREE.Mesh( geometry, material );
			obj.rotation.y = i * Math.PI / 2 + Math.PI / 4;
			obj.position.y = 10;
			obj.scale.set( 0.9, 0.9, 0.9 );
			group.add( obj );
		}

   		scene.add( group );

	}

	this.addAction= function(actionCallBack,start,end)
	{
		
		this.vecActions.push( { fun: actionCallBack, start: start, end: end } );

	}

	this.animate = function (t) 
	{
		for( var i = 0; i < this.vecActions.length; i++ )
		{
			action = this.vecActions[ i ];

			if( action.start <= t && action.end > t )
				action.fun.doAction( group, t - action.start, t );
			else if( t > action.end )
				action.fun.whenFinished( group );
		}
	}

	this.update = function ( fxTime, percTime, demoTime ) {

		this.animate( fxTime );
		renderer.render( scene, camera );
	};

};
