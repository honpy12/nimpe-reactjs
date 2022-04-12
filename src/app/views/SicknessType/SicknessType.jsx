import {
	Button,
	FormControl,
	Grid,
	Icon,
	IconButton,
	Input,
	InputAdornment,
	Link,
} from "@material-ui/core";
import { Add, Delete } from "@material-ui/icons";
import SearchIcon from "@material-ui/icons/Search";
import { Breadcrumb, ConfirmationDialog } from "egret";
import MaterialTable, { MTableToolbar } from "material-table";
import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import NicePagination from "../Component/Pagination/NicePagination";
import SicknessTypeDialog from "./SicknessTypeDialog";
import { deleteItem, getItemById, searchByPage } from "./SicknessTypeService";

toast.configure({
	autoClose: 2000,
	draggable: false,
	limit: 3,
});

function MaterialButton(props) {
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

class SpecimenType extends Component {
	state = {
		keyWord: "",
		rowsPerPage: 10,
		page: 0,
		item: {},
		shouldOpenEditorDialog: false,
		shouldOpenConfirmationDialog: false,
		shouldOpenConfirmDialog: false,
		selectAllItem: false,
		selectedList: [],
		totalElements: 0,
		totalPages: 0,
		shouldOpenConfirmationDeleteAllDialog: false,
	};
	numSelected = 0;
	rowCount = 0;

	handleTextChange = event => {
		this.setState({ keyWord: event.target.value }, function () {});
	};

	handleKeyDownEnterSearch = e => {
		if (e.key === "Enter") {
			this.search();
		}
	};

	setPage = page => {
		this.setState({ page }, function () {
			this.updatePageData();
		});
	};

	setRowsPerPage = event => {
		this.setState(
			{ rowsPerPage: event.target.value, page: 0 },
			function () {
				this.updatePageData();
			}
		);
	};

	handleChangePage = (event, newPage) => {
		this.setPage(newPage);
	};

	handleChangeRowsPerPage = event => {
		this.setState(
			{
				rowsPerPage: parseInt(event.target.value, 10),
				page: 1,
			},
			() => this.updatePageData()
		);
	};

	search() {
		this.setState({ page: 0 }, function () {
			var searchObject = {};
			searchObject.keyWord = this.state.keyWord;
			searchObject.pageIndex = this.state.page + 1;
			searchObject.pageSize = this.state.rowsPerPage;

			searchByPage(searchObject).then(({ data }) => {
				let itemListClone = [...data.content];
				this.setState({
					itemList: itemListClone,
					totalElements: data.totalElements,
					totalPage: data.totalPage,
				});
			});
		});
	}

	updatePageData = () => {
		var searchObject = {};
		searchObject.keyWord = this.state.keyWord;
		searchObject.pageIndex = this.state.page + 1;
		searchObject.pageSize = this.state.rowsPerPage;
		searchByPage(searchObject).then(({ data }) => {
			let itemListClone = [...data.content];
			this.setState({
				itemList: itemListClone,
				totalElements: data.totalElements,
				totalPage: data.totalPage,
			});
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
			shouldOpenConfirmationDeleteAllDialog: false,
			shouldOpenConfirmDialog: false,
		});
	};

	handleOKEditClose = () => {
		this.setState({
			shouldOpenEditorDialog: false,
			shouldOpenConfirmationDialog: false,
		});
		this.updatePageData();
	};

	handleConfirmationResponse = () => {
		let { t } = this.props;
		deleteItem(this.state.id)
			.then(() => {
				this.updatePageData();
				this.handleDialogClose();
				toast.success("Xóa thành công");
			})
			.catch(() => {
				toast.error(t("general.error"));
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
		console.log(item);
	};

	async handleDeleteList(list) {
		for (var i = 0; i < list.length; i++) {
			await deleteItem(list[i].id);
		}
	}

	handleDeleteAll = event => {
		let { t } = this.props;
		if (this.data != null) {
			this.handleDeleteList(this.data).then(() => {
				this.updatePageData();
				this.handleDialogClose();
				toast.success("Xóa thành công");
			});
		} else {
			toast.warning(t("general.select_data"));
			this.handleDialogClose();
		}
	};

	render() {
		const { t, i18n } = this.props;
		let {
			keyWord,
			rowsPerPage,
			page,
			itemList,
			item,
			shouldOpenConfirmationDialog,
			shouldOpenEditorDialog,
			shouldOpenConfirmationDeleteAllDialog,
			totalPage,
			totalElements,
		} = this.state;

		let columns = [
			{
				title: t("general.action"),
				field: "custom",
				align: "left",
				width: "250",

				render: rowData => (
					<MaterialButton
						item={rowData}
						onSelect={(rowData, method) => {
							console.log(rowData);
							if (method === 0) {
								getItemById(rowData.id).then(({ data }) => {
									console.log(rowData.id);
									if (data.parent === null) {
										data.parent = {};
									}
									this.setState({
										item: data,
										shouldOpenEditorDialog: true,
									});
									console.log("item1" + item);
								});
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
				title: t("sicknessType.code"),
				field: "code",
				align: "left",
				width: "100",
			},
			{
				title: t("sicknessType.name"),
				field: "name",
				align: "left",
				width: "100",
			},
			{
				title: t("sicknessType.description"),
				field: "description",
				align: "left",
				width: "100",
			},
		];

		return (
			<div className="m-sm-30">
				<Helmet>
					<title>
						{t("sicknessType.title")} | {t("web_site")}
					</title>
				</Helmet>
				<div className="mb-sm-30">
					<Breadcrumb
						routeSegments={[
							{
								name: t("Dashboard.category"),
								path: "/directory/apartment",
							},
							{ name: t("sicknessType.title") },
						]}
					/>
				</div>

				<Grid
					container
					spacing={2}
					alignItems="flex-end"
					justifyContent="space-between"
				>
					<Grid item lg={4} md={4} sm={12} xs={12}>
						<Button
							className="mr-16"
							variant="contained"
							color="primary"
							startIcon={<Add />}
							onClick={() => {
								this.handleEditItem({
									startDate: new Date(),
									endDate: new Date(),
									isAddnew: true,
								});
							}}
						>
							{t("general.add")}
						</Button>
						{/* <Button
							className="mr-36"
							variant="contained"
							color="secondary"
							startIcon={<Delete />}
							onClick={() =>
								this.setState({
									shouldOpenConfirmationDeleteAllDialog: true,
								})
							}
						>
							{t("general.delete")}
						</Button> */}
					</Grid>

					{shouldOpenConfirmationDeleteAllDialog && (
						<ConfirmationDialog
							open={shouldOpenConfirmationDeleteAllDialog}
							onConfirmDialogClose={this.handleDialogClose}
							onYesClick={this.handleDeleteAll}
							title={t("general.confirm")}
							text={t("general.deleteAllConfirm")}
							agree={t("general.agree")}
							cancel={t("general.cancel")}
						/>
					)}

					<Grid item lg={3} md={3} sm={12} xs={12}>
						<FormControl fullWidth>
							<Input
								className="mt-10 search_box w-100 stylePlaceholder"
								type="text"
								name="keyWord"
								value={keyWord}
								onChange={this.handleTextChange}
								onKeyDown={this.handleKeyDownEnterSearch}
								placeholder={t("general.enterSearch")}
								id="search_box"
								startAdornment={
									<InputAdornment>
										<Link to="#">
											<SearchIcon
												cursor="pointer"
												onClick={() =>
													this.search(keyWord)
												}
												style={{
													position: "absolute",
													top: "0",
													right: "0",
												}}
											/>
										</Link>
									</InputAdornment>
								}
							/>
						</FormControl>
					</Grid>

					<Grid item xs={12}>
						<div>
							{shouldOpenEditorDialog && (
								<SicknessTypeDialog
									t={t}
									i18n={i18n}
									handleClose={this.handleDialogClose}
									open={shouldOpenEditorDialog}
									handleOKEditClose={this.handleOKEditClose}
									item={
										this.state.item ? this.state.item : {}
									}
								/>
							)}

							{shouldOpenConfirmationDialog && (
								<ConfirmationDialog
									title={t("general.confirm")}
									open={shouldOpenConfirmationDialog}
									onConfirmDialogClose={
										this.handleDialogClose
									}
									onYesClick={this.handleConfirmationResponse}
									text={t("general.deleteConfirm")}
									agree={t("general.agree")}
									cancel={t("general.cancel")}
								/>
							)}
						</div>

						<MaterialTable
							data={itemList}
							columns={columns}
							parentChildData={(row, rows) => {
								var list = rows.find(
									a => a.id === row.parentId
								);
								return list;
							}}
							options={{
								selection: true,
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
								},
								padding: "dense",
								toolbar: false,
							}}
							components={{
								Toolbar: props => <MTableToolbar {...props} />,
							}}
							onSelectionChange={rows => {
								this.data = rows;
								// this.setState({selectedItems:rows});
							}}
							actions={[
								{
									tooltip: "Remove All Selected Users",
									icon: "delete",
									onClick: (evt, data) => {
										this.handleDeleteAll(data);
										alert(
											"You want to delete " +
												data.length +
												" rows"
										);
									},
								},
							]}
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
			</div>
		);
	}
}

export default SpecimenType;
