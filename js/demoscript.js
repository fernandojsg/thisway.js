var greetsWidth=0.3;
var greetsHeight=0.0625;

var DEMO_WIDTH=1280;
var DEMO_HEIGHT=720;

var json = {"metadata":{"version":1},"timeline":[
	//[0,0,188.09375,"WebGLRendererModule",{"width":DEMO_WIDTH,"height":DEMO_HEIGHT,"dom":null}],
	[0,0,288.09375,"WebGLRendererModule",{"width":DEMO_WIDTH,"height":DEMO_HEIGHT,"dom":null}],

	[1, 1.8, 2.2,"FXTelevisionNoise",{}],
	[1, 2.79, 2.9,"FXTelevisionNoise",{}],
	[1, 3.0, 3.2,"FXTelevisionNoise",{}],
	[1, 4.15, 4.45,"FXTelevisionNoise",{}],

	[2, 4.9, 6.9,"FXFade",{color:0x000000,opacity:1,fadeIn:true}],
	
	[1, 4.9, 16.1,"FXArrows",{},1],
	
	//[2, 14.1, 288, "ClearModule", {clearColor: 0x28363f} ],

	//[2, 14.1, 17.5, "FXWavesBackground", {}, 123 ],
	[2, 14.1, 17.5, "FXWavesBackground", {"timeoffset":0}, 201 ],
	[3, 14.1, 17.5, "FXWaterScene", { "cameraId" : 0 }, 2 ],
	[4, 14.1, 17.5, "FXParticleSteam", {"type":0}, 3 ],

	[5, 14.1, 16.1, "FXAlphaFunc", { "startEffects" : [ 1 ], "endEffects" : [ 201, 2, 3 ], "transitionMap": "arrowsTransition", "textureThreshold" : 0.1 } ],

	[2, 16.5, 24.9, "FXWavesBackground", {"timeoffset":10}, 202 ],
	[3, 16.5, 24.9, "FXWaterScene", { "cameraId" : 1 }, 4 ],
	[4, 16.5, 24.9, "FXParticleSteam",{"type":0},5],
	[5, 16.5, 17.5, "FXAlphaFunc",{"startEffects": [201, 2,3], "endEffects": [202, 4,5] }],
	[6, 19.2, 23.5, "FXWaveDistortion",{"effects": [202, 4,5] }],

	[2, 23.9, 27.0, "FXWavesBackground", {"timeoffset":20}, 203 ],
	[3, 23.9, 27.0, "FXWaterScene",{"cameraId":2},6],
	[4, 23.9, 27.0, "FXParticleSteam",{"type":0},7],
	[5, 23.9, 24.9, "FXAlphaFunc",{"startEffects": [202, 4,5], "endEffects": [203,  6,7] }],

	[2, 26.0, 29.4, "FXWavesBackground", {"timeoffset":30}, 204 ],
	[3, 26.0, 29.4, "FXWaterScene",{"cameraId":3},8],
	[4, 26.0, 29.4, "FXParticleSteam",{"type":0},9],
	[5, 26.0, 27.0, "FXAlphaFunc",{"startEffects": [203, 6,7], "endEffects": [204,  8,9] }],

	
	[2, 28.5, 32.3, "FXWavesBackground", {"timeoffset":40}, 205 ],
	[3, 28.5, 32.3, "FXWaterScene",{"cameraId":4},10],
	[4, 28.5, 32.3, "FXParticleSteam",{"type":0},11],
	[5, 28.5, 29.4, "FXAlphaFunc",{"startEffects": [204, 8,9], "endEffects": [205, 10,11] }],

	//[6, 29.5, 31.1, "FXRadialBlur", { "effects": [ 10, 11 ], "center":[0.5,0.5], "alphaBuffer": true, "strength": 0.45, "mode": "animateStrength", "multiplier": 2.0 } ],
	[6, 29.5, 31.1, "FXRadialBlur", { "effects": [205, 10, 11 ], "center":[0.5,0.5], "alphaBuffer": true, "strength": 0.45, "mode": "animateStrength", "multiplier": 1.0 } ],
//				

	[2, 31.3, 36.7, "FXWavesBackground", {"timeoffset":50}, 206 ],
	[3, 31.3, 36.7, "FXWaterScene", { "cameraId":5 }, 12 ],
	[4, 31.3, 36.7, "FXParticleSteam", {"type":0}, 13 ],
	[5, 31.3, 32.3, "FXAlphaFunc", { "startEffects": [ 205, 10, 11 ], "endEffects": [ 206, 12, 13 ] } ],

	[7, 35.0, 36.1, "FXFlash", { "color": 0xffffff, "middlePoint": 0.8 } ],

	[6, 35.8, 36.7, "FXQuadsTransition", { "startEffects": [ 206, 12, 13 ], "numQuadsX": 15, "numQuadsY": 10, "type": "scale" } ],
	

	[2, 35.8, 51, "FXBackground", { "image": "spikeball_background", "transparent": false } ],

	[5, 36.1, 47.89, "FXPulsatingImage",
		{	
			"x":0.0,
			"y":0.0,
			"width":1.28,
			"height":1.21,
			"image":"spikeball_flash",
			"pulses":[
				{"time":0.989,"duration":0.5},
				{"time":1.823,"duration":0.5},
				{"time":2.261,"duration":0.5},
				{"time":2.823,"duration":0.5},
				{"time":3.609,"duration":0.5},
				{"time":4.500,"duration":0.5},
				{"time":5.378,"duration":0.5},
				{"time":5.767,"duration":0.5},
				{"time":6.245,"duration":0.5},
				{"time":7.091,"duration":0.5},
				{"time":7.957,"duration":0.5},
				{"time":8.930, "duration":0.5},
				{"time":9.266,"duration":0.5},
				{"time":9.766,"duration":0.5},
				{"time":10.632,"duration":0.5},
				{"time":11.29,"duration":0.5}],
			"transparent":true
		}
	],
	[4,36.1,50,"FXSpikeBallScene",{}],

	[4,48.05,50,"FXThisWayGlow",{},48],
	[5, 48.05, 50, "FXRadialBlur", {"effects": [48], "center":[0.5,0.6], "alphaBuffer": true, "strength": 0.45, "multiplier":2.0 } ],


	[6,50,64,"FXBackground",{"image":"arrow_background","transparent":false}],
	[7,50,64,"FXRotatingArrow",{}],

	[8,50,51, "FXQuadsTransition",{"image": "spikeball_background", "numQuadsX":15, "numQuadsY":10, "type": "explode" }],


	// [5,50,51,"FXRotatingArrow",{}],
	[2,64,71,"FXKnotBackground",{"image_background":"knot_background","image_scroll": "knot_grid"}],

	[4,64,71,"FXKNot",{}],
	
	[2,71,85.1,"FXSineBackground",{}],
	[4,71,85.1,"FXHairyObject",{}],

	[6,71,77,"FXDisintegrateImage",{
		"image": "gfx",
		"width": 0.3,
		"height": 0.04,
		"startPosition": [0.685, 0.65, 0],"endPosition": null, "size": 0.03, "color": 0xffffff, "fadeSpeed": 0.25}],
	[6,72,77,"FXCredits",{
		"resourcePrefix": "credits_",
		"name":"tekno", 
		"x":0.7, 
		"y":0.5, 
		"quadWidth": 0.11,
		"quadHeight": 0.07,
		"totalWidth": 0.21,
		"duration": 5, 
		"formationDuration": 1.3,
		"quadDelay": 0.2,
		"initialHeight": 6
	}],


	[6,78,84,"FXDisintegrateImage",{
		"image": "music",
		"width": 0.3,
		"height": 0.04,
		"startPosition": [0.285, 0.47, 0],"endPosition": null, "size": 0.03, "color": 0xffffff, "fadeSpeed": 0.25}],

	[6,79,85,"FXCredits",{
		"resourcePrefix": "credits_",
		"name":"wonder", 
		"x":0.3, 
		"y":0.32, 
		"quadWidth": 0.11,
		"quadHeight": 0.07,
		"totalWidth": 0.26,
		"duration": 5, 
		"formationDuration": 1.45,
		"quadDelay": 0.2,
		"initialHeight": 6
	}],


	[5,84.35,85.15,"FXPulsatingImage",
		{	
			"x":0.0,
			"y":0.0,
			"width":0.6,
			"height":0.2,
			"image": "japo",
			"pulses":[
				{"time":0.0,"duration":0.4},
				{"time":0.4,"duration":0.4}],
			"transparent":true
		}
	],

	[4, 85.1, 108, "FXCubesRoom", {}, 85 ],
	
	[9, 85.2, 90.15,"FXDisintegrateImage",{
		"image": "code",
		"width": 0.3,
		"height": 0.05,
		"startPosition": [0.380, 0.68, 0],"endPosition": null, "size": 0.03, "color": 0xffffff, "fadeSpeed": 0.25}],
	
	[9,86.15,91.15,"FXCredits",{
		"resourcePrefix": "credits_",
		"name":"ithaqua", 
		"x":0.40, 
		"y":0.6, 
		"quadWidth": 0.11,
		"quadHeight": 0.07,
		"totalWidth": 0.35,
		"duration": 5, 
		"formationDuration": 0.6,
		"quadDelay": 0.05,
		"initialHeight": 6
	}],
	
	[9,87.15,92.15,"FXCredits",{
		"resourcePrefix": "credits_",
		"name":"kile", 
		"x":0.4, 
		"y":0.54, 
		"quadWidth": 0.11,
		"quadHeight": 0.07,
		"totalWidth": 0.18,
		"duration": 5, 
		"formationDuration": 0.6,
		"quadDelay": 0.05,
		"initialHeight": 6
	}],

	[5,92,95,"FXText2D",{
		"text": "YOU ARE BORN AND",
		"startPosition": [0.6, 0.4, 0],"endPosition": [0.5, 0.3, 0], "size": 0.02, "color": 0xffffff, "fadeSpeed": 0.25},86],
	[5,93,96,"FXText2D",{
		"text": "THEN YOU ARE PUT IN A WAY",
		"startPosition": [0.7,0.6,0.0], "endPosition": [0.6,0.5,0.0], "size": 0.02, "color": 0xffffff, "fadeSpeed": 0.25},87],
	[5,93.5,96.5,"FXText2D",{
		"text": "YOU HAVE TO FOLLOW", 
		"startPosition": [0.4,0.5,0.0], "endPosition": [0.7,0.4,0.0], "size": 0.02, "color": 0xffffff, "fadeSpeed": 0.25},88],
	[5,95,98,"FXText2D",{
		"text": "IF YOU WANT TO SURVIVE",
		"startPosition": [0.5,0.4,0.0], "endPosition": [0.5,0.6,0.0], "size": 0.02, "color": 0xffffff, "fadeSpeed": 0.25},89],
	[5,96,99,"FXText2D",{
		"text": "THIS WAY IS IN YOUR HEAD",
		"startPosition": [0.4,0.3,0.0], "endPosition": [0.4,0.4,0.0], "size": 0.02, "color": 0xffffff, "fadeSpeed": 0.25},90],
	[5,97,100,"FXText2D",{
		"text": "IT HAS BEEN RECORDED",
		"startPosition": [0.6,0.6,0.0], "endPosition": [0.5,0.3,0.0], "size": 0.02, "color": 0xffffff, "fadeSpeed": 0.25},91],
	[5,98,101,"FXText2D",{
		"text": "DEEP IN YOUR BRAIN AND",
		"startPosition": [0.7,0.4,0.0], "endPosition": [0.4,0.5,0.0], "size": 0.02, "color": 0xffffff, "fadeSpeed": 0.25},92],
	[5,99,102,"FXText2D",{
		"text": "IT MAKES YOU BE ONE MORE OF THEM",
		"startPosition": [0.8,0.5,0.0], "endPosition": [0.5,0.3,0.0], "size": 0.02, "color": 0xffffff, "fadeSpeed": 0.25},93],
	[5,101,104,"FXText2D",{
		"text": "BUT IF YOU WANT TO KNOW",
		"startPosition": [0.7,0.3,0.0], "endPosition": [0.7,0.6,0.0], "size": 0.02, "color": 0xffffff, "fadeSpeed": 0.25},94],
	[5,102,105,"FXText2D",{
		"text": "WHO YOU ARE",
		"startPosition": [0.5,0.6,0.0], "endPosition": [0.4,0.3,0.0], "size": 0.02, "color": 0xffffff, "fadeSpeed": 0.25},95],
	[5,103,106,"FXText2D",{
		"text": "YOU HAVE TO IGNORE IT",
		"startPosition": [0.6,0.5,0.0], "endPosition": [0.4,0.6,0.0], "size": 0.02, "color": 0xffffff, "fadeSpeed": 0.25},96],
	[5,104,107,"FXText2D",{
		"text": "WHEN YOU HEAR",
		"startPosition": [0.5,0.5,0.0], "endPosition": [0.5,0.5,0.0], "size": 0.03, "color": 0xffffff, "fadeSpeed": 0.25},97],

	[8, 85.1, 108, "FXCubesBlur", {
		"effects": [85,86,87,88,89,90,91,92,93,94,95,96,97], 
		"center":[0.5,0.5],
		"alphaBuffer": true, 
		"strength": 0.55, 
		"multiplier":0.75 } ],

	[7,104,108,"FXPulsatingImage",
		{	
			"x":0.0,
			"y":0.0,
			"width":0.6,
			"height":0.2,
			"image":"japo",
			"pulses":[
				{"time":2.228,"duration":0.1},
				{"time":2.367,"duration":0.1},
				{"time":2.505,"duration":0.1},
				{"time":2.644,"duration":0.1},
				{"time":2.777,"duration":0.1},
				{"time":2.911,"duration":0.1},
				{"time":3.039,"duration":0.1},
				{"time":3.185,"duration":0.4},
				{"time":3.573,"duration":0.4}],
			"transparent":true
		},
		123
	],

	[9, 104, 108, "FXRadialBlur", {
		//"effects": [86,87,88,89,90,91,92,93,94,95,96,97],
		"effects": [ 123 ],
		"center":[0.5,0.5],
		"alphaBuffer": true, 
		"strength": 0.45, 
		"multiplier":0.65 } ],
		
//				[7, 86, 108, "FXRadialBlur", { "effects": [ 85 ], "center":[0.5,0.5], "alphaBuffer": true, "strength": 0.45, "multiplier": 1.0 } ],

	[2,108,124,"FXBackground",{"image":"circles_background","transparent":false},14],
	[3,108,124,"FXCircles",{},15],
	

	[3, 122, 129.4, "FXBackgroundGrid", {"image":"jellyfish_grid", "rotation": 1.01, "z": 4},1110],
	[4, 122, 129.4,"FXJellyScene",{"cameraId": 0, "randomizer": 4}, 16],
	[5, 122, 129.4, "FXParticleSteam", {"type":1}, 17 ],
	[6, 122, 124,"FXAlphaFunc",{"startEffects": [14,15], "endEffects": [1110, 16, 17], "transitionMap": "arrowsTransition", "textureThreshold": 0.05}],


	[3, 128.9, 139, "FXBackgroundGrid", {"image":"jellyfish_grid", "rotation": 1.01, "z": 4},1111],
	[4, 128.9, 139, "FXJellyScene", { "cameraId": 1, "randomizer": 4 }, 18 ],
	[5, 128.9, 139, "FXParticleSteam", { "type": 1 }, 19 ],
	[6, 128.9, 129.4, "FXAlphaFunc", { "startEffects": [ 1110, 16, 17 ], "endEffects": [ 1111, 18, 19 ] } ],

	[3, 138.5, 143.4, "FXBackgroundGrid", {"image": "jellyfish_grid", "rotation": 1.01, "z": 4},1112],
	[4, 138.5, 143.4,"FXJellyScene",{"cameraId": 2, "randomizer": 5}, 20],
	[5, 138.5, 143.4, "FXParticleSteam", {"type":1}, 21 ],
	[6, 138.5, 139, "FXAlphaFunc",{"startEffects": [1111, 18,19], "endEffects": [1112, 20,21]}],

	[3, 142.9, 150.8, "FXBackgroundGrid", {"image":"jellyfish_grid", "rotation": 1.01, "z": 4},1113],
	[4, 142.9, 150.8, "FXJellyScene",{"cameraId": 3, "randomizer": 7}, 22],
	[5, 142.9, 150.8, "FXParticleSteam", {"type":1}, 23 ],
	[6, 142.9, 143.4, "FXAlphaFunc",{"startEffects": [ 1112, 20, 21 ], "endEffects": [ 1113, 22, 23 ]}],
	
	// Greets & Respects
	[6,124,129,"FXDisintegrateImage",{
		"image": "greets1", 
		"width": greetsWidth,
		"height": greetsHeight,
		"startPosition": [0.2, 0.20, 0],"endPosition": null, "size": 0.03, "color": 0xffffff, "fadeSpeed": 0.25}],
	[6,124,129,"FXDisintegrateImage",{
		"image": "greets2", 
		"width": greetsWidth,
		"height": greetsHeight,
		"startPosition": [0.2, 0.35, 0],"endPosition": null, "size": 0.03, "color": 0xffffff, "fadeSpeed": 0.25}],
	[6,124,129,"FXDisintegrateImage",{
		"image": "greets3", 
		"width": greetsWidth,
		"height": greetsHeight,
		"startPosition": [0.2, 0.5, 0],"endPosition": null, "size": 0.03, "color": 0xffffff, "fadeSpeed": 0.25}],
	[6,124,129,"FXDisintegrateImage",{
		"image": "greets4", 
		"width": greetsWidth,
		"height": greetsHeight,
		"startPosition": [0.2, 0.65, 0],"endPosition": null, "size": 0.03, "color": 0xffffff, "fadeSpeed": 0.25}],
	[6,124,129,"FXDisintegrateImage",{
		"image": "greets5", 
		"width": greetsWidth,
		"height": greetsHeight,
		"startPosition": [0.2, 0.80, 0],"endPosition": null, "size": 0.03, "color": 0xffffff, "fadeSpeed": 0.25}],

	
	[6,129,134,"FXDisintegrateImage",{
		"image": "greets6", 
		"width": greetsWidth,
		"height": greetsHeight,
		"startPosition": [0.2, 0.275, 0],"endPosition": null, "size": 0.03, "color": 0xffffff, "fadeSpeed": 0.25}],
	[6,129,134,"FXDisintegrateImage",{
		"image": "greets7", 
		"width": greetsWidth,
		"height": greetsHeight,
		"startPosition": [0.2, 0.425, 0],"endPosition": null, "size": 0.03, "color": 0xffffff, "fadeSpeed": 0.25}],
	[6,129,134,"FXDisintegrateImage",{
		"image": "greets8", 
		"width": greetsWidth,
		"height": greetsHeight,
		"startPosition": [0.2, 0.575, 0],"endPosition": null, "size": 0.03, "color": 0xffffff, "fadeSpeed": 0.25}],
	[6,129,134,"FXDisintegrateImage",{
		"image": "greets9", 
		"width": greetsWidth,
		"height": greetsHeight,
		"startPosition": [0.2, 0.725, 0],"endPosition": null, "size": 0.03, "color": 0xffffff, "fadeSpeed": 0.25}],

	[6,134,139,"FXDisintegrateImage",{
		"image": "respect1", 
		"width": greetsWidth,
		"height": greetsHeight,
		"startPosition": [0.8, 0.20, 0],"endPosition": null, "size": 0.03, "color": 0xffffff, "fadeSpeed": 0.25}],
	[6,134,139,"FXDisintegrateImage",{
		"image": "respect2", 
		"width": greetsWidth,
		"height": greetsHeight,
		"startPosition": [0.8, 0.35, 0],"endPosition": null, "size": 0.03, "color": 0xffffff, "fadeSpeed": 0.25}],
	[6,134,139,"FXDisintegrateImage",{
		"image": "respect3", 
		"width": greetsWidth,
		"height": greetsHeight,
		"startPosition": [0.8, 0.50, 0],"endPosition": null, "size": 0.03, "color": 0xffffff, "fadeSpeed": 0.25}],
	[6,134,139,"FXDisintegrateImage",{
		"image": "respect4", 
		"width": greetsWidth,
		"height": greetsHeight,
		"startPosition": [0.8, 0.65, 0],"endPosition": null, "size": 0.03, "color": 0xffffff, "fadeSpeed": 0.25}],
	[6,134,139,"FXDisintegrateImage",{
		"image": "respect5", 
		"width": greetsWidth,
		"height": greetsHeight,
		"startPosition": [0.8, 0.80, 0],"endPosition": null, "size": 0.03, "color": 0xffffff, "fadeSpeed": 0.25}],

	[6,139,144,"FXDisintegrateImage",{
		"image": "respect6", 
		"width": greetsWidth,
		"height": greetsHeight,
		"startPosition": [0.8, 0.275, 0],"endPosition": null, "size": 0.03, "color": 0xffffff, "fadeSpeed": 0.25}],
	[6,139,144,"FXDisintegrateImage",{
		"image": "respect7", 
		"width": greetsWidth,
		"height": greetsHeight,
		"startPosition": [0.8, 0.425, 0],"endPosition": null, "size": 0.03, "color": 0xffffff, "fadeSpeed": 0.25}],
	[6,139,144,"FXDisintegrateImage",{
		"image": "respect8", 
		"width": greetsWidth,
		"height": greetsHeight,
		"startPosition": [0.8, 0.575, 0],"endPosition": null, "size": 0.03, "color": 0xffffff, "fadeSpeed": 0.25}],
	[6,139,144,"FXDisintegrateImage",{
		"image": "respect9", 
		"width": greetsWidth,
		"height": greetsHeight,
		"startPosition": [0.8, 0.725, 0],"endPosition": null, "size": 0.03, "color": 0xffffff, "fadeSpeed": 0.25}],


	[4,144.25, 144.65,"FXTelevisionNoise",{},144],
	[4,145.50, 145.75,"FXTelevisionNoise",{},145],
	[4,146.35, 146.45,"FXTelevisionNoise",{},146],
	[4,147.50, 147.55,"FXTelevisionNoise",{},147],
	[4,148.25, 148.55,"FXTelevisionNoise",{},148],
	[4,149.35, 149.65,"FXTelevisionNoise",{},149],
	[4,150.80, 172.00,"FXTelevisionNoise",{},150],

	[5, 146.9, 172.0, "FXFinalTV", { "effects" : [1113, 22, 23, 144, 145, 146, 147, 148, 149, 150 ] } ],

	[6, 160, 168, "FXCredits",{
		"resourcePrefix": "sgz_",
		"name": "stravaganza", 
		"x":0.3, 
		"y":0.5, 
		"quadWidth": 0.1,
		"quadHeight": 0.08,
		"totalWidth": 0.44,
		"duration": 8, 
		"formationDuration": 2.5,
		"quadDelay": 0.2,
		"initialHeight": 6
	}],

	[7,164,168,"FXText2D",{
		"text": "To Ithaqua, Tekno, Wonder, Herotyc, Reality3D & Trace",
		//"startPosition": [0.283, 0.45, 0],"endPosition": [0.283, 0.45, 0], "size": 0.0103, "color": 0x000000, "fadeSpeed": 0.2}],
		"startPosition": [0.283, 0.44, 0],"endPosition": [0.283, 0.44, 0], "size": 0.0103, "color": 0x000000, "fadeSpeed": 0.2, "maxOpacity": 0.25}],

/*				[7,164,168,"FXText2D",{
		"text": "18th January 2014",
		"startPosition": [0.44, 0.42, 0],"endPosition": [0.44, 0.42, 0], "size": 0.008, "color": 0x000000, "fadeSpeed": 0.2}],
*/

	[8, 167, 172,"FXFade", {color:0x000000,opacity:0,fadeIn:false}],
	[1, 0, 172, "ClearModule", {} ],

],"curves":[]};

var stdVertexShader = [

"varying vec2 vUv;",

"void main() {",

    "vUv = vec2( uv.x, uv.y );",
    "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

"}"
].join("\n");
