import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	Grid,
	Input,
	InputAdornment,
	InputLabel,
	Paper,
	Radio,
} from "@material-ui/core";
import { Search } from "@material-ui/icons";
import MaterialTable from "material-table";
import React, { Component } from "react";
import Draggable from "react-draggable";
import NicePagination from "../Component/Pagination/NicePagination";
import { searchByDto } from "./AdministrativeUnitService";

function PaperComponent(props) {
	return (
		<Draggable
			handle="#draggable-dialog-title"
			cancel={'[class*="MuiDialogContent-root"]'}
		>
			<Paper {...props} />
		</Draggable>
	);
}

class SelectParentPopup extends Component {
	constructor(props) {
		super(props);
		this.state = {
			rowsPerPage: 5,
			page: 1,
			totalElements: 0,
			totalPage: 0,
			itemList: [],
			selectedItem: {},
			text: "",
			item: null,
			loading: true,
		};
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

	updatePageData = () => {
		var searchObject = {};
		this.setState({
			loading: true,
		});
		searchObject.pageIndex = this.state.page;
		searchObject.pageSize = this.state.rowsPerPage;
		searchByDto(searchObject)
			.then(({ data }) => {
				this.setState({
					itemList: [...data.content],
					totalElements: data.totalElements,
					totalPage: data.totalPages,
					loading: false,
				});
			})
			.catch(() => {
				this.setState({
					itemList: [],
					loading: false,
				});
			});
	};

	componentDidMount() {
		this.updatePageData();
		let { selectedItem } = this.props;
		this.setState({ selectedValue: selectedItem.id });
	}

	handleClick = (event, item) => {
		if (item.id != null) {
			this.setState({ selectedValue: item.id, selectedItem: item });
		} else {
			this.setState({ selectedValue: null, selectedItem: null });
		}
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
		var searchObject = {};
		this.setState({ page: 1, loading: true });
		searchObject.text = this.state.text;
		searchObject.pageIndex = this.state.page;
		searchObject.pageSize = this.state.rowsPerPage;
		searchByDto(searchObject)
			.then(({ data }) => {
				this.setState({
					itemList: data.content,
					totalElements: data.totalElements,
					totalPage: data.totalPages,
					loading: false,
				});
			})
			.catch(() => {
				this.setState({
					itemList: [],
					loading: false,
				});
			});
	}

	onClickRow = selectedRow => {
		document.querySelector(`#radio${selectedRow.id}`).click();
	};

	render() {
		const { t, handleClose, handleSelect, open, itemId } = this.props;
		let {
			text,
			itemList,
			loading,
			page,
			rowsPerPage,
			totalElements,
			totalPage,
		} = this.state;

		let columns = [
			{
				title: t("general.select"),
				field: "custom",
				align: "left",
				render: rowData => (
					<Radio
						id={`radio${rowData.id}`}
						name="radSelected"
						value={rowData.id}
						checked={this.state.selectedValue === rowData.id}
						onClick={event => this.handleClick(event, rowData)}
						disabled={rowData.id === itemId}
					/>
				),
			},
			{
				title: t("administrativeUnit.code"),
				field: "code",
				align: "left",
				width: "150",
			},
			{
				title: t("administrativeUnit.name"),
				field: "name",
				width: "150",
			},
		];

		return (
			<Dialog
				onClose={handleClose}
				open={open}
				PaperComponent={PaperComponent}
				maxWidth={"md"}
				fullWidth
			>
				<DialogTitle
					style={{ cursor: "move" }}
					id="draggable-dialog-title"
				>
					<span className="mb-20">
						{t("component.product.title")}
					</span>
				</DialogTitle>

				<DialogContent>
					<Grid
						item
						xs={12}
						sm={3}
						style={{ marginLeft: "auto" }}
						className="mb-12"
					>
						<FormControl className="w-100">
							<InputLabel htmlFor="standard-adornment">
								{t("EnterSearch")}
							</InputLabel>
							<Input
								id="standard-basic"
								type="text"
								name="text"
								value={text}
								onChange={this.handleSearchInputChange}
								onKeyDown={this.handleKeyDownEnterSearch}
								endAdornment={
									<InputAdornment position="end">
										<Search
											onClick={() => this.search(text)}
											style={{
												cursor: "pointer",
											}}
										/>
									</InputAdornment>
								}
							/>
						</FormControl>
					</Grid>

					<Grid item xs={12}>
						<MaterialTable
							title={t("List")}
							data={itemList}
							columns={columns}
							parentChildData={(row, rows) => {
								var list = rows.find(
									a => a.id === row.parentId
								);
								return list;
							}}
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
							pageSize={rowsPerPage}
							pageSizeOption={[1, 2, 3, 5, 10, 25]}
							t={t}
							totalElements={totalElements}
							page={page}
						/>
					</Grid>
				</DialogContent>

				<DialogActions className="mb-16 mr-16">
					<Button
						className="mr-12 align-bottom"
						variant="contained"
						color="secondary"
						onClick={() => handleClose()}
					>
						{t("general.cancel")}
					</Button>
					<Button
						className="align-bottom"
						variant="contained"
						color="primary"
						onClick={() => handleSelect(this.state.selectedItem)}
					>
						{t("general.select")}
					</Button>
				</DialogActions>
			</Dialog>
		);
	}
}
export default SelectParentPopup;
