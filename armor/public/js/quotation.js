{% include 'armor/public/js/sales_armor_common.js' %}

frappe.ui.form.on(cur_frm.doctype, {
  onload_post_render: function (frm) {
    if (frm.doc.quotation_to == 'Lead') {
      frappe.db.get_value('Lead', frm.doc.party_name, 'guest_group_cf')
        .then(r => {
          let customer_group = r.message.guest_group_cf
          frm.set_value('customer_group', customer_group)
        })
    }
  },
  party_name: function (frm) {
    if (frm.doc.quotation_to == 'Lead') {
      frappe.db.get_value('Lead', frm.doc.party_name, 'guest_group_cf')
        .then(r => {
          let customer_group = r.message.guest_group_cf
          frm.set_value('customer_group', customer_group)
        })
    }
  },
  customer_group: function (frm) {
    if (frm.doc.customer_group) {
      frappe.db.get_doc('Customer Group', frm.doc.customer_group)
        .then(doc => {
          let customer_group_source = doc.customer_group_source
          let sales_partners = []
          let max_discount_allowed_cf = doc.max_discount_allowed_cf
          if (customer_group_source == 'Is Agency') {
            frm.set_df_property('source', 'reqd', 1)
            frm.set_df_property('sales_partner', 'reqd', 1)
            $.each(doc.sales_partners_cf, function (index, source_row) {
              sales_partners.push(source_row.sales_partner)
            });
            frm.set_query('sales_partner', () => {
              return {
                filters: {
                  partner_name: ['in', sales_partners]
                }
              }
            })

          } else if (customer_group_source == 'Walk In') {
            frm.set_df_property('source', 'reqd', 1)
            frm.set_df_property('sales_partner', 'reqd', 1)
            $.each(doc.sales_partners_cf, function (index, source_row) {
              sales_partners.push(source_row.sales_partner)
            });
            frm.set_query('sales_partner', () => {
              return {
                filters: {
                  partner_name: ['in', sales_partners]
                }
              }
            })
          } else if (customer_group_source == 'Social Media') {
            frm.set_df_property('source', 'reqd', 1)
            frm.set_df_property('sales_partner', 'reqd', 0)
          } else {
            frm.set_df_property('source', 'reqd', 0)
            frm.set_df_property('sales_partner', 'reqd', 0)
          }

          frm.set_value('max_discount_allowed_cf', max_discount_allowed_cf)

          frm.refresh_field('max_discount_allowed_cf')
          frm.refresh_field('sales_partner')
          frm.refresh_field('source')
        })

    }
  },
  validate: function (frm) {
    if (frm.doc.quotation_to == undefined || frm.doc.quotation_to != 'Lead') {
      frappe.throw({
        message: __("Please select 'Quotation To' field value as Lead."),
        title: __("Quotation To error.")
      })
    }
    if (frm.doc.party_name == undefined || frm.doc.party_name == '') {
      frappe.throw({
        message: __("Please select lead."),
        title: __("Lead value is missing.")
      })
    }
  }
})