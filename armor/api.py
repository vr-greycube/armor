
from __future__ import unicode_literals
import frappe
# from erpnext.setup.doctype.item_group.item_group import get_child_groups
from frappe.desk.reportview import get_match_cond, get_filters_cond
from frappe.utils import nowdate, getdate


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
def item_query(doctype, txt, searchfield, start, page_len, filters, as_dict=False):
	conditions = []

	#Get searchfields from meta and use in Item Link field query
	meta = frappe.get_meta("Item", cached=True)
	searchfields = meta.get_search_fields()

	if "description" in searchfields:
		searchfields.remove("description")

	columns = ''
	extra_searchfields = [field for field in searchfields
		if not field in ["name", "item_group", "description"]]

	if extra_searchfields:
		columns = ", " + ", ".join(extra_searchfields)

	searchfields = searchfields + [field for field in[searchfield or "name", "item_code", "item_group", "item_name"]
		if not field in searchfields]
	searchfields = " or ".join([field + " like %(txt)s" for field in searchfields])

	description_cond = ''
	if frappe.db.count('Item', cache=True) < 50000:
		# scan description only if items are less than 50000
		description_cond = 'or tabItem.description LIKE %(txt)s'

	if filters and filters.get('armour_item_group'):
		item_group=filters.get('armour_item_group')
		item_group_list = ", ".join(['"' + i[0] + '"' for i in get_child_groups(item_group)])

	return frappe.db.sql("""select tabItem.name,
		if(length(tabItem.item_name) > 40,
			concat(substr(tabItem.item_name, 1, 40), "..."), item_name) as item_name,
		tabItem.item_group,
		if(length(tabItem.description) > 40, \
			concat(substr(tabItem.description, 1, 40), "..."), description) as description
		{columns}
		from tabItem
		where tabItem.docstatus < 2
			and tabItem.has_variants=0
			and tabItem.disabled=0
			and tabItem.is_sales_item=1
			and (item_group in ({item_group_list}))
			and (tabItem.end_of_life > %(today)s or ifnull(tabItem.end_of_life, '0000-00-00')='0000-00-00')
			and ({scond} or tabItem.item_code IN (select parent from `tabItem Barcode` where barcode LIKE %(txt)s)
				{description_cond})
		
			{mcond}
		order by
			if(locate(%(_txt)s, name), locate(%(_txt)s, name), 99999),
			if(locate(%(_txt)s, item_name), locate(%(_txt)s, item_name), 99999),
			idx desc,
			name, item_name
		limit %(start)s, %(page_len)s """.format(
			columns=columns,
			item_group_list=item_group_list,
			scond=searchfields,
			# fcond=get_filters_cond(doctype, filters, conditions).replace('%', '%%'),
			mcond=get_match_cond(doctype).replace('%', '%%'),
			description_cond = description_cond),
			{
				"today": nowdate(),
				"txt": "%%%s%%" % txt,
				"_txt": txt.replace("%", ""),
				"start": start,
				"page_len": page_len
			}, as_dict=as_dict)


# @frappe.whitelist()
# @frappe.validate_and_sanitize_search_inputs
# def get_item_group_items(doctype, txt, searchfield, start, page_len, filters):
# 	print('get_item_group_items'*100)
# 	if filters and filters.get('item_group'):
# 		item_group=filters.get('item_group')
# 		child_groups = ", ".join(['"' + i[0] + '"' for i in get_child_groups(item_group)])
# 		print('item_group',item_group)
# 		print('--'*100,child_groups)
# 		if child_groups:
# 			return frappe.db.sql("""select item_name,description,item_group,customer_code from `tabItem`
# 				where docstatus = 0 
# 				and is_sales_item=1
# 				and (item_group in (%s)) """ % (child_groups))


def get_child_groups(item_group_name):
	item_group = frappe.get_doc("Item Group", item_group_name)
	return frappe.db.sql("""select name
		from `tabItem Group` where lft>=%(lft)s and rgt<=%(rgt)s
			""", {"lft": item_group.lft, "rgt": item_group.rgt})				