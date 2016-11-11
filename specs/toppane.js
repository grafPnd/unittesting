describe('checking header', function() {
	it('header exists', function() {
		assert(document.getElementById('j_header'));
	});

	it('header has 6 elements', function() {
		assert.equal(document.getElementById('j_header').childNodes.length, 6);
	});	
});