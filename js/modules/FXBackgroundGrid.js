var FXBackgroundGrid = function () {

	FRAME.Module.call( this );

	this.parameters.input = {
		image : null,
		rotation: 1.01,
		z: 4
	};

	var scene = new THREE.Scene();
	
	var w = window.innerWidth;
	var h = window.innerHeight;

	var biggerSize =  w > h ? w : h;

	var aspectX = biggerSize / w;
	var aspectY = biggerSize / h;

	var object;

	var camera = new THREE.OrthographicCamera( -w/2, w/2, h/2, -h/2, 0, 1 );
	var texture;

	this.init = function ( parameters ) {

		texture = resourceManager.getTexture(parameters.image);
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set(20, 20);
	
		var material = new THREE.MeshBasicMaterial( {

			color: 0xffffffff,
			opacity: 1.0,
			map: texture,
			depthTest: false,
			depthWrite: false,

		} );

		object = new THREE.Mesh( new THREE.PlaneGeometry( w, h ), material );

		object.scale.set( parameters.z * aspectX, parameters.z * aspectY, 1 );
		object.rotation.z = parameters.rotation;

		scene.add( object );

	};

	this.update = function ( t ) {

		texture.offset.x = t/2.0;

		if (this.renderToTexture)
			renderer.render(scene, camera, this.fbo,this.clearBuffer);
		else
			renderer.render( scene, camera );

	};

};