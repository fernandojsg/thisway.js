var FXPulsatingImage = function () {

	FRAME.Module.call( this );

	this.parameters.input = {
		image : null,
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		pulses: [],
		transparent: false
	};

	var scene=scene = new THREE.Scene();
	var camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );
	var material;

	this.init = function ( parameters ) {

		this.parameters.input=parameters;

		material = new THREE.MeshBasicMaterial( {
			color: 0xffffffff,
			opacity: 1.0,
			map: resourceManager.getTexture(parameters.image),
			depthTest: false,
			depthWrite: false,
			transparent: parameters.transparent
		} );

		var object = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), material );
		
		object.position.set( this.parameters.input.x, this.parameters.input.y, 0 );
		object.scale.set( this.parameters.input.width, this.parameters.input.height, 1 );
		
		scene.add( object );
	};

	this.getAlpha=function (effectTime)
	{
		var alpha = 0.0;

		for(var i = 0; i < this.parameters.input.pulses.length; i++)
		{
			var pulse = this.parameters.input.pulses[ i ];

			if(effectTime > pulse.time && (effectTime < (pulse.time + pulse.duration)))
				alpha = 1.0 - (effectTime - pulse.time) / pulse.duration;
		}
		return alpha;
	}

	this.update = function ( effectTime, perc, demoTime ) {

		material.opacity = this.getAlpha( effectTime );
		
        if ( this.renderToTexture )
            renderer.render( scene, camera, this.fbo,this.clearBuffer );
        else
            renderer.render( scene, camera );
	};

};