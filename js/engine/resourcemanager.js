THREE.ResourceManager = function () {

	this.resources = {
		"length" : 0,
		"textures":{},
		"scenes":{},
		"geometry":{}		
	};

	this.waitingToLoad = {};
	this.onLoadingProgress = null;
	this.totalResourcesToLoad = 0;
};

THREE.ResourceManager.prototype = {

	loadResources: function ( resourcesList, onLoadCallback, onLoadingProgress ) {

		this.onLoadCallback = onLoadCallback;
		this.onLoadingProgress = onLoadingProgress || null;

		for (var type in resources)
		{
			this.totalResourcesToLoad += resources[ type ].length;
		}

		for (var type in resources)
		{
			for ( var i = 0; i < resources[ type ].length; i++ )
			{
				var resource = resources[ type ][i];

				if ( type == "textures" )
					this.addTexture( resource.url, resource.id );
				else if (type == "geometry")
					this.addGeometry( resource.url, resource.id );
			}
		}

	},

	getTexture: function ( resourceId ) {

		return this.resources.textures[ resourceId ];

	},

	addGeometry: function ( resourceUrl, resourceId ) {

		if ( typeof resourceId == "undefined" )
			resourceId = resourceUrl;

		var extension = resourceUrl.split('.').pop();
		var loader = null;

		if (extension == "js2")
		  	loader = new THREE.ObjectLoader();
		else if ( extension == "js" )
			loader = new THREE.JSONLoader();
		else if ( extension =="json" )
			loader = new THREE.ObjectLoader();
		else if ( extension == "dae" )
			loader = new THREE.ColladaLoader();
		
		$this=this;
		loader.load( resourceUrl, function ( object ) {
				
			$this.resources.geometry[ resourceId ] = object;
			$this.resourceLoaded( resourceId );

		});

	},

	resourceLoaded: function ( resourceId ) {

		this.resources.length++;

		var total = this.resources.length + this.totalResourcesToLoad;
		//console.log("Loaded resource", this.resources.length, resourceId, (this.resources.length+1) / total);

		if (this.onLoadingProgress)
			this.onLoadingProgress( ( this.resources.length + 1 ) / total ); 

		if ( --this.totalResourcesToLoad == 0)
			this.onLoadCallback();

	},

	getGeometry: function ( resourceId ) {

		return this.resources.geometry[ resourceId ];

	},

	addTexture: function ( imageUrl, resourceId ) {

		if (typeof resourceId == "undefined")
			resourceId = imageUrl;

		$this = this;
		THREE.ImageUtils.loadTexture( imageUrl, undefined, function ( object ) {
				
				$this.resources.textures[ resourceId ] = object;
				$this.resourceLoaded( resourceId );

		});

	},

	addResource: function ( resourceId, resourceData, resourceType ) {

	},

	get: function ( resourceId ) {

		return this.resources [ resourceId ];

	}

};

