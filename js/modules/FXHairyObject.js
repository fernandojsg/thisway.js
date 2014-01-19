function QuadraticInOut ( k ) {

    if ( ( k *= 2 ) < 1 ) return 0.5 * k * k;
    return - 0.5 * ( --k * ( k - 2 ) - 1 );

}

var FXHairyObject = function () {

	var HAIRCPOINTS = 6;
	var HAIRROTDELAY = 1000;
	var HAIRPOSDELAY = 0.8;
	var HAIRLENGTH = 500;
	var ELASTICITY = 0.05;
	var pos = new THREE.Vector3();
	var vtx = new THREE.Vector3();
	var euler = new THREE.Euler();
	var tm = new THREE.Matrix4;
	var spline = new THREE.SplineCurve3();

	FRAME.Module.call( this );

	this.parameters.input = {

	};

	var width = renderer.domElement.width;
	var height = renderer.domElement.height;

	var camera = new THREE.PerspectiveCamera( 60, width / height, 1, 5000 );

	var scene = new THREE.Scene();

  	var ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add( ambientLight );

	var icosa = new THREE.IcosahedronGeometry( 30, 1 );
	var vecHairs = [];
	vecNormals = [];

	var map = resourceManager.getTexture( "hairy_particle" );
	
	var material = new THREE.SpriteMaterial( 
		{ 	map: map, 
			useScreenCoordinates: false, 
			color: 0xffffff, 
			transparent:true,
			depthTest: false,
			opacity:1.0
		} );

	var group = new THREE.Object3D();
	var sprites = [];

	for( var i = 0; i < icosa.vertices.length; i++ )
	{
		vecNormals[ i ] = icosa.vertices[ i ].clone();
		vecNormals[ i ].normalize();

		vecHairs[ i ] = { "original": [], "spline": null, "sprites": [] };
		vecHairs[ i ].original[ 0 ] = icosa.vertices[ i ].clone();

		for( var j = 1; j < HAIRCPOINTS; j++ )
		{
			var normal = vecNormals[ i ].clone();
			var fT = j / HAIRCPOINTS;
			vecHairs[ i ].original[ j ] = new THREE.Vector3();
			vecHairs[ i ].original[ j ].addVectors( icosa.vertices[ i ], normal.multiplyScalar( HAIRLENGTH * fT ) );
		}
	}

	var numSpritesByHair = 40;

	for( var i = 0; i < icosa.vertices.length; i++ )
	{
		for ( var j = 0; j < numSpritesByHair; j++ )
		{
			var sprite = new THREE.Sprite( material );

			scaleX = scaleY = 20 * ( 1 - j / numSpritesByHair ) + 10;
			sprite.scale.set( scaleX, scaleY, 1 );
			vecHairs[ i ].sprites.push( sprite );
			sprite.position = vecHairs[ i ].original[ parseInt( j / numSpritesByHair ) ].clone();

			group.add( sprite );
		}
	}

	scene.add( group );

	camera.position.z = 700;

	var posX = -450;
	
	this.init = function ( t ) {
		
		var position = { x : -160 };
		var target = { x : 160 };
	};
	
	this.animate = function ( t ) {
		
		var fX1 = -450.0;
		var fX2 =  450.0;
		var fX3 = -1200;

		for( var i = 0; i < vecHairs.length; i++ )
		{
			var points = [];
			
			for(j = 0; j < HAIRCPOINTS; j++)
			{
				vtx = vecHairs[ i ].original[ j ].clone();

				var fT = j / ( HAIRCPOINTS - 1 );
				var distance = vtx.length();
				var timeRot  = t * 10.0 - ( distance * ELASTICITY );
				var fTime = t - fT * HAIRPOSDELAY;

				if( fTime < 6 )
					pos.x = fX1;
				else if ( fTime < 8 )
					pos.x = fX1 + ( fX2 - fX1 ) * QuadraticInOut( ( fTime - 6 ) / 2 );
				else if ( fTime < 12 )
					pos.x = fX2;
				else if ( fTime < 14.3 )
					pos.x = fX2 + ( fX3 - fX2 ) * QuadraticInOut( ( fTime - 12 ) / 2.3 );
				
				euler.set( timeRot * 0.05, timeRot * 0.02, timeRot * 0.06, 'XYZ');
				tm.makeRotationFromEuler( euler );
				tm.setPosition( pos );

				vtx.applyMatrix4( tm );
				points.push( vtx );
			}

			spline.points = points;
			for( var j = 0; j < numSpritesByHair; j++ )
				vecHairs[ i ].sprites[ j ].position = spline.getPoint( j / numSpritesByHair );

		}
	};

	this.update = function ( t ) {
		
		this.animate(t);

		//group.rotation.set(t/2,t*2,t);
		renderer.render( scene, camera );
	};

};
