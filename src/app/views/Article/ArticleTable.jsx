import {
	Button,
	FormControl,
	Grid,
	Icon,
	IconButton,
	Input,
	InputAdornment,
	InputLabel,
	Tooltip,
	Collapse,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Add, Search, Tune, ArrowDropDown } from "@material-ui/icons";
import { Breadcrumb, ConfirmationDialog } from "egret";
import MaterialTable from "material-table";
import moment from "moment";
import React, { Component } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NicePagination from "../Component/Pagination/NicePagination";
import ArticleEditorDialog from "./ArticleEditorDialog";
import { deleteArticle, getById, searchByDto } from "./ArticleService";
import ArticleFilter from "./ArticleFilter";
import { Helmet } from "react-helmet";

const LightTooltip = withStyles(theme => ({
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
				enterDelay={100}
				leaveDelay={100}
				arrow
			>
				<IconButton
					size="small"
					onClick={() => props.onSelect(item, 0)}
				>
					<Icon fontSize="small" color="primary">
						edit
					</Icon>
				</IconButton>
			</LightTooltip>
			<LightTooltip
				title={t("general.deleteIcon")}
				placement="bottom"
				enterDelay={100}
				leaveDelay={100}
				arrow
			>
				<IconButton
					size="small"
					onClick={() => props.onSelect(item, 1)}
				>
					<Icon fontSize="small" color="error">
						delete
					</Icon>
				</IconButton>
			</LightTooltip>
		</div>
	);
}

class ArticleTable extends Component {
	constructor(props) {
		super(props);

		this.state = {
			rowsPerPage: 5,
			page: 1,
			articleList: [],
			item: {},
			totalElements: 0,
			totalPage: 0,
			loading: true,
			text: "",
			id: "",
			itemEdit: {},
			checkedFilter: false,
			shouldOpenEditorDialog: false,
			shouldOpenConfirmationDialog: false,
			language: "",
		};
	}

	componentDidMount() {
		this.updatePageData();
		this.setState({
			language: this.props.i18n.language,
		});
	}

	componentDidUpdate(prevProps) {
		if (prevProps.i18n.language !== this.state.language) {
			this.setState(
				{
					language: this.props.i18n.language,
				},
				() => this.updatePageData()
			);
		}
	}

	handleChangeRowsPerPage = event => {
		this.setState(
			{
				rowsPerPage: parseInt(event.target.value, 10),
				page: 1,
			},
			() => this.updatePageData()
		);
	};

	handleChangePage = (event, newPage) => {
		this.setState(
			{
				page: newPage,
			},
			() => this.updatePageData()
		);
	};

	handleDialogClose = () => {
		this.setState({
			shouldOpenEditorDialog: false,
			shouldOpenConfirmationDialog: false,
		});
	};

	handleOKDialog = () => {
		this.setState(
			{
				shouldOpenEditorDialog: false,
				shouldOpenConfirmationDialog: false,
			},
			() => {
				this.updatePageData();
			}
		);
	};

	handleDeleteArticle = id => {
		this.setState({
			id,
			shouldOpenConfirmationDialog: true,
		});
	};

	handleEditArticle = item => {
		this.setState({
			item: item,
			shouldOpenEditorDialog: true,
		});
	};

	handleConfirmationResponse = () => {
		const { t } = this.props;
		deleteArticle(this.state.id)
			.then(() => {
				toast.success(t("general.deleteSuccess"));
				this.handleOKDialog();
			})
			.catch(() => toast.error(t("general.error")));
	};

	updatePageData = () => {
		const { t } = this.props;
		var searchObject = {};
		this.setState({
			loading: true,
		});
		searchObject.pageIndex = this.state.page;
		searchObject.pageSize = this.state.rowsPerPage;
		searchObject.checkLanguage = this.props.i18n.language === "vi" ? 1 : 0;
		searchByDto(searchObject)
			.then(({ data }) => {
				this.setState({
					articleList: [...data.content],
					totalElements: data.totalElements,
					totalPage: data.totalPages,
					loading: false,
				});
			})
			.catch(() => {
				this.setState({
					articleList: [],
					loading: false,
				});
				toast.error(t("general.error"));
			});
	};

	handleCollapseFilter = () => {
		let { checkedFilter } = this.state;
		this.setState({ checkedFilter: !checkedFilter });
	};

	// handle delete start
	// async handleDeleteList(list) {
	// 	let listAlert = [];
	// 	for (var i = 0; i < list.length; i++) {
	// 		try {
	// 			await deleteArticle(list[i].id);
	// 		} catch (error) {
	// 			listAlert.push(list[i].name);
	// 		}
	// 	}
	// }

	// handleDeleteListItem = event => {
	// 	let { t } = this.props;
	// 	if (this.data != null) {
	// 		this.handleDeleteList(this.data).then(() => {
	// 			this.updatePageData();
	// 		});
	// 	} else {
	// 		toast.warning(t("toast.please_select"));
	// 	}
	// };

	handleEditItem = item => {
		this.setState({
			itemEdit: item,
			shouldOpenEditorDialog: true,
		});
	};

	handleSearchInputChange = event => {
		this.setState({
			[event.target.name]: event.target.value,
		});
		if (event.target.value === "") {
			this.setState({
				loading: true,
			});
			this.updatePageData();
		}
	};

	handleKeyDownEnterSearch = e => {
		if (e.key === "Enter") {
			this.search();
		}
	};

	search() {
		const { t } = this.props;
		var searchObject = {};
		this.setState({ page: 1, loading: true });
		searchObject.text = this.state.text;
		searchObject.category = this.state.category;
		searchObject.publishDate = this.state.publishDate;
		searchObject.status = this.state.status;
		searchObject.pageIndex = this.state.page;
		searchObject.pageSize = this.state.rowsPerPage;
		searchObject.checkLanguage = this.props.i18n.language === "vi" ? 1 : 0;
		searchByDto(searchObject)
			.then(({ data }) => {
				this.setState({
					articleList: data.content,
					totalElements: data.totalElements,
					totalPage: data.totalPages,
					loading: false,
				});
			})
			.catch(() => {
				this.setState({
					articleList: [],
					loading: false,
				});
				toast.error(t("general.error"));
			});
	}

	filter = option => {
		let { publishDate, status, category } = option;
		this.setState({
			page: 1,
			loading: true,
			publishDate,
			status,
			category,
		});
		const { t } = this.props;
		var searchObject = {};

		searchObject.text = this.state.text;
		searchObject.category = category;
		searchObject.publishDate = publishDate;
		searchObject.status = status;
		searchObject.pageIndex = this.state.page;
		searchObject.pageSize = this.state.rowsPerPage;
		searchObject.checkLanguage = this.props.i18n.language === "vi" ? 1 : 0;
		searchByDto(searchObject)
			.then(({ data }) => {
				this.setState({
					articleList: data.content,
					totalElements: data.totalElements,
					totalPage: data.totalPages,
					loading: false,
				});
			})
			.catch(() => {
				this.setState({
					articleList: [],
					loading: false,
				});
				toast.error(t("general.error"));
			});
	};

	render() {
		const { t, i18n } = this.props;
		const {
			rowsPerPage,
			page,
			articleList,
			shouldOpenConfirmationDialog,
			shouldOpenEditorDialog,
			checkedFilter,
			totalElements,
			totalPage,
			loading,
			text,
		} = this.state;

		let columns = [
			{
				title: t("general.action"),
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
					textAlign: "left",
				},
				render: rowData => (
					<MaterialButton
						item={rowData}
						onSelect={(rowData, method) => {
							if (method === 0) {
								getById(rowData.id).then(({ data }) => {
									this.setState({
										item: data,
										shouldOpenEditorDialog: true,
									});
								});
							} else if (method === 1) {
								this.handleDeleteArticle(rowData.id);
							} else {
								alert("Call Selected Here:" + rowData.id);
							}
						}}
					/>
				),
			},
			{
				title: t("article.title"),
				field: "title",
				align: "left",
				headerStyle: {
					minWidth: "150px",
					paddingLeft: "10px",
					paddingRight: "0px",
				},
				cellStyle: {
					minWidth: "150px",
					paddingLeft: "10px",
					paddingRight: "0px",
					textAlign: "left",
				},
			},
			{
				title: t("article.realAuthor"),
				field: "realAuthor",
				align: "left",
				headerStyle: {
					minWidth: "150px",
					paddingLeft: "10px",
					paddingRight: "0px",
				},
				cellStyle: {
					minWidth: "150px",
					paddingLeft: "10px",
					paddingRight: "0px",
					textAlign: "left",
				},
			},
			{
				title: t("article.publishDate"),
				field: "publishDate",
				align: "left",
				headerStyle: {
					minWidth: "150px",
					paddingLeft: "10px",
					paddingRight: "0px",
				},
				cellStyle: {
					minWidth: "150px",
					paddingLeft: "10px",
					paddingRight: "0px",
					textAlign: "left",
				},
				render: rowData =>
					rowData.publishDate ? (
						<span>
							{moment(rowData.publishDate).format("DD/MM/YYYY")}
						</span>
					) : (
						""
					),
			},
			{
				title: t("article.status"),
				field: "status",
				align: "left",
				headerStyle: {
					minWidth: "150px",
					paddingLeft: "10px",
					paddingRight: "0px",
				},
				cellStyle: {
					minWidth: "150px",
					paddingLeft: "10px",
					paddingRight: "0px",
					textAlign: "left",
				},
				render: rowData => {
					switch (rowData.status) {
						case 1:
							return (
								<span style={{ color: "red" }}>
									{t("article.approve.not")}
								</span>
							);
						case 2:
							return (
								<span style={{ color: "orange" }}>
									{t("article.approve.pen")}
								</span>
							);
						case 3:
							return (
								<span style={{ color: "green" }}>
									{t("article.approve.yes")}
								</span>
							);
						default:
							break;
					}
				},
			},
			{
				title: t("article.view"),
				field: "view",
				align: "left",
				headerStyle: {
					minWidth: "150px",
					paddingLeft: "10px",
					paddingRight: "0px",
				},
				cellStyle: {
					minWidth: "150px",
					paddingLeft: "10px",
					paddingRight: "0px",
					textAlign: "left",
				},
			},
			{
				title: t("category.category"),
				field: "categories.title",
				align: "left",
				headerStyle: {
					minWidth: "150px",
					paddingLeft: "10px",
					paddingRight: "0px",
				},
				cellStyle: {
					minWidth: "150px",
					paddingLeft: "10px",
					paddingRight: "0px",
					textAlign: "left",
				},
			},
			{
				title: t("article.tags"),
				field: "tags",
				align: "left",
				headerStyle: {
					minWidth: "150px",
					paddingLeft: "10px",
					paddingRight: "0px",
				},
				cellStyle: {
					minWidth: "150px",
					paddingLeft: "10px",
					paddingRight: "0px",
					textAlign: "left",
				},
			},
		];

		return (
			<div className="m-sm-30">
				<Helmet>
					<title>
						{t("article.articleTitle")} | {t("web_site")}
					</title>
				</Helmet>
				<div className="mb-sm-30">
					<Breadcrumb
						routeSegments={[{ name: t("article.articleTitle") }]}
					/>
				</div>

				<Grid
					container
					alignItems="flex-end"
					justifyContent="space-between"
				>
					<Grid item md={2} sm={3} className="mb-12">
						<Button
							startIcon={<Add />}
							variant="contained"
							color="primary"
							onClick={() => {
								this.handleEditArticle(null);
							}}
						>
							{t("general.add")}
						</Button>
					</Grid>

					<Grid
						item
						md={5}
						lg={4}
						sm={5}
						xs={12}
						className="flex flex-align-end mb-12"
					>
						<FormControl size="small" className="flex-grow-1 mr-8">
							<InputLabel htmlFor="standard-adornment">
								{t("EnterSearch")}
							</InputLabel>
							<Input
								id="standard-basic"
								type="text"
								name="text"
								value={text}
								label={t("EnterSearch")}
								onChange={this.handleSearchInputChange}
								onKeyDown={this.handleKeyDownEnterSearch}
								endAdornment={
									<InputAdornment position="end">
										<IconButton
											edge="end"
											onClick={() => this.search(text)}
										>
											<Search />
										</IconButton>
									</InputAdornment>
								}
							/>
						</FormControl>

						<Button
							className="px-16"
							variant="contained"
							color="secondary"
							onClick={this.handleCollapseFilter}
						>
							<Tune className="mr-4" />
							<span>{t("general.filter")}</span>
							<ArrowDropDown
								style={
									this.state.checkedFilter === true
										? {
												transform: "rotate(180deg)",
												transition: ".3s",
												paddingRight: 5,
										  }
										: {
												transform: "rotate(0deg)",
												transition: ".3s",
												paddingLeft: 5,
										  }
								}
							/>
						</Button>
					</Grid>

					<Grid item xs={12} className="mb-12">
						<Collapse
							in={checkedFilter}
							style={{
								width: "100%",
							}}
						>
							<ArticleFilter
								t={t}
								i18n={i18n}
								handleFilter={this.filter}
							/>
						</Collapse>
					</Grid>

					<Grid item xs={12}>
						<MaterialTable
							title={t("List")}
							data={articleList}
							columns={columns}
							isLoading={loading}
							options={{
								showEmptyDataSourceMessage: true,
								loadingType: "overlay",
								selection: false,
								actionsColumnIndex: -1,
								paging: false,
								search: false,
								rowStyle: (rowData, index) => ({
									backgroundColor:
										index % 2 === 1 ? "#EEE" : "#FFF",
								}),
								maxBodyHeight: "450px",
								minBodyHeight: "370px",
								headerStyle: {
									backgroundColor: "#2a80c8",
									color: "#fff",
									height: "50px",
								},
								padding: "dense",
								toolbar: false,
							}}
							onSelectionChange={rows => {
								this.data = rows;
							}}
							localization={{
								body: {
									emptyDataSourceMessage: `${t(
										"general.emptyDataMessageTable"
									)}`,
								},
							}}
						/>

						<NicePagination
							totalPages={totalPage}
							handleChangePage={this.handleChangePage}
							setRowsPerPage={this.handleChangeRowsPerPage}
							pageSize={rowsPerPage}
							pageSizeOption={[1, 2, 3, 5, 10, 25]}
							t={t}
							totalElements={totalElements}
							page={page}
						/>
					</Grid>

					{/* {shouldOpenConfirmationDeleteListDialog && (
						<ConfirmationDialog
							open={shouldOpenConfirmationDeleteListDialog}
							onConfirmDialogClose={this.handleDialogClose}
							onYesClick={this.handleDeleteListItem}
							title={t("confirm_dialog.delete_list.title")}
							text={t("confirm_dialog.delete_list.text")}
							agree={t("confirm_dialog.delete_list.agree")}
							cancel={t("confirm_dialog.delete_list.cancel")}
						/>
					)} */}

					{shouldOpenEditorDialog && (
						<ArticleEditorDialog
							t={t}
							i18n={i18n}
							handleClose={this.handleDialogClose}
							open={shouldOpenEditorDialog}
							item={this.state.item}
							handleOKDialog={this.handleOKDialog}
						/>
					)}

					{shouldOpenConfirmationDialog && (
						<ConfirmationDialog
							open={shouldOpenConfirmationDialog}
							onConfirmDialogClose={this.handleDialogClose}
							onYesClick={this.handleConfirmationResponse}
							title={t("confirm_dialog.delete.title")}
							text={t("confirm_dialog.delete.text")}
							agree={t("confirm_dialog.delete.agree")}
							cancel={t("confirm_dialog.delete.cancel")}
						/>
					)}
				</Grid>
			</div>
		);
	}
}

export default ArticleTable;
