{% include 'armor/public/js/sales_armor_common.js' %}

frappe.ui.form.on(cur_frm.doctype, {
  onload: function (frm) {
    if (frm.doc.customer) {
      filter_source_based_on_customer(frm)
    }    
  },
  customer: function (frm) {
    if (frm.doc.customer) {
      filter_source_based_on_customer(frm)
    }    
  },
  // validate:function (frm) {
	// 	for (let row of (frm.doc.items || [])) {
  //     if (row.prevdoc_docname==undefined || row.prevdoc_docname=='') {
  //       frappe.throw({message:__("Quotation refrenece is missing for row <b>{0}</b>.",[row.idx]),title:__("Quotation reference is missing." )})
  //     }
	// 	}    
  // }
})
function filter_source_based_on_customer(frm){
  frappe.db.get_value('Customer', frm.doc.customer, 'customer_group')
  .then(r => {
    let customer_group = r.message.customer_group
    if (customer_group) {
        frappe.db.get_value('Customer Group', customer_group, 'customer_group_source')
        .then(r => {
          let customer_group_source = r.message.customer_group_source
          if (customer_group_source) {
            frm.set_query('source', () => {
              return {
                  filters: {
                    lead_source_category_cf: customer_group_source
                  }
              }
          })                
          }
        })            
    }
  })  
}