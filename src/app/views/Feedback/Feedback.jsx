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
import { Add, Search } from "@material-ui/icons";
import { Breadcrumb, ConfirmationDialog } from "egret";
import MaterialTable from "material-table";
import React from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NicePagination from "../Component/Pagination/NicePagination";
import FeedbackDialog from "./FeedbackDialog";
import { deleteFeedback, searchByPage } from "./FeedbackServices";

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

class Feedback extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			page: 1,
			rowsPerPage: 5,
			totalElements: 0,
			feedbackData: [],
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
		this.updatePageData();
	}

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
		var searchObject = {};
		const { t } = this.props;
		this.setState({ page: 1, loading: true });
		searchObject.text = this.state.text;
		searchObject.pageIndex = this.state.page;
		searchObject.pageSize = this.state.rowsPerPage;
		searchByPage(searchObject)
			.then(({ data }) => {
				this.setState({
					feedbackData: data.content,
					totalElements: data.totalElements,
					totalPage: data.totalPages,
					loading: false,
				});
			})
			.catch(() => {
				this.setState({
					feedbackData: [],
					loading: false,
				});
				toast.error(t("general.error"));
			});
	}

	updatePageData = () => {
		const { t } = this.props;
		var searchObject = {};
		this.setState({
			loading: true,
		});
		searchObject.pageIndex = this.state.page;
		searchObject.pageSize = this.state.rowsPerPage;
		searchByPage(searchObject)
			.then(({ data }) => {
				this.setState({
					feedbackData: data.content,
					totalElements: data.totalElements,
					totalPage: data.totalPages,
					loading: false,
				});
			})
			.catch(() => {
				this.setState({
					feedbackData: [],
					loading: false,
				});
				toast.error(t("general.error"));
			});
	};

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

	handleEditItem = item => {
		this.setState({
			itemEdit: item,
			shouldOpenEditorDialog: true,
		});
	};

	handleOKEditClose = () => {
		this.setState(
			{
				shouldOpenEditorDialog: false,
				shouldOpenConfirmationDialog: false,
				page: 1,
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

	handleDelete = id => {
		this.setState({
			id,
			shouldOpenConfirmationDialog: true,
		});
	};

	handleConfirmationResponse = () => {
		let { t } = this.props;
		deleteFeedback(this.state.id).then(() => {
			this.handleOKEditClose();
			toast.success(t("general.deleteSuccess"));
		});
	};

	render() {
		const { t, i18n } = this.props;
		const {
			shouldOpenEditorDialog,
			shouldOpenConfirmationDialog,
			itemEdit,
			feedbackData,
			page,
			rowsPerPage,
			totalElements,
			totalPage,
			loading,
			text,
		} = this.state;

		let TitlePage = t("feedback.title");

		const columns = [
			{
				title: t("general.action"),
				field: "custom",
				align: "left",
				headerStyle: {
					maxWidth: "80px",
					paddingLeft: "10px",
					paddingRight: "0px",
				},
				cellStyle: {
					maxWidth: "80px",
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
				title: t("feedback.time"),
				field: "createDate",
				align: "left",
				headerStyle: {
					minWidth: "250px",
					paddingLeft: "10px",
					paddingRight: "0px",
				},
				cellStyle: {
					minWidth: "250px",
					paddingLeft: "10px",
					paddingRight: "0px",
					textAlign: "left",
				},
				render: rowData => (
					<>
						{rowData.createDate[3] +
							":" +
							rowData.createDate[4] +
							", " +
							rowData.createDate[2] +
							"/" +
							rowData.createDate[1] +
							"/" +
							rowData.createDate[0]}
					</>
				),
			},
			{
				title: t("feedback.content"),
				field: "feedback",
				align: "left",
				headerStyle: {
					minWidth: "150px",
					paddingLeft: "10px",
					paddingRight: "0px",
				},
				cellStyle: {
					maxWidth: "150px",
					paddingLeft: "10px",
					paddingRight: "0px",
					textAlign: "left",
					whiteSpace: "nowrap",
					overflow: "hidden",
					textOverflow: "ellipsis",
				},
			},
		];

		return (
			<div className="m-sm-30">
				{shouldOpenEditorDialog && (
					<FeedbackDialog
						t={t}
						i18n={i18n}
						handleClose={this.handleDialogClose}
						open={shouldOpenEditorDialog}
						handleOKEditClose={this.handleOKEditClose}
						item={itemEdit}
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
					<Grid item md={2} sm={3}>
						<Button
							color="primary"
							className="mb-12"
							startIcon={<Add />}
							variant="contained"
							onClick={() => {
								this.handleEditItem(null);
							}}
						>
							{t("general.add")}
						</Button>
					</Grid>

					<Grid item md={3} lg={3}>
						<FormControl size="small" className="w-100 mb-12">
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

					<Grid item xs={12} md={12}>
						<MaterialTable
							title={t("general.list")}
							data={feedbackData}
							labelRowsPerPage={t("general.rows_per_page")}
							columns={columns}
							style={{ tableLayout: "auto" }}
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

export default Feedback;
