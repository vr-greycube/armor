{% include 'armor/public/js/sales_armor_common.js' %}

var weekday = new Array(7);
weekday[0] = "لأحَد";
weekday[1] = "لإثنين";
weekday[2] = "لثلاثاء";
weekday[3] = "لأربعاء";
weekday[4] = "لخميس";
weekday[5] = "لجمعة";
weekday[6] = "لسبت";


frappe.ui.form.on(cur_frm.doctype, {
  delivery_date: function (frm) {
    if (frm.doc.delivery_date) {
      let delivery_date=frm.doc.delivery_date
      var n = weekday[frappe.datetime.user_to_obj(delivery_date).getDay()];
      frm.set_value('delivery_day_cf', n)
      
    }
  },
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
  customer_group: function(frm){
 if (frm.doc.customer_group ) {
        let sales_partners = []
      let customer_group_value = frm.doc.customer_group
      frappe.db.get_doc('Customer Group', customer_group_value)
        .then(doc => {
          if (doc.customer_group_source == 'Is Agency') {
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
            frm.toggle_reqd('sales_partner', doc.customer_group_source == 'Is Agency'?1:0);
            frm.refresh_field('sales_partner')
          } else if (doc.customer_group_source != 'Is Agency') {
            frm.toggle_reqd('sales_partner', doc.customer_group_source == 'Is Agency'?1:0);
            frm.refresh_field('sales_partner')
          }
        })
    }
  } ,
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