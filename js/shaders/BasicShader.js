/**
 * @author mrdoob / http://www.mrdoob.com
 *
 * Simple test shader
 */

THREE.BasicShader = {

	uniforms: {},

	vertexShader: [

		"void main() {",

			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join("\n"),

	fragmentShader: [

		"void main() {",

			"gl_FragColor = vec4( 1.0, 0.0, 0.0, 0.5 );",

		"}"

	].join("\n")

};

THREE.BasicTextureShader = {

	uniforms: {
		"tDiffuse1": { type: "t", value: null },
	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join("\n"),

	fragmentShader: [

		"uniform sampler2D tDiffuse1;",
		"varying vec2 vUv;",

		"void main() {",

			"gl_FragColor = texture2D( tDiffuse1, vUv );",
			//"gl_FragColor = vec4( 1.0, 0.0, 0.0, 0.5 );",

		"}"

	].join("\n")

};



THREE.BasicShader2 = {


	uniforms: {
		"tDiffuse":   	{ type: "t", value: null },
		"time": 		{type:"f",value:1.0},
		"numquads": 	{type:"i",value:60},
		"quadheight": 	{type:"f",value:1.0},
		"quads": 		{ type: "fv1", value: [ ] },    // float array (plain)
	},

	vertexShader: [

			"varying vec2 vUv;",
			"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join("\n"),

	fragmentShader: [
	"uniform sampler2D tDiffuse;",

	"uniform float time;",
	"uniform int numquads;",
	"uniform float quadheight;",
	"uniform float quads[60];",

	"uniform vec2 resolution;",
    "varying vec2 vUv;",
	"float PI = 3.14159265358979323846264;",
	"const int MAX_QUADS=60;",

	"void main(void)",
	"{",
		"vec2 uv = vUv;",
		"vec4 col=texture2D(tDiffuse, uv);",
		"bool found=false;",
		"for (int i=0;i<MAX_QUADS;i++)",
		"{",
			"if (i<numquads)",
			"{",
				"float fY = cos(quads[i] * PI*2.0+time);",
				"found=found||((uv.y> (fY - quadheight)) && (uv.y< (fY + quadheight)));",
			"}",
		"}",
		"if (found)",
			"col=vec4(0.0,0.0,0.0,1.0);",
		"gl_FragColor = col;",
	"}"

	].join("\n")

};
