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
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Add, Description, Search } from "@material-ui/icons";
import { Breadcrumb, ConfirmationDialog } from "egret";
import MaterialTable from "material-table";
import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "styles/globitsStyles.css";
import ImportExcelDialog from "../Component/ImportExcel/SingleExcelFileUpload";
import NicePagination from "../Component/Pagination/NicePagination";
import AdministrativeUnitEditorDialog from "./AdministrativeUnitEditorDialog";
import {
	deleteAdministrativeUnit,
	getById,
	searchByDto,
} from "./AdministrativeUnitService";

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

class AdministrativeUnitTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			page: 1,
			rowsPerPage: 10,
			administrativeList: [],
			totalElements: 0,
			item: {},
			id: "",
			shouldOpenEditorDialog: false,
			shouldOpenConfirmationDialog: false,
			shouldOpenImportExcelDialog: false,
			text: "",
			totalPage: 0,
			loading: true,
		};
	}

	componentDidMount() {
		this.updatePageData();
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
			shouldOpenImportExcelDialog: false,
		});
	};

	handleOK = () => {
		this.setState(
			{
				shouldOpenEditorDialog: false,
				shouldOpenConfirmationDialog: false,
				shouldOpenImportExcelDialog: false,
			},
			() => this.updatePageData()
		);
	};

	handleCloseImport = data => {
		this.setState(
			{
				shouldOpenImportExcelDialog: false,
			},
			() => {
				this.updatePageData();
			}
		);
	};

	handleEditAdministrativeUnit = item => {
		this.setState({
			item: item,
			shouldOpenEditorDialog: true,
		});
	};

	handleDeleteAdministrativeUnit = item => {
		this.setState({
			item,
			shouldOpenConfirmationDialog: true,
		});
	};

	updatePageData = () => {
		const { t } = this.props;
		var searchObject = {};
		this.setState({
			loading: true,
		});
		searchObject.pageIndex = this.state.page;
		searchObject.pageSize = this.state.rowsPerPage;
		searchByDto(searchObject)
			.then(({ data }) => {
				this.setState({
					administrativeList: data.content,
					totalElements: data.totalElements,
					totalPage: data.totalPages,
					loading: false,
				});
			})
			.catch(() => {
				this.setState({
					administrativeList: [],
					loading: false,
				});
				toast.error(t("general.error"));
			});
	};

	handleEditItem = item => {
		this.setState({
			item: item,
			shouldOpenEditorDialog: true,
		});
	};

	importExcel = () => {
		this.setState({
			shouldOpenImportExcelDialog: true,
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
		searchObject.pageIndex = this.state.page;
		searchObject.pageSize = this.state.rowsPerPage;
		searchByDto(searchObject)
			.then(({ data }) => {
				this.setState({
					administrativeList: data.content,
					totalElements: data.totalElements,
					totalPage: data.totalPages,
					loading: false,
				});
			})
			.catch(() => {
				this.setState({
					administrativeList: [],
					loading: false,
				});
				toast.error(t("general.error"));
			});
	}

	handleConfirmationResponse = () => {
		const { t } = this.props;
		deleteAdministrativeUnit(this.state.item.id)
			.then(() => {
				toast.success(t("general.deleteSuccess"));
				this.handleOK();
			})
			.catch(() => {
				toast.error(t("general.error"));
				this.handleDialogClose();
			});
	};

	render() {
		const { t, i18n } = this.props;
		const {
			rowsPerPage,
			page,
			administrativeList,
			totalElements,
			item,
			shouldOpenConfirmationDialog,
			shouldOpenEditorDialog,
			shouldOpenImportExcelDialog,
			text,
			totalPage,
			loading,
		} = this.state;

		const columns = [
			{
				title: t("general.action"),
				field: "custom",
				align: "left",
				width: "250",
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
								this.handleDeleteAdministrativeUnit(rowData);
							} else {
								alert("Call Selected Here:" + rowData.id);
							}
						}}
					/>
				),
			},
			{
				title: t("administrativeUnit.code"),
				field: "code",
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
			},
			{
				title: t("administrativeUnit.name"),
				field: "name",
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
			},
			{
				title: t("administrativeUnit.level"),
				field: "level",
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
				title: t("administrativeUnit.selectParent"),
				field: "parent",
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
					<>{rowData.parent ? rowData.parent.name : ""}</>
				),
			},
		];

		return (
			<div className="m-sm-30">
				<Helmet>
					<title>
						{t("administrativeUnit.title")} | {t("web_site")}
					</title>
				</Helmet>
				<div className="mb-sm-30">
					<Breadcrumb
						routeSegments={[
							{
								name: t("Dashboard.category"),
								path: "/directory/apartment",
							},
							{ name: t("administrativeUnit.title") },
						]}
					/>
				</div>

				<Grid
					container
					spacing={2}
					justifyContent="space-between"
					alignItems="flex-end"
				>
					<Grid item sm={6} md={6} lg={6}>
						<Button
							startIcon={<Add />}
							variant="contained"
							color="primary"
							onClick={() => {
								this.handleEditItem(null);
							}}
						>
							{t("general.add")}
						</Button>
						<Button
							className="ml-16"
							startIcon={<Description />}
							variant="contained"
							color="secondary"
							onClick={this.importExcel}
						>
							{t("general.importExcel")}
						</Button>
					</Grid>

					<Grid item sm={4} md={3}>
						<FormControl className="w-100" size="small">
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
					</Grid>

					<Grid item xs={12}>
						<div>
							<MaterialTable
								title={t("List")}
								data={administrativeList}
								columns={columns}
								isLoading={loading}
								options={{
									showEmptyDataSourceMessage: true,
									selection: false,
									sorting: false,
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
							{/* Dialog */}
							{shouldOpenEditorDialog && (
								<AdministrativeUnitEditorDialog
									handleClose={this.handleDialogClose}
									handleOK={this.handleOK}
									open={shouldOpenEditorDialog}
									item={item}
									t={t}
									i18n={i18n}
								/>
							)}
							{shouldOpenConfirmationDialog && (
								<ConfirmationDialog
									open={shouldOpenConfirmationDialog}
									onConfirmDialogClose={
										this.handleDialogClose
									}
									title={t("general.confirm")}
									text={t("general.deleteConfirm")}
									onYesClick={this.handleConfirmationResponse}
									agree={t("general.agree")}
									cancel={t("general.cancel")}
								/>
							)}
							{shouldOpenImportExcelDialog && (
								<ImportExcelDialog
									t={t}
									handleClose={this.handleCloseImport}
									open={shouldOpenImportExcelDialog}
									urlPath={"/api/admin-unit/import"}
									onHandleDataImportExcel={
										this.handleCloseImport
									}
								/>
							)}
						</div>
					</Grid>
				</Grid>
			</div>
		);
	}
}

export default AdministrativeUnitTable;
