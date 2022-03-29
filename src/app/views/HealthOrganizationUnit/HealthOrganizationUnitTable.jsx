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
	MenuItem,
	TextField,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Add, Search } from "@material-ui/icons";
import { Breadcrumb, ConfirmationDialog } from "egret";
import MaterialTable from "material-table";
import React, { Component } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "styles/globitsStyles.css";
import NicePagination from "../Component/Pagination/NicePagination";
import HealthOrganizationUnitEditorDialog from "./HealthOrganizationUnitEditorDialog";
import {
	deleteHealthOrganization,
	searchByDto,
} from "./HealthOrganizationUnitService";
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

class HealthOrganizationUnitTable extends Component {
	constructor(props) {
		super(props);

		this.state = {
			page: 1,
			rowsPerPage: 10,
			healOrganizationList: [],
			totalElements: 0,
			totalPage: 0,
			item: {},
			id: "",
			text: "",
			orgType: "",
			shouldOpenEditorDialog: false,
			shouldOpenConfirmationDialog: false,
			loading: true,
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
				page: 0,
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
		this.updatePageData();
	};

	handleEditHealthOrganizationUnit = item => {
		this.setState({
			item: item,
			shouldOpenEditorDialog: true,
		});
	};

	handleDeleteHealthOrganizationUnit = id => {
		this.setState({
			id,
			shouldOpenConfirmationDialog: true,
		});
	};

	handleConfirmationResponse = () => {
		const { t } = this.props;
		deleteHealthOrganization(this.state.id)
			.then(() => {
				this.handleDialogClose();
				toast.success(t("general.deleteSuccess"));
			})
			.then(() => this.handleDialogClose())
			.catch(() => toast.error(t("general.error")));
	};

	updatePageData = () => {
		const { t } = this.props;
		var searchObject = {};
		this.setState({
			page: 1,
			loading: true,
			text: "",
			orgType: "",
		});
		searchObject.name = "";
		searchObject.orgType = -1;
		searchObject.pageIndex = this.state.page;
		searchObject.pageSize = this.state.rowsPerPage;
		searchObject.checkLanguage = this.props.i18n.language === "vi" ? 1 : 0;
		searchByDto(searchObject)
			.then(({ data }) => {
				this.setState({
					healOrganizationList: [...data.content],
					totalElements: data.totalElements,
					totalPage: data.totalPages,
					loading: false,
				});
			})
			.catch(() => {
				this.setState({
					loading: false,
				});
				toast.error(t("general.error"));
			});
	};

	handleCollapseFilter = () => {
		let { checkedFilter } = this.state;
		this.setState({ checkedFilter: !checkedFilter });
	};

	handleEditItem = item => {
		this.setState({
			item: item,
			shouldOpenEditorDialog: true,
		});
	};

	handleSearchInputChange = event => {
		this.setState({
			[event.target.name]: event.target.value,
		});
		if (event.target.value === "") {
			this.setState(
				{
					loading: true,
				},
				() => this.search()
			);
		}
	};

	handleKeyDownEnterSearch = e => {
		if (e.key === "Enter") {
			this.search();
		}
	};

	search() {
		var searchObject = {};
		const { t } = this.props;
		this.setState({ page: 1, loading: true });
		searchObject.name = this.state.text;
		searchObject.orgType = this.state.orgType;
		searchObject.pageIndex = this.state.page;
		searchObject.pageSize = this.state.rowsPerPage;
		searchObject.checkLanguage = this.props.i18n.language === "vi" ? 1 : 0;
		searchByDto(searchObject)
			.then(({ data }) => {
				this.setState({
					healOrganizationList: data.content,
					totalElements: data.totalElements,
					totalPage: data.totalPages,
					loading: false,
				});
			})
			.catch(() => {
				this.setState({
					loading: false,
				});
				toast.error(t("general.error"));
			});
	}

	handleFilterChange = event => {
		this.setState(
			{
				orgType: event.target.value,
			},
			() => this.search()
		);
	};

	render() {
		const { t, i18n } = this.props;
		let {
			rowsPerPage,
			page,
			healOrganizationList,
			totalPage,
			totalElements,
			item,
			shouldOpenConfirmationDialog,
			shouldOpenEditorDialog,
			text,
			loading,
			orgType,
		} = this.state;

		let columns = [
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
								this.setState({
									item: rowData,
									shouldOpenEditorDialog: true,
								});
							} else if (method === 1) {
								this.handleDeleteHealthOrganizationUnit(
									rowData.id
								);
							} else {
								alert("Call Selected Here:" + rowData.id);
							}
						}}
					/>
				),
			},
			{
				title: t("healthOrganization.code"),
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
				title: t("healthOrganization.name"),
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
				title: t("healthOrganization.type"),
				field: "type",
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
				render: rowData => {
					switch (rowData.orgType) {
						case 1:
							return <>{t("healthOrganization.reviewUnit")}</>;
						case 2:
							return <>{t("healthOrganization.screeningUnit")}</>;
						case 3:
							return (
								<>{t("healthOrganization.managementUnit")}</>
							);
						case 4:
							return (
								<>{t("healthOrganization.affirmationUnit")}</>
							);
						case 5:
							return <>{t("healthOrganization.treatmentUnit")}</>;
						default:
							break;
					}
				},
			},
			{
				title: t("healthOrganization.address"),
				field: "address",
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
				title: t("healthOrganization.description"),
				field: "description",
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
		];

		const listOrganizationType = [
			{
				label: t("all"),
				value: -1,
			},
			{
				label: t("healthOrganization.reviewUnit"),
				value: 1,
			},
			{
				label: t("healthOrganization.screeningUnit"),
				value: 2,
			},
			{
				label: t("healthOrganization.managementUnit"),
				value: 3,
			},
			{
				label: t("healthOrganization.affirmationUnit"),
				value: 4,
			},
			{
				label: t("healthOrganization.treatmentUnit"),
				value: 5,
			},
		];

		return (
			<div className="m-sm-30">
				<Helmet>
					<title>
						{t("healthOrganization.title")} | {t("web_site")}
					</title>
				</Helmet>
				<div className="mb-sm-30">
					<Breadcrumb
						routeSegments={[
							{ name: t("healthOrganization.title") },
						]}
					/>
				</div>

				<Grid container spacing={2} alignItems="flex-end">
					<Grid item md={2} lg={2} sm={12} xs={12}>
						<Button
							startIcon={<Add />}
							color="primary"
							variant="contained"
							onClick={() => {
								this.handleEditItem(null);
							}}
						>
							{t("general.add")}
						</Button>
					</Grid>

					<Grid
						item
						sm={6}
						md={6}
						lg={5}
						xs={12}
						className="flex ml-auto"
						style={{ alignItems: "flex-end" }}
					>
						<TextField
							select
							label={t("healthOrganization.type")}
							value={orgType}
							onChange={this.handleFilterChange}
							className="w-100 mr-16"
						>
							{listOrganizationType.map(option => (
								<MenuItem
									key={option.value}
									value={option.value}
								>
									{option.label}
								</MenuItem>
							))}
						</TextField>

						<FormControl size="small" className="w-100">
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
						<MaterialTable
							title={t("List")}
							data={healOrganizationList}
							columns={columns}
							isLoading={loading}
							options={{
								showEmptyDataSourceMessage: true,
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
							page={page}
							pageSize={rowsPerPage}
							pageSizeOption={[1, 2, 3, 5, 10, 25]}
							t={t}
							totalElements={totalElements}
						/>
					</Grid>
				</Grid>

				{shouldOpenEditorDialog && (
					<HealthOrganizationUnitEditorDialog
						t={t}
						i18n={i18n}
						handleClose={this.handleDialogClose}
						open={shouldOpenEditorDialog}
						item={item}
						updatePageData={this.updatePageData}
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

export default HealthOrganizationUnitTable;
