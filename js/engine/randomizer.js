THREE.Randomizer = function (seed) {

	this.max=Math.pow(2,32);
	this.setSeed(seed || (new Date()).getTime());
};

THREE.Randomizer.prototype =  {

	constructor: THREE.Randomizer,
    
    setSeed: function(val) {

    	this.seed = val || Math.round(Math.random() * this.max);

    },

    getSeed: function() {

    	return this.seed;

    },

    random: function () {

		// creates randomness...somehow...
      	this.seed += (this.seed * this.seed) | 5;
      	// Shift off bits, discarding the sign. Discarding the sign is
      	// important because OR w/ 5 can give us + or - numbers.
      	return (this.seed >>> 32) / this.max;

    },

	// Random float from <0, 1> with 16 bits of randomness
	// (standard Math.random() creates repetitive patterns when applied over larger space)
	//Webkit2's crazy invertible mapping generator
	// Theory is here: http://dl.acm.org/citation.cfm?id=752741
	random16: function () {

		return ( 65280 * this.random() + 255 * this.random() ) / 65535;

	},

	// Random integer from <low, high> interval

	randInt: function ( low, high ) {

		return low + Math.floor( this.random() * ( high - low + 1 ) );

	},

	// Random float from <low, high> interval

	randFloat: function ( low, high ) {

		return low + this.random() * ( high - low );

	},

	// Random float from <-range/2, range/2> interval

	randFloatSpread: function ( range ) {

		return range * ( 0.5 - this.random() );

	},

	randIntSpread: function ( range ) {

		return parseInt( range * ( 0.5 - this.random() ) );

	}

};
