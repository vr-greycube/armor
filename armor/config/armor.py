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
                    "label":_("Lead"),
                    "name":"Lead"
                },              
                {
                    "type":"doctype",
                    "label":_("Quotation"),
                    "name":"Quotation"
                },
                {
                    "type":"doctype",
                    "label":_("Sales Order"),
                    "name":"Sales Order"
                },
                {
                    "type":"doctype",
                    "label":_("Sales Invoice"),
                    "name":"Sales Invoice"
                },
                {
                    "type":"doctype",
                    "label":_("Delivery Note"),
                    "name":"Delivery Note"
                }                                                   
            ]
		},         
		{
			"label": _("Car Setup"),
			"icon": "fa fa-list",
			"items": [
				{
                    "type":"doctype",
                    "label":_("Car Size"),
                    "name":"Car Size CT"
				},
				{
                    "type":"doctype",
                    "label":_("Car Production Year"),
                    "name":"Car Production Year CT"
				},
				{
                    "type":"doctype",
                    "label":_("Car Model"),
                    "name":"Car Model CT"
				},
				{
                    "type":"doctype",
                    "label":_("Car Group"),
                    "name":"Car Group CT"
				}                                
			]
		},
		{
			"label": _("Package Setup"),
			"icon": "fa fa-list",
			"items": [
				{
                    "type":"doctype",
                    "label":_("Package"),
                    "name":"Package CT"
				},
                             
			]
		},        
		{
            "label":_("Quotation Setup"),
            "items":[
                {
                    "type":"doctype",
                    "label":_("Sales Partner"),
                    "name":"Sales Partner"
                },              
                {
                    "type":"doctype",
                    "label":_("Customer Group"),
                    "name":"Customer Group"
                }                
            ]
		}
	]