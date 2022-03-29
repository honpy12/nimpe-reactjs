import {
	Button,
	Card,
	Dialog,
	DialogActions,
	Divider,
	Grid,
	Icon,
} from "@material-ui/core";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Paper from "@material-ui/core/Paper";
import axios from "axios";
import { EgretProgressBar } from "egret";
import React from "react";
import Draggable from "react-draggable";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Error, Done } from "@material-ui/icons";
import ConstantList from "../../../appConfig";
import PropTypes from "prop-types";

toast.configure({
	autoClose: 3000,
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

const formatFileSize = size =>
	size < 10e6 ? (
		<span>{(size / 1024).toFixed(2)} KB</span>
	) : (
		<span>{(size / 1024 ** 2).toFixed(2)} MB</span>
	);

const cancelToken = axios.CancelToken;
const source = cancelToken.source();

class ImportSingleExcelDialog extends React.Component {
	static propTypes = {
		open: PropTypes.bool.isRequired,
		handleClose: PropTypes.func.isRequired,
		urlPath: PropTypes.string.isRequired,
		t: PropTypes.any,
	};

	constructor(props) {
		super(props);
		this.state = {
			file: null,
			progress: 0,
			uploading: false,
			error: false,
			success: false,
			source: "",
			isValidFile: true,
		};
	}

	onHandleFileSelect = event => {
		this.setState({
			isValidFile: true,
		});
		let file = event.target.files[0];
		const extension = file?.name.split(".")[1];
		this.setState({
			file,
		});
		if (!/(xlsx|csv|xls)$/gi.test(extension)) {
			toast.error("Định dạng file không phù hợp.");
			this.setState({
				isValidFile: false,
			});
			return;
		}
	};

	onHandleCancel = () => {
		source.cancel();
		this.setState({
			uploading: false,
		});
	};

	onHandleRemove = () => {
		this.setState({
			file: null,
			progress: 0,
			uploading: false,
			error: false,
			success: false,
			source: "",
		});
	};

	onFileUpload = () => {
		const { t, urlPath } = this.props;
		const url = ConstantList.API_ENPOINT + urlPath;

		let formData = new FormData();
		formData.append("file", this.state.file);

		axios
			.post(url, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
				cancelToken: source.token,
				onUploadProgress: progressEvent => {
					let percent = Math.round(
						(progressEvent.loaded * 100) / progressEvent.total
					);
					this.setState({
						progress: Number.parseInt(percent),
						uploading: true,
					});
				},
			})
			.then(result => {
				this.props.onHandleDataImportExcel(result.data);
				this.setState({
					uploading: false,
					success: true,
				});
				toast.success(t("general.successImport"));
			})
			.catch(() => {
				this.setState({
					uploading: false,
					error: true,
				});
				toast.error(t("general.errorImport"));
			});
	};

	render() {
		const { t, handleClose, open } = this.props;
		const { file, progress, error, success, uploading, isValidFile } =
			this.state;

		return (
			<Dialog
				onClose={handleClose}
				open={open}
				PaperComponent={PaperComponent}
				maxWidth={"md"}
				fullWidth
			>
				<DialogTitle
					style={{ cursor: "move" }}
					id="draggable-dialog-title"
				>
					<span className="mb-20">{t("general.upload")}</span>
				</DialogTitle>

				<DialogContent>
					<div className="upload-form m-sm-30">
						<div className="flex flex-wrap mb-20">
							<label htmlFor="upload-single-file">
								<Button
									className="capitalize"
									component="span"
									variant="contained"
									color="primary"
								>
									<div className="flex flex-middle">
										<Icon className="pr-8">
											cloud_upload
										</Icon>
										<span>{t("general.select_file")}</span>
									</div>
								</Button>
							</label>
							<input
								className="display-none"
								onChange={this.onHandleFileSelect}
								id="upload-single-file"
								type="file"
							/>
						</div>

						<Card className="mb-24" elevation={3}>
							<div className="p-16">
								<Grid
									container
									spacing={2}
									alignItems="center"
									direction="row"
								>
									<Grid item lg={4} md={4}>
										{t("general.file_name")}
									</Grid>
									<Grid item lg={2} md={2}>
										{t("general.size")}
									</Grid>
									<Grid item lg={2} md={2}>
										{t("general.status")}
									</Grid>
									<Grid item lg={4} md={4}>
										{t("general.action")}
									</Grid>
								</Grid>
							</div>
							<Divider></Divider>

							{file === null ? (
								<p className="px-16 center">
									{t("general.empty_file")}
								</p>
							) : (
								<div className="px-16 py-16">
									<Grid
										container
										spacing={2}
										alignItems="center"
										direction="row"
									>
										<Grid
											item
											lg={4}
											md={4}
											sm={12}
											xs={12}
										>
											{file?.name}
										</Grid>
										<Grid
											item
											lg={2}
											md={2}
											sm={12}
											xs={12}
										>
											{formatFileSize(file?.size)}
										</Grid>
										<Grid
											item
											lg={2}
											md={2}
											sm={12}
											xs={12}
											className="flex"
										>
											<EgretProgressBar
												value={progress}
											></EgretProgressBar>
											{error && <Error color="error" />}
											{success && (
												<Done className="text-green" />
											)}
										</Grid>
										<Grid
											item
											lg={4}
											md={4}
											sm={12}
											xs={12}
										>
											<div className="flex">
												<Button
													variant="contained"
													size="small"
													color="primary"
													onClick={() =>
														this.onFileUpload()
													}
													disabled={
														uploading ||
														!isValidFile
													}
												>
													{t("general.upload")}
												</Button>
												<Button
													variant="contained"
													size="small"
													color="inherit"
													className="ml-4"
													onClick={() =>
														this.onHandleCancel()
													}
												>
													{t("general.cancel")}
												</Button>
												<Button
													variant="contained"
													className="bg-error ml-4"
													size="small"
													onClick={() =>
														this.onHandleRemove()
													}
												>
													{t("general.remove")}
												</Button>
											</div>
										</Grid>
									</Grid>
								</div>
							)}
						</Card>
					</div>
				</DialogContent>

				<DialogActions>
					<Button
						className="mb-16 mr-36 align-bottom"
						variant="contained"
						color="secondary"
						onClick={() => handleClose()}
					>
						{t("general.close")}
					</Button>
				</DialogActions>
			</Dialog>
		);
	}
}

export default ImportSingleExcelDialog;
