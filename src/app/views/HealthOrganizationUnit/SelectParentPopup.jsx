import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	Paper,
	Radio,
	TextField,
	FormControl,
	Input,
	InputLabel,
	InputAdornment,
	IconButton,
} from "@material-ui/core";
import MaterialTable from "material-table";
import React, { Component } from "react";
import Draggable from "react-draggable";
import NicePagination from "../Component/Pagination/NicePagination";
import { searchByDto } from "./HealthOrganizationUnitService";
import { Search } from "@material-ui/icons";

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

	setPage = page => {
		this.setState({ page }, function () {
			this.updatePageData();
		});
	};

	setRowsPerPage = event => {
		this.setState(
			{ rowsPerPage: event.target.value, page: 1 },
			function () {
				this.updatePageData();
			}
		);
	};

	handleChangePage = (event, newPage) => {
		this.setPage(newPage);
	};

	updatePageData = () => {
		var searchObject = {};
		this.setState({ loading: true });
		searchObject.pageIndex = this.state.page;
		searchObject.pageSize = this.state.rowsPerPage;
		searchByDto(searchObject).then(({ data }) => {
			this.setState({
				itemList: [...data.content],
				totalElements: data.totalElements,
				totalPage: data.totalPages,
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
		searchObject.name = this.state.text;
		searchObject.pageIndex = this.state.page;
		searchObject.pageSize = this.state.rowsPerPage;
		searchByDto(searchObject).then(({ data }) => {
			this.setState({
				itemList: data.content,
				totalElements: data.totalElements,
				totalPage: data.totalPages,
				loading: false,
			});
		});
	}

	onClickRow = selectedRow => {
		document.querySelector(`#radio${selectedRow.id}`).click();
	};

	render() {
		const { t, handleClose, handleSelect, open, selectedItem, itemId } =
			this.props;
		const {
			text,
			itemList,
			page,
			rowsPerPage,
			totalElements,
			totalPage,
			loading,
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
					<Grid item xs={12} sm={3} className="ml-auto mb-12">
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
							data={itemList}
							columns={columns}
							onRowClick={(evt, selectedRow) =>
								this.onClickRow(selectedRow)
							}
							parentChildData={(row, rows) =>
								rows.find(a => a.id === row.parent?.id)
							}
							isLoading={loading}
							options={{
								showEmptyDataSourceMessage: true,
								toolbar: false,
								selection: false,
								actionsColumnIndex: -1,
								paging: false,
								search: false,
								loadingType: "overlay",
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
							setRowsPerPage={this.setRowsPerPage}
							page={page}
							pageSize={rowsPerPage}
							pageSizeOption={[1, 2, 3, 5, 10, 25]}
							t={t}
							totalElements={totalElements}
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
