/**
 * @author felixturner / http://airtight.cc/
 *
 * RGB Shift Shader
 * Shifts red and blue channels from center in opposite directions
 * Ported from http://kriss.cx/tom/2009/05/rgb-shift/
 * by Tom Butterworth / http://kriss.cx/tom/
 *
 * amount: shift distance (1 is width of input)
 * angle: shift angle in radians
 */



THREE.MyRadialBlurShader = {

	uniforms: {

		"tDiffuse": 	{ type: "t", value: this.fboBaseTexture },
		"resolution": 	{ type: "v2", value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        "center": 		{ type: "v2", value: new THREE.Vector2(0.5,0.5) },
		"strength": 	{ type: "f",value: 0.45 },
		"multiplier": 	{ type: "f",value: 1.0 }

	},

 	vertexShader: [
		"varying vec2 vUv;",

    	"void main() {",
        	"vUv = uv;",

        	"gl_Position =   projectionMatrix * modelViewMatrix * vec4(position,1.0);",
    	"}"

 	].join("\n"),

 	fragmentShader: [
		
		// Add center, strength, random yes/no, randomize
		
		"varying vec2 vUv;",
		"uniform sampler2D tDiffuse;",
		"uniform vec2 resolution;",
		"uniform float strength;",
		"uniform float multiplier;",
		"uniform vec2 center;",
		
		"float random(vec3 scale,float seed)",
		"{",
			"return fract(sin(dot(gl_FragCoord.xyz+seed,scale))*43758.5453+seed);",
		"}",
		
		"void main() {",

			"vec4 color=vec4(0.0);",
			"float total=0.0;",

			"vec2 toCenter=(center-vUv)*resolution;",
			
	        // randomize the lookup values to hide the fixed number of samples
			"float offset=random(vec3(12.9898,78.233,151.7182),0.0);",
			
			"for(float t=0.0;t<=40.0;t++){",

				"float percent=(t+offset)/40.0;",
				"float weight=4.0*(percent-percent*percent);",
				
				"vec4 sample=texture2D(tDiffuse,vUv+toCenter*percent*strength/resolution)*multiplier;",
				
				// switch to pre-multiplied alpha to correctly blur transparent images
				"sample.rgb*=sample.a;",

				"color+=sample*weight;",
				"total+=weight;",
			"}",
			
			"gl_FragColor=color/total;",
			"gl_FragColor.rgb/=gl_FragColor.a+0.00001;",
		"}"

 	].join("\n")

};







THREE.RadialBlurShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"amount":   { type: "f", value: 0.005 },
		"angle":    { type: "f", value: 0.0 }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
			"gl_Position = sign( gl_Position );",
   			"vUv = (vec2( gl_Position.x, - gl_Position.y ) + vec2( 1.0 ) ) / vec2( 2.0 );",
		"}"

	].join("\n"),

	fragmentShader: [

		"uniform sampler2D tDiffuse;",
		"uniform float amount;",
		"uniform float angle;",
		"const float sampleDist = 1.0;",
		"const float sampleStrength = 2.0;",

		"varying vec2 vUv;",

		"void main() {",
			"vec2 uv=vUv;",

			"float samples[10];",
			"samples[0]=-0.08;",
			"samples[1]=-0.05;",
			"samples[2]=-0.03;",
			"samples[3]=-0.02;",
			"samples[4]=-0.01;",
			"samples[5]=0.01;",
			"samples[6]=0.02;",
			"samples[7]=0.03;",
			"samples[8]=0.05;",
			"samples[9]=0.08;",

			// some sample positions

			// 0.5,0.5 is the center of the screen
			// so substracting uv from it will result in
			// a vector pointing to the middle of the screen
			"vec2 dir = 0.5-uv; ",

			// calculate the distance to the center of the screen
			"float dist = sqrt(dir.x*dir.x + dir.y*dir.y); ",

			// normalize the direction (reuse the distance)
			"dir = dir/dist; ",

			// this is the original colour of this fragment
			// using only this would result in a nonblurred version
			"vec4 color = texture2D(tDiffuse,uv); ",

			"vec4 sum = color;",

			// take 10 additional blur samples in the direction towards
			// the center of the screen
			"for (int i = 0; i < 10; i++)",
			"	sum += texture2D( tDiffuse, uv + dir * samples[i] * sampleDist );",
			
			// we have taken eleven samples
			"sum *= 1.0/11.0;",

			// weighten the blur effect with the distance to the
			// center of the screen ( further out is blurred more)
			"float t = dist * sampleStrength;",
			"t = clamp( t ,0.0,1.0);", //0 &lt;= t &lt;= 1

			//Blend the original color with the averaged pixels
			//"gl_FragColor = mix( color, sum, t );",
			"gl_FragColor = texture2D(tDiffuse, uv);",
		"}"

	].join("\n")

};













THREE.RadialBlurShader2 = {

	uniforms: {
/*
		"tDiffuse": { type: "t", value: null },
		"amount":   { type: "f", value: 0.005 },
		"angle":    { type: "f", value: 0.0 }
		*/
		"tDiffuse": 	{ type: "t", value: null },
		"resolution": 	{ type: "v2", value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
		"strength": 	{ type: "f", value: 0.03 }

	},

	vertexShader: [

		  "varying vec2 vUv;",

	                "void main() {",

	                "vUv = vec2( uv.x, uv.y );",
	                "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

	                "}"

	].join("\n"),

	fragmentShader: [


  "uniform sampler2D tDiffuse;",
					"uniform float time;",
					"uniform float strength;",

	                "varying vec2 vUv;",

	                "void main() {",

						"vec2 dir = vUv - vec2(.5);",
						"float dist = distance(vUv, vec2(.5));",
						
						//"vec2 offset = dir * (sin(dist * 80. - iGlobalTime*15.) + .5) / 30.;",
						//"vec2 offset = dir * (sin(dist * 80. - time*15.) + .5) / 3.;",

						"vec2 offset = dir * (sin(dist * 80.0 - time*15.0) + 0.5) * strength;",
						"vec2 texCoord = vUv + offset;",

		                "vec4 texelStart = texture2D( tDiffuse, texCoord );",

	                    "gl_FragColor = texelStart;",
	        		"}"

	].join("\n")

};
