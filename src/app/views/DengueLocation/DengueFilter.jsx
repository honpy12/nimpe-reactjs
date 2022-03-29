import { Button } from "@material-ui/core";
import React, { Component } from "react";
import { ValidatorForm } from "react-material-ui-form-validator";
import {
  getByPageByParentId,
  searchByDto,
} from "../AdministrativeUnit/AdministrativeUnitService";
import DatePicker from "../Component/ValidateSelect/ValidatePicker";
import AsynchronousAutocomplete from "../utilities/AsynchronousAutocomplete";
import "./DengueFilter.css";
import moment from "moment";

export default class DengueFilter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fromDate: null,
      endDate: null,
      province: null,
      district: null,
      ward: null,
      provinceOfResidenceSearch: {
        pageSize: 999,
        pageIndex: 0,
        isGetAllCity: true,
        level: 3,
      },
      districtOfResidenceSearch: {},
      wardOfResidenceSearch: {},
    };
  }

  componentDidMount() {
    ValidatorForm.addValidationRule("isDateBigger", (value) => {
      if (this.state.endDate !== null && value > this.state.endDate) {
        return false;
      }
      return true;
    });
    ValidatorForm.addValidationRule("isDateLower", () => {
      if (
        this.state.fromDate !== null &&
        this.state.endDate !== null &&
        this.state.endDate < this.state.fromDate
      ) {
        return false;
      } else {
        return true;
      }
    });
    ValidatorForm.addValidationRule("isValidDate", (value) => {
      if (value !== null) {
        const b = new Date(value).setHours(0, 0, 0, 0);
        const a = new Date().setHours(0, 0, 0, 0);
        return a >= b;
      }
      return true;
    });
  }

  getProvinceListData = () => {
    const searchOption = {
      pageSize: 999,
      pageIndex: 0,
    };
    searchByDto(searchOption).then((data) => {
      this.setState({
        provinceList: data.content,
      });
    });
  };

  handleSelectAdministrativeUnit = (value, source) => {
    if ("province" === source) {
      this.setState({ province: value });

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
      this.setState({ district: value });
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
      this.setState({ ward: value });
    }
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleDateChange = (date, type) => {
    if (type === "fromDate") {
      this.setState({
        fromDate: date,
      });
    } else {
      this.setState({
        endDate: date,
      });
    }
  };

  clearFilter = () => {
    this.setState(
      {
        fromDate: null,
        endDate: null,
        province: null,
        district: null,
        ward: null,
      },
      () => this.props.handleFilter(this.state)
    );
  };

  onHandleFilter = () => {
    if (this.state.fromDate !== null) {
      this.setState(
        {
          ...this.state,
          fromDate: new Date(this.state.fromDate).setHours(0, 0, 0, 0),
        },
        () => this.props.handleFilter(this.state)
      );
    } else if (this.state.endDate !== null) {
      this.setState(
        {
          ...this.state,
          endDate: new Date(this.state.endDate).setHours(23, 59, 0, 0),
        },
        () => this.props.handleFilter(this.state)
      );
    } else if (this.state.fromDate !== null && this.state.endDate !== null) {
      this.setState(
        {
          ...this.state,
          fromDate: new Date(this.state.fromDate).setHours(0, 0, 0, 0),
          endDate: new Date(this.state.endDate).setHours(23, 59, 0, 0),
        },
        () => this.props.handleFilter(this.state)
      );
    } else {
      this.props.handleFilter(this.state);
    }
  };

  render() {
    const {
      fromDate,
      endDate,
      provinceOfResidenceSearch,
      districtOfResidenceSearch,
      wardOfResidenceSearch,
      province,
      district,
      ward,
    } = this.state;
    const { t } = this.props;

    return (
      <ValidatorForm
        ref="form"
        className="filter-containers"
        onSubmit={() => this.onHandleFilter()}
      >
        <DatePicker
          disableToolbar
          autoOk
          variant="dialog"
          format="dd/MM/yyyy"
          margin="normal"
          name="fromDate"
          label={t("dengueLocation.fromDate")}
          value={fromDate}
          onChange={(date) => this.handleDateChange(date, "fromDate")}
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
          validators={["isValidDate", "isDateBigger", "isDateLower"]}
          errorMessages={[
            t("dengueLocation.error1"),
            t("dengueLocation.error2"),
          ]}
          className="mb-0"
        />

        <DatePicker
          disableToolbar
          autoOk
          variant="dialog"
          format="dd/MM/yyyy"
          margin="normal"
          label={t("dengueLocation.toDate")}
          value={endDate}
          onChange={(date) => this.handleDateChange(date, "endDate")}
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
          validators={["isValidDate", "isDateLower"]}
          errorMessages={[
            t("dengueLocation.error1"),
            t("dengueLocation.error3"),
          ]}
          className="mb-0"
        />

        <AsynchronousAutocomplete
          label={<span className="font">{t("dengueLocation.province")}</span>}
          searchFunction={getByPageByParentId}
          searchObject={provinceOfResidenceSearch}
          value={province}
          multiple={false}
          inputValue={province ? province.name : ""}
          displayLable={"name"}
          className="w-100"
          onSelect={(value) => {
            this.handleSelectAdministrativeUnit(value, "province");
          }}
          size="small"
        />

        <AsynchronousAutocomplete
          label={<span className="font">{t("dengueLocation.district")}</span>}
          searchFunction={getByPageByParentId}
          searchObject={districtOfResidenceSearch}
          value={district}
          multiple={false}
          inputValue={district ? district.name : ""}
          defaultValue={district}
          displayLable={"name"}
          className="w-100"
          onSelect={(value) => {
            this.handleSelectAdministrativeUnit(value, "district");
          }}
          size="small"
        />

        <AsynchronousAutocomplete
          label={<span className="font">{t("dengueLocation.ward")}</span>}
          searchFunction={getByPageByParentId}
          searchObject={wardOfResidenceSearch}
          value={ward}
          multiple={false}
          inputValue={ward ? ward.name : ""}
          defaultValue={ward}
          displayLable={"name"}
          className="w-100"
          onSelect={(value) => {
            this.handleSelectAdministrativeUnit(value, "ward");
          }}
          size="small"
        />

        <div className="btn-action">
          <Button
            variant="contained"
            color="primary"
            onClick={() => this.clearFilter()}
          >
            {t("dengueLocation.reset")}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            className="ml-12"
            type="submit"
          >
            {t("general.search")}
          </Button>
        </div>
      </ValidatorForm>
    );
  }
}
