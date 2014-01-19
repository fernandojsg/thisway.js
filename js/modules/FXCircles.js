var FXCircles = function () {

var NUMCIRCLESYNCHS = 17;
var CIRCLEMOVDURATION = 0.6;
var ALLEEEZ = 0;

var fRadialSynchs = [
	1.184,
	2.899,
	4.688,
	6.39,
	8.12,
	9.849,
	11.554,
	13.45,
];

var pfCircleSynchs =
[
	0.457,
	1.334,
	2.134,
	3.049,
	3.874,
	4.838,
	5.603,
	6.54,
	7.343,
	8.27,
	9.12,
	9.999,
	10.888,
	11.704,
	12.701,
	13.599
];

var circleObjects = ['a','b','c','d','e','f','g'];

var pcWhichCircle = 
[
	'd',
	'a',
	'b',
	'c',
	'd',
	'e',
	'f',
	'a',
	'b',
	'c',
	'd',
	'e',
	'f',
	'a',
	'b',
	'c',
	'd'
];

var circleSpeed = 
[
	 1,
	-1,
 	 1,
	-1,
	 1,
	 1,
	-3,
	-1,
	 1,
 	-1,
	 1,
	 1,
	-1,
	-1,
	 1,
	-1,
	 1	
];

var pcCircleSynchSpeeds = 
[
	 6,
	-6,
 	 4,
	 6,
	-4,
	 5,
	-4,
	-7,
	 8,
	 6,
	-6,
 	 4,
	 6,
	-4,
	 5,
	-4,
	-7
];

	FRAME.Module.call( this );

	this.parameters.input = {
		startPosition: [100, 100, 100],
		endPosition: [-100, 100, 100]
	};

	var width = renderer.domElement.width;
	var height = renderer.domElement.height;

	var camera = new THREE.PerspectiveCamera( 81, width / height, 0.1, 10000 );
	var scene;
	var lasttime=0;
	var cylinder;

  	object = resourceManager.getGeometry("circles");
	scene = object;

	var material=new THREE.MeshLambertMaterial( { 

		color: 0xa69cbe, //0xa69cbe
		ambient: 0xa69cbe,
		side: THREE.DoubleSide,
		shading: THREE.FlatShading,

	} );

	var materialArrow = new THREE.MeshPhongMaterial( {
		color: 0xffffff,
		ambient: 0,
		emissive: 0,
		specular: 13027014,
		map: resourceManager.getTexture( "circular_arrow" )
	} );

	for( i = 0; i < circleObjects.length; i++ )
	{
		circleObjects[ i ] = scene.getObjectByName( circleObjects[ i ], true );
		circleObjects[ i ].material = material;
	}

	circleObjects[ 6 ].material = materialArrow;

	cylinder = scene.getObjectByName( "astomp", true );
	cylinder.material=material;

  	var ambientLight = new THREE.AmbientLight( 0x555555 );
    scene.add( ambientLight );

	var light = new THREE.PointLight( 0x555555, 5, 20 );
	light.position.set( 5,5,5 );
	scene.add( light );

	camera.position.set(2,2.7,5);
	camera.up = new THREE.Vector3(0,1,0);
	camera.lookAt(new THREE.Vector3(1,0,0));
	camera.rotation.z=0.3;

	this.animate = function (t) 
	{
	  	var incTime=t-lasttime;
	  	lasttime=t;

		var SPEED_CONST=20;

		for(var i = 0; i < circleObjects.length; i++)
			circleObjects[ i ].rotation.z += incTime * circleSpeed[ i ] * 0.01 * SPEED_CONST;

		for( j = 0; j < NUMCIRCLESYNCHS; j++ )
		{
			if ( t > pfCircleSynchs[ j ] && t < ( pfCircleSynchs[ j ] + CIRCLEMOVDURATION ) )
			{
				var fSpeed = Math.cos( ( ( t - pfCircleSynchs[ j ] ) / CIRCLEMOVDURATION ) * Math.PI / 2 ) * 0.3 * SPEED_CONST;

				for ( i = 0; i < circleObjects.length; i++ )
				{
					if( circleObjects[ i ].name == pcWhichCircle[ j ] )
						circleObjects[ i ].rotation.z += incTime * circleSpeed[ i ] * fSpeed;
				}
			}
		}

		for(i = 0; i < 8; i++)
		{
			if(t > fRadialSynchs[i] && t < (fRadialSynchs[i] + 0.5))
			{
				var fT = ( t - fRadialSynchs[ i ] ) / 0.5;
				var fY = 380 - ( QuadraticInOut( fT * Math.PI ) * 180 );
				
				cylinder.position.y = fY;
			}
		}

	}

	this.start = function ( t, parameters ) {

	};

	this.update = function ( t ) {

		this.animate(t);

		if (this.renderToTexture)
			renderer.render(scene, camera, this.fbo,this.clearBuffer);
		else
			renderer.render( scene, camera );

	};

};
