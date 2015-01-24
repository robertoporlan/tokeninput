(function ($) {
  module('jQuery#', {
    setup: function () {
      this.elems = $('#qunit-fixture').children();
    }
  });

  test('is chainable', function () {
    expect(1);
    strictEqual(this.elems.tokeninput(), this.elems, 'should be chainable');
  });
  //
  //test('is ', function () {
  //  expect(1);
  //  strictEqual(this.elems.tokeninput().text(), '012', 'should be ');
  //});
  //
  //module('jQuery.');
  //
  //test('is ', function () {
  //  expect(2);
  //  strictEqual($.tokeninput(), '.', 'should be ');
  //  strictEqual($.tokeninput({punctuation: '!'}), '!', 'should be thoroughly ');
  //});
  //
  //module(': selector', {
  //  setup: function () {
  //    this.elems = $('#qunit-fixture').children();
  //  }
  //});
  //
  //test('is ', function () {
  //  expect(1);
  //  deepEqual(this.elems.filter(':tokeninput').get(), this.elems.last().get());
  //});
}(jQuery));
