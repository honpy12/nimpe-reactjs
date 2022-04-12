import {
	Button,
	Collapse,
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
import { Add, ArrowDropDown, Search, Tune } from "@material-ui/icons";
import "date-fns";
import moment from "moment";
import { Breadcrumb, ConfirmationDialog } from "egret";
import MaterialTable from "material-table";
import React from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "styles/globitsStyles.css";
import "../../../styles/views/_dengueLocation.scss";
import { searchByDto } from "../AdministrativeUnit/AdministrativeUnitService";
import NicePagination from "../Component/Pagination/NicePagination";
import DengueFilter from "./DengueFilter";
import {
	deleteDengueLocation,
	deleteDengueLocationItem,
	getAllDengueLocation,
} from "./Re-DengueLocationServices";
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

class Dengue extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			page: 1,
			rowsPerPage: 5,
			totalElements: 0,
			dengueLocationData: [],
			totalPage: 0,
			shouldOpenEditorDialog: false,
			shouldOpenConfirmationDialog: false,
			provinceList: [],
			itemEdit: {},
			id: "",
			text: "",
			loading: true,
		};
	}

	componentDidMount() {
		this.getProvinceListData();
		this.updatePageData();
	}

	getProvinceListData = () => {
		const searchOption = {
			pageSize: 100,
			pageIndex: 1,
		};
		searchByDto(searchOption).then(data =>
			this.setState({
				...this.state,
				provinceList: data.data.content,
			})
		);
	};

	updatePageData = () => {
		const { t } = this.props;
		var searchObject = {};
		this.setState({
			loading: true,
		});
		searchObject.pageIndex = this.state.page;
		searchObject.pageSize = this.state.rowsPerPage;
		getAllDengueLocation(searchObject)
			.then(({ data }) => {
				this.setState({
					dengueLocationData: data.content,
					totalElements: data.totalElements,
					totalPage: data.totalPages,
					loading: false,
				});
			})
			.catch(() => {
				this.setState({
					dengueLocationData: [],
					loading: false,
				});
				toast.error(t("general.error"));
			});
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

	handleChangePage = (event, newPage) => {
		this.setState(
			{
				page: newPage,
			},
			() => this.updatePageData()
		);
	};

	handleEditItem = item => {
		this.setState(
			{
				...this.state,
				itemEdit: item,
			},
			() => {
				this.props.history.push({
					pathname: `/ReDengueLocation/create`,
					state: { item: item },
				});
			}
		);
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

	handleDialogClose = () => {
		this.setState({
			shouldOpenConfirmationDialog: false,
		});
	};

	handleDelete = id => {
		this.setState({
			...this.state,
			id,
			shouldOpenConfirmationDialog: true,
		});
	};

	handleConfirmationResponse = () => {
		let { t } = this.props;

		this.state.dengueLocationData.forEach(item => {
			if (item.id === this.state.id) {
				if (item.dengueLocationItems?.length > 0) {
					item.dengueLocationItems.forEach(i => {
						deleteDengueLocationItem(i.id);
					});
					deleteDengueLocation(this.state.id)
						.then(() => {
							toast.success(t("general.deleteSuccess"));
							this.handleOKEditClose();
						})
						.catch(() => {
							toast.error(
								"Đơn vị này đang được sử dụng.Không thể xóa !"
							);
						});
					deleteDengueLocation(this.state.id)
						.then(() => {
							toast.success(t("general.deleteSuccess"));
							this.handleOKEditClose();
						})
						.catch(() => {
							toast.error(
								"Đơn vị này đang được sử dụng.Không thể xóa !"
							);
						});
				} else {
					deleteDengueLocation(this.state.id)
						.then(() => {
							toast.success(t("general.deleteSuccess"));
							this.updatePageData();
							this.handleDialogClose();
						})
						.catch(() => {
							toast.error(t("general.error"));
						});
				}
			}
		});
	};

	handleSearchInputChange = event => {
		this.setState({
			text: event.target.value,
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
		searchObject.keyword = this.state.text;
		searchObject.provinceSearchDto = this.state.province;
		searchObject.districtSearchDto = this.state.district;
		searchObject.wardSearchDto = this.state.ward;
		searchObject.fromDate = this.state.fromDate;
		searchObject.endDate = this.state.endDate;
		searchObject.pageIndex = this.state.page;
		searchObject.pageSize = this.state.rowsPerPage;
		getAllDengueLocation(searchObject)
			.then(({ data }) => {
				this.setState({
					dengueLocationData: data.content,
					totalElements: data.totalElements,
					totalPage: data.totalPages,
					loading: false,
				});
			})
			.catch(() => {
				this.setState({
					dengueLocationData: [],
					loading: false,
				});
				toast.error(t("general.error"));
			});
	}

	handleCollapseFilter = () => {
		let { checkedFilter } = this.state;
		this.setState({ checkedFilter: !checkedFilter });
	};

	handleFilter = option => {
		const { t } = this.props;
		const { fromDate, endDate, province, district, ward } = option;
		var searchObject = {};

		this.setState({
			page: 1,
			loading: true,
			fromDate,
			endDate,
			province,
			district,
			ward,
		});
		searchObject.keyword = this.state.text;
		searchObject.provinceSearchDto = province;
		searchObject.districtSearchDto = district;
		searchObject.wardSearchDto = ward;
		searchObject.fromDate = fromDate;
		searchObject.endDate = endDate;
		searchObject.pageIndex = this.state.page;
		searchObject.pageSize = this.state.rowsPerPage;
		getAllDengueLocation(searchObject)
			.then(({ data }) => {
				this.setState({
					dengueLocationData: data.content,
					totalElements: data.totalElements,
					totalPage: data.totalPages,
					loading: false,
				});
			})
			.catch(() => {
				this.setState({
					dengueLocationData: [],
					loading: false,
				});
				toast.error(t("general.error"));
			});
	};

	render() {
		const { t, i18n } = this.props;
		const {
			text,
			shouldOpenConfirmationDialog,
			dengueLocationData,
			checkedFilter,
			page,
			rowsPerPage,
			totalElements,
			totalPage,
			loading,
		} = this.state;

		let TitlePage = t("dengueLocation.dengueLocation");

		let columns = [
			{
				title: t("general.action"),
				field: "custom",
				align: "left",
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
				title: t("dengueLocation.status"),
				field: "active",
				render: rowData => (
					<span>
						{rowData.active ? (
							<span style={{ color: "orange" }}>
								Đang hoạt động
							</span>
						) : (
							<span style={{ color: "red" }}>Hủy</span>
						)}
					</span>
				),
			},
			{
				title: t("dengueLocation.address"),
				field: "address",
				render: rowData => (
					<span>
						{rowData.address} {rowData.ward.name},{" "}
						{rowData.district.name},{rowData.province.name}
					</span>
				),
			},
			{
				title: t("dengueLocation.investigationPerson"),
				field: "investigationPerson",
			},
			{
				title: t("dengueLocation.investigationDate"),
				field: "investigationDate",
				render: rowData => (
					<>
						{moment(rowData.investigationDate).format("DD/MM/yyyy")}
					</>
				),
			},
		];

		return (
			<div className="m-sm-30">
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

				<Helmet>
					<title>
						{TitlePage} | {t("web_site")}
					</title>
				</Helmet>

				<div className="mb-sm-30">
					<Breadcrumb routeSegments={[{ name: TitlePage }]} />
				</div>

				<Grid
					container
					alignItems="flex-end"
					justifyContent="space-between"
					className="mb-12"
				>
					<Grid item md={2} sm={3} className="mb-12">
						<Button
							color="primary"
							startIcon={<Add />}
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
						md={5}
						lg={4}
						sm={12}
						xs={12}
						className="flex flex-align-end mb-12"
					>
						<FormControl className="flex-grow-1 mr-8" size="small">
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
							color="secondary"
							variant="contained"
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

					<Grid item md={12} sm={12} xs={12} className="mb-12">
						<Collapse
							in={checkedFilter}
							style={{
								width: "100%",
							}}
						>
							<DengueFilter
								handleFilter={this.handleFilter}
								t={t}
							/>
						</Collapse>
					</Grid>

					<Grid item xs={12} md={12}>
						<MaterialTable
							title={t("general.list")}
							data={dengueLocationData}
							labelRowsPerPage={t("general.rows_per_page")}
							columns={columns}
							style={{ tableLayout: "auto" }}
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
							isLoading={loading}
							options={{
								showEmptyDataSourceMessage: true,
								selection: false,
								actionsColumnIndex: -1,
								paging: false,
								search: false,
								toolbar: false,
								rowStyle: rowData => ({
									backgroundColor:
										rowData.tableData.id % 2 === 1
											? "#EEE"
											: "#FFF",
								}),
								maxBodyHeight: "450px",
								minBodyHeight: "380px",
								headerStyle: {
									backgroundColor: "#2a80c8",
									color: "#fff",
									height: "50px",
								},
								padding: "dense",
							}}
							onSelectionChange={rows => {
								this.data = rows;
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
			</div>
		);
	}
}

export default Dengue;
