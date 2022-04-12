import { Button, Grid, Icon, IconButton, Tooltip } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Breadcrumb, ConfirmationDialog } from "egret";
import MaterialTable, { MTableToolbar } from "material-table";
import React from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import NotificationPopup from "../Component/NotificationPopup/NotificationPopup";
import NicePagination from "../Component/Pagination/NicePagination";
import MenuDialog from "./MenuDialog";
import { deleteItem, getAllByRoot, getItemById } from "./MenuService";
import { Add } from "@material-ui/icons";
const LightTooltip = withStyles(theme => ({
	tooltip: {
		backgroundColor: theme.palette.common.white,
		color: "rgba(0, 0, 0, 0.87)",
		boxShadow: theme.shadows[1],
		fontSize: 11,
		position: "absolute",
		top: "-15px",
		left: "-30px",
		width: "80px",
	},
}))(Tooltip);

function MaterialButton(props) {
	const { t, i18n } = useTranslation();
	const item = props.item;
	return (
		<div className="none_wrap">
			<LightTooltip
				title={t("general.editIcon")}
				placement="right-end"
				enterDelay={300}
				leaveDelay={200}
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
				placement="right-end"
				enterDelay={300}
				leaveDelay={200}
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
class Menu extends React.Component {
	state = {
		rowsPerPage: 5,
		page: 0,
		data: [],
		totalElements: 0,
		totalPage: 0,
		itemList: [],
		shouldOpenEditorDialog: false,
		shouldOpenConfirmationDialog: false,
		shouldOpenConfirmationDeleteAllDialog: false,
		keyword: "",
		shouldOpenNotificationPopup: false,
		Notification: "",
	};
	constructor(props) {
		super(props);
		//this.state = {keyword: ''};
		this.handleTextChange = this.handleTextChange.bind(this);
	}
	handleTextChange(event) {
		this.setState({ keyword: event.target.value });
	}

	handleKeyDownEnterSearch = e => {
		if (e.key === "Enter") {
			this.search();
		}
	};
	componentDidMount() {
		this.updatePageData();
	}
	getListItemChild(item) {
		var result = [];
		var root = {};
		root.name = item.name;
		root.description = item.description;
		root.code = item.code;
		root.icon = item.icon;
		root.path = item.path;
		root.id = item.id;
		root.parentId = item.parentId;
		result.push(root);
		if (item.children) {
			item.children.forEach(child => {
				var childs = this.getListItemChild(child);
				result.push(...childs);
			});
		}
		return result;
	}
	updatePageData = () => {
		var searchObject = {};
		searchObject.keyword = "";
		searchObject.pageIndex = this.state.page + 1;
		searchObject.pageSize = this.state.rowsPerPage;
		getAllByRoot().then(({ data }) => {
			var itemList = [...data];
			var list = [];
			itemList.forEach(item => {
				var items = this.getListItemChild(item);
				list.push(...items);
			});
			console.log(list);
			this.setState({
				itemList: list,
				totalElements: data.totalElements,
				totalPage: data.totalPages,
			});
		});
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

	handleOKEditClose = () => {
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

	handleDelete = id => {
		this.setState({
			id,
			shouldOpenConfirmationDialog: true,
		});
	};
	handleDialogClose = () => {
		this.setState(
			{
				shouldOpenEditorDialog: false,
				shouldOpenConfirmationDialog: false,
				shouldOpenConfirmationDeleteAllDialog: false,
				shouldOpenNotificationPopup: false,
				data: [],
			},
			() => {
				this.updatePageData();
			}
		);
	};

	handleOKEditClose = () => {
		this.setState({
			shouldOpenEditorDialog: false,
			shouldOpenConfirmationDialog: false,
			shouldOpenConfirmationDeleteAllDialog: false,
		});
		this.setPage(0);
	};

	handleDelete = id => {
		this.setState({
			id,
			shouldOpenConfirmationDialog: true,
		});
	};

	handleConfirmationResponse = () => {
		if (this.state.itemList.length === 1 && this.state.page === 1) {
			let count = this.state.page - 1;
			this.setState({
				page: count,
			});
		}
		deleteItem(this.state.id).then(() => {
			this.updatePageData();
			this.handleDialogClose();
		});
	};
	handleEditItem = item => {
		this.setState({
			item: item,
			shouldOpenEditorDialog: true,
		});
	};
	handleDeleteButtonClick = () => {
		if (
			typeof this.state.data === "undefined" ||
			this.state.data.length === 0
		) {
			this.setState({
				shouldOpenNotificationPopup: true,
				Notification: "general.noti_check_data",
			});
			// alert('Chưa chọn dữ liệu')
		} else {
			this.setState({ shouldOpenConfirmationDeleteAllDialog: true });
		}
	};
	handleDeleteAll = event => {
		this.handleDeleteList(this.state.data).then(() => {
			this.updatePageData();
			// this.handleDialogClose()
		});
	};

	render() {
		const { t, i18n } = this.props;
		let {
			keyword,
			shouldOpenNotificationPopup,
			totalElements,
			totalPage,
			page,
			rowsPerPage,
			shouldOpenConfirmationDialog,
		} = this.state;
		let TitlePage = t("menu.title");

		let columns = [
			{
				title: t("general.action"),
				field: "custom",
				align: "left",
				width: "120px",
				render: rowData => (
					<MaterialButton
						item={rowData}
						onSelect={(rowData, method) => {
							if (method === 0) {
								getItemById(rowData.id).then(({ data }) => {
									if (data.parent === null) {
										data.parent = {};
									}
									this.setState({
										item: data,
										shouldOpenEditorDialog: true,
									});
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
				title: t("menu.description"),
				field: "description",
				align: "left",
				width: "150",
			},
			{ title: t("menu.name"), field: "name", width: "150" },
			{
				title: t("menu.code"),
				field: "code",
				align: "left",
				width: "150",
			},
		];
		return (
			<div className="m-sm-30">
				<Helmet>
					<title>
						{TitlePage} | {t("web_site")}
					</title>
				</Helmet>
				<div className="mb-sm-30">
					{/* <Breadcrumb routeSegments={[{ name: t('Supplier.title') }]} /> */}
					<Breadcrumb 
						routeSegments={[
							{
								name: t("Dashboard.manage"),
								path: "/directory/apartment",
							},
							{ name: TitlePage }
						]} 
					/>
				</div>
				<Grid container spacing={2} justify="space-between">
					<Grid item md={3} xs={12}>
						<Button
							className="align-bottom"
							variant="contained"
							color="primary"
							startIcon={<Add />}
							onClick={() => this.handleEditItem(null)}
						>
							{t("general.add")}
						</Button>
						{/* <Button
              className="align-bottom mb-16"
              variant="contained"
              color="primary"
              onClick={this.handleDeleteButtonClick}
            >
              {t('general.delete')}
            </Button> */}

						{this.state.shouldOpenConfirmationDeleteAllDialog && (
							<ConfirmationDialog
								open={
									this.state
										.shouldOpenConfirmationDeleteAllDialog
								}
								onConfirmDialogClose={this.handleDialogClose}
								onYesClick={this.handleDeleteAll}
								text={t("general.deleteAllConfirm")}
								cancel={t("general.cancel")}
								agree={t("general.agree")}
							/>
						)}
						{/* <TextField
              label={t('Supplier.search')}
              className="mb-16 mr-10"
              style={{ width: '20%' }}
              type="text"
              name="keyword"
              value={keyword}
              onChange={this.handleTextChange}
              onKeyDown={this.handleKeyDownEnterSearch}
            />
            <Button
              className="mb-16 mr-16 align-bottom"
              variant="contained"
              color="primary"
              onClick={() => this.search(keyword)}
            >
              {t('general.search')}
            </Button> */}
					</Grid>
					{/* <Grid item md={6} sm={12} xs={12} >
            <FormControl fullWidth style={{marginTop:'6px'}}>
                <Input
                    className='search_box w-100'
                    onChange={this.handleTextChange}
                    onKeyDown={this.handleKeyDownEnterSearch}
                    placeholder={t("Supplier.search")}
                    id="search_box"
                    startAdornment={
                        <InputAdornment>
                             <Link> <SearchIcon 
                            onClick={() => this.search(keyword)}
                            style ={{position:"absolute",
                            top:"0",
                            right:"0"
                          }} /></Link>
                        </InputAdornment>
                    }
                />
            </FormControl>
          </Grid> */}
					<Grid item xs={12}>
						<div>
							{this.state.shouldOpenEditorDialog && (
								<MenuDialog
									t={t}
									i18n={i18n}
									handleClose={this.handleDialogClose}
									open={this.state.shouldOpenEditorDialog}
									handleOKEditClose={this.handleOKEditClose}
									item={this.state.item}
								/>
							)}

							{shouldOpenNotificationPopup && (
								<NotificationPopup
									title={t("general.noti")}
									open={shouldOpenNotificationPopup}
									// onConfirmDialogClose={this.handleDialogClose}
									onYesClick={this.handleDialogClose}
									text={t(this.state.Notification)}
									agree={t("general.agree")}
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
						</div>
						<MaterialTable
							data={this.state.itemList}
							columns={columns}
							parentChildData={(row, rows) => {
								var list = rows.find(
									a => a.id === row.parentId
								);
								return list;
							}}
							localization={{
								body: {
									emptyDataSourceMessage: `${t(
										"general.emptyDataMessageTable"
									)}`,
								},
							}}
							options={{
								selection: false,
								actionsColumnIndex: -1,
								paging: false,
								search: false,
								rowStyle: rowData => ({
									backgroundColor:
										rowData.tableData.id % 2 === 1
											? "#EEE"
											: "#FFF",
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
								this.setState({ data: rows });
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
					</Grid>
				</Grid>
			</div>
		);
	}
}
export default Menu;
