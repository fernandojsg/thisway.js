particleVertexShader = 
[
"attribute vec3  customColor;",
"attribute float customOpacity;",
"attribute float customSize;",
"attribute float customVisible;",  // float used as boolean (0 = false, 1 = true)
"varying vec4  vColor;",
"varying float vAngle;",
"void main()",
"{",
	"if ( customVisible > 0.5 )", 				// true
		"vColor = vec4( customColor, customOpacity );", //     set color associated to vertex; use later in fragment shader.
	"else",							// false
		"vColor = vec4(0.0, 0.0, 0.0, 0.0);", 		//     make particle invisible.
		
	"vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
	"gl_PointSize = customSize * ( 300.0 / length( mvPosition.xyz ) );",     // scale particles as objects in 3D space
	"gl_Position = projectionMatrix * mvPosition;",
"}"
].join("\n");

particleFragmentShader =
[
"uniform sampler2D texture;",
"varying vec4 vColor;", 	
"void main()", 
"{",
	"gl_FragColor = vColor;",
	
	"vec2 rotatedUV = vec2(gl_PointCoord.x,", 
	                      "gl_PointCoord.y);",  // rotate UV coordinates to rotate texture
    	"vec4 rotatedTexture = texture2D( texture,  rotatedUV );",
	"gl_FragColor = gl_FragColor * rotatedTexture;",    // sets an otherwise white particle texture to desired color
"}"
].join("\n");








var ALMOST_ZERO=0.0001;

function IS_ZERO(x) {
	return Math.abs(x) < ALMOST_ZERO;
}

function Particle()
{
	this.position     = new THREE.Vector3();
	this.direction     = new THREE.Vector3();
	this.size=0;
	this.life=0;
}


function ParticleSystem(scene)
{
	this.scene=scene;
	this.timeOffset = 0.0;

	this.numParticles = 0;
	this.particleSize = 0;
	this.particleLife = 0;

	this.origin      = new THREE.Vector3();

	this.particles   = [];
	this.linkedObject= null;

	this.particleGeometry = new THREE.Geometry();
	
	this.particleMaterial = new THREE.ParticleBasicMaterial( { 
					size: 5, 
					map: THREE.ImageUtils.loadTexture( 'files/watercell/blackparticle.png' ), 
					blending: THREE.AdditiveBlending, 
					depthTest: false, 
					//blending: THREE.NormalBlending, 
					//depthTest: true,
					transparent : true 
	} );

	this.particleTexture=THREE.ImageUtils.loadTexture( 'files/watercell/blackparticle.png' );
	this.particleMaterial = new THREE.ShaderMaterial( 
	{
		uniforms: 
		{
			texture:   { type: "t", value: this.particleTexture },
		},
		attributes:     
		{
			customVisible:	{ type: 'f',  value: [] },
			customSize:		{ type: 'f',  value: [] },
			customColor:	{ type: 'c',  value: [] },
			customOpacity:	{ type: 'f',  value: [] }
		},
		vertexShader:   particleVertexShader,
		fragmentShader: particleFragmentShader,
		transparent: true, 
		blending: THREE.NormalBlending, 
		depthTest: true,
		depthWrite: false
	});

	this.particleMesh = new THREE.ParticleSystem( this.particleGeometry, this.particleMaterial );
	//var scale=100.0;
	//this.particleMesh.scale.set(scale,scale,scale);

	this.particleMesh.dynamic = true;
	this.particleMesh.sortParticles = true;

	this.scene.add(this.particleMesh);
}

ParticleSystem.prototype =  {

	constructor: THREE.Randomizer,
    

    resetParticle: function (particle,i) {
		var pos=new THREE.Vector3;
		var dir=new THREE.Vector3;
		var perpDir= new THREE.Vector3;

		if(this.linkedObject)
		{
			pos.set(this.linkedObject.matrix.elements[12],
					this.linkedObject.matrix.elements[13],
					this.linkedObject.matrix.elements[14]);

			//pos.y-=5;

			//pos.Set(systemTM->m_fM[0][3], systemTM->m_fM[1][3], systemTM->m_fM[2][3]);
			//dir.Set(systemTM->m_fM[1][0], systemTM->m_fM[1][1], systemTM->m_fM[1][2]);

//			dir.set(this.systemTM->m_fM[1][0], this.systemTM->m_fM[1][1], this.systemTM->m_fM[1][2]);
			dir.set(this.linkedObject.matrix.elements[12],
					this.linkedObject.matrix.elements[13],
					this.linkedObject.matrix.elements[14]);

			//dir.normalize();
			//dir = dir.multiplyScalar(direction.length());
			
			dir.copy(this.direction);
		}
		else
		{
			pos.copy(this.origin);
			dir.copy(this.direction);
		}

		particle.position = pos;
		var rotMatrix=new THREE.Matrix4;

		if(this.angleOfExpulsion > 0.01 && !(IS_ZERO(dir.x) && IS_ZERO(dir.x) && IS_ZERO(dir.x)))
		{

			if(Math.abs(dir.x) < ALMOST_ZERO && Math.abs(dir.y) > ALMOST_ZERO && Math.abs(dir.x) < ALMOST_ZERO)
			{
				// excepción del algoritmo de despues.
				perpDir.set(dir.y, 0.0, 0.0);
			}
			else
			{
				// direction * perpDir = 0; Angle = 90;
				perpDir.set(dir.z, 0.0, -dir.x);
			}

			var dir1 = dir.clone();
			dir1.normalize();

			rotMatrix.makeRotationAxis(dir1, Math.random()*THREE.Math.PI2);
			perpDir.applyMatrix4(rotMatrix);
			perpDir.normalize();

			var modifiedAngle = Math.random()*this.angleOfExpulsion - (this.angleOfExpulsion * 0.5);

			rotMatrix.makeRotationAxis(perpDir, modifiedAngle);
			dir.applyMatrix4(rotMatrix);

			//particle->dir = dir + dir * ((float)-particle->life / (float)particleLife);
			//particle.direction=dir.add(dir.multiplyScalar(-particle.life / this.particleLife));
			particle.direction=dir;
		}
		else
		{
			particle.direction.set(0,0,0);
		}

		var reciprocalLife     = 1.0 / this.particleLife;
		var alpha = particle.life * reciprocalLife;

		if(particle.life > 0)
		{
			particle.life = Math.random()*this.particleLife;
		}
		else
		{
			particle.life = particle.life + this.particleLife;
		}
	},

	resetParticles: function () {
		
		for(var i = 0; i < this.numParticles; i++)
			this.resetParticle(this.particles[i],i);

	},

	update: function (incSeconds)
	{
		var fIncTSquare   = (incSeconds * incSeconds);
		var halfASquareT = (this.acceleration * fIncTSquare) * 0.5;

		this.timeOffset += incSeconds;
		//this.timeOffset=t;
		
		var reciprocalLife     = 1.0 / this.particleLife;
		var scaleFactorMilisec = this.particleScaleFactor;

		for(var i = 0; i < this.numParticles; i++)
		{
			this.particles[i].life -= incSeconds;

			if(this.particles[i].life < 0) // muere?
			{
//				this.particleMaterial.attributes.customVisible.value[i] = 0;
//				this.particleMaterial.attributes.customOpacity.value[i] = 0;
				this.resetParticle(this.particles[i],i);
			}
			else
			{
				var alpha = this.particles[i].life * reciprocalLife;
				var fSize = this.particleSize + (this.particleSize * ((this.particleLife - this.particles[i].life) * scaleFactorMilisec));

				this.particleMaterial.attributes.customVisible.value[i] = 1;
				this.particleMaterial.attributes.customOpacity.value[i] = alpha;
				this.particleMaterial.attributes.customSize.value[i]    = fSize;
				this.particles[i].size=fSize;
/*
				var dir=this.particles[i].direction.clone();
				//dir=dir.multiplyScalar(incSeconds);
				///dir=dir.multiplyScalar(incSeconds);
				dir=dir.multiplyScalar(this.acceleration);
				this.particles[i].position.add(dir);
*/				
				//this.particles[i].position.add(this.particles[i].direction.multiplyScalar(incSeconds)).addScalar(halfASquareT);
				//particles[count].pos = particles[count].pos + ((particles[count].dir * fSeconds) + halfASquareT);

				this.particles[i].position.add(this.particles[i].direction);

				this.particleGeometry.vertices[i] = this.particles[i].position;
			}
		}
	},

	attachToObject: function (object) {
		
		this.linkedObject=object;
		this.resetParticles();
	},

    init: function(pos,dir,accel,angleExpulsion,num,size,scaleFactor,life,object3d) {
		var i;

		this.linkedObject=object3d||null;

		this.origin       = pos.clone();
		this.direction    = dir.clone();
		this.acceleration = accel;
		//this.acceleration = accel.clone();

		this.angleOfExpulsion = angleExpulsion;

		this.particleSize        = size;
		this.particleScaleFactor = scaleFactor;
		this.particleLife        = life;
		this.numParticles = num;

		halfASquareT= new THREE.Vector3();

		// Reset the particles
		for(var i = 0; i < this.numParticles; i++)
		{
			var particle=new Particle();
			this.resetParticle(particle,i);
			this.particles.push(particle);

			if(i & 1)
			{
				// Odd will have random life
				particle.life = Math.random()*this.particleLife;
			}
			else
			{
				// Even particles have constant distributed life
				particle.life = i * (this.particleLife / this.numParticles);
			}

			// Initial position depending on their life
			var seconds = (this.particleLife - particle.life);
			halfASquareT = (this.acceleration * (seconds * seconds)) * 0.5;
			var dir=particle.direction.clone();
			particle.position.add(((dir.multiplyScalar(seconds)).addScalar(halfASquareT)));

			this.particleGeometry.vertices.push(particle.position);

			this.resetParticle(particle,i);
		}
	},
}
