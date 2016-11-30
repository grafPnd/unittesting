(function(){
	var
		$top = $(window.top),
		U_test = function(cfg){
			this.cfg = cfg;
			this.specSet = $.extend([],cfg.specSet);
			this.coreSet = $.extend([],cfg.coreSet);
			this.standBy = {
				core: this.coreSet.length,
				specs: this.specSet.length
			};

		};
	U_test.prototype.constructor = U_test;
	U_test.prototype.coreConstruct = {
		bindCore: function(){
			self.self = this;
		},
		getSpecs: function(){
			while(self.specSet.length){
				loadSpec(self.specSet.pop());
			}
			function loadSpec(name){
				self.dom_scope.appendChild(($('<script>')
				.attr('src','./specs/' + name + '.js')
				.on('load', function(){
					self.standBy.specs -- ;
					self.service.checkRun({message: 'specs/' + name + ': ready'});
				}))[0]);
			}
		},
		getCore: function(){
			self.dom_scope = this.getComponent({
				id: 'j_u_test_scope', 
				holder: self.dom_holder
			});
			self.serviceMessage = this.getComponent({
				id: 'j_u_serviceMessage', 
				holder: self.dom_scope
			});
			while(self.coreSet.length){
				this.getCoreItem(self.coreSet.pop());
			}	
		},
		getCoreItem: function(e){
			e.holder = self.dom_scope;
			if(e.path){
				e.on = {
					type: 'load',
					handler: function(){
						self.standBy.core -- ;
						self.service.checkRun({message: e.path + ': ready'});
					}
				}
			}else{
				self.standBy.core -- ;
			}
			this.getComponent(e);	
		},
		getComponent: function(e){
			var 
				type = e.type ? e.type == 'style' ? 'link' : e.type : 'div';
			if(!!e.id && $('#' + e.id, e.holder).length){
				return $('#' + e.id, e.holder)[0];
			}
			return e.holder.appendChild(($('<' + type + '>').
				attr(!!e.id ? 'id' : 'tmp', e.id).
				attr(e.type == 'style' ? 'rel' : 'tmp', 'stylesheet').
				attr(e.type == 'style' ? 'href' : 'tmp', e.path).
				attr(e.type == 'script' ? 'src' : 'tmp', e.path).
				on(e.on ? e.on.type : 'load', e.on ? e.on.handler : false).
				removeAttr('tmp'))[0]);	
		}
	}
	/** This is a set of api methods, that could be called from triggers. */
	U_test.prototype.api = {
		run_tests: function(){
			if(self.service.checkRun()){
				mocha.run();
			}
		},
		destruct: function(){
			if(self && self.dom_scope && self.dom_scope.parentNode){
				self.dom_scope.parentNode.removeChild(self.dom_scope);
			}
		},
		construct: function(){
			this.destruct();
			self.specSet = $.extend([],self.cfg.specSet);
			self.coreSet = $.extend([],self,cfg.coreSet);
			self.standBy = {
				core: self.coreSet.length,
				specs: self.specSet.length
			};
			self.service.init.call(self);
		},
		reconfig: function(data){
			if(data && data.cfg){
				self.cfg = $.extend(self.cfg, data.cfg)
				this.construct();
			}
		},
		say: function(data){
			if(data && data.message != undefined){
				self.service.say(data.message, data.clear);
			}
		}
	}
	U_test.prototype.service = {
		init: function(){
			this.coreConstruct.bindCore.call(this);
			this.dom_holder = $(this.cfg.dom_holder)[0];
			this.coreConstruct.getCore();
			this.service.checkRun();
		},
		checkRun: function(data){
			if(data && data.message){
				this.say(data.message);
			}
			if(!self.standBy.core){
				mocha.setup('bdd');
				window.assert = chai.assert;
				self.coreConstruct.getSpecs();
				if(!self.standBy.specs){
					if(self.cfg.autorun){
						mocha.run();					
					}
					this.say('ready');	
					return true;
				}else{
					this.say('specs are loading, left ' + self.standBy.specs); 
				}
			}else{
				this.say('core files are loading, left ' + self.standBy.core);
			}
		},
		say: function(data, clear){
			if(clear){
				self.serviceMessage.innerHTML = '';
			}
			self.serviceMessage.innerHTML += data + '<br>';
		},
		dispatcher: function(e){
			if(e.u_action){
				if(typeof(self.api[e.u_action]) == 'function'){
					self.api[e.u_action](e.data);
				}
			}
		}
	}

	var 
		cfg = {
			autorun: false,
			dom_holder: 'body',
			coreSet:[{
					id: 'mocha'
				},{
					type: 'style',
					path: 'https://cdnjs.cloudflare.com/ajax/libs/mocha/2.1.0/mocha.css'
				},{
					type: 'script',
					path: 'https://cdnjs.cloudflare.com/ajax/libs/mocha/2.1.0/mocha.js'
				},{
					type: 'script',
					path: 'https://cdnjs.cloudflare.com/ajax/libs/chai/2.0.0/chai.js'
				}
			],
			specSet: [
				'leftpane', 
				'toppane'
			]
		},
		u_test = new U_test(cfg);
		
	$top.on('u_test_evt', function(e,data){u_test.service.dispatcher(data)});
	$top.on('load', function(){u_test.service.init.call(u_test);});
}())