// frappe.provide("frappe.ui.form");

// frappe.ui.form.LeadQuickEntryForm = frappe.ui.form.QuickEntryForm.extend({
//   render_dialog: function () {
//     this._super();
//     let dialog = this.dialog;
//     let lead_source_field = dialog.get_field("source");
//     lead_source_field.df.onchange = function (params) {
//       let sales_partners = []
//       let sales_partner_field = dialog.get_field("sales_partner");
//       let lead_source_value = cur_dialog.fields_dict.source.value
//       debugger
//       if (lead_source_value!=undefined) {
//         frappe.db.get_doc('Lead Source', lead_source_value)
//         .then(doc => {
//           if (doc.is_agency_cf == 1) {
//             $.each(doc.sales_partners_cf, function (index, source_row) {
//               sales_partners.push(source_row.sales_partner)
//             });
//             sales_partner_field.df.get_query = function (params) {
//               return {
//                 filters: {
//                   partner_name: ['in', sales_partners]
//                 }
//               }
//             }
//             sales_partner_field.df.reqd = doc.is_agency_cf
//             sales_partner_field.refresh();
//           } 
//           else if (doc.is_agency_cf == 0) {
//             sales_partner_field.df.get_query = function (params) {
//               return {
//                 filters: {
//                   partner_name: ['in', sales_partners]
//                 }
//               }
//             }
//             sales_partner_field.df.reqd = doc.is_agency_cf
//             sales_partner_field.refresh();
//           }
//         })     
//       }else{
//         sales_partner_field.df.get_query = function (params) {
//           return {
//             filters: {
//               partner_name: ['in', sales_partners]
//             }
//           }
//         }
//         sales_partner_field.df.reqd = 0
//         sales_partner_field.refresh();     
//       }
//     };
//   },
// });