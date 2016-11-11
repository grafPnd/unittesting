(function(){
	var
		$top = $(window.top),
		fCfg = {
			specSet: [
				'footer'
			]
		},
		ltCfg = {
			specSet: [
				'leftpane', 
				'toppane'
			]
		};
	$top.on('load',function(){
		$('<input>').attr('type','submit').val('construct test').appendTo($('#j_header')).on('click', function(){$top.trigger('u_test_evt', {'u_action': 'construct'});});
		$('<input>').attr('type','submit').val('destruct test').appendTo($('#j_header')).on('click', function(){$top.trigger('u_test_evt', {'u_action': 'destruct'});});
		$('<input>').attr('type','submit').val('clear log').appendTo($('#j_header')).on('click', function(){$top.trigger('u_test_evt', {'u_action': 'say', data: {message: '', clear: true}});});
		$('<input>').attr('type','submit').val('run test').appendTo($('#j_header')).on('click', function(){$top.trigger('u_test_evt', {'u_action': 'run_tests'});});
		$('<input>').attr('type','submit').val('reconfig to footer').appendTo($('#j_header')).on('click', function(){$top.trigger('u_test_evt', {'u_action': 'reconfig', data: {cfg: fCfg}});});
		$('<input>').attr('type','submit').val('reconfig to topPane&leftpane').appendTo($('#j_header')).on('click', function(){$top.trigger('u_test_evt', {'u_action': 'reconfig', data: {cfg: ltCfg}});});
	})
}())