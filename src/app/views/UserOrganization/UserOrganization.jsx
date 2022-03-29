import { Button, Icon, IconButton } from "@material-ui/core";
import { Breadcrumb, ConfirmationDialog } from "egret";
import { saveAs } from "file-saver";
import MaterialTable from "material-table";
import React, { Component } from "react";
import { useTranslation } from "react-i18next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NicePagination from "../Component/Pagination/NicePagination";
import UserOrganizationEditorDialog from "./UserOrganizationEditorDialog";
import {
	deleteUserOrganizationUnit,
	getById,
	searchByDto,
} from "./UserOrganizationService";
import { Add } from "@material-ui/icons";
function MaterialButton(props) {
	const { t, i18n } = useTranslation();
	const item = props.item;
	return (
		<div>
			<IconButton size="small" onClick={() => props.onSelect(item, 0)}>
				<Icon fontSize="small" color="primary">
					edit
				</Icon>
			</IconButton>
			<IconButton size="small" onClick={() => props.onSelect(item, 1)}>
				<Icon fontSize="small" color="error">
					delete
				</Icon>
			</IconButton>
		</div>
	);
}
class UserOrganizationUnitTable extends Component {
	state = {
		rowsPerPage: 10,
		page: 0,
		administrativeList: [],
		totalElements: 0,
		totalPage: 0,
		item: {},
		shouldOpenEditorDialog: false,
		shouldOpenConfirmationDialog: false,
	};

	setPage = page => {
		this.setState({ page }, () => this.updatePageData());
	};

	setRowsPerPage = event => {
		this.setState({ rowsPerPage: event.target.value });
	};

	handleChangePage = (event, newPage) => {
		this.setPage(newPage);
	};
	handleDownload = () => {
		var blob = new Blob(["Hello, world!"], {
			type: "text/plain;charset=utf-8",
		});
		saveAs(blob, "hello world.txt");
	};

	handleDialogClose = () => {
		this.setState({
			shouldOpenEditorDialog: false,
			shouldOpenConfirmationDialog: false,
		});
		this.updatePageData();
	};

	handleDeleteHealthOrganizationUnit = id => {
		this.setState({
			id,
			shouldOpenConfirmationDialog: true,
		});
	};

	handleEditHealthOrganizationUnit = item => {
		this.setState({
			item: item,
			shouldOpenEditorDialog: true,
		});
	};

	handleConfirmationResponse = () => {
		deleteUserOrganizationUnit(this.state.id).then(() => {
			this.handleDialogClose();
		});
	};

	componentDidMount() {
		this.updatePageData();
	}

	updatePageData = () => {
		var searchObject = {};
		// searchObject.text = this.state.keyword;
		searchObject.pageIndex = this.state.page + 1;
		searchObject.pageSize = this.state.rowsPerPage;
		searchByDto(searchObject).then(({ data }) => {
			this.setState({
				administrativeList: [...data.content],
				totalElements: data.totalElements,
				totalPage: data.totalPages,
			});
		});
	};

	render() {
		// var blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"});
		// saveAs(blob, "hello world.txt");
		const { t, i18n } = this.props;
		let {
			rowsPerPage,
			page,
			administrativeList,
			shouldOpenConfirmationDialog,
			shouldOpenEditorDialog,
			totalElements,
			totalPage,
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
								getById(rowData.id).then(({ data }) => {
									this.setState({
										item: data,
										shouldOpenEditorDialog: true,
									});
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
				title: t("username"),
				field: "user.username",
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
				title: t("userOrganization.code"),
				field: "healthOrganization.name",
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
				title: t("userOrganization.name"),
				field: "administrativeUnit.name",
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
		return (
			<div className="m-sm-30">
				<div className="mb-sm-30">
					<Breadcrumb
						routeSegments={[{ name: t("userOrganization.title") }]}
					/>
				</div>
				<Button
					startIcon={<Add />}
					className="mb-16"
					variant="contained"
					color="primary"
					onClick={() =>
						this.setState({
							shouldOpenEditorDialog: true,
							item: {},
						})
					}
				>
					{t("Add")}
				</Button>
				<MaterialTable
					title={t("List")}
					data={administrativeList}
					columns={columns}
					parentChildData={(row, rows) => {
						var list = rows.find(
							a => a.id === row.healthOrganizationParent?.id
						);
						return list;
					}}
					options={{
						selection: false,
						actionsColumnIndex: -1,
						paging: false,
						search: false,
						rowStyle: (rowData, index) => ({
							backgroundColor: index % 2 === 1 ? "#EEE" : "#FFF",
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
					setRowsPerPage={this.setRowsPerPage}
					pageSize={rowsPerPage}
					pageSizeOption={[1, 2, 3, 5, 10, 25]}
					t={t}
					totalElements={totalElements}
					page={page}
				/>

				{shouldOpenEditorDialog && (
					<UserOrganizationEditorDialog
						handleClose={this.handleDialogClose}
						open={shouldOpenEditorDialog}
						item={this.state.item}
						t={t}
						i18n={i18n}
					/>
				)}
				{shouldOpenConfirmationDialog && (
					<ConfirmationDialog
						title={t("general.confirm")}
						open={shouldOpenConfirmationDialog}
						onConfirmDialogClose={this.handleDialogClose}
						onYesClick={this.handleConfirmationResponse}
						text="Are you sure to delete?"
						agree={t("general.agree")}
						cancel={t("general.cancel")}
					/>
				)}
				<ToastContainer />
			</div>
		);
	}
}

export default UserOrganizationUnitTable;
