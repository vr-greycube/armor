# -*- coding: utf-8 -*-
# Copyright (c) 2021, GreyCube Technologies and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from frappe import _

class PackageCT(Document):
	def validate(self):
		total_percent=0
		for item in self.package_items:
			total_percent+=item.item_percent
		if total_percent!=100:
			frappe.throw(msg=_("Total package item percent should be <b>100%</b>. It is {0}%. Please correct it.".format(frappe.bold(total_percent))),
			title=_("Total percent error."))

