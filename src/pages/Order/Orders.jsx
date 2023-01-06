import React from "react";
import { useState, useEffect } from "react";
import {
  InputOnlyView,
  FieldEditCombobox,
  OrderDetailHeader,
  MyCommandCell,
  DropdowCell,
} from "../../components";
import { AiOutlineEdit } from "react-icons/ai";
import { TextArea } from "@progress/kendo-react-inputs";
import { ComboBox } from "@progress/kendo-react-dropdowns";
import { Label } from "@progress/kendo-react-labels";
import api from "../../api";
import { apiUrl } from "../../constants";
import { filterBy } from "@progress/kendo-data-query";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import { FieldWrapper } from "@progress/kendo-react-form";
import { Input, NumericTextBox } from "@progress/kendo-react-inputs";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import Multiselect from "multiselect-react-dropdown";
import { Dialog } from "@progress/kendo-react-dialogs";
import { Tooltip } from "@progress/kendo-react-tooltip";
import {
  Grid,
  GridColumn,
  GridToolbar,
  GridNoRecords,
} from "@progress/kendo-react-grid";
const Orders = () => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [customers, setCustomers] = useState([]);
  const [customersFilter, setCustomersFilter] = useState([]);
  const [customer, setCustomer] = useState({});
  const initListCode = {
    ITEMCODE: "%",
    ITEMNAME: "%",
  };

  const [paymentMethodSelected, setPaymentMethodSelected] =
    useState(initListCode);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentCycles, setPaymentCycles] = useState([]);
  const [paymentCyclesSelected, setpaymentCyclesSelected] = useState({});
  const [deliveryMethods, setDeliveryMethods] = useState([]);
  const [deliveryMethodsSelected, setDeliveryMethodsSelected] = useState({});
  const [deliveryTypes, setDeliveryTypes] = useState([]);
  const [deliveryTypesSelected, setdeliveryTypesSelected] = useState({});
  const [deliveryTimes, setDeliveryTimes] = useState([]);
  const [deliveryTimesSelected, setDeliveryTimesSelected] = useState({});
  const [detailPaymentVisible, setDetailPaymentVisible] = useState(false)
  const [detailDeliveryVisible, setDetailDeliveryVisible] = useState(false);
  const [shortValuePayment, setShortValuePayment] = useState("Chưa thiết lặp thông tin thanh toán");
  const [shortValueDelivery, setShortValueDelivery] = useState(
    "Chưa thiết lặp thông tin giao hàng"
  );
  const mainFucntions = [
    {
      text: "Lưu",
      id: "save",
    },
    {
      text: "Trình ký",
      id: "lock",
    },
    {
      text: "Xóa",
      id: "delete",
    },
  ];
  const [mainFunction, setMainFunction] = useState(mainFucntions[0])

  const [orderDetails, setOrderDetails] = useState([]);
  const EDIT_FIELD = "inEdit";
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [sumQuatity, setsumQuatity] = useState(0);
  const [sumMoney, setsumMoney] = useState(0);
  const [sumMoneyCram, setsumMoneyCram] = useState(0);
  const [rdtnRate, setrdtnRate] = useState(0);
  const [rdtnCram, setrdtnCram] = useState(0);
  const [vatRate, setvatRate] = useState(0);
  const [vatCram, setvatCram] = useState(0);
  const currentDate = new Date();
  const initOrderHeader = {
    COMPCODE: "",
    LCTNCODE: "",
    ODERCODE: "",
    ODERDATE: currentDate,
    CUSTCODE: "",
    CUOMRATE: 1,
    PYMNPERD: "",
    PYMNNUMB: 0,
    DLVRTYPE: "",
    DLVRDATE: currentDate,
    DLVRPLCE: "",
    EMPLCODE: "",
    NOTETEXT: "", // Nội dung đơn hàng
    CUST_TEL: "", // Số điện thoại khách hàng
    TAX_CODE: "", // Mã số thuế
    VAT_RATE: 0, // Thuế xuất
    VAT_CRAM: 0, // Tiền thuế
    SUM_CRAM: 0, // Tổng tiền
    VAT_AMNT: 0,
    SUM_AMNT: 0,
    SMPRQTTY: 20, // Tổng số lượng
    RCVREMPL: "", // Người nhận hàng
    RCVR_TEL: "", // SĐT nhận hàng
    DLVRMTHD: 1,
    DLVRHOUR: 0,
    DLVRADDR: "", // Địa chỉ giao hàng
    PAY_MTHD: 0,
    MCUSTNME: "",
    SRC_DATA: 3,
    USERLGIN: "",
    RDTNRATE: 0, // % Chiết khấu
    RDTNCRAM: 0, // Số tiền chiết khấu
    RDTNAMNT: 0, // Số tiền chiết khấu VND
    CSCMRATE: 0, // % Hoa hồng
    DCMNSBCD: "",
    CUSTADDR: "",
    DDDD: "DDHKH",
    ACCERGHT: 0,
    STTESIGN: 0,
    STTENAME: "",
    KKKK0000: "",
  };
  const [header, setHeader] = useState(initOrderHeader)
  
  useEffect(() => {
    loadCustomers();
    loadPaymentMethods();
    loadPaymentCycles();
    loadDeliveryMethods();
    loadDeliveryType();
    loadDeliveryTimes();
    loadDataProduct();
  }, []);
  const loadDataProduct = () => {
    api(localStorage.getItem("usertoken"))
      .post(apiUrl.listProduct.value, {
        DCMNCODE: "appPrdcList",
        LCTNCODE: userData.LCTNCODE,
        PARACODE: "001",
        LGGECODE: "v",
        SCTNCODE: 1,
        JSTFDATE: "1990-01-01",
        KEY_WORD: "%",
        SHOPCODE: "%",
        CUSTCODE: customer.CUSTCODE,
      })
      .then((res) => {
        console.log(res.data);
        var data = res.data.RETNDATA;
        data.map((item) => {
          item.PRCESALE = 100000;
          item.inEdit = true;
        });
        setProducts(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
   const loadDeliveryTimes = () => {
     api(localStorage.getItem("usertoken"))
       .post(apiUrl.listCommon.value, {
         LISTCODE: "lstListHour",
       })
       .then((res) => {
         setDeliveryTimes(res.data.RETNDATA);
         setDeliveryTimesSelected(res.data.RETNDATA[0]);
       })
       .catch((err) => {
         console.log(err);
       });
   };
  const loadDeliveryType = () => {
    api(localStorage.getItem("usertoken"))
      .post(apiUrl.listCommon.value, {
        LISTCODE: "lstDlvrType",
      })
      .then((res) => {
        setDeliveryTypes(res.data.RETNDATA);
        setdeliveryTypesSelected(res.data.RETNDATA[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const loadDeliveryMethods = () => {
    api(localStorage.getItem("usertoken"))
      .post(apiUrl.listCommon.value, {
        LISTCODE: "lstDlvrMthd",
      })
      .then((res) => {
        setDeliveryMethods(res.data.RETNDATA);
        setDeliveryMethodsSelected(res.data.RETNDATA[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const loadPaymentMethods = () =>{
    api(localStorage.getItem("usertoken"))
      .post(apiUrl.listCommon.value, {
        LISTCODE: "lst_inpCustOdMt_Pay_Mthd_2"
      })
      .then((res) => {
        setPaymentMethods(res.data.RETNDATA)
        setPaymentMethodSelected(res.data.RETNDATA[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  const loadPaymentCycles = () => {
    api(localStorage.getItem("usertoken"))
      .post(apiUrl.listCommon.value, {
        LISTCODE: "lstTimeType",
      })
      .then((res) => {
        setPaymentCycles(res.data.RETNDATA);
        setpaymentCyclesSelected(res.data.RETNDATA[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const loadCustomers = () => {
    api(localStorage.getItem("usertoken"))
      .post(apiUrl.listCustomer.value, {
        DCMNCODE: "appCustList",
        EMPLCODE: userData.EMPLCODE,
        PARACODE: "001",
        KEY_WORD: "%",
      })
      .then((res) => {
        var data = res.data;
        var returnCode = data.RETNCODE;
        var returnData = data.RETNDATA;
        if (returnCode) {
          returnData.map((item) => {
            item.Display = item.CUSTNAME + " (#" + item.CUSTCODE + ")";
          });
          setCustomers(returnData);
          setCustomersFilter(returnData);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
   const filterData = (filter) => {
     const data = customers.slice();
     return filterBy(data, filter);
   };
 const customerFilterChange = (event) => {
  console.log(event.filter);
  if(event.filter.value == ""){
    setCustomersFilter(customers);
  }
   setCustomersFilter(filterData(event.filter));
 };
 const itemChange = (event) => {
   let field = event.field || "";
   event.dataItem[field] = event.value;
   let newData = orderDetails.map((item) => {
     if (item.PRDCCODE === event.dataItem.PRDCCODE) {
       item[field] = event.value;
       if (field == "PRDCQTTY" || field == "SALEPRCE" || field == "DISCRATE") {
         item["DCPRAMNT"] =
           (item["PRDCQTTY"] * item["SALEPRCE"] * item["DISCRATE"]) / 100;
         item["MNEYAMNT"] =
           item["PRDCQTTY"] * item["SALEPRCE"] - item["DCPRAMNT"];
       }
       console.log(
         "id = " +
           event.dataItem.PRDCCODE +
           " change = " +
           field +
           " value = " +
           event.value
       );
     }

     return item;
   });
   setOrderDetails(newData);
 };
  const remove = (dataItem) => {
    const newData = orderDetails.filter(
      (item) => item.PRDCCODE !== dataItem.PRDCCODE
    );
    console.log("Length new data = " + newData.length);
    setOrderDetails(newData);
  };
 const editField = "inEdit";
  const CommandCell = (props) => (
    <MyCommandCell {...props} editField={editField} remove={remove} />
  );
   const [visibleDialog, setVisibleDialog] = useState(false);
    const onDialogToggle = () => {
      setVisibleDialog(!visibleDialog);
    };
    const onSelect = (selectedList, selectedItem) => {
      setSelectedProducts(selectedList);
    }
    const onDoneSelectProduct = () => {
      onDialogToggle();
      if(selectedProducts.length == 0)
      return;
      console.log(selectedProducts);
      for (let i = 0; i < selectedProducts.length; i++) {
        var item = selectedProducts[i];
        if(checkProductExits(item)){
          continue;
        }
        const cloneItem = Object.assign({}, item);
        cloneItem.PRDCQTTY = 1;
        cloneItem.SALEPRCE = cloneItem.PRCESALE;
        cloneItem.DISCRATE = 0;
        cloneItem.DCPRAMNT = 0;
        cloneItem.inEdit = true;
        cloneItem.MNEYAMNT = cloneItem.PRDCQTTY * cloneItem.SALEPRCE;
       setOrderDetails((prevState) => [...prevState, cloneItem]);
      }
    }
    const checkProductExits = (item) =>{
      var prd = orderDetails.find((element) => element.PRDCCODE == item.PRDCCODE);
      return prd != null
    }
    useEffect(() => {
      if (paymentCyclesSelected && paymentCyclesSelected.ITEMNAME) {
        shortValuePayment(paymentCyclesSelected.ITEMNAME);
      }
    }, [paymentMethodSelected])
    
    useEffect(() => {
      var sumProductQuantity = 0;
      var sumProductMoney = 0;
      orderDetails.map((item) => {
        sumProductQuantity += item.PRDCQTTY;
        sumProductMoney += item.MNEYAMNT;
      });
      setsumQuatity(sumProductQuantity);
      setsumMoney(sumProductMoney);
    }, [orderDetails]);
    useEffect(() => {
      var rdtn = (sumMoney * rdtnRate) / 100;
      var vatCram = ((sumMoney - rdtn) * vatRate) / 100;
      setrdtnCram(rdtn);
      setvatCram(vatCram);
      setsumMoneyCram(sumMoney - rdtn + vatCram);
    }, [sumMoney, rdtnRate, vatRate]);
  return (
    <div className="bg-gray-200 pb-10 min-h-screen">
      {visibleDialog && (
        <Dialog title={"Thêm sản phẩm"} onClose={onDialogToggle}>
          <div className="w-[400px] h-[300px]">
            <Multiselect
              className="h-full"
              options={products}
              displayValue="PRDCNAME"
              showCheckbox
              placeholder="Chọn sản phẩm"
              emptyRecordMsg="Không có dữ liệu"
              showArrow
              hideSelectedList
              onSelect={onSelect}
            />
          </div>
          <div className="flex justify-end">
            <button
              className="bg-primary text-sm text-white rounded-md pr-3 pl-3 pt-1 pb-1"
              onClick={onDoneSelectProduct}
            >
              Thêm
            </button>
            <button
              className="bg-red-500 text-sm text-white rounded-md pr-3 pl-3 pt-1 pb-1 ml-3"
              onClick={onDialogToggle}
            >
              Hủy
            </button>
          </div>
        </Dialog>
      )}
      <h3 className="text-xl pl-5 pt-5">Thêm đơn hàng mới</h3>
      <div className="flex md:flex-row flex-col">
        <div className="w-full md:flex-row flex-col">
          <div className="m-5 p-5 bg-white border-solid border-[1px] border-borderBase hover:border-blue-700">
            <h4 className="text-xl">Đặt hàng #558 chi tiết</h4>
            <div className="flex justify-between md:flex-row flex-col">
              <div className="w-full p-5">
                <div>Chung</div>
                <Label className="text-sm" style={{ color: "grey" }}>
                  Ngày tạo
                </Label>
                <DatePicker
                  format="dd/MM/yyyy"
                  weekNumber={true}
                  defaultValue={currentDate}
                />
                <Label className="text-sm" style={{ color: "grey" }}>
                  Khách hàng
                </Label>
                <ComboBox
                  style={{}}
                  data={customersFilter}
                  value={customer}
                  onChange={(e) => setCustomer(e.value)}
                  textField="Display"
                  dataItemKey="CUSTCODE"
                  filterable={true}
                  onFilterChange={customerFilterChange}
                />
                <div className="flex">
                  <FieldWrapper className="w-full pr-2">
                    <Label className="text-sm" style={{ color: "grey" }}>
                      Mã khách hàng
                    </Label>
                    <div className={"k-form-field-wrap"}>
                      <Input
                        id="CUSTCODE"
                        name="CUSTCODE"
                        style={{ borderColor: "grey" }}
                        value={customer.CUSTCODE}
                        type="text"
                        disabled
                      />
                    </div>
                  </FieldWrapper>
                  <FieldWrapper className="w-full pl-2">
                    <Label className="text-sm" style={{ color: "grey" }}>
                      Mã số thuế
                    </Label>
                    <div className={"k-form-field-wrap"}>
                      <Input
                        id="TAX_CODE"
                        name="TAX_CODE"
                        style={{ borderColor: "grey" }}
                        value={customer.VAT_CODE}
                        type="text"
                      />
                    </div>
                  </FieldWrapper>
                </div>
                <div className="w-full">
                  <FieldWrapper>
                    <Label className="text-sm" style={{ color: "grey" }}>
                      Địa chỉ
                    </Label>
                    <TextArea rows={2} value={customer.CUSTADDR} disabled />
                  </FieldWrapper>
                </div>
              </div>
              <div className="w-full p-5">
                <div className="flex">
                  <p className="w-full">Thanh toán</p>
                  <AiOutlineEdit
                    onClick={() => {
                      setDetailPaymentVisible(!detailPaymentVisible);
                    }}
                  />
                </div>
                <div>
                  <div>
                    <p className="text-sm text-gray-500 font-semibold">
                      Thông tin thanh toán:
                    </p>
                    {detailPaymentVisible ? (
                      <div id="payment-detail">
                        <div className="pr-2 pl-2">
                          <FieldEditCombobox
                            title="Phương thức thanh toán"
                            id={"paymentMethods"}
                            data={paymentMethods}
                            defaultValue={paymentMethodSelected}
                            textField="ITEMNAME"
                            dataItemKey="ITEMCODE"
                            onComboboxChange={(e) =>
                              setPaymentMethodSelected(e.target.value)
                            }
                          />
                        </div>
                        <div className="flex" hidden>
                          <FieldWrapper className="w-full pr-2 pl-2">
                            <Label
                              className="text-sm"
                              style={{ color: "grey" }}
                            >
                              Số
                            </Label>
                            <div className={"k-form-field-wrap"}>
                              <Input
                                id="PYMNNUMB"
                                name="PYMNNUMB"
                                style={{ borderColor: "grey" }}
                                type="number"
                                value={0}
                              />
                            </div>
                          </FieldWrapper>
                          <div className="pr-2 pl-2 w-full">
                            <FieldEditCombobox
                              title="Kỳ thanh toán"
                              id={"PYMNPERD"}
                              data={paymentCycles}
                              defaultValue={paymentCycles[0]}
                              textField="ITEMNAME"
                              dataItemKey="ITEMCODE"
                              onComboboxChange={(e) =>
                                setpaymentCyclesSelected(e.target.value)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">Chưa thiết lặp</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="w-full p-5">
                <div className="flex">
                  <p className="w-full">Giao hàng</p>
                  <AiOutlineEdit
                    onClick={() =>
                      setDetailDeliveryVisible(!detailDeliveryVisible)
                    }
                  />
                </div>
                <div>
                  <div>
                    <p className="text-sm text-gray-500 font-semibold">
                      Địa chỉ:
                    </p>
                    {detailDeliveryVisible ? (
                      <div id="delivery-detail">
                        <div className="flex">
                          <div className="w-full pr-2 pl-2">
                            <FieldEditCombobox
                              title="Phương thức giao hàng"
                              id={"DLVRMTHD"}
                              data={deliveryMethods}
                              defaultValue={deliveryMethodsSelected}
                              textField="ITEMNAME"
                              dataItemKey="ITEMCODE"
                              onComboboxChange={(e) =>
                                setDeliveryMethodsSelected(e.target.value)
                              }
                            />
                          </div>
                          <div className={"w-full pr-2 pl-2"}>
                            <FieldEditCombobox
                              title="Phương thức vận chuyển"
                              id={"DLVRTYPE"}
                              data={deliveryTypes}
                              defaultValue={deliveryTypesSelected}
                              textField="ITEMNAME"
                              dataItemKey="ITEMCODE"
                              onComboboxChange={(e) =>
                                setdeliveryTypesSelected(e.target.value)
                              }
                            />
                          </div>
                        </div>
                        <div className="flex">
                          <div className={"w-full pr-2 pl-2"}>
                            <FieldEditCombobox
                              title="Giờ giao hàng"
                              id={"DLVRHOUR"}
                              data={deliveryTimes}
                              defaultValue={deliveryTimesSelected}
                              textField="ITEMNAME"
                              dataItemKey="ITEMCODE"
                              onComboboxChange={(e) =>
                                setDeliveryTimesSelected(e.target.value)
                              }
                            />
                          </div>
                          <div className="w-full pr-2 pl-2">
                            <Label className="text-sm text-gray-500">
                              Ngày giao hàng
                            </Label>
                            <DatePicker
                              format="dd/MM/yyyy"
                              weekNumber={true}
                              defaultValue={currentDate}
                            />
                          </div>
                        </div>
                        <div className="flex">
                          <FieldWrapper className="w-full pr-2 pl-2">
                            <Label
                              className="text-sm"
                              style={{ color: "grey" }}
                            >
                              Người nhận hàng
                            </Label>
                            <div className={"k-form-field-wrap"}>
                              <Input
                                id="RCVREMPL"
                                name="RCVREMPL"
                                style={{ borderColor: "grey" }}
                                type="text"
                              />
                            </div>
                          </FieldWrapper>
                          <FieldWrapper className="w-full pr-2 pl-2">
                            <Label
                              className="text-sm"
                              style={{ color: "grey" }}
                            >
                              Số điện thoại nhận hàng
                            </Label>
                            <div className={"k-form-field-wrap"}>
                              <Input
                                id="RCVR_TEL"
                                name="RCVR_TEL"
                                style={{ borderColor: "grey" }}
                                type="text"
                              />
                            </div>
                          </FieldWrapper>
                        </div>
                        <FieldWrapper className="w-full pr-2 pl-2">
                          <Label className="text-sm" style={{ color: "grey" }}>
                            Nơi giao
                          </Label>
                          <div className={"k-form-field-wrap"}>
                            <Input
                              id="DLVRPLCE"
                              name="DLVRPLCE"
                              style={{ borderColor: "grey" }}
                              type="text"
                            />
                          </div>
                        </FieldWrapper>
                        <FieldWrapper className="w-full pr-2 pl-2">
                          <Label className="text-sm" style={{ color: "grey" }}>
                            Địa chỉ giao
                          </Label>
                          <div className={"k-form-field-wrap"}>
                            <Input
                              id="DLVRPLCE"
                              name="DLVRPLCE"
                              style={{ borderColor: "grey" }}
                              type="text"
                            />
                          </div>
                        </FieldWrapper>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">Chưa thiết lặp</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5 bg-white m-5 border-solid border-[1px] border-borderBase hover:border-blue-700">
            <Grid
              style={{
                height: "300px",
              }}
              data={orderDetails}
              dataItemKey={"PRDCCODE"}
              rowHeight={50}
              onItemChange={itemChange}
              editField={EDIT_FIELD}
            >
              <GridNoRecords>
                <p className="text-red-700 italic"> Không có dữ liệu</p>
              </GridNoRecords>
              <GridColumn
                headerCell={OrderDetailHeader}
                field="PRDCCODE"
                title="Mã"
                width="100px"
                editable={false}
              />
              <GridColumn
                headerCell={OrderDetailHeader}
                field="PRDCNAME"
                title="Tên"
                width="200px"
                editable={false}
              />
              <GridColumn
                headerCell={OrderDetailHeader}
                field="sortSale"
                title="Phân loại"
                width="150px"
                cell={DropdowCell}
              />
              <GridColumn
                headerCell={OrderDetailHeader}
                field="PRDCQTTY"
                title="Số lượng"
                editor="numeric"
              />
              <GridColumn
                headerCell={OrderDetailHeader}
                field="QUOMNAME"
                title="ĐVT"
                editable={false}
                width="70px"
              />
              <GridColumn
                headerCell={OrderDetailHeader}
                field="SALEPRCE"
                title="Giá bán"
                editor="numeric"
              />
              <GridColumn
                headerCell={OrderDetailHeader}
                field="DISCRATE"
                title="Chiết khấu"
                editor="numeric"
              />
              <GridColumn
                headerCell={OrderDetailHeader}
                field="DCPRAMNT"
                title="Tiền chiết khấu"
                editor="numeric"
              />
              <GridColumn
                headerCell={OrderDetailHeader}
                field="MNEYAMNT"
                title="Thành tiền"
                editable={false}
                editor="numeric"
                format="{0:n}"
              />
              <GridColumn cell={CommandCell} width="100px" />
            </Grid>
            <div className="h-[1px] bg-borderBase"></div>
            <div className="p-3">
              <button
                className="outline outline-offset-2 outline-1 hover:outline-2 rounded-sm pr-2 pl-2 text-sm"
                onClick={() => setVisibleDialog(true)}
              >
                Thêm sản phẩm
              </button>
              <div></div>
            </div>
          </div>
        </div>
        <div className="basis-1/6 mt-5 ">
          <div className="bg-white border-solid border-[1px] border-borderBase hover:border-blue-700">
            <p className="text-sm text-gray-500 font-semibold w-full p-3">
              Tác vụ đơn hàng
            </p>
            <div className="h-[1px] bg-borderBase"></div>
            <div className="p-3 flex items-center">
              <div className="w-[150px]">
                <DropDownList
                  data={mainFucntions}
                  textField="text"
                  dataItemKey="id"
                  defaultValue={mainFunction}
                  onChange={(e) => setMainFunction(e.target.value)}
                />
              </div>
              <button className=" bg-primary text-white pt-1 pb-1 pl-3 pr-3 rounded-md text-sm ml-3 w-[100px]">
                Thực hiện
              </button>
            </div>
          </div>
          <div className="bg-white border-solid border-[1px] border-borderBase hover:border-blue-700 mt-5">
            <p className="text-sm text-gray-500 font-semibold w-full p-3">
              Chi phí
            </p>
            <div className="h-[1px] bg-borderBase"></div>
            <div className="p-3">
              <div className="flex items-center mb-2">
                <p className="text-sm text-gray-500 w-full">Tổng số lượng:</p>
                <NumericTextBox
                  id="SMPRQTTY"
                  name="SMPRQTTY"
                  style={{ borderColor: "grey", textAlign: "right" }}
                  value={sumQuatity}
                  type="number"
                  disabled
                />
              </div>
              <div className="flex items-center mb-2">
                <p className="text-sm text-gray-500 w-full">% chiết khấu:</p>
                <NumericTextBox
                  id="RDTNRATE"
                  name="RDTNRATE"
                  style={{ borderColor: "grey", textAlign: "right" }}
                  type="number"
                  onChange={(e) => setrdtnRate(e.target.value)}
                />
              </div>
              <div className="flex items-center mb-2">
                <p className="text-sm text-gray-500 w-full">Tiền chiết khấu:</p>
                <NumericTextBox
                  id="RDTNCRAM"
                  name="RDTNCRAM"
                  style={{ borderColor: "grey", textAlign: "right" }}
                  value={rdtnCram}
                  type="number"
                  disabled
                />
              </div>
              <div className="flex items-center mb-2">
                <p className="text-sm text-gray-500 w-full">% hoa hồng:</p>
                <NumericTextBox
                  id="CUSTCODE"
                  name="CUSTCODE"
                  style={{ borderColor: "grey", textAlign: "right" }}
                  type="number"
                />
              </div>
              <div className="flex items-center mb-2">
                <p className="text-sm text-gray-500 w-full">Thuế xuất:</p>
                <NumericTextBox
                  id="CSCMRATE"
                  name="CSCMRATE"
                  style={{ borderColor: "grey", textAlign: "right" }}
                  type="number"
                  onChange={(e) => setvatRate(e.target.value)}
                />
              </div>
              <div className="flex items-center mb-2">
                <p className="text-sm text-gray-500 w-full">Tiền thuế:</p>
                <NumericTextBox
                  id="VAT_CRAM"
                  name="VAT_CRAM"
                  style={{ borderColor: "grey", textAlign: "right" }}
                  value={vatCram}
                  type="number"
                  disabled
                />
              </div>
              <div className="flex items-center mb-2">
                <p className="text-sm text-gray-500 w-full">Tổng tiền:</p>
                <NumericTextBox
                  id="SUM_CRAM"
                  name="SUM_CRAM"
                  style={{ borderColor: "grey", textAlign: "right" }}
                  value={sumMoneyCram}
                  type="number"
                  disabled
                />
              </div>
            </div>
          </div>
          <div className="bg-white border-solid border-[1px] border-borderBase hover:border-blue-700 mt-5">
            <p className="text-sm text-gray-500 font-semibold w-full p-3">
              Ghi chú đơn hàng
            </p>
            <div className="h-[1px] bg-borderBase"></div>
            <div className="p-3">
              <p className="text-sm text-gray-500">Thêm ghi chú</p>
              <TextArea rows={3} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
