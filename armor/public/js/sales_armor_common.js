frappe.ui.form.on(cur_frm.doctype, {
  customer: function (frm) {
    frappe.db.get_value('Customer', frm.doc.customer, 'customer_group')
      .then(r => {
        let customer_group = r.message.customer_group
        if (customer_group) {
          frappe.db.get_value('Customer Group', customer_group, 'max_discount_allowed_cf')
            .then(r => {
              let max_discount_allowed_cf = r.message.max_discount_allowed_cf
              if (max_discount_allowed_cf) {
                frm.set_value('max_discount_allowed_cf', max_discount_allowed_cf)
              }
            })
        }
      })
  },
  validate: function (frm) {
    if (frm.doc.max_discount_allowed_cf && frm.doc.max_discount_allowed_cf > 0) {
      let erpnext_percentage
      if (frm.doc.apply_discount_on == 'Grand Total') {
        erpnext_percentage = flt((frm.doc.discount_amount / (frm.doc.discount_amount + frm.doc.base_grand_total)) * 100, 1)
      } else if (frm.doc.apply_discount_on == 'Net Total') {
        erpnext_percentage = flt((frm.doc.discount_amount / (frm.doc.discount_amount + frm.doc.base_net_total)) * 100, 1)
      }
      if (erpnext_percentage > flt(frm.doc.max_discount_allowed_cf)) {
        frappe.throw(__({
          message: __('Maximum discount allowed is <b>{0}%</b>. Discount given is <b>{1}%</b>. Please correct it.', [frm.doc.max_discount_allowed_cf, erpnext_percentage]),
          title: __('Max discount allowed percentage has exceeded.'),
        }))
      }
    }
  },
  package_cf: function (frm) {
    cur_frm.cached_items = {};
    frappe.db.get_doc('Package CT', frm.doc.package_cf)
      .then(doc => {
        frm.set_value("items", []);
        let package_amount = doc.package_amount
        let package_items = doc.package_items
        for (let index = 0; index < package_items.length; index++) {
          let row = cur_frm.fields_dict.items.grid.add_new_row(),docname = row.name;
          console.log(((package_items[index].item_percent) /100)*package_amount,index)
          cur_frm.cached_items[docname] = {
            rate: ((package_items[index].item_percent) /100)*package_amount,
          };
          frappe.model.set_value(cur_frm.doctype + " Item", docname, "item_code", package_items[index].item_code);
        }
      })
  },
  setup: function (frm) {
    // monkey patch erpnext transaction.js item_code
    // update items row after erpnext updates row values on setting item
    var original_item_code = frm.cscript.item_code;
    frm.cscript.item_code = function (doc, cdt, cdn) {
      original_item_code.apply(this, arguments).then(() => {
        frappe.timeout(0.8).then(() => {
          // called after erpnext update
          if (cur_frm.cached_items && !$.isEmptyObject(cur_frm.cached_items)) {
            set_values(cur_frm.doctype + " Item", cdn, cur_frm.cached_items[cdn]);
            delete cur_frm.cached_items[cdn];
            if ($.isEmptyObject(cur_frm.cached_items)) {
              frappe.msgprint({
                message: __('Table updated with package items.'),
                title: __('Success'),
                indicator: 'green'
              })
            }
          }
        });
      });
    };
    //
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

frappe.ui.form.on('Car Information CT', {
  model: function (frm, cdt, cdn) {
    let row = locals[cdt][cdn]
    if (row.model && row.group) {
      frappe.db.get_doc('Car Group CT', row.group)
        .then(doc => {
          let car_group_models = doc.car_group_models
          if (car_group_models) {
            for (let car_group_model of (car_group_models || [])) {
              if (car_group_model.car_model == row.model) {
                row.size = car_group_model.car_size
                frm.refresh_field('cars')
              }
            }

          }
        })
    }
  }
})

function set_values(cdt, cdn, args) {
  let item = locals[cdt][cdn];
  for (const key in args) {
    item[key] = args[key];
  }
  cur_frm.refresh_field("items");
}