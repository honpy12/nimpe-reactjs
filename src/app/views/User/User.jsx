import {
	Button,
	Checkbox,
	FormControl,
	Grid,
	Icon,
	IconButton,
	Input,
	InputAdornment,
	InputLabel,
	Tooltip,
	withStyles,
} from "@material-ui/core";
import { Add, Search } from "@material-ui/icons";
import { Breadcrumb, ConfirmationDialog } from "egret";
import MaterialTable from "material-table";
import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NicePagination from "../Component/Pagination/NicePagination";
import UserEditorDialog from "./UserEditorDialog";
import { deleteUser, searchByPage, searchUser } from "./UserService";

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

class User extends Component {
	state = {
		keyword: "",
		rowsPerPage: 10,
		page: 1,
		totalPage: 0,
		eQAHealthOrgType: [],
		item: {},
		shouldOpenEditorDialog: false,
		shouldOpenConfirmationDialog: false,
		selectAllItem: false,
		selectedList: [],
		totalElements: 0,
		shouldOpenConfirmationDeleteAllDialog: false,
		text: "",
		loading: true,
		id: "",
	};
	numSelected = 0;
	rowCount = 0;

	setPage = page => {
		this.setState({ page }, function () {
			this.updatePageData();
		});
	};

	setRowsPerPage = event => {
		this.setState({ rowsPerPage: event.target.value }, function () {
			this.updatePageData();
		});
	};

	handleChangePage = (event, newPage) => {
		this.setPage(newPage);
	};

	handleTextChange = event => {
		this.setState({ text: event.target.value });
	};

	handleKeyDownEnterSearch = e => {
		if (e.key === "Enter") {
			this.search();
		}
	};

	search() {
		this.setState({ page: 1, loading: true }, function () {
			var searchObject = {};
			searchObject.keyword = this.state.text;
			searchObject.pageIndex = 1;
			searchObject.pageSize = this.state.rowsPerPage;
			searchUser(searchObject).then(({ data }) => {
				this.setState({
					itemList: [...data.content],
					totalElements: data.totalElements,
					totalPage: data.totalPages,
					loading: false,
				});
			});
		});
	}

	updatePageData = () => {
		var searchObject = {};
		this.setState({ loading: true });
		searchObject.pageIndex = this.state.page;
		searchObject.pageSize = this.state.rowsPerPage;
		searchByPage(searchObject).then(({ data }) => {
			this.setState({
				itemList: [...data.content],
				totalElements: data.totalElements,
				totalPage: data.totalPages,
				loading: false,
			});
		});
	};

	handleDialogClose = () => {
		this.setState({
			shouldOpenEditorDialog: false,
			shouldOpenConfirmationDialog: false,
			shouldOpenConfirmationDeleteAllDialog: false,
		});
	};

	handleOKEditClose = () => {
		this.setState(
			{
				shouldOpenEditorDialog: false,
				shouldOpenConfirmationDialog: false,
			},
			() => this.updatePageData()
		);
	};

	handleDeleteUser = id => {
		this.setState({
			id,
			shouldOpenConfirmationDialog: true,
		});
	};

	handleConfirmationResponse = () => {
		const { t } = this.props;
		deleteUser(this.state.id)
			.then(() => {
				toast.success(t("general.deleteSuccess"));
				this.handleOKEditClose();
			})
			.catch(() => {
				toast.error(t("Tài khoản đang được sử dụng. Không thể xóa"));
				this.handleDialogClose();
			});
	};

	componentDidMount() {
		this.updatePageData();
	}

	handleEditItem = item => {
		this.setState({
			item: item,
			shouldOpenEditorDialog: true,
		});
	};

	handleDelete = id => {
		this.setState({
			id,
			shouldOpenConfirmationDialog: true,
		});
	};

	// async handleDeleteList(list) {
	// 	for (var i = 0; i < list.length; i++) {
	// 		await deleteItem(list[i].id);
	// 	}
	// }

	// handleDeleteAll = () => {
	// 	//alert(this.data.length);
	// 	this.handleDeleteList(this.data).then(() => {
	// 		this.updatePageData();
	// 		this.handleDialogClose();
	// 	});
	// };

	render() {
		const { t, i18n } = this.props;
		let {
			rowsPerPage,
			page,
			totalElements,
			itemList,
			item,
			shouldOpenConfirmationDialog,
			shouldOpenEditorDialog,
			totalPage,
			loading,
			text,
		} = this.state;

		let columns = [
			{
				title: t("general.action"),
				field: "custom",
				align: "left",
				width: "100",
				headerStyle: {
					minWidth: "100px",
					paddingLeft: "10px",
					paddingRight: "0px",
				},
				cellStyle: {
					minWidth: "100px",
					paddingLeft: "10px",
					paddingRight: "0px",
					textAlign: "left",
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
				title: t("username"),
				field: "username",
				width: "100",
				headerStyle: {
					minWidth: "100px",
					paddingLeft: "10px",
					paddingRight: "0px",
				},
				cellStyle: {
					minWidth: "100px",
					paddingLeft: "10px",
					paddingRight: "0px",
					textAlign: "left",
				},
			},
			{
				title: t("user.displayName"),
				field: "person.displayName",
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
				title: t("user.active"),
				field: "active",
				align: "left",
				width: "100",
				headerStyle: {
					minWidth: "100px",
					paddingLeft: "10px",
					paddingRight: "0px",
				},
				cellStyle: {
					minWidth: "100px",
					paddingLeft: "10px",
					paddingRight: "0px",
					textAlign: "left",
				},
				render: rowData => (
					<>
						<Checkbox checked={rowData.active} disableRipple />
					</>
				),
			},
			{
				title: t("user.role"),
				field: "custom",
				align: "left",
				width: "200",
				headerStyle: {
					minWidth: "200px",
					paddingLeft: "10px",
					paddingRight: "0px",
				},
				cellStyle: {
					minWidth: "200px",
					paddingLeft: "10px",
					paddingRight: "0px",
					textAlign: "left",
				},
				render: rowData => rowData?.roles[0]?.name,
			},
			{
				title: t("user.email"),
				field: "person.email",
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
				title: t("user.address"),
				field: "person.birthPlace",
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
			},
		];

		return (
			<div className="m-sm-30">
				<Helmet>
					<title>
						{t("user.title")} | {t("web_site")}
					</title>
				</Helmet>
				<div className="mb-sm-30">
					<Breadcrumb
						routeSegments={[
							{
								name: t("Dashboard.manage"),
								path: "/directory/apartment",
							},
							{ name: t("user.title") },
						]}
					/>
				</div>

				<Grid
					container
					spacing={2}
					alignItems="flex-end"
					justifyContent="space-between"
				>
					<Grid item sm={4} lg={3}>
						<Button
							className="align-bottom"
							variant="contained"
							color="primary"
							startIcon={<Add />}
							onClick={() => {
								this.handleEditItem(null);
							}}
						>
							{t("general.add")}
						</Button>
					</Grid>

					<Grid item sm={4} md={3} lg={3}>
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
								onChange={this.handleTextChange}
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
					<Grid item sm={12} md={12}>
						<MaterialTable
							title={t("List")}
							data={itemList}
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
							setRowsPerPage={this.setRowsPerPage}
							page={page}
							pageSize={rowsPerPage}
							pageSizeOption={[1, 2, 3, 5, 10, 25]}
							t={t}
							totalElements={totalElements}
						/>
					</Grid>
					{shouldOpenEditorDialog && (
						<UserEditorDialog
							t={t}
							i18n={i18n}
							handleClose={this.handleDialogClose}
							open={shouldOpenEditorDialog}
							handleOKEditClose={this.handleOKEditClose}
							item={item}
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
				</Grid>
			</div>
		);
	}
}

export default User;
