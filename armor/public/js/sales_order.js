{% include 'armor/public/js/sales_armor_common.js' %}



var weekday = new Array(7);
weekday[0] = "الاحد"; 
weekday[1] = "الاثنين";
weekday[2] = "الثلاثاء";
weekday[3] = "الأربعاء";
weekday[4] = "الخميس";
weekday[5] = "الجمعة";
weekday[6] = "لسبت";


frappe.ui.form.on('Sales Order', {
  delivery_date: function (frm) {
    if (frm.doc.delivery_date) {
      let delivery_date=frm.doc.delivery_date
      var n = weekday[frappe.datetime.str_to_obj(delivery_date).getDay()];
      frm.set_value('delivery_day_cf', n)
      
    }
  },
  onload_post_render(frm){
    if(frm.doc.__islocal && !(frm.doc.taxes || []).length && (frm.doc.__onload ? frm.doc.__onload.load_after_mapping : false)) {
    frappe.after_ajax(() => apply_default_taxes_cs(frm));
  }  
  },
  onload: function (frm) {
    if (frm.doc.customer) {
      filter_source_based_on_customer(frm)
      make_sales_partner_mandatory_based_on_is_agency(frm)
    }
  },
  customer: function (frm) {
    if (frm.doc.customer) {
      filter_source_based_on_customer(frm)
    }    
  },
  customer_group: function(frm){
    make_sales_partner_mandatory_based_on_is_agency(frm)
  } ,
  // validate:function (frm) {
	// 	for (let row of (frm.doc.items || [])) {
  //     if (row.prevdoc_docname==undefined || row.prevdoc_docname=='') {
  //       frappe.throw({message:__("Quotation refrenece is missing for row <b>{0}</b>.",[row.idx]),title:__("Quotation reference is missing." )})
  //     }
	// 	}    
  // }
})

function make_sales_partner_mandatory_based_on_is_agency(frm){
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
}

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


function apply_default_taxes_cs(frm) {
  var taxes_and_charges_field = frappe.meta.get_docfield(frm.doc.doctype, "taxes_and_charges",
    frm.doc.name);
  if (frm.doc.taxes && frm.doc.taxes.length > 0 && frm.doc.taxes_and_charges) {
    return;
  }
  if (taxes_and_charges_field) {
    return frappe.call({
      method: "erpnext.controllers.accounts_controller.get_default_taxes_and_charges",
      args: {
        "master_doctype": taxes_and_charges_field.options,
        "tax_template": frm.doc.taxes_and_charges,
        "company": frm.doc.company
      },
      callback: function (r) {
        console.log('r', r)
        if (!r.exc && r.message) {
          frappe.run_serially([
            () => {
              // directly set in doc, so as not to call triggers
              if (r.message.taxes_and_charges) {
                frm.doc.taxes_and_charges = r.message.taxes_and_charges;
              }

              // set taxes table
              if (r.message.taxes) {

                frm.set_value("taxes", r.message.taxes);
              }
            },
            () => cur_frm.cscript.set_dynamic_labels(),
            () => cur_frm.cscript.calculate_taxes_and_totals()
          ]);
        }
      }
    });
  }
}