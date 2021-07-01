# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from . import __version__ as app_version

app_name = "armor"
app_title = "Armor"
app_publisher = "GreyCube Technologies"
app_description = "Customization for Armor company"
app_icon = "octicon octicon-bug"
app_color = "green"
app_email = "admin@greycube.in"
app_license = "MIT"

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/armor/css/armor.css"
app_include_js =  "/assets/armor/js/lead_quick_entry.js"

# include js, css files in header of web template
# web_include_css = "/assets/armor/css/armor.css"
# web_include_js = "/assets/armor/js/armor.js"

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
doctype_js = {
  "Lead" : "public/js/lead.js",
  "Quotation":"public/js/quotation.js",
  "Sales Order":"public/js/sales_order.js",
  "Sales Invoice":"public/js/sales_invoice.js"
  
  }
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
#	"Role": "home_page"
# }

# Website user home page (by function)
# get_website_user_home_page = "armor.utils.get_home_page"

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Installation
# ------------

# before_install = "armor.install.before_install"
# after_install = "armor.install.after_install"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "armor.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# Document Events
# ---------------
# Hook on document methods and events

doc_events = {
	"Sales Invoice": {
		"on_submit": "armor.api.make_stock_entry_from_sales_invoice",
	}
}

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"armor.tasks.all"
# 	],
# 	"daily": [
# 		"armor.tasks.daily"
# 	],
# 	"hourly": [
# 		"armor.tasks.hourly"
# 	],
# 	"weekly": [
# 		"armor.tasks.weekly"
# 	]
# 	"monthly": [
# 		"armor.tasks.monthly"
# 	]
# }

# Testing
# -------

# before_tests = "armor.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "armor.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "armor.task.get_dashboard_data"
# }

