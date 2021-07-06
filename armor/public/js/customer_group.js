frappe.ui.form.on('Customer Group', {
  customer_group_source:function (frm) {
    let customer_group_source=frm.doc.customer_group_source
    if (customer_group_source=='Is Agency') {
      frm.set_df_property('sales_partners_cf', 'reqd', 1)
    }else if(customer_group_source=='Walk In'){
      frm.set_df_property('sales_partners_cf', 'reqd', 1)
    }else if(customer_group_source=='Social Media'){
      frm.set_df_property('sales_partners_cf', 'reqd', 0)
    }else{
      frm.set_df_property('sales_partners_cf', 'reqd', 0)
    }  
    frm.refresh_field('sales_partners_cf')  
  }
})