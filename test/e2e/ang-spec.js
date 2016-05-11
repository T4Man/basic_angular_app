describe('angular two way binding test', function() {
  it('should have a 2 way data binding', () => {
    browser.get('http://localhost:5000');
    element(by.model('typing')).sendKeys('This is a heading');
    element(by.binding('typing')).getText().then(function(text) {
      expect(text).toEqual('This is a heading');
    });
  });
});
