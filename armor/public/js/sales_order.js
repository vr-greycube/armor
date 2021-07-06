{% include 'armor/public/js/sales_armor_common.js' %}

frappe.ui.form.on(cur_frm.doctype, {
  validate:function (frm) {
		for (let row of (frm.doc.items || [])) {
      if (row.prevdoc_docname==undefined || row.prevdoc_docname=='') {
        frappe.throw({message:__("Quotation refrenece is missing for row <b>{0}</b>.",[row.idx]),title:__("Quotation reference is missing." )})
      }
		}    
  }
})