# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from frappe import _
import frappe

def get_data():
	return [
		{
            "label":_("Transaction"),
            "items":[
                {
                    "type":"doctype",
                    "label":"Lead",
                    "name":"Lead"
                },              
                {
                    "type":"doctype",
                    "label":"Quotation",
                    "name":"Quotation"
                },
                {
                    "type":"doctype",
                    "label":"Sales Order",
                    "name":"Sales Order"
                },
                {
                    "type":"doctype",
                    "label":"Sales Invoice",
                    "name":"Sales Invoice"
                }                                  
            ]
		},         
		{
			"label": _("Car Setup"),
			"icon": "fa fa-list",
			"items": [
				{
                    "type":"doctype",
                    "label":"Car Size",
                    "name":"Car Size CT"
				},
				{
                    "type":"doctype",
                    "label":"Car Production Year",
                    "name":"Car Production Year CT"
				},
				{
                    "type":"doctype",
                    "label":"Car Model",
                    "name":"Car Model CT"
				},
				{
                    "type":"doctype",
                    "label":"Car Group",
                    "name":"Car Group CT"
				}                                
			]
		},
		{
            "label":_("Lead Setup"),
            "items":[
                {
                    "type":"doctype",
                    "label":"Sales Partner",
                    "name":"Sales Partner"
                },              
                {
                    "type":"doctype",
                    "label":"Lead Source",
                    "name":"Lead Source"
                },
                {
                    "type":"doctype",
                    "label":"Customer Group",
                    "name":"Customer Group"
                }                
            ]
		}
	]