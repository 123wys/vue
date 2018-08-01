export default {
  routes: [{
    path: '/login',
    component(resolve) {
      require(['./components/Login/Login'], resolve);
    }
  }, {
    path: '/reset',
    component(resolve) {
      require(['./components/Login/reset'], resolve);
    }
  }, {
    path: '/update',
    component(resolve) {
      require(['./components/SystemUpdate'], resolve);
    }
  }, {
    path: '/register',
    redirect: '/register/setAccount',
    component(resolve) {
      require(['./components/Register/Register'], resolve);
    },
    children: [{
      path: 'setAccount',
      component(resolve) {
        require(['./components/Register/SetAccount'], resolve);
      },
    }, {
      path: 'complateShip',
      component(resolve) {
        require(['./components/Register/ComplateShip'], resolve);
      }
    }, {
      path: 'regComplate',
      component(resolve) {
        require(['./components/Register/RegComplate'], resolve);
      },
    }]
  }, {
    path: '',
    redirect: '/login',
  }, {
    path: '',
    component(resolve) {
      require(['./components/Operation'], resolve);
    },
    children: [{
      path: '',
      component(resolve) {
        require(['./components/Index'], resolve);
      }
    }, {
      path: 'index',
      component(resolve) {
        require(['./components/Index'], resolve);
      }
    }, {
      path: 'infoCenter',
      component(resolve) {
        require(['./components/common/InfoCenter'], resolve);
      }
    }, {
      path: 'accountSet',
      component(resolve) {
        require(['./components/AccountSet/Account'], resolve);
      },
      children: [{
        path: '',
        component(resolve) {
          require(['./components/AccountSet/AccountSet'], resolve);
        }
      }, {
        path: 'account',
        component(resolve) {
          require(['./components/AccountSet/AccountChange'], resolve);
        }
      }, {
        path: 'psw',
        component(resolve) {
          require(['./components/AccountSet/AccountPsw'], resolve);
        }
      }]
    }, {
      path: 'production',
      component(resolve) {
        require(['./components/Prod/Production'], resolve);
      }
    }, {
      path: 'cycleSend',
      component(resolve) {
        require(['./components/Prod/CycleSend'], resolve);
      }
    }, {
      path: 'supplierProdAction',
      component(resolve) {
        require(['./components/Prod/SupplierProdAction'], resolve);
      }
    }, {
      path: 'editInvoice',
      component(resolve) {
        require(['./components/AfterSale/EditInvoice'], resolve);
      }
    }, {
      path: 'afterSale',
      component(resolve) {
        require(['./components/AfterSale/afterSale'], resolve);
      }
    }, {
      path: 'realtimestock',
      component(resolve) {
        require(['./components/Stock/realtimeStock'], resolve);
      }
    }, {
      path: 'initstock',
      component(resolve) {
        require(['./components/Stock/InitStock'], resolve);
      }
    }, {
      path: 'warehouseprod',
      component(resolve) {
        require(['./components/Stock/WarehouseProd'], resolve);
      }
    }, {
      path: 'inoutstock',
      component(resolve) {
        require(['./components/Stock/InOutStock'], resolve);
      }
    }, {
      path: 'warehouse',
      component(resolve) {
        require(['./components/Stock/Warehouse'], resolve);
      }
    }, {
      path: 'procurementplan',
      component(resolve) {
        require(['./components/Stock/ProcurementPlanEdit'], resolve);
      }
    }, {
      path: 'aftersaleentrance',
      component(resolve) {
        require(['./components/AfterSale/AfterSaleEntrance'], resolve);
      }
    }, {
      path: 'aftersalemanagement',
      component(resolve) {
        require(['./components/AfterSale/AfterSaleManagement'], resolve);
      }
    }, {
      path: 'finance',
      component(resolve) {
        require(['./components/Finance/FinanceCrumb'], resolve);
      },
      children: [{
        path: '',
        component(resolve) {
          require(['./components/Finance/finance'], resolve);
        }
      }, {
        path: 'financeDetail',
        component(resolve) {
          require(['./components/Finance/FinanceDetail'], resolve);
        }
      }]
    }, {
      path: 'freeReport',
      component(resolve) {
        require(['./components/Finance/FreeReport'], resolve);
      },
      children: [{
        path: '',
        component(resolve) {
          require(['./components/Finance/FreeReportList'], resolve);
        }
      }, {
        path: 'freeReportDetail',
        component(resolve) {
          require(['./components/Finance/FreeReportDetail'], resolve);
        }
      }]
    }, {
      path: 'financeRule',
      component(resolve) {
        require(['./components/Finance/FinanceRuleCrumb'], resolve);
      },
      children: [{
        path: '',
        component(resolve) {
          require(['./components/Finance/FinanceRule'], resolve);
        }
      }, {
        path: 'addfinanceRule',
        component(resolve) {
          require(['./components/Finance/addfinanceRule'], resolve);
        }
      }, {
        path: 'editFinanceRule',
        component(resolve) {
          require(['./components/Finance/editFinanceRule'], resolve);
        }
      }, {
        path: 'financeRuleDetail',
        component(resolve) {
          require(['./components/Finance/FinanceRuleDetail'], resolve);
        }
      }]
    }, {
      path: 'dataCenter',
      component(resolve) {
        require(['./components/DataCenter/dataCenter'], resolve);
      }
    }, {
      path: 'productAnalysis',
      component(resolve) {
        require(['./components/DataCenter/ProductAnalysis'], resolve);
      }
    }, {
      path: 'orderAnalysis',
      component(resolve) {
        require(['./components/DataCenter/OrderAnalysis'], resolve);
      }
    }, {
      path: 'appCenter',
      component(resolve) {
        require(['./components/AppCenter/appCenter'], resolve);
      }
    }, {
      path: 'callCenter',
      component(resolve) {
        require(['./components/CallCenter/callCenter'], resolve);
      }
    }, {
      path: 'taskcenter',
      component(resolve) {
        require(['./components/TaskCenter/TaskCenter'], resolve);
      }
    }, {
      path: 'customer',
      component(resolve) {
        require(['./components/customer/CustomerCenter'], resolve);
      }
    }, {
      path: 'groupRule',
      component(resolve) {
        require(['./components/customer/CustomerGroup'], resolve);
      }
    }, {
      path: 'createGroup',
      component(resolve) {
        require(['./components/customer/CreateGroup'], resolve);
      }
    }, {
      path: 'help',
      component(resolve) {
        require(['./components/Help/help'], resolve);
      }
    }, {
      path: 'supportCenter',
      component(resolve) {
        require(['./components/Help/supportCenter'], resolve);
      }
    }, {
      path: 'system',
      component(resolve) {
        require(['./components/System/system'], resolve);
      }
    }, {
      path: 'user',
      component(resolve) {
        require(['./components/System/userEdit'], resolve);
      }
    }, {
      path: 'role',
      component(resolve) {
        require(['./components/System/role'], resolve);
      }
    }, {
      path: 'order',
      component(resolve) {
        require(['./components/Order/Order'], resolve);
      }
    }, {
      path: 'orderAdd',
      component(resolve) {
        require(['./components/Order/OrderAdd'], resolve);
      }
    }, {
      path: 'myChannel',
      component(resolve) {
        require(['./components/comconnection/channel/MyChannel'], resolve);
      }
    }, {
      path: 'channelDetail',
      component(resolve) {
        require(['./components/comconnection/channel/channelDetail'], resolve)
      }
    }, {
      path: 'businessDetail',
      component(resolve) {
        require(['./components/comconnection/businessDetail/businessDetail'], resolve)
      }
    }, {
      path: 'businessUpdate',
      component(resolve) {
        require(['./components/comconnection/businessDetail/businessUpdate'], resolve)
      }
    }, {
      path: 'orderimported',
      component(resolve) {
        require(['./components/Order/OrderImported'], resolve);
      }
    }, {
      path: 'orderdetail/:orderId',
      component(resolve) {
        require(['./components/Order/OrderDetail'], resolve);
      }
    }, {
      path: 'ordertrack/:id',
      component(resolve) {
        require(['./components/Order/OrderTrack'], resolve)
      }
    }, {
      path: 'orderprint',
      component(resolve) {
        require(['./components/Order/OrderPrint'], resolve)
      }
    }, {
      path: 'orderexport',
      component(resolve) {
        require(['./components/Order/OrderExport'], resolve)
      }
    }, {
      path: 'errororder',
      component(resolve) {
        require(['./components/ErrorOrder/ErrorOrder'], resolve);
      }
    }, {
      path: 'undisorder',
      component(resolve) {
        require(['./components/ErrorOrder/ErrorOrder'], resolve);
      }
    }, {
      path: 'deadorder',
      component(resolve) {
        require(['./components/ErrorOrder/ErrorOrder'], resolve);
      }
    }, {
      path: 'supplier',
      component(resolve) {
        require(['./components/comconnection/supplier/Supplier'], resolve);
      }
    }, {
      path: 'supplierList',
      component(resolve) {
        require(['./components/comconnection/supplier/SupplierList'], resolve);
      }
    }, {
      path: 'supplierDetail',
      component(resolve) {
        require(['./components/comconnection/supplier/supplierDetail'], resolve)
      }
    }, {
      path: 'inviteSupplier',
      component(resolve) {
        require(['./components/comconnection/supplier/InviteSupplier'], resolve);
      }
    }, {
      path: 'shop',
      component(resolve) {
        require(['./components/comconnection/shop/shop'], resolve);
      }
    }, {
      path: 'store',
      component(resolve) {
        require(['./components/comconnection/shop/storeList'], resolve);
      }
    }, {
      path: 'channel',
      component(resolve) {
        require(['./components/comconnection/channel/MyChannel'], resolve);
      }
    }, {
      path: 'supplierUpdate',
      component(resolve) {
        require(['./components/comconnection/supplier/SupplierUpdate'], resolve)
      }
    }, {
      path: 'versionshow',
      component(resolve) {
        require(['./components/System/versionshow'], resolve)
      }
    }, {
      path: 'sysmgnt',
      component(resolve) {
        require(['./components/System/sysmgnt'], resolve)
      }
    }, {
      path: 'pay',
      component(resolve) {
        require(['./components/System/pay'], resolve)
      }
    }, {
      path: 'paramset',
      component(resolve) {
        require(['./components/System/paramset'], resolve)
      }
    }]
  }, {
    path: '/join',
    component(resolve) {
      require(['./components/comconnection/supplier/InviteCode'], resolve);
    }
  }, {
    path: '*', redirect: '/index'
  }],
}
