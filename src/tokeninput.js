/*
 * Copyright (c) 2015 Paulo Leal
 * Licensed under the GPL license.
 */
(function ($) {
  $.tokeninput = {
    defaultOptions: {
      fromListOnly: false
    }
  };

  $.fn.tokeninput = function (options) {
    var CLASS_PREFIX = 'tokeninput';
    var INPUT_FIELD_CLASS = CLASS_PREFIX + '-input-field';
    var HIDDEN_FIELDS_CLASS = CLASS_PREFIX + '-hidden-fields';
    var VISIBLE_LABELS_CLASS = CLASS_PREFIX + '-visible-labels';
    var DELETE_FIELD_CLASS = CLASS_PREFIX + '-delete';
    var OPTIONS_BOX_CLASS = CLASS_PREFIX + '-options';
    var OPTIONS_BOX_ITEMS_CLASS = CLASS_PREFIX + '-options-item';

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
      var newInput = obj.clone().removeAttr('name').addClass(INPUT_FIELD_CLASS);
      if (options.placeholder) {
        newInput.attr('placeholder', options.placeholder);
      }
      block.append(newInput);
      return block;
    };

    return this.each(function () {
      var obj = $(this);
      var inputName = obj.attr('name');

      var optionsBox = null;
      var block = createBlock(obj);
      var prev = obj.prev();
      obj.remove();
      block.insertAfter(prev);
      var searchDelayTimer = null;

      var findByValue = function (value) {
        var _ret = false;
        block.find("." + HIDDEN_FIELDS_CLASS + " > input").each(function () {
          if ($(this).val() === value) {
            _ret = true;
          }
        });
        return _ret;
      };

      var removeEntry = function (event, index) {
        var me = $(this);
        if (index == null) {
          index = block.find(".tokeninput-visible-labels > li").toArray().indexOf(me.parent()[0]);
        }
        block.find("." + HIDDEN_FIELDS_CLASS + " > input")[index].remove();
        block.find("." + VISIBLE_LABELS_CLASS + " > li")[index].remove();
      };

      var addEntry = function (inputName, displayName, value) {
        var closeButton = $("<a></a>", {class: DELETE_FIELD_CLASS, href: 'javascript:void(0)'}).html('X');
        closeButton.on('click', removeEntry);

        var inputObject = $("<input/>", {name: inputName, type: 'hidden', value: value})
          .attr('data-displayName', displayName);
        var li = $("<li></li>")
          .html(displayName)
          .append(closeButton);

        block.find("." + HIDDEN_FIELDS_CLASS).append(inputObject);
        block.find("." + VISIBLE_LABELS_CLASS).append(li);
      };

      var updateOptionsList = function () {
        var source = [];

        if (searchDelayTimer) {
          searchDelayTimer = clearTimeout(searchDelayTimer);
        }

        searchDelayTimer = setTimeout(function () {
          var search = block.find("." + INPUT_FIELD_CLASS).val();
          if (typeof(options.source) === "function") {
            source = options.source(search);
            $.when(source).done(function (result) {
              _updateOptionsList(result);
            });
          } else if (typeof(options.source) === "object") {
            source = _$.grep(options.source, function (it) {
              return it.listingName.toLowerCase().indexOf(search.toLowerCase()) >= 0
            });
            _updateOptionsList(source);
          } else {
            console.error("unrecognized source");
          }
        }, 100);
      };

      var _updateOptionsList = function (source) {
        optionsBox.find("li").remove();
        $(source).each(function (index, value) {
          if (!block.find("." + HIDDEN_FIELDS_CLASS).find("[data-displayname='" + value.displayName + "']").length) {

            var el = $("<li></li>", {class: OPTIONS_BOX_ITEMS_CLASS})
              .html(value.listingName)
              .data('displayName', value.displayName)
              .data('value', value.value);

            el.on('click', function () {
              var me = $(this);
              addEntry(inputName, me.data('displayName'), me.data('value'));
              updateOptionsList();
            });
            optionsBox.append(el);
          }
        });
      };

      var showListIfSource = function () {
        if (!options.source) {
          return;
        }

        if (!optionsBox) {
          optionsBox = createUl({class: OPTIONS_BOX_CLASS}).hide();
          block.append(optionsBox);
        }

        optionsBox.show();
        updateOptionsList();
      };

      block.find("." + INPUT_FIELD_CLASS)
        .on('keyup', function (e) {
          var keyCode = e.which;
          if (keyCode >= 48 && keyCode <= 90 || keyCode == 8 || keyCode == 46) {
            updateOptionsList();
          }
        })
        .on('keydown', function (e) {
          var target = $(e.target);
          var keyCode = e.which;
          var interruptingKeys = [9, 188, 186, 13];

          if (keyCode == 8) {
            if (target.val() === "") {
              e.preventDefault();
              var tokensCount = block.find("." + DELETE_FIELD_CLASS).size();
              if (tokensCount > 0) {
                removeEntry(null, tokensCount - 1);
              }
            }
          }

          if (interruptingKeys.indexOf(keyCode) >= 0) {
            e.preventDefault();

            var displayName = target.val();
            var value = $(e.target).val();

            if (!options.fromListOnly) {
              if (value.length && !findByValue(value)) {
                addEntry(inputName, displayName, value);
                target.val('');
              }
            }
          }
        })
        .on('focus', showListIfSource);

    });
  };

}(jQuery));
