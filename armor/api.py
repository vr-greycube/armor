
from __future__ import unicode_literals
import frappe
# from erpnext.setup.doctype.item_group.item_group import get_child_groups


@frappe.whitelist()
@frappe.validate_and_sanitize_search_inputs
def get_car_model(doctype, txt, searchfield, start, page_len, filters):
	if filters and filters.get('group'):
		cond = "'%s'" % filters.get('group')
		return frappe.db.sql("""select car_model from `tabCar Group Model CT`
				where parent = {cond}
				order by name limit %(start)s, %(page_len)s"""
				.format(cond=cond), {
					'start': start, 'page_len': page_len
				})


@frappe.whitelist()
@frappe.validate_and_sanitize_search_inputs
def get_item_group_items(doctype, txt, searchfield, start, page_len, filters):
	print('get_item_group_items'*100)
	if filters and filters.get('item_group'):
		item_group=filters.get('item_group')
		child_groups = ", ".join(['"' + i[0] + '"' for i in get_child_groups(item_group)])
		print('item_group',item_group)
		print('--'*100,child_groups)
		if child_groups:
			return frappe.db.sql("""select name,item_group,description from `tabItem`
				where docstatus = 0 
				and is_sales_item=1
				and (item_group in (%s)) """ % (child_groups))


def get_child_groups(item_group_name):
	item_group = frappe.get_doc("Item Group", item_group_name)
	return frappe.db.sql("""select name
		from `tabItem Group` where lft>=%(lft)s and rgt<=%(rgt)s
			""", {"lft": item_group.lft, "rgt": item_group.rgt})				