/*! tokeninput - v0.1.0 - 2015-01-24
* Copyright (c) 2015 Paulo Leal; Licensed GPL */
(function ($) {
  $.tokeninput = {
    defaultOptions: {}
  };

  $.fn.tokeninput = function (options) {
    var CLASS_PREFIX = 'tokeninput';
    var INPUT_FIELD_CLASS = CLASS_PREFIX + '-input-field';
    var HIDDEN_FIELDS_CLASS = CLASS_PREFIX + '-hidden-fields';
    var VISIBLE_LABELS_CLASS = CLASS_PREFIX + '-visible-labels';
    var DELETE_FIELD_CLASS = CLASS_PREFIX + '-delete';

    options = $.extend({}, $.tokeninput.defaultOptions, options);

    var createDiv = function (params) {
      return $("<div></div>", params);
    };

    var createUl = function (params) {
      return $("<ul></ul>", params);
    };

    var createBlock = function (obj) {
      var block = createDiv({class: CLASS_PREFIX + " " + options.class});
      block.append(createDiv({class: HIDDEN_FIELDS_CLASS}).hide());
      block.append(createUl({class: VISIBLE_LABELS_CLASS}));
      block.append(obj.clone().removeAttr('name').addClass(INPUT_FIELD_CLASS));
      return block;
    };

    return this.each(function () {
      var obj = $(this);
      var inputName = obj.attr('name');

      var block = createBlock(obj);
      var prev = obj.prev();
      obj.remove();
      block.insertAfter(prev);

      var findByValue = function (value) {
        var _ret = false;
        block.find("." + HIDDEN_FIELDS_CLASS + " > input").each(function () {
          if ($(this).val() === value) {
            _ret = true;
          }
        });
        return _ret;
      };

      var removeEntry = function () {
        var me = $(this);
        var index = block.find(".tokeninput-visible-labels > li").toArray().indexOf(me.parent()[0]);
        block.find("." + HIDDEN_FIELDS_CLASS + " > input")[index].remove();
        block.find("." + VISIBLE_LABELS_CLASS + " > li")[index].remove();
      };

      var addEntry = function (inputName, displayName, value) {
        var closeButton = $("<a></a>", {class: DELETE_FIELD_CLASS, href: ''}).html('X');
        closeButton.on('click', removeEntry);

        var inputObject = $("<input/>", {name: name, type: 'hidden', value: value});
        var li = $("<li></li>").html(displayName).append(closeButton);

        block.find("." + HIDDEN_FIELDS_CLASS).append(inputObject);
        block.find("." + VISIBLE_LABELS_CLASS).append(li);
      };

      block.find("." + INPUT_FIELD_CLASS).on('keydown', function (e) {
        var keyCode = e.keyCode || e.which;
        var interruptingKeys = [9, 188, 186, 13];

        if (interruptingKeys.indexOf(keyCode) >= 0) {
          e.preventDefault();

          var target = $(e.target);
          var displayName = "O-" + target.val() + "-O";
          var value = $(e.target).val();

          if (!findByValue(value)) {
            addEntry(inputName, displayName, value);
            target.val('');
          }

        }
      });

    });
  };

}(jQuery));
