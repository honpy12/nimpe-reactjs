import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
} from "@material-ui/core";
import { Block, Save, CloudUpload } from "@material-ui/icons";
import React, { Component } from "react";
import Draggable from "react-draggable";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addVideo, updateVideo } from "./VideoListService";
// import SelectParentPopup from "./SelectParentPopup";
import ConstantList from "../../appConfig";
import axios from "axios";
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

class VideoListDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoList: {
        id: "",
        title: "",
        descriptions: "",
      },
      file: null,
      shouldOpenSelectParentPopup: false,
    };
  }

  componentDidMount() {
    if (this.props.item) {
      this.setState({
        videoList: {
          ...this.props.item,
        },
      });
    }
  }

  handleChange = (e) => {
    this.setState({
      videoList: {
        ...this.state.videoList,
        [e.target.name]: e.target.value,
      },
    });
  };

  openParentPopup = () => {
    this.setState({ shouldOpenSelectParentPopup: true });
  };

  handleDialogClose = () => {
    this.setState({ shouldOpenSelectParentPopup: false });
  };

  //   handleSelectParent = (itemParent) => {
  //     this.setState({
  //       category: {
  //         ...this.state.category,
  //         parent: itemParent,
  //       },
  //     });
  //     this.setState({ shouldOpenSelectParentPopup: false });
  //   };

  handleFormSubmit = () => {
    const { t } = this.props;
    const { title, descriptions } = this.state.videoList;
    let formData = new FormData();
    formData.append("file", this.state.file);
    formData.append("title", title);
    formData.append("descriptions", descriptions);
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    if (this.state.videoList.id) {
      updateVideo(this.state.videoList.id,formData,config)
        .then(() => {
          toast.success(t("general.updateSuccess"));
          this.props.handleOKDialog();
        })
        .catch(() => {
          toast.error(t("general.error"));
          this.props.handleClose();
        });
    } else {
      addVideo(formData, config)
        .then(({ data }) => {
          toast.success(t("general.addSuccess"));
          this.props.handleOKDialog();
          this.setState({
            ...this.state.videoList,
          });
        })
        .catch(() => {
          toast.error(t("general.error"));
          this.props.handleClose();
        });
    }
  };

  handleUploadFile = (e) => {
    var fileUrl = window.URL.createObjectURL(e.target.files[0]);
    this.setState({
      file: e.target.files[0],
      videoUrl: fileUrl,
    });
  };

  render() {
    const { open, handleClose, t } = this.props;
    const { videoUrl } = this.state;
    const { id, title, descriptions } = this.state.videoList;

    return (
      <Dialog
        onClose={handleClose}
        open={open}
        maxWidth="sm"
        fullWidth
        PaperComponent={PaperComponent}
      >
        <DialogTitle>
          {id ? t("update") : t("add")} {t("video.videoTitle")}
        </DialogTitle>

        <ValidatorForm ref="form" onSubmit={this.handleFormSubmit}>
          <DialogContent dividers style={{ overflowX: "hidden" }}>
            <Grid container spacing={4}>
              <Grid item sm={12} xs={12}>
                <TextValidator
                  size="small"
                  className="w-100 mb-16"
                  label={t("video.title")}
                  onChange={this.handleChange}
                  type="text"
                  name="title"
                  value={title || null}
                />
                <div
                  className="mb-18"
                  style={{
                    position: "relative",
                    left: "50%",
                  }}
                >
                  {videoUrl && (
                    <span>
                      <video
                        controls
                        className="x-center"
                        style={{
                          objectFit: "contain",
                          width: "100%",
                          height: "300px",
                        }}
                        src={videoUrl}
                      ></video>
                    </span>
                  )}
                  {this.state.videoList.id && !videoUrl && (
                    <span>
                      <video
                        controls
                        src={
                          ConstantList.API_ENPOINT +
                          "/public/api/video/downloadVideo/" +
                          this.state.videoList.id
                        }
                        className="x-center"
                        style={{
                          objectFit: "contain",
                          width: "100%",
                          height: "300px",
                        }}
                      ></video>
                    </span>
                  )}
                  {!videoUrl && !this.state.videoList.id && (
                    <div
                      className="x-center"
                      style={{
                        border: "1px solid black",
                        width: "100%",
                        height: "306px",
                      }}
                    ></div>
                  )}
                  <label
                    htmlFor="id"
                    style={{
                      background: "#ffcb89",
                      borderRadius: "999px",
                      padding: "7px 14px",
                      width: "fit-content",
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                      margin: "30px 0",
                    }}
                    onClick={this.upload}
                    className="x-center"
                  >
                    <CloudUpload className="mr-10" />
                    Tải lên video
                  </label>
                  <input
                    type="file"
                    id="id"
                    name="id"
                    accept="video/*"
                    onChange={this.handleUploadFile}
                    style={{ display: "none" }}
                  />
                </div>
                <TextValidator
                  size="small"
                  className="w-100 mb-16"
                  label={t("video.description")}
                  onChange={this.handleChange}
                  type="text"
                  name="descriptions"
                  value={descriptions || null}
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions>
            <div className="flex flex-end flex-middle">
              <Button
                variant="contained"
                color="secondary"
                className="mr-12"
                startIcon={<Block />}
                onClick={() => this.props.handleClose()}
              >
                {t("Cancel")}
              </Button>
              <Button
                variant="contained"
                className="mr-8"
                startIcon={<Save />}
                color="primary"
                type="submit"
              >
                {t("Save")}
              </Button>
            </div>
          </DialogActions>
        </ValidatorForm>

        {/* {this.state.shouldOpenSelectParentPopup && (
          <SelectParentPopup
            open={this.state.shouldOpenSelectParentPopup}
            handleSelect={this.handleSelectParent}
            selectedItem={parent !== null ? parent : {}}
            handleClose={this.handleDialogClose}
            itemId={this.state.category?.id}
            t={t}
          />
        )} */}
      </Dialog>
    );
  }
}

export default VideoListDialog;
