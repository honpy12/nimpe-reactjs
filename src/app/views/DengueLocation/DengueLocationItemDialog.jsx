import {
  AppBar,
  Button,
  Dialog,
  DialogContent,
  Grid,
  Slide,
  TextField,
  Toolbar,
} from "@material-ui/core";
import { Block, Save } from "@material-ui/icons";
import React, { Component } from "react";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../styles/views/_dengueLocation.scss";
import DengueMap from "./DengueGoogleMap";
import {
  addDengueLocationItem,
  updateDengueLocationItem,
} from "./DengueLocationServices";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class DengueLocationItemDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: "",
      familyName: "",
      address: "",
      longitude: "",
      latitude: "",
      aedesAegyptiQty: 0,
      aedesAlbopictusQty: 0,
      aedesAegyptiLarvae: 0,
      aedesAlbopictusLarvae: 0,
      dengueLocation: null,
    };
  }

  componentDidMount() {
    if (this.props.item) {
      this.setState({
        ...this.props.item,
      });
    }
    if (this.props.parent) {
      this.setState({
        dengueLocation: this.props.parent,
      });
    }
  }

  handleFormSubmit = () => {
    const { t } = this.props;
    if (this.state.dengueLocation.id) {
      if (this.state.id) {
        updateDengueLocationItem(this.state)
          .then(() => {
            toast.success(t("general.updateSuccess"));
            this.props.handleOKDialog();
          })
          .catch(() => {
            toast.error(t("general.error"));
            this.props.handleClose();
          });
      } else {
        addDengueLocationItem(this.state)
          .then(() => {
            toast.success(t("general.updateSuccess"));
            this.props.handleOKDialog();
          })
          .catch(() => {
            toast.error(t("general.error"));
            this.props.handleClose();
          });
      }
    } else {
      this.props.updateTableData(this.state, "vector");
      this.props.handleClose();
    }
  };

  search = (keyword) => {
    var searchObject = {};
    searchObject.text = keyword;
    searchObject.pageIndex = this.state.page;
    searchObject.pageSize = this.state.rowsPerPage;
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleDialogClose = () => {
    this.setState({ shouldOpenNotificationPopup: false });
  };

  onCloseMap = (geo) => {
    const { longitude, latitude, itemAddress } = geo;
    this.setState({
      longitude,
      latitude,
      address: itemAddress,
    });
  };

  render() {
    console.log("Location Item");
    const { t, open, handleClose } = this.props;
    const {
      code,
      familyName,
      address,
      longitude,
      latitude,
      aedesAegyptiQty,
      aedesAegyptiLarvae,
      aedesAlbopictusQty,
      aedesAlbopictusLarvae,
    } = this.state;

    const mosquitoList = ["Aedes aegypti", "Aedes albopictus"];

    const larvaeList = ["Aedes aegypti", "Aedes albopictus"];

    return (
      <Dialog
        open={open}
        onClose={() => handleClose()}
        fullScreen
        TransitionComponent={Transition}
      >
        <AppBar position="relative" color="transparent">
          <Toolbar>
            <h4 style={{ flex: "1" }} className="mt-8">
              {t("dengueLocation.householdInformation")}
            </h4>
          </Toolbar>
        </AppBar>

        <DialogContent
          className="flex"
          style={{ alignItems: "flex-start", overflowY: "hidden" }}
        >
          <ValidatorForm
            ref="form"
            onSubmit={this.handleFormSubmit}
            className="w-50"
          >
            <TextValidator
              label={t("general.code")}
              className="w-40 mr-16 mb-16"
              name="code"
              value={code}
              onChange={this.handleChange}
              validators={["required"]}
              errorMessages={t("general.required")}
            />

            <TextValidator
              label={t("dengueLocation.householderName")}
              className="w-40"
              name="familyName"
              value={familyName}
              onChange={this.handleChange}
            />

            <TextField
              id="standard-basic"
              name="address"
              label={t("dengueLocation.address")}
              value={address}
              onChange={this.handleChange}
              className="w-70 mt-8"
              validators={["required"]}
              errorMessages={t("general.required")}
            />

            <div className="mt-30">
              <p style={{ color: "blue", fontWeight: "700" }}>
                {t("dengueLocation.locationInfo")}
              </p>
            </div>

            <div>
              <TextField
                id="standard-basic"
                name="latitude"
                label={t("dengueLocation.latitude")}
                value={latitude}
                onChange={this.handleChange}
                className="w-40 mr-16"
              />
              <TextField
                id="standard-basic"
                name="longitude"
                label={t("dengueLocation.longitude")}
                value={longitude}
                onChange={this.handleChange}
                className="w-40"
              />
            </div>

            <h4
              style={{
                marginTop: "40px",
                marginBottom: "20px",
              }}
            >
              {t("dengueLocation.specificInformation")}
            </h4>

            <Grid container spacing={1}>
              <Grid item sm={7} md={6} lg={6}>
                <h5>{t("dengueLocation.mosquitoSpeciesCaught")}</h5>
                <Grid item container className="mt-15">
                  <Grid item xs={7} md={6}>
                    <label className="fw-600">
                      {t("dengueLocation.speciesName")}
                    </label>
                    {mosquitoList.map((item, index) => (
                      <span key={index}>
                        <TextValidator
                          value={item}
                          inputProps={{
                            readOnly: true,
                          }}
                        />
                      </span>
                    ))}
                  </Grid>
                  <Grid item xs={3} md={3} lg={3}>
                    <label className="fw-600 mb-8">
                      {t("dengueLocation.quantity")}
                    </label>
                    <TextValidator
                      name="aedesAegyptiQty"
                      value={aedesAegyptiQty}
                      onChange={this.handleChange}
                      type="number"
                      validators={["minNumber:0"]}
                      errorMessages={[t("dengueLocation.valueGreater0")]}
                    />
                    <TextValidator
                      name="aedesAlbopictusQty"
                      value={aedesAlbopictusQty}
                      onChange={this.handleChange}
                      type="number"
                      validators={["minNumber:0"]}
                      errorMessages={[t("dengueLocation.valueGreater0")]}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sm={7} md={6} lg={6}>
                <h5>{t("dengueLocation.numberWithLarva")}</h5>
                <Grid item container className="mt-15">
                  <Grid item xs={7} md={6}>
                    <label className="fw-600 mb-8">
                      {t("dengueLocation.speciesName")}
                    </label>
                    {larvaeList.map((item, index) => (
                      <span key={index}>
                        <TextValidator
                          value={item}
                          inputProps={{
                            readOnly: true,
                          }}
                        />
                      </span>
                    ))}
                  </Grid>
                  <Grid item xs={3} md={3}>
                    <label className="fw-600">
                      {t("dengueLocation.quantity")}
                    </label>
                    <TextValidator
                      name="aedesAegyptiLarvae"
                      value={aedesAegyptiLarvae}
                      onChange={this.handleChange}
                      type="number"
                      validators={["minNumber:0"]}
                      errorMessages={[t("dengueLocation.valueGreater0")]}
                    />
                    <TextValidator
                      name="aedesAlbopictusLarvae"
                      value={aedesAlbopictusLarvae}
                      onChange={this.handleChange}
                      type="number"
                      validators={["minNumber:0"]}
                      errorMessages={[t("dengueLocation.valueGreater0")]}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sm={4} md={8} lg={8}></Grid>
              <Grid item sm={4} md={3} className="mt-30 mr-20">
                <div className="flex flex-middle">
                  <Button
                    variant="contained"
                    className="mr-12"
                    startIcon={<Block />}
                    color="secondary"
                    onClick={() => this.props.handleClose()}
                  >
                    {t("general.cancel")}
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    color="primary"
                    type="submit"
                    className="mr-16"
                  >
                    {t("general.save")}
                  </Button>
                </div>
              </Grid>
            </Grid>
          </ValidatorForm>

          <DengueMap item={this.state} onGetLocation={this.onCloseMap} />
        </DialogContent>
      </Dialog>
    );
  }
}

export default DengueLocationItemDialog;
