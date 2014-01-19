var FXKnotBackground = function () {

	FRAME.Module.call( this );

	this.parameters.input = {

		image_background : null,
		image_scroll: null

	};

	var scene=scene = new THREE.Scene();
	var camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );
	var uniforms;

	this.init = function ( parameters ) {

		var backTexture = resourceManager.getTexture( parameters.image_background );
		var gridTexture = resourceManager.getTexture( parameters.image_scroll );

		gridTexture.wrapS = gridTexture.wrapT = THREE.RepeatWrapping;

		uniforms = {
			background: { type: "t", value: backTexture },
			scroll: { type: "t", value: gridTexture },
			time: { type:"f", value: 1.0 }
		};

		vertexShader= document.getElementById( 'vertexShader' ).textContent;
		fragmentShaderSine= document.getElementById( 'fragmentShaderScroll' ).textContent;

		var material = new THREE.ShaderMaterial( { 
			vertexShader: vertexShader, 
			fragmentShader: fragmentShaderSine, 
			uniforms: uniforms,
			depthTest: false
		} );

		var object = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), material );
		scene.add( object );
	};

	this.update = function ( t ) {

		uniforms.time.value = t / 8;
		renderer.render( scene, camera );
	};

};