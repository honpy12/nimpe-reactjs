import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	FormControlLabel,
	FormLabel,
	Grid,
	Paper,
	Radio,
	RadioGroup,
} from "@material-ui/core";
import { Block, CloudUpload, Notifications, Save } from "@material-ui/icons";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import React, { Component } from "react";
import Draggable from "react-draggable";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConstantList from "../../appConfig";
import { searchByPage } from "../Category/CategoryService";
import ValidatePicker from "../Component/ValidateSelect/ValidatePicker";
import {
	addNewArticle,
	sendNotification,
	updateArticle,
} from "./ArticleService";
import SelectParentPopup from "./SelectParentPopup";

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

const requireLabel = item => {
	return (
		<>
			{item}
			<span style={{ color: "red", fontWeight: "bold" }}>*</span>
		</>
	);
};

class ArticleEditorDialog extends Component {
	state = {
		item: {},
		content: "",
		title: "",
		summary: "",
		titleImageUrl: "",
		urlVideo: "",
		publishDate: null,
		view: "",
		subtitle: "",
		slug: "",
		noteAvatarImage: "",
		realAuthor: "",
		note: "",
		tags: "",
		source: "",
		status: 1,
		avatarImage: null,
		shouldOpenSelectTopic: false,
		categories: null,
		id: null,
		categoryList: [],
		language: this.props.i18n.language === "vi" ? 1 : 0,
	};

	handleChange = (event, source) => {
		event.persist();
		if (source === "switch") {
			this.setState({ isActive: event.target.checked });
			return;
		}
		this.setState({
			[event.target.name]: event.target.value,
		});
	};

	handleFormSubmit = () => {
		const { t } = this.props;
		const { id } = this.state;

		if (id) {
			updateArticle({
				...this.state,
			})
				.then(() => {
					toast.success(t("general.updateSuccess"));
					this.props.handleOKDialog();
				})
				.catch(() => {
					toast.error(t("general.error"));
					this.props.handleClose();
				});
		} else {
			addNewArticle({
				...this.state,
			})
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

	componentDidMount() {
		this.getCategoryList();
		if (this.props.item) {
			this.setState({ ...this.props.item });
		}
	}

	getCategoryList = () => {
		var searchObject = {
			pageIndex: 1,
			pageSize: 1000,
			checkLanguage: this.props.i18n.language === "vi" ? 1 : 0,
		};
		searchByPage(searchObject).then(({ data }) => {
			this.setState({
				categoryList: data.content,
			});
		});
	};

	openParentPopup = () => {
		this.setState({
			shouldOpenSelectTopic: true,
		});
	};

	handleSelectItem = (e, value) => {
		this.setState({
			categories: value,
		});
	};

	handleDialogClose = () => {
		this.setState({
			shouldOpenSelectTopic: false,
		});
	};

	handleDateChange = (value, source) => {
		let { item } = this.state;
		let publishDate = "";
		item = item ? item : {};
		item[source] = value;
		this.setState({ item: item });
		this.setState({ publishDate: value });
		publishDate = item.publishDate;
	};

	handleUploadFile = (e, type) => {
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
				titleImageName: data.name,
			});
		});
	};

	sendNotifycation = () => {
		let { id } = this.state;
		sendNotification(id).then(() => {
			toast.success("Gửi thành công");
		});
	};

	handleChangeContent = data => {
		this.setState({
			content: data,
		});
		console.log(data);
	};

	handleChangeStatus = e => {
		this.setState({
			status: Number.parseInt(e.target.value),
		});
	};

	render() {
		const { open, handleClose, t, i18n } = this.props;
		const {
			id,
			content,
			title,
			summary,
			publishDate,
			view,
			subtitle,
			slug,
			noteAvatarImage,
			realAuthor,
			note,
			tags,
			source,
			status,
			categories,
			categoryList,
		} = this.state;

		return (
			<Dialog
				onClose={handleClose}
				open={open}
				fullScreen
				fullWidth
				PaperComponent={PaperComponent}
			>
				<DialogTitle
					style={{ cursor: "move" }}
					id="draggable-dialog-title"
				>
					{(id ? t("general.update") : t("general.add")) +
						" " +
						t("article.articleTitle")}
				</DialogTitle>

				<ValidatorForm ref="form" onSubmit={this.handleFormSubmit}>
					<DialogContent dividers style={{ overflowX: "hidden" }}>
						<Grid container spacing={4}>
							<Grid item sm={8} xs={12}>
								<TextValidator
									size="small"
									className="w-100 mb-16"
									label={requireLabel(t("article.title"))}
									onChange={this.handleChange}
									type="text"
									name="title"
									value={title}
									validators={["required"]}
									errorMessages={[`${t("general.required")}`]}
								/>
								<TextValidator
									size="small"
									className="w-100 mb-16"
									label={t("article.subtitle")}
									onChange={this.handleChange}
									type="text"
									name="subtitle"
									value={subtitle}
								/>
								<TextValidator
									size="small"
									className="w-100 mb-16"
									label={t("article.summary")}
									onChange={this.handleChange}
									type="text"
									name="summary"
									value={summary}
								/>
								<TextValidator
									size="small"
									className="w-100 mb-16"
									label={"slug"}
									onChange={this.handleChange}
									type="text"
									name="slug"
									value={slug}
								/>
								<Grid
									item
									container
									spacing={2}
									alignItems="flex-end"
									className="mb-20"
								>
									<Grid item xs={6} sm={6}>
										<Autocomplete
											style={{ width: "100%" }}
											id="combo-box-demo"
											defaultValue={categories}
											options={categoryList}
											getOptionSelected={(
												option,
												value
											) => option.id === value.id}
											getOptionLabel={option =>
												option.title
											}
											onChange={(event, value) => {
												this.handleSelectItem(
													event,
													value
												);
											}}
											renderInput={params => (
												<TextValidator
													{...params}
													value={categories}
													label={requireLabel(
														t("article.selectTopic")
													)}
													fullWidth
													validators={["required"]}
													errorMessages={[
														`${t(
															"general.required"
														)}`,
													]}
												/>
											)}
										/>
									</Grid>
									<Grid item xs={6} sm={6}>
										<TextValidator
											size="small"
											className="w-100"
											label={t("article.tags")}
											onChange={this.handleChange}
											type="text"
											name="tags"
											value={tags}
										/>
									</Grid>
									<Grid item sm={4}>
										<ValidatePicker
											size="small"
											type="text"
											autoOk
											format="dd/MM/yyyy"
											className="w-100"
											id="date-picker-inline"
											label={t("article.publishDate")}
											value={
												publishDate ? publishDate : null
											}
											onChange={resultDate =>
												this.handleDateChange(
													resultDate,
													"publishDate"
												)
											}
											fullWidth
										/>
									</Grid>
									<Grid item sm={8}>
										<FormControl
											component="fieldset"
											fullWidth
											className="ml-auto"
										>
											<FormLabel component="legend">
												{t("article.status")}
											</FormLabel>
											<RadioGroup
												aria-label="status"
												name="status"
												value={status}
												onChange={
													this.handleChangeStatus
												}
												row
											>
												<FormControlLabel
													value={1}
													control={<Radio />}
													label={t(
														"article.approve.not"
													)}
												/>
												<FormControlLabel
													value={2}
													control={<Radio />}
													label={t(
														"article.approve.pen"
													)}
												/>
												<FormControlLabel
													value={3}
													control={<Radio />}
													label={t(
														"article.approve.yes"
													)}
												/>
											</RadioGroup>
										</FormControl>
									</Grid>
								</Grid>
								<Editor
									size="small"
									className="mb-16 mt-16"
									value={content}
									placeholder={t("Article.content")}
									name="content"
									apiKey="0uobe2c4huxovpadx797l0a3gr7nk29aup9ft8qp1rhyc90d"
									init={{
										language:
											i18n.language === "en"
												? "en_US"
												: "vi_VN",
										language_url: "/lang/vi_VN.js",
										height: 400,
										plugins: [
											" fullscreen advlist autolink lists link image charmap print preview anchor " +
												" searchreplace visualblocks code fullscreen " +
												" insertdatetime media table paste code help wordcount ",
										],
										paste_data_images: true,
										image_advtab: true,
										automatic_uploads: true,
										media_live_embeds: true,
										file_picker_types: "image media",
										file_picker_callback: function (cb) {
											const input =
												document.createElement("input");
											input.setAttribute("type", "file");
											input.setAttribute(
												"accept",
												"image/*, video/*"
											);
											input.onchange = function () {
												const file = this.files[0];
												console.log(file);
												if (
													file.type.includes("image")
												) {
													let urlImage =
														ConstantList.API_ENPOINT +
														"/api/image";
													let formData =
														new FormData();
													formData.append(
														"file",
														file
													);
													const config = {
														headers: {
															"Content-Type":
																"multipart/form-data",
														},
													};
													axios
														.post(
															urlImage,
															formData,
															config
														)
														.then(({ data }) => {
															cb(
																ConstantList.API_ENPOINT +
																	"/public/api/getImage/" +
																	data.name
															);
														});
												} else {
													let urlVideo =
														ConstantList.API_ENPOINT +
														"/public/api/video/uploadVideo";

													let formData =
														new FormData();
													formData.append(
														"file",
														file
													);
													const config = {
														headers: {
															"Content-Type":
																"multipart/form-data",
														},
													};
													axios
														.post(
															urlVideo,
															formData,
															config
														)
														.then(({ data }) => {
															cb(
																ConstantList.API_ENPOINT +
																	"/public/api/video/downloadVideo/" +
																	data.id,
																{
																	source:
																		ConstantList.API_ENPOINT +
																		"/public/api/video/downloadVideo/" +
																		data.id,
																}
															);
														});
												}
											};
											input.click();
										},
										toolbar:
											" fullscreen undo redo | formatselect | bold italic backcolor | image | media " +
											" alignleft aligncenter alignright alignjustify | " +
											" bullist numlist outdent indent | removeformat | help ",
										fullscreen_native: true,
									}}
									onEditorChange={value => {
										this.handleChangeContent(value);
									}}
								></Editor>
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
										{t("article.image")}
									</label>
									<input
										type="file"
										id="avatarImage"
										name="avatarImage"
										accept="image/*"
										onChange={e => {
											this.handleUploadFile(e, "image");
										}}
										style={{ display: "none" }}
									/>
								</div>
								<TextValidator
									size="small"
									className="w-100 mb-16"
									label={t("article.noteAvatarImage")}
									onChange={this.handleChange}
									type="text"
									name="noteAvatarImage"
									value={noteAvatarImage}
								/>
								<TextValidator
									size="small"
									className="w-100 mb-16"
									label={requireLabel(
										t("article.realAuthor")
									)}
									onChange={this.handleChange}
									type="text"
									name="realAuthor"
									value={realAuthor}
									validators={["required"]}
									errorMessages={[`${t("general.required")}`]}
								/>
								<TextValidator
									className="w-100 mb-16"
									label={t("article.note")}
									onChange={this.handleChange}
									type="text"
									name="note"
									value={note}
								/>
								<TextValidator
									size="small"
									className="w-100 mb-16"
									label={t("article.source")}
									onChange={this.handleChange}
									type="text"
									name="source"
									value={source}
								/>
								<TextValidator
									size="small"
									className="w-100"
									label={t("article.view")}
									onChange={this.handleChange}
									type="text"
									name="view"
									value={view}
								/>
							</Grid>
						</Grid>
					</DialogContent>

					<DialogActions>
						<div className="flex flex-middle">
							<Button
								variant="contained"
								color="primary"
								onClick={() => this.sendNotifycation()}
								disabled={id ? false : true}
								className="mr-30"
								startIcon={<Notifications />}
							>
								Gửi thông báo
							</Button>
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
								className="mr-8"
								variant="contained"
								color="primary"
								type="submit"
							>
								{t("general.save")}
							</Button>
						</div>
					</DialogActions>
				</ValidatorForm>

				{this.state.shouldOpenSelectTopic && (
					<SelectParentPopup
						open={this.state.shouldOpenSelectTopic}
						handleSelect={this.handleSelectItem}
						selectedItem={categories !== null ? categories : {}}
						handleClose={this.handleDialogClose}
						itemId={this.state.categories?.id}
						t={t}
					/>
				)}
			</Dialog>
		);
	}
}

export default ArticleEditorDialog;
