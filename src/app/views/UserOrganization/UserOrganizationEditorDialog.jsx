import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	Paper,
} from "@material-ui/core";
import React, { Component } from "react";
import Draggable from "react-draggable";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { toast } from "react-toastify";
import SelectAdministrationUnit from "./SelectAdministrationUnit";
import SelectHealthOrgUnit from "./SelectHealthOrgUnit";
import SelectUser from "./SelectUser";
import {
	addUserOrganizationUnit,
	updateUserOrganizationUnit,
} from "./UserOrganizationService";
import { Block, Save } from "@material-ui/icons";
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

class UserOrganizationUnitEditorDialog extends Component {
	state = {
		user: null,
		healthOrganization: null,
		administrativeUnit: null,
		shouldOpenSelectAdministration: false,
		shouldOpenSelectHealthOrg: false,
		shouldOpenSelectUser: false,
	};

	handleSelect = () => {};
	handleSelectUnit = (item, type) => {
		let { t } = this.props;
		let { id } = this.state;
		let { healthOrganization, administrativeUnit, user } = this.state;
		let checkCode = false;
		if (type === "administrativeUnit") {
			if (administrativeUnit?.id === item.id) {
				checkCode = true;
			}
			if (checkCode) {
				alert(t("administrationUnit_code"));
				return;
			}
			this.setState({ administrativeUnit: item });
		}
		if (type === "healthOrganization") {
			if (healthOrganization?.id === item.id) {
				checkCode = true;
			}
			if (checkCode) {
				alert(t("administrationUnit_code"));
				return;
			}
			this.setState({ healthOrganization: item });
		}
		if (type === "user") {
			if (user?.id === item.id) {
				checkCode = true;
			}
			if (checkCode) {
				alert(t("administrationUnit_code"));
				return;
			}
			this.setState({ user: item });
		}
		this.setState({
			shouldOpenSelectAdministration: false,
			shouldOpenSelectHealthOrg: false,
			shouldOpenSelectUser: false,
		});
	};

	handleFormSubmit = () => {
		let { t } = this.props;
		let { id, user, healthOrganization, administrativeUnit } = this.state;
		if (!user || !healthOrganization || !administrativeUnit) {
			toast.error("Vui lòng chọn những trường còn thiếu", {
				position: "top-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});

			return;
		}
		if (id) {
			updateUserOrganizationUnit({
				...this.state,
			})
				.then(() => {
					this.props.handleClose();
				})
				.catch(err => {
					console.log(err);
					alert(t("mess_code"));
				})
				.then(() => {});
		} else {
			addUserOrganizationUnit({
				...this.state,
			})
				.then(() => {
					this.props.handleClose();
				})
				.catch(err => {
					console.log(err);
					toast(t("mess_code"));
				})
				.then(() => {});
		}
	};

	componentDidMount() {
		let { item } = this.props;
		this.setState(item);
	}

	render() {
		let { open, handleClose, t, i18n } = this.props;
		let { id } = this.state;
		return (
			<Dialog
				onClose={handleClose}
				open={open}
				PaperComponent={PaperComponent}
				maxWidth={"sm"}
				fullWidth
			>
				<DialogTitle>
					{id ? t("update") : t("add")}{" "}
					{t("userOrganization.titlePopup")}
				</DialogTitle>

				<ValidatorForm ref="form" onSubmit={this.handleFormSubmit}>
					<DialogContent dividers>
						<Grid item sm={12} xs={12}>
							<Button
								size="small"
								style={{
									position: "absolute",
									cursor: "pointer",
									right: "24px",
									zIndex: "9999",
									marginTop: "12px",
								}}
								variant="contained"
								color="primary"
								onClick={() => {
									this.setState({
										shouldOpenSelectAdministration: true,
									});
								}}
							>
								{t("general.select")}
							</Button>
							<TextValidator
								size="small"
								fullWidth
								InputProps={{
									readOnly: true,
								}}
								label={
									<span>
										<span style={{ color: "red" }}></span>
										Đơn vị quản lý"
									</span>
								}
								// className="w-80"
								value={
									this.state.administrativeUnit != null
										? this.state.administrativeUnit.name
											? this.state.administrativeUnit.name
											: ""
										: ""
								}
								required
							/>

							{this.state.shouldOpenSelectAdministration && (
								<SelectAdministrationUnit
									open={
										this.state
											.shouldOpenSelectAdministration
									}
									handleSelect={this.handleSelectUnit}
									selectedItem={
										this.state.administrativeUnit != null
											? this.state.administrativeUnit
											: {}
									}
									handleClose={() => {
										this.setState({
											shouldOpenSelectAdministration: false,
										});
									}}
									t={t}
									i18n={i18n}
								/>
							)}
						</Grid>
						<Grid
							item
							sm={12}
							xs={12}
							style={{ marginTop: "20px" }}
						>
							<Button
								size="small"
								style={{
									position: "absolute",
									cursor: "pointer",
									right: "24px",
									zIndex: "9999",
									marginTop: "12px",
								}}
								variant="contained"
								color="primary"
								onClick={() => {
									this.setState({
										shouldOpenSelectHealthOrg: true,
									});
								}}
							>
								{t("general.select")}
							</Button>
							<TextValidator
								size="small"
								fullWidth
								InputProps={{
									readOnly: true,
								}}
								label={
									<span>
										<span style={{ color: "red" }}></span>
										Đơn vị y tế
									</span>
								}
								// className="w-80"
								value={
									this.state.healthOrganization != null
										? this.state.healthOrganization.name
											? this.state.healthOrganization.name
											: ""
										: ""
								}
								required
							/>

							{this.state.shouldOpenSelectHealthOrg && (
								<SelectHealthOrgUnit
									open={this.state.shouldOpenSelectHealthOrg}
									handleSelect={this.handleSelectUnit}
									selectedItem={
										this.state.healthOrganization != null
											? this.state.healthOrganization
											: {}
									}
									handleClose={() => {
										this.setState({
											shouldOpenSelectHealthOrg: false,
										});
									}}
									t={t}
									i18n={i18n}
								/>
							)}
						</Grid>
						<Grid
							item
							sm={12}
							xs={12}
							style={{ marginTop: "20px" }}
						>
							<Button
								size="small"
								style={{
									position: "absolute",
									cursor: "pointer",
									right: "24px",
									zIndex: "9999",
									marginTop: "12px",
								}}
								variant="contained"
								color="primary"
								onClick={() => {
									this.setState({
										shouldOpenSelectUser: true,
									});
								}}
							>
								{t("general.select")}
							</Button>
							<TextValidator
								size="small"
								fullWidth
								InputProps={{
									readOnly: true,
								}}
								label={
									<span>
										<span style={{ color: "red" }}></span>
										Chọn Tài Khoản
									</span>
								}
								// className="w-80"
								value={
									this.state.user != null
										? this.state.user.username
											? this.state.user.username
											: ""
										: ""
								}
								required
							/>

							{this.state.shouldOpenSelectUser && (
								<SelectUser
									open={this.state.shouldOpenSelectUser}
									handleSelect={this.handleSelectUnit}
									selectedItem={
										this.state.user != null
											? this.state.user
											: {}
									}
									handleClose={() => {
										this.setState({
											shouldOpenSelectUser: false,
										});
									}}
									t={t}
									i18n={i18n}
								/>
							)}
						</Grid>
					</DialogContent>

					<DialogActions>
						<div className="flex flex-middle">
							<Button
								variant="contained"
								color="secondary"
								className="mr-12"
								startIcon={<Block />}
								onClick={() => this.props.handleClose()}
							>
								{t("Cancel")}
							</Button>

							<Button
								variant="contained"
								color="primary"
								type="submit"
								startIcon={<Save />}
								className="mr-8"
							>
								{t("Save")}
							</Button>
						</div>
					</DialogActions>
				</ValidatorForm>
			</Dialog>
		);
	}
}

export default UserOrganizationUnitEditorDialog;
