var SArrow = function () {
	this.quad=null;
	this.index=0;
	this.angle=0;
}

var pfArrowSynchs = [

	0.351,
	0.793,
	1.027,
	1.219,
	1.776,
	2.031,
	2.857,
	3.207,
	3.679,
	4.026,
	4.612,
	4.994,
	5.559,
	6.299,
	6.536,
	7.038,
	7.317,
	7.81,
	8.122,
	8.471,
	8.573,
	//8.773,
	//8.873,

];


var NUMARROWSYNCHS=21;
var ARROWMOVDURATION=0.125;

var FXArrows = function () {

	FRAME.Module.call( this );

	this.parameters.input = {

	};

	var width = renderer.domElement.width;
	var height = renderer.domElement.height;

	var scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2( 0x000000, 0.01 );
	
	var cameras = [];
	cameras[ 1 ] = new THREE.PerspectiveCamera( 55, width / height, 1, 15000 );
	cameras[ 1 ].rotation.set( deg2rad( 10 ), deg2rad( -20 ), deg2rad( 5 ) );
	cameras[ 1 ].position.y = 5;

	cameras[ 0 ] = new THREE.PerspectiveCamera( 80, width / height, 1, 15000 );
	cameras[ 0 ].position.set( 50, 50, 200 );


	cameras[ 2 ] = new THREE.PerspectiveCamera( 50, width / height, 1, 5000 );
	cameras[ 2 ].position.set( 1, 8, 48 );
	cameras[ 2 ].rotation.set( deg2rad(-10), deg2rad(15), deg2rad(20) );

	var randomizer=new THREE.Randomizer(11);

  	var ambientLight = new THREE.AmbientLight(0x777777);
    scene.add(ambientLight);

	var material = new THREE.MeshBasicMaterial( {
		color: 0xffffffff,
		opacity: 1.0,
		fog: true,
		side: THREE.DoubleSide,
		map: resourceManager.getTexture( "grey_arrow" )

	} );

	var lenX   	= 115;
	var lenY   	= 75;
	var lenZ   	= 576;
	var numX	= 14;
	var numY 	= 5;
	var numZ 	= 20;

	var vecArrows = new Array();
	var num = 0;
	for (var i=0;i<numX;i++)
		for (var j=0;j<numY;j++)
			for (var k=0;k<numZ;k++)
			{
				var x = lenX * (i / numX)-lenX/2;
				x+=(j%3)*lenX/10;

				var y = lenY * (j / numY)-lenY/2;
				var z = lenZ * (k / numZ)-300;

				var arrow = new SArrow();
				arrow.quad = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), material );
				arrow.quad.position.set(x,y,z);
				scene.add(arrow.quad);
				
				var val = randomizer.randInt(0,1000)%50;
				num++;

				if(val < NUMARROWSYNCHS)
				{
					arrow.index      = val;
					arrow.angle     = Math.PI;
				}
				else
				{
					arrow.index      = 10000;
					arrow.angle     = 0;
				}
				
				arrow.quad.rotation.y = arrow.angle;

				vecArrows.push(arrow);
			}

	var wireframeMaterial = new THREE.MeshBasicMaterial( {
		color: 0xffffff, 
		wireframe: true, 
		transparent: true, 
		map: resourceManager.getTexture( "green_grid" ),
		side: 2, 
	} ); 

	object = new THREE.Mesh( new THREE.CubeGeometry( lenX*1.5, lenY*2, lenZ, 6, 8, 20 ), wireframeMaterial );
	var material = new THREE.MeshLambertMaterial();
	scene.add(object);

	this.init = function ( t, parameters ) {

	  	this.lasttime=0;
	  	
	};

	this.animateArrows = function (t, delta) {

		for(var i = 0; i < NUMARROWSYNCHS; i++)
		{
			var sync=pfArrowSynchs[i];
			
			if(t > sync && t < (sync + ARROWMOVDURATION))
			{
				for(var j = 0; j < vecArrows.length; j++)
				{
					if(vecArrows[j].index == i)
					{
						var fDecDegrees = ((t - sync) / ARROWMOVDURATION)*Math.PI;
						vecArrows[j].angle = Math.PI - fDecDegrees;

						if(vecArrows[j].angle < 0.0)
							vecArrows[j].angle = 0.0;

						vecArrows[j].quad.rotation.y=vecArrows[j].angle;
					}
				}
			}
			else if(t > (sync + ARROWMOVDURATION))
			{
				for(var j = 0; j < vecArrows.length; j++)
				{
					if(vecArrows[j].index == i)
						vecArrows[j].angle = 0;

					vecArrows[j].quad.rotation.y=vecArrows[j].angle;
				}
			}
		}

	};

	this.update = function ( t ) {

		var currentCamera;

		var delta = t - this.lasttime;
		this.lasttime = t;

		if ( t <= 5.1 )
		{
			cameras[ 0 ].position.z += delta * 3;
			cameras[ 0 ].position.y -= delta * 1.5;
			cameras[ 0 ].lookAt( new THREE.Vector3( -300, -380, -100 ) );

			currentCamera = cameras[ 0 ];
		}
		else if ( t <= 7.1 )
		{
			currentCamera = cameras[ 1 ];
			cameras[ 1 ].position.z -= delta * 1.5;
		}
		else
		{
			currentCamera=cameras[ 2 ];
			cameras[ 2 ].position.x -= delta / 5;
		}

		this.animateArrows( t, delta );

		if ( this.renderToTexture )
			renderer.render( scene, currentCamera, this.fbo, true );
		else
			renderer.render( scene, currentCamera );
	};

};