import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  Icon,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Paper,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Tabs,
  Tab,
  Box,
  Typography,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import {
  Add,
  Block,
  Save,
  Search,
  Description,
  GetApp,
} from "@material-ui/icons";
import { ConfirmationDialog } from "egret";
import MaterialTable from "material-table";
import React, { Component } from "react";
import Draggable from "react-draggable";
import { useTranslation } from "react-i18next";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../styles/views/_dengueLocation.scss";
import {
  getById,
  getByPageByParentId,
  searchByDto,
} from "../AdministrativeUnit/AdministrativeUnitService";
import ValidatePicker from "../Component/ValidateSelect/ValidatePicker";
import AsynchronousAutocomplete from "../utilities/AsynchronousAutocomplete";
import DengueLocationItemDialog from "./DengueLocationItemDialog";
import {
  addDengueLocation,
  addDengueLocationItem,
  deleteDengueLocationItem,
  getAllDengueLocationItem,
  updateDengueLocation,
  exportExcelVector,
} from "./DengueLocationServices";
import PatientDialog from "./PatientDialog";
import {
  addPatient,
  deletePatient,
  searchByPagePatient,
  exportExcelPatient,
} from "./PatientServices";
import PropTypes from "prop-types";
import ImportExcel from "../Component/ImportExcel/SingleExcelFileUpload";
import { saveAs } from "file-saver";

toast.configure({
  autoClose: 2000,
  draggable: false,
  limit: 3,
});

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

const LightTooltip = withStyles((theme) => ({
  arrow: {
    color: theme.palette.common.black,
  },
  tooltip: {
    backgroundColor: theme.palette.common.black,
  },
}))(Tooltip);

function MaterialButton(props) {
  const { t } = useTranslation();
  const item = props.item;
  return (
    <div className="none_wrap">
      <LightTooltip
        title={t("general.editIcon")}
        placement="bottom"
        enterDelay={300}
        leaveDelay={200}
        arrow
      >
        <IconButton size="small" onClick={() => props.onSelect(item, 0)}>
          <Icon fontSize="small" color="primary">
            edit
          </Icon>
        </IconButton>
      </LightTooltip>
      <LightTooltip
        title={t("general.deleteIcon")}
        placement="bottom"
        enterDelay={300}
        leaveDelay={200}
        arrow
      >
        <IconButton size="small" onClick={() => props.onSelect(item, 1)}>
          <Icon fontSize="small" color="error">
            delete
          </Icon>
        </IconButton>
      </LightTooltip>
    </div>
  );
}

function TableHeader() {
  const { t } = useTranslation();
  return (
    <TableHead
      style={{
        backgroundColor: "#2a80c8",
        overflow: "auto",
      }}
    >
      <TableRow>
        <TableCell
          rowSpan={2}
          className="border t-center"
          width="80px"
          style={{ minWidth: "80px", color: "white" }}
        >
          {t("dengueLocation.operation")}
        </TableCell>
        <TableCell
          rowSpan={2}
          width="100px"
          className="border t-center"
          style={{ minWidth: "100px", color: "white" }}
        >
          {t("general.code")}
        </TableCell>
        <TableCell
          rowSpan={2}
          width="200px"
          style={{ minWidth: "200px", color: "white" }}
          className="border t-center"
        >
          {t("dengueLocation.householderName")}
        </TableCell>
        <TableCell
          rowSpan={2}
          width="300px"
          style={{ minWidth: "300px", color: "white" }}
          className="border t-center"
        >
          {t("dengueLocation.address")}
        </TableCell>
        <TableCell
          rowSpan={2}
          width="200px"
          style={{ minWidth: "200px", color: "white" }}
          className="border t-center"
        >
          {t("dengueLocation.coordinates")}
        </TableCell>
        <TableCell
          colSpan={2}
          className="border t-center"
          width="150px"
          style={{ minWidth: "150px", color: "white" }}
        >
          {t("dengueLocation.mosquitoSpeciesCaught")}
        </TableCell>
        <TableCell
          colSpan={2}
          className="border t-center"
          width="150px"
          style={{ minWidth: "150px", color: "white" }}
        >
          {t("dengueLocation.numberWithLarva")}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          className="border t-center"
          width="100px"
          style={{ minWidth: "100px", color: "white" }}
        >
          Aedes aegypti
        </TableCell>
        <TableCell
          className="border t-center"
          width="150px"
          style={{ minWidth: "150px", color: "white" }}
        >
          Aedes albopictus
        </TableCell>
        <TableCell
          className="border t-center"
          width="100px"
          style={{ minWidth: "100px", color: "white" }}
        >
          Aedes aegypti
        </TableCell>
        <TableCell
          className="border t-center"
          width="150px"
          style={{ minWidth: "150px", color: "white" }}
        >
          Aedes albopictus
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

function TablePatientHeader() {
  const { t } = useTranslation();

  return (
    <TableHead
      style={{
        backgroundColor: "#2a80c8",
        overflow: "auto",
      }}
    >
      <TableRow>
        <TableCell
          rowSpan={2}
          className="border t-center"
          width="80px"
          style={{ minWidth: "80px", color: "white" }}
        >
          {t("dengueLocation.operation")}
        </TableCell>
        <TableCell
          rowSpan={2}
          width="100px"
          className="border t-center"
          style={{ minWidth: "100px", color: "white" }}
        >
          {t("general.code")}
        </TableCell>
        <TableCell
          rowSpan={2}
          width="200px"
          style={{ minWidth: "200px", color: "white" }}
          className="border t-center"
        >
          {t("dengueLocation.patientName")}
        </TableCell>
        <TableCell
          rowSpan={2}
          width="300px"
          style={{ minWidth: "300px", color: "white" }}
          className="border t-center"
        >
          {t("dengueLocation.address")}
        </TableCell>
        <TableCell
          rowSpan={2}
          width="200px"
          style={{ minWidth: "200px", color: "white" }}
          className="border t-center"
        >
          {t("dengueLocation.coordinates")}
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

function requiredLabel(title) {
  return (
    <span>
      {title} <span style={{ color: "red", fontWeight: "bold" }}>*</span>
    </span>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`wrapped-tabpanel-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography component="span">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

class DengueLocationDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      dengueLocation: {
        province: null,
        district: null,
        ward: null,
        address: "",
        investigationDate: Date.now(),
        investigationPerson: "",
      },
      shouldOpenDengueItemDialog: false,
      shouldOpenConfirmationDialog: false,
      shouldOpenConfirmDelPatient: false,
      itemEdit: {},
      itemId: "",
      itemList: [],
      provinceOfResidenceSearch: {
        pageSize: 999,
        pageIndex: 0,
        isGetAllCity: true,
        level: 3,
      },
      districtOfResidenceSearch: {},
      wardOfResidenceSearch: {},
      shouldOpenPatientDialog: false,
      patientList: [],
      vectorSearch: "",
      patientSearch: "",
      tabActive: "one",
      openImportExcelDialog: false,
      excelURL: "",
    };
  }

  componentDidMount() {
    if (this.props.item) {
      this.setState({
        ...this.state,
        dengueLocation: this.props.item,
      });
      console.log(this.props.item);
      this.getAdministrativeUnit();
      this.updateTableData();
      this.updatePatientData();
    }
    ValidatorForm.addValidationRule("isValidDate", (value) => {
      if (value !== null) {
        const b = new Date(value).setHours(0, 0, 0, 0);
        const a = new Date().setHours(0, 0, 0, 0);
        return a >= b;
      }
      return true;
    });
  }

  getAdministrativeUnit = () => {
    const { administrativeUnit } = this.props.item;
    if (administrativeUnit) {
      getById(administrativeUnit.id).then(({ data }) => {
        this.setState({
          dengueLocation: {
            ...this.state.dengueLocation,
            ward: administrativeUnit,
            district: data.parent,
            province: data.parent.parent,
          },
        });
      });
    }
  };

  handleSelectAdministrativeUnit = (value, source) => {
    if ("province" === source) {
      this.setState({
        dengueLocation: {
          ...this.state.dengueLocation,
          province: value,
        },
      });

      if (value != null) {
        this.setState({
          districtOfResidenceSearch: {
            pageSize: 999,
            pageIndex: 0,
            parentId: value.id,
          },
          district: null,
          ward: null,
        });
      } else {
        this.setState({ district: null });
        this.setState({ ward: null });
        this.setState({
          districtOfResidenceSearch: {
            pageSize: 999,
            pageIndex: 0,
          },
        });
        this.setState({
          wardOfResidenceSearch: {
            pageSize: 999,
            pageIndex: 0,
          },
        });
      }
    }
    if ("district" === source) {
      this.setState({
        dengueLocation: {
          ...this.state.dengueLocation,
          district: value,
        },
      });
      if (value != null) {
        this.setState({
          wardOfResidenceSearch: {
            pageSize: 999,
            pageIndex: 0,
            parentId: value.id,
          },
          ward: null,
        });
      } else {
        this.setState({ ward: null });
        this.setState({
          wardOfResidenceSearch: {
            pageSize: 999,
            pageIndex: 0,
          },
        });
      }
    }
    if ("ward" === source) {
      this.setState({
        dengueLocation: {
          ...this.state.dengueLocation,
          ward: value,
        },
      });
    }
  };

  getProvinceListData = () => {
    const searchOption = {
      pageSize: 999,
      pageIndex: 0,
    };
    searchByDto(searchOption).then((data) => {
      this.setState({
        provinceList: data.data.content,
      });
    });
  };

  handleFormSubmit = () => {
    const { t } = this.props;
    const { dengueLocation } = this.state;
    if (this.props.item) {
      updateDengueLocation(dengueLocation)
        .then(() => {
          toast.success(t("general.updateSuccess"));
          this.props.handleOKEditClose();
        })
        .catch(() => {
          toast.error(t("general.error"));
          this.props.handleClose();
        });
    } else {
      console.log("dengueLocation: ", dengueLocation);
      if (
        dengueLocation.province === null ||
        dengueLocation.district === null ||
        dengueLocation.ward === null ||
        dengueLocation.investigationPerson === ""
      ) {
        toast.error("Chưa nhập đủ thông tin chung!");
      } else {
        addDengueLocation(dengueLocation)
          .then((data) => data.data)
          .then((data) => {
            console.log("data", data);

            this.state.itemList.forEach((item) => {
              const newItem = {
                ...item,
                dengueLocation: data,
              };
              addDengueLocationItem(newItem);
            });
            this.state.patientList.forEach((item) => {
              const newItem = {
                ...item,
                dengueLocation: data,
              };
              addPatient(newItem);
            });
          })
          .then(() => {
            toast.success(t("general.addSuccess"));
            this.props.handleOKEditClose();
          })
          .catch(() => {
            toast.error(t("general.error"));
            this.props.handleClose();
          });
      }
    }
  };

  handleDateChange = (date) => {
    this.setState({
      dengueLocation: {
        ...this.state.dengueLocation,
        investigationDate: date,
      },
    });
  };

  handleItemChange = (e) => {
    this.setState({
      dengueLocation: {
        ...this.state.dengueLocation,
        [e.target.name]: e.target.value,
      },
    });
  };

  handleDialogClose = () => {
    this.setState({
      shouldOpenDengueItemDialog: false,
      shouldOpenConfirmationDialog: false,
      shouldOpenPatientDialog: false,
      shouldOpenConfirmDelPatient: false,
    });
  };

  handleOKVectorDialog = () => {
    this.setState(
      {
        shouldOpenDengueItemDialog: false,
      },
      () => this.updateTableData()
    );
  };

  handleOKPatientDialog = () => {
    this.setState(
      {
        shouldOpenPatientDialog: false,
      },
      () => this.updatePatientData()
    );
  };

  handleOpenDengueItemDialog = () => {
    this.setState({
      ...this.state,
      shouldOpenDengueItemDialog: true,
    });
  };

  // Table Item
  updateListData = (itemData, source) => {
    if (source === "vector") {
      const index = this.state.itemList.findIndex(
        (i) => i.tableData.id === itemData?.tableData?.id
      );
      let newList = [...this.state.itemList];

      if (index !== -1) {
        newList[index] = itemData;
        this.setState({
          itemList: newList,
        });
      } else {
        this.setState({
          itemList: [...this.state.itemList, itemData],
        });
      }
    } else {
      const index = this.state.patientList.findIndex(
        (i) => i.tableData.id === itemData?.tableData?.id
      );
      let newList = [...this.state.patientList];

      if (index !== -1) {
        newList[index] = itemData;
        this.setState({
          patientList: newList,
        });
      } else {
        this.setState({
          patientList: [...this.state.patientList, itemData],
        });
      }
    }
  };

  updateTableData = () => {
    let searchObject = {};
    searchObject.dengueLocation = this.props.item;
    searchObject.pageIndex = 1;
    searchObject.pageSize = 10000;
    getAllDengueLocationItem(searchObject).then(({ data }) => {
      this.setState({
        itemList: data.content,
      });
    });
  };

  updatePatientData = () => {
    let searchObject = {};
    searchObject.dengueLocation = this.props.item;
    searchObject.pageIndex = 1;
    searchObject.pageSize = 10000;
    searchByPagePatient(searchObject).then(({ data }) => {
      this.setState({
        patientList: data.content,
      });
    });
  };

  handleSearchInputChange = (e, source) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
    if (e.target.value === "") {
      this.search(source);
    }
  };

  handleKeyDownEnterSearch = (e, source) => {
    e.stopPropagation();
    if (e.key === "Enter") {
      this.search(source);
      e.preventDefault();
    }
  };

  search = (source) => {
    if (source === "vector") {
      let searchObject = {};
      searchObject.dengueLocation = this.props.item;
      searchObject.keyword = this.state.vectorSearch;
      searchObject.pageIndex = 1;
      searchObject.pageSize = 1000;
      getAllDengueLocationItem(searchObject).then(({ data }) => {
        this.setState({
          itemList: data.content,
        });
      });
    } else {
      let searchObject = {};
      searchObject.dengueLocation = this.props.item;
      searchObject.text = this.state.patientSearch;
      searchObject.pageIndex = 1;
      searchObject.pageSize = 1000;
      searchByPagePatient(searchObject).then(({ data }) => {
        this.setState({
          patientList: data.content,
        });
      });
    }
  };

  handleChangeRowsPerPage = (event) => {
    this.setState(
      {
        rowsPerPage: parseInt(event.target.value, 10),
        page: 1,
      },
      () => this.updateTableData()
    );
  };

  handleChangePage = (event, newPage) => {
    this.setState(
      {
        page: newPage,
      },
      () => this.updateTableData()
    );
  };

  handleEditItem = (item, source) => {
    if (source === "vector") {
      this.setState({
        ...this.state,
        itemEdit: item,
        shouldOpenDengueItemDialog: true,
      });
    } else {
      this.setState({
        ...this.state,
        itemEdit: item,
        shouldOpenPatientDialog: true,
      });
    }
  };

  handleDeleteVector = (id, rowId) => {
    if (id) {
      this.setState({
        itemId: id,
        shouldOpenConfirmationDialog: true,
      });
    } else {
      const a = [...this.state.itemList];
      const b = a.findIndex((item) => item.tableData.id === rowId);
      a.splice(b, 1);
      this.setState({
        itemList: a,
      });
    }
  };

  handleConfirmationResponse = () => {
    let { t } = this.props;

    deleteDengueLocationItem(this.state.itemId)
      .then(() => {
        toast.success(t("general.deleteSuccess"));
        this.updateTableData();
        this.handleDialogClose();
      })
      .catch(() => toast.error(t("general.error")));
  };

  handleDeletePatient = (id, rowId) => {
    if (id) {
      this.setState({
        itemId: id,
        shouldOpenConfirmDelPatient: true,
      });
    } else {
      const a = [...this.state.patientList];
      const b = a.findIndex((item) => item.tableData.id === rowId);
      a.splice(b, 1);
      this.setState({
        patientList: a,
      });
    }
  };

  handleConfirmDeletePatient = () => {
    let { t } = this.props;

    deletePatient(this.state.itemId)
      .then(() => {
        toast.success(t("general.deleteSuccess"));
        this.updatePatientData();
        this.handleDialogClose();
      })
      .catch(() => toast.error(t("general.error")));
  };

  handleTabChange = (event, newValue) => {
    console.log(newValue);
    this.setState({
      tabActive: newValue,
    });
  };

  onOpenImportExcel = (source) => {
    if (source === "vector") {
      this.setState({
        excelURL: "/api/dengue-location-item/importExcel",
        openImportExcelDialog: true,
      });
    } else {
      this.setState({
        excelURL: "/api/patientInformation/importExcel",
        openImportExcelDialog: true,
      });
    }
  };

  handleCloseImport = () => {
    this.setState({
      openImportExcelDialog: false,
    });
  };

  onHandleDataImportExcel = (data) => {
    if (!this.props.item) {
      if (this.state.excelURL.includes("dengue")) {
        this.setState({
          itemList: [...this.state.itemList, ...data],
        });
      } else {
        this.setState({
          patientList: [...this.state.patientList, ...data],
        });
      }
    } else {
      if (this.state.excelURL.includes("dengue")) {
        let itemList = this.state.itemList;
        let itemListNew = [...data];
        itemListNew.forEach((element) => {
          itemList.push(element);
        });
        itemList.forEach((item) => {
          const newItem = {
            ...item,
            dengueLocation: this.props.item,
          };
          addDengueLocationItem(newItem);
        });
        this.setState({ itemList });
      } else {
        this.setState({
          patientList: [...this.state.patientList, ...data],
        });

        let patientList = this.state.patientList;
        let patientListNew = [...data];
        patientListNew.forEach((element) => {
          patientList.push(element);
        });
        patientList.forEach((item) => {
          const newItem = {
            ...item,
            dengueLocation: this.props.item,
          };
          addPatient(newItem);
        });

        this.setState({ patientList });
      }
    }
  };

  onExportExcel = (source) => {
    if (source === "vector") {
      exportExcelVector()
        .then((res) => {
          console.log(res);
          //toast.info(this.props.t("general.successExport"));
          let blob = new Blob([res.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
          });
          saveAs(blob, "Danh sách vector truyền bệnh.xlsx");
        })
        .catch(() => {
          // console.log(err);
        });
    } else {
      exportExcelPatient()
        .then((res) => {
          console.log(res);
          //toast.info(this.props.t("general.successExport"));
          let blob = new Blob([res.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
          });
          saveAs(blob, "Danh sách ca bệnh.xlsx");
        })
        .catch(() => {
          // console.log(err);
        });
    }
  };

  render() {
    const { t, open, handleClose } = this.props;
    const {
      address,
      investigationDate,
      investigationPerson,
      province,
      district,
      ward,
    } = this.state.dengueLocation;
    const {
      shouldOpenDengueItemDialog,
      itemEdit,
      provinceOfResidenceSearch,
      districtOfResidenceSearch,
      wardOfResidenceSearch,
      shouldOpenConfirmationDialog,
      shouldOpenPatientDialog,
      itemList,
      patientList,
      shouldOpenConfirmDelPatient,
      tabActive,
      openImportExcelDialog,
      excelURL,
    } = this.state;

    let columns = [
      {
        title: t("general.action"),
        field: "custom",
        align: "center",
        width: "60",
        headerStyle: {
          minWidth: "60px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "60px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "center",
        },
        render: (rowData) => (
          <MaterialButton
            item={rowData}
            onSelect={(rowData, method) => {
              if (method === 0) {
                this.handleEditItem(rowData, "vector");
              } else if (method === 1) {
                this.handleDeleteVector(rowData.id, rowData.tableData.id);
              } else {
                alert("Call Selected Here:" + rowData.id);
              }
            }}
          />
        ),
      },
      {
        title: t("general.code"),
        field: "code",
        align: "center",
        width: "150",
        headerStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "center",
        },
      },
      {
        title: t("dengueLocation.householderName"),
        field: "familyName",
        align: "left",
        width: "200",
        headerStyle: {
          minWidth: "200px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "200px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "center",
        },
      },
      {
        title: t("dengueLocation.address"),
        field: "address",
        align: "left",
        width: "200",
        headerStyle: {
          minWidth: "200px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "200px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "center",
        },
      },
      {
        title: t("dengueLocation.coordinates"),
        field: "custom",
        align: "left",
        width: "150",
        headerStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "center",
        },
        render: (rowData) => (
          <>
            {rowData.latitude}, {rowData.longitude}
          </>
        ),
      },
      {
        title: "",
        field: "aedesAegyptiQty",
        align: "left",
        width: "100",
        headerStyle: {
          minWidth: "100px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "100px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "center",
        },
      },
      {
        title: "",
        field: "aedesAlbopictusQty",
        align: "left",
        width: "100",
        headerStyle: {
          minWidth: "100px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "100px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "center",
        },
      },
      {
        title: "",
        field: "aedesAegyptiLarvae",
        align: "left",
        width: "100",
        headerStyle: {
          minWidth: "100px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "100px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "center",
        },
      },
      {
        title: "",
        field: "aedesAlbopictusLarvae",
        align: "left",
        width: "100",
        headerStyle: {
          minWidth: "100px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "100px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "center",
        },
      },
    ];

    let columnsPatient = [
      {
        title: t("dengueLocation.operation"),
        field: "custom",
        align: "left",
        width: "100",
        headerStyle: {
          minWidth: "100px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "100px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "center",
        },
        render: (rowData) => (
          <MaterialButton
            item={rowData}
            onSelect={(rowData, method) => {
              if (method === 0) {
                this.handleEditItem(rowData, "patient");
              } else if (method === 1) {
                this.handleDeletePatient(rowData.id, rowData.tableData.id);
              } else {
                alert("Call Selected Here:" + rowData.id);
              }
            }}
          />
        ),
      },
      {
        title: t("general.code"),
        field: "code",
        align: "left",
        width: "150",
        headerStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "center",
        },
      },
      {
        title: t("dengueLocation.patientName"),
        field: "name",
        align: "left",
        width: "250",
        headerStyle: {
          minWidth: "250px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "250px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "center",
        },
      },
      {
        title: t("dengueLocation.address"),
        field: "address",
        align: "left",
        width: "300",
        headerStyle: {
          minWidth: "300px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "300px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "center",
        },
      },
      {
        title: t("dengueLocation.coordinates"),
        field: "custom",
        align: "left",
        width: "250",
        headerStyle: {
          minWidth: "250px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "250px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "center",
        },
        render: (rowData) => (
          <>
            {rowData.latitude}, {rowData.longitude}
          </>
        ),
      },
    ];

    return (
      <Dialog
        open={open}
        fullWidth
        maxWidth="xl"
        onClose={handleClose}
        PaperComponent={PaperComponent}
      >
        {shouldOpenDengueItemDialog && (
          <DengueLocationItemDialog
            open={shouldOpenDengueItemDialog}
            handleClose={this.handleDialogClose}
            handleOKDialog={this.handleOKVectorDialog}
            t={t}
            item={itemEdit}
            updateTableData={this.updateListData}
            parent={this.state.dengueLocation}
          />
        )}

        {shouldOpenConfirmationDialog && (
          <ConfirmationDialog
            open={shouldOpenConfirmationDialog}
            onConfirmDialogClose={this.handleDialogClose}
            title={t("general.confirm")}
            text={t("general.deleteConfirm")}
            onYesClick={this.handleConfirmationResponse}
            agree={t("general.agree")}
            cancel={t("general.cancel")}
          />
        )}

        {shouldOpenPatientDialog && (
          <PatientDialog
            open={shouldOpenPatientDialog}
            handleClose={this.handleDialogClose}
            handleOKDialog={this.handleOKPatientDialog}
            t={t}
            item={itemEdit}
            updateTableData={this.updateListData}
            parent={this.state.dengueLocation}
          />
        )}

        {shouldOpenConfirmDelPatient && (
          <ConfirmationDialog
            open={shouldOpenConfirmDelPatient}
            onConfirmDialogClose={this.handleDialogClose}
            title={t("general.confirm")}
            text={t("general.deleteConfirm")}
            onYesClick={this.handleConfirmDeletePatient}
            agree={t("general.agree")}
            cancel={t("general.cancel")}
          />
        )}

        {openImportExcelDialog && (
          <ImportExcel
            t={t}
            handleClose={this.handleCloseImport}
            open={openImportExcelDialog}
            urlPath={excelURL}
            onHandleDataImportExcel={this.onHandleDataImportExcel}
          />
        )}

        <DialogTitle
          style={{ cursor: "move", backgroundColor: "#f9fafb" }}
          id="draggable-dialog-title"
        >
          <strong
            style={{
              fontSize: "14px",
              float: "right",
              position: "absolute",
              top: "10px",
              right: "20px",
            }}
          >
            {t("dengueLocation.form5b")}
          </strong>
          <p
            style={{
              textAlign: "center",
              fontSize: "18px",
              fontWeight: "700",
              textTransform: "uppercase",
            }}
          >
            {t("dengueLocation.dengueHemorrhagicFeverVectorSurveySheet")}
          </p>
        </DialogTitle>

        <ValidatorForm
          ref="form"
          onSubmit={this.handleFormSubmit}
          onError={(err) => console.log(err)}
        >
          <DialogContent>
            <Paper square elevation={3}>
              <Tabs
                value={tabActive}
                indicatorColor="primary"
                textColor="primary"
                onChange={this.handleTabChange}
                centered
              >
                <Tab
                  label={t("dengueLocation.generalInformation")}
                  value="one"
                />
                <Tab label={t("dengueLocation.diseaseVectors")} value="two" />
                <Tab label={t("dengueLocation.cases")} value="three" />
              </Tabs>

              <TabPanel
                value={tabActive}
                index="one"
                style={{ minHeight: "400px" }}
              >
                <Grid
                  container
                  className="flex mt-16"
                  style={{ alignItems: "flex-end" }}
                >
                  <h6 className="mb-0">
                    {t("dengueLocation.investigationPoint")} :
                  </h6>

                  <div className="grid-location ml-24">
                    <AsynchronousAutocomplete
                      label={requiredLabel(t("dengueLocation.province"))}
                      searchFunction={getByPageByParentId}
                      searchObject={provinceOfResidenceSearch}
                      value={province ? province : null}
                      multiple={false}
                      defaultValue={province ? province : null}
                      displayLable={"name"}
                      className="w-100"
                      onSelect={(value) => {
                        this.handleSelectAdministrativeUnit(value, "province");
                      }}
                      size="small"
                      validators={["required"]}
                      errorMessages={t("general.required")}
                    />

                    <AsynchronousAutocomplete
                      label={requiredLabel(t("dengueLocation.district"))}
                      searchFunction={getByPageByParentId}
                      searchObject={districtOfResidenceSearch}
                      value={district ? district : null}
                      multiple={false}
                      defaultValue={district ? district : null}
                      displayLable={"name"}
                      className="w-100"
                      onSelect={(value) => {
                        this.handleSelectAdministrativeUnit(value, "district");
                      }}
                      size="small"
                      validators={["required"]}
                      errorMessages={t("general.required")}
                    />

                    <AsynchronousAutocomplete
                      label={requiredLabel(t("dengueLocation.ward"))}
                      searchFunction={getByPageByParentId}
                      searchObject={wardOfResidenceSearch}
                      value={ward ? ward : null}
                      multiple={false}
                      defaultValue={ward ? ward : null}
                      displayLable={"name"}
                      className="w-100"
                      onSelect={(value) => {
                        this.handleSelectAdministrativeUnit(value, "ward");
                      }}
                      size="small"
                      validators={["required"]}
                      errorMessages={t("general.required")}
                    />

                    <TextValidator
                      label={t("dengueLocation.village")}
                      className="w-100 mt-15"
                      name="address"
                      value={address}
                      onChange={this.handleItemChange}
                    />
                  </div>
                </Grid>

                <Grid container className="mt-16" alignItems="flex-end">
                  <h6 className="mb-0">
                    {t("dengueLocation.investigationDate")} :
                  </h6>

                  <div className="grid-location ml-24">
                    <ValidatePicker
                      disableToolbar
                      autoOk
                      margin="normal"
                      variant="inline"
                      format="dd/MM/yyyy"
                      id="date-picker-inline"
                      value={investigationDate}
                      onChange={this.handleDateChange}
                      className="w-100 mb-0"
                      validators={["isValidDate"]}
                      errorMessages={[t("dengueLocation.error1")]}
                    />
                  </div>
                </Grid>
                <Grid container className="mt-16" alignItems="flex-end">
                  <h6 className="mb-0">
                    {t("dengueLocation.investigationPerson")} :
                  </h6>

                  <div className="grid-location ml-20">
                    <TextValidator
                      label={requiredLabel(
                        t("dengueLocation.investigationPerson")
                      )}
                      name="investigationPerson"
                      className="w-100 mt-15"
                      value={investigationPerson}
                      onChange={this.handleItemChange}
                      validators={["required"]}
                      errorMessages={t("general.required")}
                    />
                  </div>
                </Grid>
              </TabPanel>
              <TabPanel value={tabActive} index="two">
                <Grid
                  container
                  spacing={2}
                  alignItems="flex-end"
                  justifyContent="space-between"
                >
                  <Grid
                    item
                    sm={8}
                    md={9}
                    lg={9}
                    className="flex flex-align-end"
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      style={{ marginTop: "50px" }}
                      startIcon={<Add />}
                      onClick={() => this.handleEditItem(null, "vector")}
                    >
                      {t("dengueLocation.diseaseVectors")}
                    </Button>
                    <Button
                      className="ml-16"
                      startIcon={<Description />}
                      variant="contained"
                      color="secondary"
                      onClick={() => this.onOpenImportExcel("vector")}
                    >
                      {t("general.importExcel")}
                    </Button>
                    <Button
                      className="ml-16"
                      startIcon={<GetApp />}
                      variant="contained"
                      color="secondary"
                      onClick={() => this.onExportExcel("vector")}
                    >
                      {t("general.exportToExcel")}
                    </Button>
                  </Grid>
                  {this.state.dengueLocation.id && (
                    <Grid item md={4} lg={3} xl={3}>
                      <FormControl className="mr-8 w-100" size="small">
                        <InputLabel htmlFor="standard-adornment">
                          {t("EnterSearch")}
                        </InputLabel>
                        <Input
                          id="standard-basic"
                          type="text"
                          name="vectorSearch"
                          value={this.state.vectorSearch}
                          label={t("EnterSearch")}
                          onChange={(e) =>
                            this.handleSearchInputChange(e, "vector")
                          }
                          onKeyDown={(e) =>
                            this.handleKeyDownEnterSearch(e, "vector")
                          }
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                edge="end"
                                onClick={() => this.search("vector")}
                              >
                                <Search />
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                      </FormControl>
                    </Grid>
                  )}

                  <Grid item md={12}>
                    <MaterialTable
                      data={itemList}
                      labelRowsPerPage={t("general.rows_per_page")}
                      columns={columns}
                      localization={{
                        body: {
                          emptyDataSourceMessage: `${t(
                            "general.emptyDataMessageTable"
                          )}`,
                        },
                      }}
                      options={{
                        selection: false,
                        actionsColumnIndex: -1,
                        paging: false,
                        search: false,
                        rowStyle: (rowData) => ({
                          backgroundColor:
                            rowData.tableData.id % 2 === 1 ? "#EEE" : "#FFF",
                        }),
                        maxBodyHeight: "350px",
                        minBodyHeight: "350px",
                        overflowY: "auto",
                        padding: "dense",
                        toolbar: false,
                      }}
                      components={{
                        Header: (props) => {
                          return <TableHeader {...props} />;
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </TabPanel>
              <TabPanel value={tabActive} index="three">
                <Grid
                  container
                  spacing={2}
                  alignItems="flex-end"
                  justifyContent="space-between"
                >
                  <Grid
                    item
                    sm={8}
                    md={9}
                    lg={9}
                    className="flex flex-align-end"
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      style={{ marginTop: "50px" }}
                      startIcon={<Add />}
                      onClick={() => this.handleEditItem(null, "patient")}
                    >
                      {t("dengueLocation.cases")}
                    </Button>
                    <Button
                      className="ml-16"
                      startIcon={<Description />}
                      variant="contained"
                      color="secondary"
                      onClick={() => this.onOpenImportExcel("patient")}
                    >
                      {t("general.importExcel")}
                    </Button>
                    <Button
                      className="ml-16"
                      startIcon={<GetApp />}
                      variant="contained"
                      color="secondary"
                      onClick={() => this.onExportExcel("patient")}
                    >
                      {t("general.exportToExcel")}
                    </Button>
                  </Grid>
                  {this.state.dengueLocation.id && (
                    <Grid item md={4} lg={3} xl={3}>
                      <FormControl className="mr-8 w-100" size="small">
                        <InputLabel htmlFor="standard-adornment">
                          {t("EnterSearch")}
                        </InputLabel>
                        <Input
                          id="standard-basic"
                          type="text"
                          name="patientSearch"
                          value={this.state.patientSearch}
                          label={t("EnterSearch")}
                          onChange={(e) =>
                            this.handleSearchInputChange(e, "patient")
                          }
                          onKeyDown={(e) =>
                            this.handleKeyDownEnterSearch(e, "patient")
                          }
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                edge="end"
                                onClick={() => this.search("patient")}
                              >
                                <Search />
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                      </FormControl>
                    </Grid>
                  )}

                  <Grid item md={12}>
                    <MaterialTable
                      data={patientList}
                      labelRowsPerPage={t("general.rows_per_page")}
                      columns={columnsPatient}
                      localization={{
                        body: {
                          emptyDataSourceMessage: `${t(
                            "general.emptyDataMessageTable"
                          )}`,
                        },
                      }}
                      options={{
                        selection: false,
                        actionsColumnIndex: -1,
                        paging: false,
                        search: false,
                        rowStyle: (rowData) => ({
                          backgroundColor:
                            rowData.tableData.id % 2 === 1 ? "#EEE" : "#FFF",
                        }),
                        maxBodyHeight: "350px",
                        minBodyHeight: "350px",
                        overflowY: "auto",
                        padding: "dense",
                        toolbar: false,
                      }}
                      components={{
                        Header: (props) => {
                          return <TablePatientHeader {...props} />;
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </TabPanel>
            </Paper>
          </DialogContent>

          <DialogActions>
            <div className="flex flex-middle mr-8">
              <Button
                startIcon={<Block />}
                variant="contained"
                className="mr-12"
                color="secondary"
                onClick={() => this.props.handleClose()}
              >
                {t("general.cancel")}
              </Button>
              <Button
                startIcon={<Save />}
                variant="contained"
                className="mr-8"
                color="primary"
                type="submit"
              >
                {t("general.save")}
              </Button>
            </div>
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    );
  }
}
export default DengueLocationDialog;
