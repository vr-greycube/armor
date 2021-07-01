frappe.ui.form.on('Quotation', {
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
  },
  validate: function (frm) {
    if (frm.doc.max_discount_allowed_cf && frm.doc.max_discount_allowed_cf>0) 
    {
      let erpnext_percentage
      if (frm.doc.apply_discount_on=='Grand Total') {
        erpnext_percentage=flt((frm.doc.discount_amount/(frm.doc.discount_amount+frm.doc.base_grand_total))*100,1)
      }
      else if(frm.doc.apply_discount_on=='Net Total'){
        erpnext_percentage=flt((frm.doc.discount_amount/(frm.doc.discount_amount+frm.doc.base_net_total))*100,1)
      }
      if (erpnext_percentage> flt(frm.doc.max_discount_allowed_cf)) {
        frappe.throw(__({
          message: __('Maximum discount allowed is <b>{0}%</b>. Discount given is <b>{1}%</b>. Please correct it.',[frm.doc.max_discount_allowed_cf,erpnext_percentage]),
          title: __('Max discount allowed percentage has exceeded.'),
        }))
      }
    }
  },
  item_group_cf: function (frm) {
    frm.set_query("item_code", "items", function (doc, cdt, cdn) {
      const row = locals[cdt][cdn];
      if (frm.doc.item_group_cf) {
        return {
          query: "armor.api.item_query",
					filters: {
            'armour_item_group': frm.doc.item_group_cf,
            'is_sales_item': 1
          }
        }
      }
    });
  },
  onload: function (frm) {
    frm.set_query("model", "cars", function (doc, cdt, cdn) {
      const row = locals[cdt][cdn];
      if (row.group) {
        return {
          query: "armor.api.get_car_model",
          filters: {
            'group': row.group
          }
        }
      }
    });
  }
})