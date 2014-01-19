var FXThisWayGlow = function () {

	FRAME.Module.call( this );

	this.parameters.input = {
	};

	var width = renderer.domElement.width;
	var height = renderer.domElement.height;

	var camera, scene, material;
	var letters = [];
	var composer;
	var quad;
	var zoomBlurShader;
	var orthoScene;
    var orthoCamera;
    var obj;
    var baseTexture;
    var composer;
	var compositeShader;
	var orthoScene;
	var obj2;
	
	this.init = function ( parameters ) {

		scene = new THREE.Scene();

		camera = new THREE.OrthographicCamera(0, 1, 1, 0, 0, 1 );

		var images = [
			{ "x": 0.2, "y": 0.6, "sprite": "t" },
			{ "x": 0.3, "y": 0.6, "sprite": "h" },
			{ "x": 0.38, "y": 0.6, "sprite": "i" },
			{ "x": 0.45, "y": 0.6, "sprite": "s" },
			{ "x": 0.62, "y": 0.6, "sprite": "w" },
			{ "x": 0.73, "y": 0.6, "sprite": "a" },
			{ "x": 0.81, "y": 0.6, "sprite": "y" },
			{ "x": 0.5, "y": 0.4, "sprite": "arrow" },
		];

		for ( var i = 0; i < images.length; i++ ) {
			
			var image = images[ i ];

			var material = new THREE.MeshBasicMaterial( { 
							map: resourceManager.getTexture( "glow_" + image.sprite ),
							transparent: true,
							color: 0xffffff
						} );

			plane = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), material );
		
			plane.position.set( image.x, image.y, 0 );
			plane.scale.set( 0.08, 0.08, 1 );
			plane.visible = false;

			scene.add( plane );
			letters[ i ] = plane;
		}

	};

	this.update = function ( t ) {

		letters[ 0 ].visible = true;
		letters[ 1 ].visible = letters[ 2 ].visible = t > 0.161;
		letters[ 3 ].visible = t > 0.669;
		letters[ 4 ].visible = letters[ 5 ].visible = t > 0.823;
		letters[ 6 ].visible = t > 1.320;
		letters[ 7 ].visible = t > 1.466;

		if ( this.renderToTexture )
			renderer.render( scene, camera, this.fbo,this.clearBuffer );
		else
			renderer.render( scene, camera);

	};
};