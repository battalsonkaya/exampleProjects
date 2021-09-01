;(function ($, w) {
	'use strict';
	if (!w.jQuery) {
		throw 'CustomApp: jQuery not found';
	}
	w.customTheme = {
		config: {
			color: {primary: '#4253FF', primary_2: '#7000FF', secondary: '#06113E', third: '#FF8870'}
		},

		init: function () {
			this.eventListener();
			this.afterInit();
		},

		afterInit: function () {
			this.initCurrencySlider('.currency-carousel');
			this.initCampaignSlider('.campaign-slider');
			this.inputMask();
			this.initPlugin();
		},

		initPlugin: function (){
			$('[data-toggle="tooltip"]').tooltip();

			$('.parsley-validation').parsley();
		},

		initCurrencySlider: function (element) {
			if ($(element).length == 0) {
				return;
			}
			$(element).slick({
				autoplay: true,
				autoplaySpeed: 6000,
				arrows: false,
				dots: false,
				infinite: true,
				speed: 300,
				slidesToShow: 1,
				slidesToScroll: 1,
				fade: true,
				cssEase: 'ease-in-out',
				swipe: false
			});
			$(element).on('afterChange', function(event, slick, currentSlide) {
				if((slick.$slides.length - slick.options.slidesToShow) <= currentSlide) {
					$(element).slick('slickGoTo', 0);
				}
			});
		},

		initCampaignSlider: function (element) {
			if ($(element).length == 0) {
				return;
			}
			$(element).slick({
				autoplay: true,
				autoplaySpeed: 6000,
				arrows: false,
				dots: true,
				infinite: true,
				speed: 300,
				slidesToShow: 1,
				slidesToScroll: 1,
				fade: true,
				cssEase: 'ease-in-out',
			});
			$(element).on('afterChange', function(event, slick, currentSlide) {
				if((slick.$slides.length - slick.options.slidesToShow) <= currentSlide) {
					$(element).slick('slickGoTo', 0);
				}
			});
		},

		navigation: function (_t) {
			_t.find(".nav-sub-list").toggle('1000');
			if (_t.hasClass("active")) {
                _t.removeClass("active");
            } else {
                _t.addClass("active");
				$('body').addClass('sidebar-active');
            }
		},

		inputMask: function () {
			$('input.date').mask('00/00/0000');
			$('input.tckn').mask('00000000000');
			$('input.time').mask('00:00:00');
			$('input.date_time').mask('00/00/0000 00:00:00');
			$('input.cep').mask('00000-000');
			$('input.phone').mask('0000-0000');
			$('input.phone_with_ddd').mask('(00) 0000-0000');
			$('input.phone_tr').mask('0(000) 000-0000');
			$('input.mixed').mask('AAA 000-S0S');
			$('input.cpf').mask('000.000.000-00', {reverse: true});
			$('input.cnpj').mask('00.000.000/0000-00', {reverse: true});
			$('input.money').mask('000.000.000.000.000,00', {reverse: true});
			$('input.money2').mask("#.##0,00", {reverse: true});
			$('input.ip_address').mask('0ZZ.0ZZ.0ZZ.0ZZ', {
			  translation: {
				'Z': {
				  pattern: /[0-9]/, optional: true
				}
			  }
			});
			$('input.ip_address').mask('099.099.099.099');
			$('input.percent').mask('##0,00%', {reverse: true});
			$('input.clear-if-not-match').mask("00/00/0000", {clearIfNotMatch: true});
			$('input.placeholder').mask("00/00/0000", {placeholder: "__/__/____"});
			$('input.fallback').mask("00r00r0000", {
				translation: {
				  'r': {
					pattern: /[\/]/,
					fallback: '/'
				  },
				  placeholder: "__/__/____"
				}
			  });
			$('input.selectonfocus').mask("00/00/0000", {selectOnFocus: true});
			$('.iban').mask('TR 00 0000 0000 0000 0000 00')
		},

		buttonLoading: function() {
			$(".btn-loading").each(function() {
				$(this).addClass("loading-active");
				$(this).addClass("disabled");
				$(this).attr("disabled", true);
			});
		},

		removeButtonLoading: function() {
			$(".btn-loading").each(function() {
				$(this).removeClass("loading-active");
				$(this).removeClass("disabled");
				$(this).attr("disabled", false);
			});
		},

		inputPlaceholder: function (element) {
			var input = $(element);
			var label = ' <label class="placeholder">{title}</label>';
			var createdLabel = label.replace('{title}', input.attr('placeholder'));
			if (!input.hasClass('placeholder-active')) {
				input.addClass('placeholder-active')
				input.before(createdLabel);
			}
		},

		inputPlaceholderRemove: function (element) {
			var input = $(element);
			input.closest('.form-group').find('label').remove();
			input.removeClass('placeholder-active');
		},

		qty: function (element) {
			var _t = $(element);

			var input = _t.closest('.form-group').find('input');
			var val = input.val();
			
			if (_t.data('selector') == 'qty-plus') {
				val++;
			} else {
				val--;
			}

			if(val >= 0){
				input.attr('value', val);
			}
		},
 
		countrySelect: function() {
			if ($('.js-city').length == 0) 
				return;

			$.getJSON("assets/json/country-area.json", function(res){
				$.each(res, function(i, value){
					var row="";
					row +='<option value="'+value.il+'">'+value.il+'</option>';
					$('.js-city').append(row);
				});
			});

			$('.js-city').on("change", function(){
				var city = $(this).val();

				$('.js-district').attr("disabled", false).html("<option value=''>İlçe</option>");
				$.getJSON("assets/json/country.json", function(res){
					$.each(res, function(i, value){
						var row="";
						if(value.il == city)
						{
							row +='<option value="'+value.ilce+'">'+value.ilce+'</option>';
							$('.js-district').append(row);
						}
					});
				});
			});
		},

		eventListener: function () {
			var self = this;

			self.countrySelect();

			$(document).on("click tap", ".nav-sub", function (e) {
				e.preventDefault();
                self.navigation($(this));
            });

			$("form").on("change", ".file-upload-field", function(){ 
				$(this).parent(".b-file-upload").attr("data-text",$(this).val().replace(/.*(\/|\\)/, '') );
			});

			$(document).on('focus', '.form-control[placeholder]', function () {
				self.inputPlaceholder($(this));
			});

			$(document).on('focusout', '.form-control[placeholder]', function () {
				self.inputPlaceholderRemove($(this));
			});

			$(document).on('click', '[data-selector*="qty"]', function (e) {
				e.preventDefault();
				self.qty($(this));
			});

			$('.btn-next').click(function(e) {
				var _t = $(this);

				if (_t.closest('form').hasClass('parsley-validation-step')) {
					_t.closest('form').parsley().whenValidate().done(function() {
						$('.nav-pills .active').parent().next('li').find('a').trigger('click');
						$('.nav-pills .active').parent().prev('li').find('a').addClass('completed');
					});
				} else {
					$('.nav-pills .active').parent().next('li').find('a').trigger('click');
					$('.nav-pills .active').parent().prev('li').find('a').addClass('completed');
				}
			});

			$('.btn-prev').click(function() {
				$('.nav-pills .active').parent().prev('li').find('a').trigger('click');
				$('.nav-pills .active').parent().find('a').removeClass('completed');
			});

			//Bootstrap tab slick fix
			$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
				$('.default-products .products-content').slick('setPosition');
			});

			$(document).on('click tap', '[data-selector="openbox-close"]', function() {
				openBox.reset();
			});
		}
	},

	w.openBox = {
		selector: '.openbox',
		selectorParent: '.openbox-container',
		speed: 200,
		activeClass: 'active',
		targetClass: 'openbox-content',
		closeClass: 'openbox-close',
		overlayClass: 'openbox-overlay',
		activeBox: null,

		init: function () {
			this.build();
			this.mouseup();
			this.eventListener();
		},
		build: function () {
			var self = this;
			$(this.selector).each(function () {
				var target = $(this).attr('data-target');
				var overlay = $(this).attr('data-overlay');

				if (overlay) {
					if (overlay == 'inside') {
						$(this).parent().append('<div class="' + self.overlayClass + ' ' + target + '-overlay" />');
					} else {
						$('body').append('<div class="' + self.overlayClass + ' ' + target + '-overlay" />');
					}
				}
				if ($(this).data('close')) {
					$('.' + target).append('<div class="' + self.closeClass + '" />');
				}

			});
		},
		mouseenter: function (element) {
			var target = $('.' + element.attr('data-target'));
			var overlay = $('.' + element.attr('data-target') + '-overlay');
			var beforeCallback = new Function(element.attr('data-callback-before'));
			var speed = element.attr('data-speed') || this.speed;

			switch (element.attr('data-mode')) {
				case 'slide':
					this.slideDown(target, speed, beforeCallback);
					break;
				case 'custom':
					break;
				default:
					this.show(target, speed, beforeCallback);
					break;
			}

			this.reset();
			this.addClasses(element);
			this.show(overlay, speed);
			this.activeBox = element;
		},
		click: function (element) {
			var target = $('.' + element.attr('data-target'));
			var overlay = $('.' + element.attr('data-target') + '-overlay');
			var beforeCallback = new Function(element.attr('data-callback-before'));
			var speed = element.attr('data-speed') || this.speed;
			if (element.hasClass(this.activeClass)) {
				this.reset();
			} else {

				switch (element.attr('data-mode')) {
					case 'slide':
						this.slideDown(target, speed, beforeCallback);
						break;
					case 'custom':
						break;
					default:
						this.show(target, speed, beforeCallback);
						break;
				}
				this.reset();
				this.mouseup();
				this.addClasses(element);
				this.show(overlay, speed);
				this.activeBox = element;
			}
		},
		mouseup: function () {
			var self = this;
			$(document).bind('mouseup tap', function (e) {
				if (!$('.' + self.targetClass).is(e.target) && $('.' + self.targetClass).has(e.target).length == 0 && !$(self.selector).is(e.target) && !$(self.selector).find('*').is(e.target)) {
					self.reset();
				}
			});
		},
		addClasses: function (element) {
			$(this.selector).removeClass(this.activeClass);
			$('body').addClass(element.attr('data-target') + '-active');
			element.addClass(this.activeClass);
		},
		show: function (element, speed, cbbefore) {
			element.stop(true, true).fadeIn(speed, cbbefore);
		},
		hide: function (element, afterCallback) {
			element.stop(true).fadeOut(100, afterCallback);
		},
		slideDown: function (element, speed, beforeCallback) {
			element.stop(true, true).slideDown(speed, beforeCallback);
		},
		slideUp: function (element, cbafter) {
			element.stop(true).slideUp(100, cbafter);
		},

		reset: function () {
			if (this.activeBox) {
				var target = this.activeBox.attr('data-target');
				var afterCallback = new Function(this.activeBox.attr('data-callback-after'));

				switch (this.activeBox.attr('data-mode')) {
					case 'slide':
						this.slideUp($('.' + target), afterCallback);
						break;
					case 'custom':
						break;
					default:
						this.hide($('.' + target), afterCallback);
						break;
				}

				$('body').removeClass(target + '-active');
				this.activeBox = null;
			}
			$(this.selector).removeClass(this.activeClass);
			this.hide($('.' + this.overlayClass));
			$(document).unbind('mouseup');
		},

		eventListener: function () {
			var self = this;
			$(document).on('mouseenter', self.selector + '[data-event="hover"]', function () {
				self.mouseenter($(this));
			});
			$(document).on('click tap', self.selector + ':not([data-event="hover"])', function () {
				self.click($(this));
			});
			$(document).on('click tap', '.' + self.closeClass, function () {
				self.reset();
			});
		}

	}
})(jQuery, window);

$(function () {
	customTheme.init();
	openBox.init();
});