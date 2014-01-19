var FXCredits = function () {

	FRAME.Module.call( this );

	this.parameters.input = {
		name: "kile", 
		resourcePrefix: null,
		x:200,
		y:40, 
		quadWidth: 30,
		quadHeight: 20,
		totalWidth: 250, 
		duration: 3, 
		formationDuration: 1,
		quadDelay: 0.09,
		initialHeight: 600,
		directory: null
	};


	var width = renderer.domElement.width;
	var height = renderer.domElement.height;

	var camera, scene, material;
	var letters=[];

	this.init = function ( parameters ) {

		this.parameters=parameters;

        camera = new THREE.OrthographicCamera( 0, 1, 1, 0, 0, 1 );

		var numChars=this.parameters.name.length;
		scene = new THREE.Scene();

		for (var i=0;i<numChars;i++) {

			var material = new THREE.SpriteMaterial( { 

				map: resourceManager.getTexture( this.parameters.resourcePrefix + this.parameters.name[i] ),
				useScreenCoordinates: false,

			} );

			sprite = new THREE.Sprite( material );

			var posX = this.parameters.x - (this.parameters.totalWidth * 0.5) + ((i / numChars) * this.parameters.totalWidth);

			sprite.position.set( posX, this.parameters.y, 0 );
			sprite.scale.set( this.parameters.quadWidth, this.parameters.quadHeight, 1 );

			scene.add( sprite );
			letters[i]=sprite;
		}
	};

	this.update = function ( t ) {
		
		var HALFPI = Math.PI/2;
		var numChars = this.parameters.name.length;

		for (var i = 0; i < numChars; i++)
		{
			var quadWidth  = this.parameters.quadWidth;
			var quadHeight = this.parameters.quadHeight;
			var opacity      = 0.0;

			if(t < this.parameters.formationDuration)
			{
				// Creating
				var time      = t - (this.parameters.quadDelay * i);
				var buildTime = this.parameters.formationDuration - (numChars * this.parameters.quadDelay);
				var fT         = time / buildTime;

				opacity=1.0;
				if (fT<0.0)
					opacity = 0.0;
				else if(fT < 1.0)
				{
					// The quad, still growing
					var sin = 1 + Math.sin(Math.PI + HALFPI + (fT * HALFPI));

					quadWidth  = (sin * sin) * this.parameters.quadWidth;
					quadHeight = this.parameters.quadHeight + (Math.cos(fT * HALFPI) * this.parameters.initialHeight);
				}
				else
				{
					// Waiting for it partners
				}
			}
			else if(t < (this.parameters.duration - this.parameters.formationDuration))
			{
				// Already created
				quadWidth  = this.parameters.quadWidth;
				quadHeight = this.parameters.quadHeight;
				opacity      = 1.0;
			}
			else
			{
				// Deform
				var time     = t - (this.parameters.duration - this.parameters.formationDuration) - (this.parameters.quadDelay * i);
				var quitTime = this.parameters.formationDuration - (numChars * this.parameters.quadDelay);
				var fT        = time / quitTime;

				if(fT > 0.0 && fT < 1.0)
				{
					// Going out, streching
					var cos = Math.cos(fT * HALFPI);

					quadWidth  = (cos * cos) * this.parameters.quadWidth;
					quadHeight = this.parameters.quadHeight + (Math.sin(fT * HALFPI) * this.parameters.initialHeight);
					opacity      = 1.0;
				}
				else if(fT < 0.0)
				{
					// Still not going out
					opacity = 1.0;
				}
				else
				{
					// Go out! alpha = 0.
				}
			}

			var sprite=letters[i];

			sprite.material.opacity=opacity;
			sprite.scale.y=quadHeight;
			sprite.scale.x=quadWidth;
		}

		renderer.render( scene, camera );
	};

};