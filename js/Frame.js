var FRAME = ( function () {

	return {

		VERSION: 1,

		Module: function () {

			this.name = '';
			this.parameters = { input: {}, output: {} };

			this.init = function ( callback ) {};
			this.load = function ( callback ) {};
			this.start = function ( fxTime, perc, totalTime ) {};
			this.end = function ( fxTime, perc, totalTime ) {};
			this.update = function ( fxTime, perc, totalTime ) {};
		},

		Timeline: function () {

			var elements = [];
			var active = [];

			var next = 0, prevtime = 0;

			return {

				getElements: function () {
					return elements;
				},

				add: function ( element ) {

					element.module.init( element.parameters );

					// Hack!
					element.module.renderToTexture = false;
					element.module.fbo = null;
					element.clearBuffer = false;

					elements.push( element );
					this.sort();

				},

				sort: function () {

					elements.sort( function ( a, b ) { return a.start - b.start; } );

				},

				remove: function ( element ) {

					var i = elements.indexOf( element );

					if ( i !== -1 ) {

						elements.splice( i, 1 );

					}

				},
				
				elements: elements,

				update: function ( time ) {

					if ( time < prevtime ) {

						this.reset();

					}

					// add to active

					while ( elements[ next ] ) {

						var element = elements[ next ];

						if ( element.start > time ) {

							break;

						}

						if ( ( element.start + element.duration ) > time ) {

							active.push( element );
							element.module.start( time-element.start,( time - element.start ) / element.duration, time, element.parameters );

						}

						next ++;

					}

					// remove from active

					var i = 0;

					while ( active[ i ] ) {

						var element = active[ i ];

						if ( ( element.start + element.duration ) < time ) {

							active.splice( i, 1 );
							element.module.end( time-element.start,( time - element.start ) / element.duration, time );
							continue;

						}

						i ++;

					}

					// render

					active.sort( function ( a, b ) { return a.layer - b.layer; } );

					for ( var i = 0, l = active.length; i < l; i ++ ) {

						var element = active[ i ];
						element.module.update( time-element.start,( time - element.start ) / element.duration, time );

					}
/*
					// DEBUG
					var effect=document.getElementById("effects");
					var html="<ul>";
					for (var i=0;i<active.length;i++)
						html+="<li>"+active[i].name+" "+active[i].id+"</li>";
					html+="</ul>";
					effect.innerHTML=html;
*/
					prevtime = time;
				},

				getModuleById: function ( id ) {

					for (var i=0; i<elements.length; i++)
					{
						if (elements[i].id==id)
							return elements[i].module;
					}
					
					return null;
				},

				reset: function () {

					while ( active.length ) active.pop();
					next = 0;

				}

			}

		},

		TimelineElement: function () {
			
			var id = 0;
			
			return function ( name, layer, start, duration, module, parameters ) {

				this.id = id ++;
				this.name = name;
				this.layer = layer;
				this.start = start;
				this.duration = duration;
				this.module = module;
				this.parameters = parameters;
				
			};

		}()

	}

} )();
