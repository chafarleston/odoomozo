// pos_disable_payments js
odoo.define('pos_disable_payments.pos_disable_payments', function(require) {
	"use strict";

	var models = require('point_of_sale.models');
	var screens = require('point_of_sale.screens');
	var core = require('web.core');
	var gui = require('point_of_sale.gui');
	var popups = require('point_of_sale.popups');
	var QWeb = core.qweb;
	var session = require('web.session');
	var rpc = require('web.rpc');
	var chrome = require('point_of_sale.chrome');
	var _t = core._t;

	var _super_posmodel = models.PosModel.prototype;
	models.PosModel = models.PosModel.extend({
		initialize: function (session, attributes) {
			var self = this;
			models.load_fields('res.users',['is_allow_payments','is_allow_discount','is_allow_qty','is_edit_price','is_allow_remove_orderline']);
			_super_posmodel.initialize.apply(this, arguments);
		},
	})

	chrome.UsernameWidget.include({
		click_username: function(){
			var self = this;
			this.gui.select_user({
				'security':     true,
				'current_user': this.pos.get_cashier(),
				'title':      _t('Change Cashier'),
			}).then(function(user){
				self.pos.set_cashier(user);
				self.ProductScreenWidget = new screens.ProductScreenWidget(self,{});
				self.ProductScreenWidget.check_access();
				self.renderElement();
			});
		},
	});

	screens.ProductScreenWidget.include({

		show: function() {
			var self = this;
			self.check_access();
			this._super();
		},

		check_access: function() {
			var self = this;
			var cashier = this.pos.get_cashier();
			var user = this.pos.user;
			if (cashier.is_allow_payments == true) {
				$('.button.pay').show();
			}
			else{
				$('.button.pay').hide();
			}
			if (cashier.is_allow_qty == true) {
				$('.mode-button.qty.selected-mode').show();
			}
			else{
				$('.mode-button.qty.selected-mode').hide();
			}
			if (cashier.is_allow_discount == true) {
				$('.mode-button.disc').show();
			}
			else{
				$('.mode-button.disc').hide();
			}
			if (cashier.is_edit_price == true) {
				$('.mode-button.price').show();
			}
			else{
				$('.mode-button.price').hide();
			}
			if (cashier.is_allow_remove_orderline == true) {
				$('.input-button.numpad-backspace').show();
			}
			else{
				$('.input-button.numpad-backspace').hide();
			}
		},
	});

});
