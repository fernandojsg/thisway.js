var ClearModule = function () {

	FRAME.Module.call( this );

	this.parameters.input = {

		clearColor: 0x000000,

	};

	var clearColor;

	this.init = function ( parameters ) {

		clearColor = parameters.clearColor;

	},

	this.update = function ( t ) {

		renderer.setClearColor( clearColor, 1 );

		renderer.clear();

	};

};