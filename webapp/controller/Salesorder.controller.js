sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    
 
], (Controller, JSONModel) => {
    "use strict";

    return Controller.extend("com.sales.oder.salesorderpractice.controller.Salesorder", {
        onInit() {
            var that = this;
          this._loadTableData(20,0,"");
        },   
        _loadTableData : function(top,skip,aFilter){
            var that = this;      
            var oModel = this.getOwnerComponent().getModel();
            oModel.read("/A_SalesOrder",{
                filters:aFilter,
                urlParameters:{"$top":top, "$skip":skip,"$select":"SalesOrder,SalesOrderType,SalesDistrict,SoldToParty"}, //we have used $select bcoz we dont want all the columns to be displayed only few so we choose some
                success: function (oData, response) {
                    //debugger;
                    console.log("odata", oData);
                  var jsonmodel = new JSONModel();
                  jsonmodel.setData(oData);
                  that.getView().setModel(jsonmodel,"salesord");
                },
                Error : function(err){
                    console.log("failed", err)
                }
            })
        },

        onCreate : function(oEvent){
            debugger;
            var that= this;
            var view = this.getView();
               this._pDialog = this.loadFragment({
                name:"com.sales.oder.salesorderpractice.Fragments.onCreate"
            }).then(function(oDialog){
                view.addDependent(oDialog);
                that.createJSON();
                oDialog.open();
            }.bind(this));           
               },

            createJSON: function(){
                var jsonmodel = new JSONModel();
                this.getView().setModel(jsonmodel,"createOrd");
               },

               onSubmit :function(){
                debugger;
                var that = this;
                var oEnteredData = this.getView().getModel("createOrd").getData();
                console.log("entered data", oEnteredData);
                var oPayload = {
                    "SalesOrder": oEnteredData.SalesOrder,
                    "SalesOrderType": oEnteredData.SalesOrderType,
                    "SalesDistrict": oEnteredData.SalesDistrict,
                    "SoldToParty": oEnteredData.SoldToParty
                };
              var oModel = this.getOwnerComponent().getModel();
              oModel.create("/A_SalesOrder",oPayload, {
                success:function(oData,response){
                    //that._loadTableData(20,0,"");
                    new sap.m.MessageToast.show("record created successfully");
                    that.onCancel();
                },
                Error: function(err){
                    new sap.m.MessageToast.show("record creation Failed");
                }
              } )
              
               },


            
        onCancel: function(){
            var oDialog = this.getView().byId("createorder");
            oDialog.close();
            oDialog.destroy();
        },
        onUpdate : function(){
            //debugger;
            var that = this;
            var View = this.getView();
            this._pDialog = this.loadFragment({
                name:"com.sales.oder.salesorderpractice.Fragments.onUpdate"
            }).then(function (oDialog) {
                View.addDependent(oDialog);
                that.updateOrdJSON();
                oDialog.open();
            }.bind(this));
        },
        updateOrdJSON : function(){
            //debugger;
            var Table = this.getView().byId("idsalesTable");
            var oSelectedData = Table.getSelectedContexts()[0].getObject();
            console.log("selected data", oSelectedData);
            var ojsonmodel = new JSONModel();
            ojsonmodel.setData(oSelectedData);
            this.getView().setModel(ojsonmodel,"updateOrd");
        },
        onUpCancel : function(){
            var oDialog = this.getView().byId("updateorder");
            oDialog.close();
            oDialog.destroy();
        },
        onUpSubmit : function(){
            var that = this;
            var oModify = this.getView().getModel("updateOrd").getData();
            var oPayload = {               
                "SalesOrder":oModify.SalesOrder,
                "SalesOrderType":oModify.SalesOrderType,
                "SalesDistrict":oModify.SalesDistrict,
                "SoldToParty":oModify.SoldToParty
            }
            var oModel = this.getOwnerComponent().getModel();
            oModel.update("/A_SalesOrder",oPayload,  {
                success : function(oData,response){
                        this._loadTableData("20","0","");
                        new sap.m.MessageToast.show("record updated successfully");
                        that.onUpCancel();
                },
                Error: function(err){
                    new sap.m.MessageToast.show("updation failed");

                }
            })
        },
        onSearch : function(){
            //debugger;
            var afilter=[]; //more filters can be added or pushed to the array to filter
            var oInput = this.getView().byId("salesorderid").getValue();//getting input value entered
            var oInput1 = this.getView().byId("salesordertype").getValue();//getting input value entered
            var oInput2 = this.getView().byId("salesdistrictid").getValue();//getting input value entered
            var oInput3 = this.getView().byId("soldtopartyid").getValue();//getting input value entered
            var filter = new sap.ui.model.Filter("SalesOrder", sap.ui.model.FilterOperator.EQ, oInput); //creating new filter, saying that salesorder value should be equal to input entered
            var filter1= new sap.ui.model.Filter("SalesOrderType", sap.ui.model.FilterOperator.EQ, oInput1);
            var filter2 = new sap.ui.model.Filter("SalesDistrict", sap.ui.model.FilterOperator.EQ, oInput2);
            var filter3 = new sap.ui.model.Filter("SoldToParty", sap.ui.model.FilterOperator.EQ, oInput3);
               
            if(oInput){
                afilter.push(filter);
            }
            if(oInput1){
                afilter.push(filter1);
            }
            if(oInput2){
                afilter.push(filter2);
            }
            if(oInput3){             
            afilter.push(filter3);
            }
            this._loadTableData(20,0,afilter);
        },

        onSalesOrderF4help : function (oEvent)
        {
            debugger;
           var oInput = this.getView().byId("salesorderid");
           if(!this._oValueHelpDialog){//checking if valuehelpdialog is initialized/defined (open or close topic kaadu ikkada) //lazyloading runtime check//anything start with this is global variable         
               this._oValueHelpDialog = new sap.ui.comp.valuehelpdialog.ValueHelpDialog({//creating new instance for ValueHelpDialog class, cursor starts here variable is defined here but used later in condition//creating a dialog which has two buttons
                key: "SalesOrder", //unique identifier for the selected value that will be returned when a user selects an item from the dialog.//When a user selects an item (e.g., a sales order) from the dialog, the key represents the value that will be passed back to the calling field (in this case, the input field with the id salesorderid).
                supportMultiselect: false,
                descriptionKey: "SalesOrderType",
                ok : function(oEvent){//this is like a button
                  var selectedVal = oEvent.getParameter("tokens")[0].getProperty("key");//takes sales order value
                  oInput.setValue(selectedVal);//sets the value selected to the input control
                  this.close();
                },
                cancel: function(){
                  this.close();
                }
               })
           }
           var oDialog = this._oValueHelpDialog;
           oDialog.setTitle("Sales Order");
           var columnsmodel = new JSONModel();//this model is for structure of the table(how to be visible on ui)////The ValueHelpDialog requires a specific format for defining the table's column headers. This is done using a "columns" model, which provides metadata about the table structure.

           columnsmodel.setData({
            cols:[
                  {label:"sales order",template:"SalesOrder"},
                  {label:"sales order type",template:"SalesOrderType"}
                ]
        })
        var oTable=oDialog.getTable();
        oTable.setModel(columnsmodel,"columns");
       var oModel = this.getOwnerComponent().getModel();
       oModel.read("/A_SalesOrder",{
        urlParameters:{"$select":"SalesOrder,SalesOrderType,SalesDistrict","$top":20},
        success:function(oData,response){
            var Rowmodel = new JSONModel();//The actual data (rows) displayed in the table comes from a separate model, typically the default model without a named context.
            Rowmodel.setData(oData);
            oTable.setModel(Rowmodel);
            oTable.bindRows("/results");
            oDialog.update();//refreshing dialog(such that not to get previous entered data)
            oDialog.open();


        },
        Error:function (err){
            console.log("Error in dialog data",err);
        }
       })
        
    
        oDialog.open();
         
        }

    });
});