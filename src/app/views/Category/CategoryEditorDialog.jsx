import {
	Button,
	Checkbox,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	FormControlLabel,
	FormLabel,
	Grid,
	InputLabel,
	MenuItem,
	Paper,
	Select,
	TextField,
} from "@material-ui/core";
import { Block, Save, CloudUpload } from "@material-ui/icons";
import React, { Component } from "react";
import Draggable from "react-draggable";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addCategory, updateCategory } from "./CategoryService";
import SelectParentPopup from "./SelectParentPopup";
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

const requiredLabel = item => {
	return (
		<>
			{item}
			<span style={{ color: "red", fontWeight: "bold" }}>*</span>
		</>
	);
};

class CategoryDialog extends Component {
	constructor(props) {
		super(props);
		this.state = {
			category: {
				code: "",
				title: "",
				description: "",
				language: this.props.i18n.language === "vi" ? 1 : 0,
				active: false,
				parent: {},
			},
			titleImageUrl: "",
			avatarImage: null,
			shouldOpenSelectParentPopup: false,
		};
	}

	componentDidMount() {
		if (this.props.item) {
			this.setState({
				category: {
					...this.props.item,
				},
				titleImageUrl: this.props.item.titleImageUrl,
			});
		}
	}

	handleChange = e => {
		this.setState({
			category: {
				...this.state.category,
				[e.target.name]: e.target.value,
			},
		});
	};

	handleCheckedChange = e => {
		this.setState({
			category: {
				...this.state.category,
				[e.target.name]: e.target.checked,
			},
		});
	};

	openParentPopup = () => {
		this.setState({ shouldOpenSelectParentPopup: true });
	};

	handleDialogClose = () => {
		this.setState({ shouldOpenSelectParentPopup: false });
	};

	handleSelectParent = itemParent => {
		this.setState({
			category: {
				...this.state.category,
				parent: itemParent,
			},
		});
		this.setState({ shouldOpenSelectParentPopup: false });
	};

	handleFormSubmit = () => {
		const { t } = this.props;
		const { id } = this.state.category;
		const { titleImageUrl } = this.state;

		if (id) {
			updateCategory({ ...this.state.category, titleImageUrl })
				.then(() => {
					toast.success(t("general.updateSuccess"));
					this.props.handleOKDialog();
				})
				.catch(() => {
					toast.error(t("general.error"));
					this.props.handleClose();
				});
		} else {
			addCategory({ ...this.state.category, titleImageUrl })
				.then(() => {
					toast.success(t("general.addSuccess"));
					this.props.handleOKDialog();
				})
				.catch(() => {
					toast.error(t("general.error"));
					this.props.handleClose();
				});
		}
	};

	handleUploadFile = e => {
		let url = ConstantList.API_ENPOINT + "/api/image";
		let formData = new FormData();
		formData.append("file", e.target.files[0]);
		const config = {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		};
		axios.post(url, formData, config).then(({ data }) => {
			this.setState({
				titleImageUrl: data.name,
			});
		});
	};

	render() {
		const { open, handleClose, t, item } = this.props;

		const { id, code, title, description, active, parent } =
			this.state.category;

		return (
			<Dialog
				onClose={handleClose}
				open={open}
				maxWidth="md"
				fullWidth
				PaperComponent={PaperComponent}
			>
				<DialogTitle>
					<h4>
						{id ? t("general.update") : t("general.add")}{" "}
						{t("category.category")}
					</h4>
				</DialogTitle>

				<ValidatorForm ref="form" onSubmit={this.handleFormSubmit}>
					<DialogContent dividers style={{ overflowX: "hidden" }}>
						<Grid container spacing={4}>
							<Grid item sm={8} xs={12}>
								<TextValidator
									className="w-100 mb-16"
									label={requiredLabel(t("category.code"))}
									onChange={this.handleChange}
									type="text"
									name="code"
									value={code}
									validators={["required"]}
									errorMessages={[t("general.required")]}
								/>

								<TextValidator
									className="w-100 mb-16"
									label={requiredLabel(t("category.title"))}
									onChange={this.handleChange}
									type="text"
									name="title"
									value={title}
									validators={["required"]}
									errorMessages={[t("general.required")]}
								/>

								<TextValidator
									className="w-100 mb-16"
									label={t("category.description")}
									onChange={this.handleChange}
									type="text"
									name="description"
									value={description}
								/>

								<Grid item sm={12}>
									<section
										style={{
											display: "flex",
											alignItems: "flex-end",
											justifyContent: "space-between",
										}}
									>
										<TextField
											placeholder={t("category.parent")}
											value={parent?.title}
											className="w-100"
										/>
										<Button
											size="small"
											variant="contained"
											color="primary"
											onClick={this.openParentPopup}
										>
											{t("general.select")}
										</Button>
									</section>
								</Grid>
								<Grid item sm={12}>
									<FormControlLabel
										label={t("category.active")}
										control={
											<Checkbox
												name="active"
												checked={active}
												onChange={
													this.handleCheckedChange
												}
											/>
										}
									/>
								</Grid>
							</Grid>
							<Grid item sm={4} xs={12}>
								<div
									className="mb-18"
									style={{
										position: "relative",
										left: "50%",
									}}
								>
									{this.state.titleImageUrl && (
										<span>
											<img
												src={
													ConstantList.API_ENPOINT +
													"/public/api/getImage/" +
													this.state.titleImageUrl
												}
												alt=""
												className="x-center"
												style={{
													objectFit: "contain",
													width: "100%",
													height: "200px",
												}}
											/>
										</span>
									)}
									{!this.state.titleImageUrl && (
										<div
											className="x-center"
											style={{
												border: "1px solid black",
												width: "100%",
												height: "206px",
											}}
										></div>
									)}
									<label
										htmlFor="avatarImage"
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
										{t("category.image")}
									</label>
									<input
										type="file"
										id="avatarImage"
										name="avatarImage"
										accept="image/*"
										onChange={this.handleUploadFile}
										style={{ display: "none" }}
									/>
								</div>
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

				{this.state.shouldOpenSelectParentPopup && (
					<SelectParentPopup
						open={this.state.shouldOpenSelectParentPopup}
						handleSelect={this.handleSelectParent}
						selectedItem={parent !== null ? parent : {}}
						handleClose={this.handleDialogClose}
						itemId={this.state.category?.id}
						t={t}
					/>
				)}
			</Dialog>
		);
	}
}

export default CategoryDialog;
