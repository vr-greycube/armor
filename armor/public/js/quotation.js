{% include 'armor/public/js/sales_armor_common.js' %}

frappe.ui.form.on(cur_frm.doctype, {
  customer_name: function (frm) {
    frappe.db.get_value('Customer', frm.doc.party_name, 'customer_group')
    .then(r => {
        let customer_group=r.message.customer_group
        if (customer_group) {
          frappe.db.get_value('Customer Group', customer_group, 'max_discount_allowed_cf')
          .then(r => {
              let max_discount_allowed_cf=r.message.max_discount_allowed_cf
              if (max_discount_allowed_cf) {
              frm.set_value('max_discount_allowed_cf', max_discount_allowed_cf)
              }
          })        
        }
    })
  }
})