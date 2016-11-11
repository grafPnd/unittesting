describe('left pane tests', function() {
	// http://chaijs.com/api/assert/
	
	before(function() {$(top).trigger('u_test_evt', {'u_action': 'say', data: {message: 'begin to test leftPane'}});});
	after(function() {$(top).trigger('u_test_evt', {'u_action': 'say', data: {message: 'finish testing leftPane'}});});

	
	it('leftpane exists', function() {
		assert(document.getElementById('j_leftpane'));
	});
	it('leftpane has 5 elements', function() {
		assert.equal(document.getElementById('j_leftpane').childElementCount, 5);
	});

	describe('checking childnodes', function() {
		function checkSelected(i, el) {
			it(i + '-element is checked' , function() {
			  assert.equal(el.checked, true);
			});
		  }

		$(document.getElementById('j_leftpane')).children().each(checkSelected);
  });
	
});