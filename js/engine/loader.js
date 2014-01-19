THREE.FrameLoader = function () {

};

THREE.FrameLoader.prototype = {

	load: function ( resourceId ) {

		return this.resources [ resourceId ];

	}

};
