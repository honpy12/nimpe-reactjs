import {
	Button,
	Checkbox,
	Icon,
	IconButton,
	Tooltip,
	FormControl,
	Input,
	InputAdornment,
	InputLabel,
	Grid,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Breadcrumb, ConfirmationDialog } from "egret";
import MaterialTable from "material-table";
import React, { Component } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NicePagination from "../Component/Pagination/NicePagination";
import CategoryDialog from "./CategoryEditorDialog";
import { deleteCategory, searchByPage } from "./CategoryService";
import { Add, Search } from "@material-ui/icons";
import { Helmet } from "react-helmet";

toast.configure({
	autoClose: 2000,
	draggable: false,
	limit: 3,
});

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

class CategoryTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			page: 1,
			rowsPerPage: 10,
			totalPage: 0,
			totalElements: 0,
			categories: [],
			loading: true,
			item: {},
			id: "",
			text: "",
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

	// Paging
	setPage = page => {
		this.setState({ page }, () => this.updatePageData());
	};

	setRowsPerPage = event => {
		this.setState({ rowsPerPage: event.target.value }, () =>
			this.updatePageData()
		);
	};

	handleChangePage = (event, newPage) => {
		this.setPage(newPage);
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

		searchByPage(searchObject)
			.then(({ data }) => {
				this.setState({
					categories: data.content,
					totalElements: data.totalElements,
					totalPage: data.totalPages,
					loading: false,
				});
			})
			.catch(() => {
				this.setState({
					categories: [],
					loading: false,
				});
				toast.error(t("general.error"));
			});
	};

	// Handle data
	handleEditItem = item => {
		this.setState({
			item,
			shouldOpenEditorDialog: true,
		});
	};

	handleDelete = id => {
		this.setState({
			id,
			shouldOpenConfirmationDialog: true,
		});
	};

	handleDialogClose = () => {
		this.setState({
			shouldOpenEditorDialog: false,
			shouldOpenConfirmationDialog: false,
		});
	};

	handleOKDialog = () => {
		this.setState({
			shouldOpenEditorDialog: false,
			shouldOpenConfirmationDialog: false,
		});
		this.updatePageData();
	};

	handleConfirmationResponse = () => {
		let { t } = this.props;
		deleteCategory(this.state.id)
			.then(response => {
				toast.success(t("dengueLocation.deleteDataSuccessfully"));
				this.handleOKDialog();
			})
			.catch(() => {
				toast.error(t("Đơn vị này đang được sử dụng. Không thể xóa"));
				this.handleDialogClose();
			});
	};

	// Search
	handleSearchInputChange = event => {
		this.setState({
			text: event.target.value,
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
		searchObject.pageIndex = this.state.page;
		searchObject.pageSize = this.state.rowsPerPage;
		searchObject.checkLanguage = this.props.i18n.language === "vi" ? 1 : 0;

		searchByPage(searchObject)
			.then(({ data }) => {
				this.setState({
					categories: data.content,
					totalElements: data.totalElements,
					totalPage: data.totalPages,
					loading: false,
				});
			})
			.catch(() => {
				this.setState({
					categories: [],
					loading: false,
				});
				toast.error(t("general.error"));
			});
	}

	render() {
		const { t, i18n } = this.props;

		const {
			rowsPerPage,
			page,
			totalElements,
			totalPage,
			categories,
			loading,
			text,
			shouldOpenConfirmationDialog,
			shouldOpenEditorDialog,
		} = this.state;

		let columns = [
			{
				title: t("general.action"),
				field: "custom",
				headerStyle: {
					width: "50px",
				},
				cellStyle: {
					width: "50px",
				},
				render: rowData => (
					<MaterialButton
						item={rowData}
						onSelect={(rowData, method) => {
							if (method === 0) {
								this.handleEditItem(rowData);
							} else if (method === 1) {
								this.handleDelete(rowData.id);
							} else {
								alert("Call Selected Here:" + rowData.id);
							}
						}}
					/>
				),
			},
			{
				title: t("category.code"),
				field: "code",
				headerStyle: {
					width: "100px",
				},
				cellStyle: {
					width: "100px",
				},
			},
			{
				title: t("category.title"),
				field: "title",
				headerStyle: {
					width: "200px",
				},
				cellStyle: {
					width: "200px",
				},
			},
			{
				title: t("category.description"),
				field: "description",
				headerStyle: {
					width: "250px",
				},
				cellStyle: {
					width: "250px",
				},
			},
			{
				title: t("category.active"),
				field: "active",
				headerStyle: {
					width: "50px",
				},
				cellStyle: {
					width: "50px",
				},
				render: rowData => (
					<>
						<Checkbox
							name="active"
							checked={rowData.active}
							disableTouchRipple
							color="primary"
						/>
					</>
				),
			},
		];

		return (
			<div className="m-sm-30">
				<Helmet>
					<title>
						{t("manage.category")} | {t("web_site")}
					</title>
				</Helmet>
				<div className="mb-sm-30">
					<Breadcrumb
						routeSegments={[
							{
								name: t("Dashboard.category"),
								path: "/directory/apartment",
							},
							{ name: t("category.category") },
						]}
					/>
				</div>

				<Grid
					container
					spacing={2}
					justifyContent="space-between"
					alignItems="flex-end"
				>
					<Grid item md={4}>
						<Button
							variant="contained"
							color="primary"
							startIcon={<Add />}
							onClick={() => this.handleEditItem(null)}
						>
							{t("general.add")}
						</Button>
					</Grid>

					<Grid item ms={3} lg={3}>
						<FormControl fullWidth size="small">
							<InputLabel htmlFor="standard-adornment">
								{t("EnterSearch")}
							</InputLabel>
							<Input
								id="standard-basic"
								className="w-100"
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
					</Grid>

					<Grid item xs={12}>
						<MaterialTable
							title={t("List")}
							data={categories}
							columns={columns}
							parentChildData={(row, rows) =>
								rows.find(a => a.id === row.parent?.id)
							}
							isLoading={loading}
							options={{
								showEmptyDataSourceMessage: true,
								selection: false,
								paging: false,
								search: false,
								toolbar: false,
								sorting: false,
								actionsColumnIndex: -1,
								maxBodyHeight: "450px",
								minBodyHeight: "370px",
								headerStyle: {
									backgroundColor: "#2a80c8",
									color: "#fff",
									height: "50px",
								},
								padding: "dense",
								loadingType: "overlay",
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
				</Grid>
				{shouldOpenEditorDialog && (
					<CategoryDialog
						handleClose={this.handleDialogClose}
						open={shouldOpenEditorDialog}
						item={this.state.item}
						t={t}
						i18n={i18n}
						handleOKDialog={this.handleOKDialog}
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
			</div>
		);
	}
}

export default CategoryTable;
