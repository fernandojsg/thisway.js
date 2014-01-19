THREE.Vector3.prototype.lerp2 = function ( v1, v2, alpha ) {

    this.set(   v1.x + ( v2.x - v1.x ) * alpha,
                v1.y + ( v2.y - v1.y ) * alpha,
                v1.z + ( v2.z - v1.z ) * alpha );
    
    return this;

};

var FXText2D = function () {

        FRAME.Module.call( this );

        this.parameters.input = {

                text: "empty",
                color: 0xffffff,
                startPosition: [0, 0, 0],
                endPosition: null,
                size: 0.1,
                fadeSpeed: 0.25,
                align: "center",
                maxOpacity: 1.0,
        };

        //camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );
        camera = new THREE.OrthographicCamera( 0, 1, 1, 0, 0, 1 );

        var scene = new THREE.Scene();

        var geometries = {};

        var geometry = new THREE.Geometry();
        var material = new THREE.MeshBasicMaterial( { depthTest: false, transparent: true, opacity: 1.0 } );

        var mesh = new THREE.Mesh( geometry, material );
        scene.add( mesh );

        this.camera=camera;
        this.scene=scene;

        var startPosition = new THREE.Vector3();
        var maxOpacity;
        var endPosition = new THREE.Vector3();
        
        this.init = function ( parameters ) {

            if ( parameters.maxOpacity !== undefined )
                maxOpacity = parameters.maxOpacity;
            else
                maxOpacity = 1.0;

            var string = parameters.text;
            
            var shapes = THREE.FontUtils.generateShapes( string, {
                    font: "arial",
                    size: parameters.size
            } );
            
            var geometry = new THREE.ShapeGeometry( shapes );

            //@todo alignment
            THREE.GeometryUtils.center( geometry );
            
            geometries[ string ] = geometry;

            delete mesh.__webglInit; // TODO: Remove (WebGLRenderer refactoring)

            mesh.geometry = geometries[ parameters.text ];
     
            if ( parameters.color !== undefined ) {
            
                    material.color.setHex( parameters.color );
            
            } else {
                    
                    material.color.setHex( 0xffffff );
                    
            }

            startPosition.fromArray( parameters.startPosition );
            
            if ( parameters.endPosition != null )
            {
                if ( endPosition.equals( startPosition ) )
                    endPosition = null;
                else
                    endPosition.fromArray( parameters.endPosition );
            }
            else
                endPosition = null;

            mesh.scale.y = 2;

            mesh.position.fromArray( parameters.startPosition );
            this.parameters.fadeSpeed = parameters.fadeSpeed;

        }
                
        this.animate = function ( t, perc ) {

            var alpha = 1.0;

            if( perc < this.parameters.fadeSpeed )
            {
                alpha = perc / this.parameters.fadeSpeed;
            }
            else if ( perc > 1.0 - this.parameters.fadeSpeed )
            {
                alpha = ( 1.0 - perc ) / this.parameters.fadeSpeed;
                if ( alpha < 0.0 ) 
                    alpha = 0.0;
            }
            
            alpha *= maxOpacity;

            material.opacity = alpha;

            if ( endPosition != null )
                mesh.position.lerp2( startPosition, endPosition, perc );

        }

        this.update = function ( t, perc ) {

            this.animate( t, perc );
            
            if ( this.renderToTexture )
                renderer.render( scene, camera, this.fbo, this.clearBuffer );
            else
                renderer.render( scene, camera );
        };

};