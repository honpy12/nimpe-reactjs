import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	MenuItem,
	Paper,
} from "@material-ui/core";
import BlockIcon from "@material-ui/icons/Block";
import SaveIcon from "@material-ui/icons/Save";
import React, { Component } from "react";
import Draggable from "react-draggable";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SelectParentAdministrative from "../AdministrativeUnit/SelectParentAdministrative";
import ValidateSelect from "../Component/ValidateSelect/ValidateSelect";
import {
	addHealOrganization,
	updateHealOrganization,
} from "./HealthOrganizationUnitService";
import SelectParentPopup from "./SelectParentPopup";

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

function requiredLabel(title) {
	return (
		<span>
			{title} <span style={{ color: "red", fontWeight: "bold" }}>*</span>
		</span>
	);
}

class HealthOrganizationUnitEditorDialog extends Component {
	constructor(props) {
		super(props);
		this.state = {
			healOrganization: {
				code: "",
				name: "",
				path: "",
				orgType: "",
				language: this.props.i18n.language === "vi" ? 1 : 0,
				healthOrganizationParent: null,
				adminUnit: null,
				address: "",
				description: "",
			},
			showHealthOrganizationParent: null,
			showAdministrativeUnitParent: null,
		};
	}

	componentDidMount() {
		if (this.props.item) {
			this.setState({
				healOrganization: this.props.item,
			});
		}
	}

	handleChange = event => {
		this.setState({
			healOrganization: {
				...this.state.healOrganization,
				[event.target.name]: event.target.value,
			},
		});
	};

	openParentPopup = type => {
		type === "healOrganizationParent"
			? this.setState({ showHealthOrganizationParent: true })
			: this.setState({
					showAdministrativeUnitParent: true,
			  });
	};

	handleDialogClose = () => {
		this.setState({
			showHealthOrganizationParent: false,
			showAdministrativeUnitParent: false,
		});
	};

	handleSelectAdministrative = item => {
		this.setState({
			healOrganization: {
				...this.state.healOrganization,
				adminUnit: item,
			},
		});
		this.handleDialogClose();
	};

	handleSelectParent = itemParent => {
		this.setState({
			healOrganization: {
				...this.state.healOrganization,
				healthOrganizationParent: itemParent,
			},
		});
		this.handleDialogClose();
	};

	handleFormSubmit = () => {
		const { t } = this.props;
		const { id } = this.state.healOrganization;

		if (id) {
			updateHealOrganization(this.state.healOrganization)
				.then(() => {
					toast.success(t("general.updateSuccess"));
					this.props.handleClose();
				})
				.catch(() => {
					toast.error(t("general.error"));
				});
		} else {
			addHealOrganization(this.state.healOrganization)
				.then(() => {
					toast.success(t("general.addSuccess"));
					this.props.handleClose();
				})
				.catch(() => {
					toast.error(t("general.error"));
				});
		}
	};

	render() {
		const { open, handleClose, t } = this.props;
		const {
			id,
			code,
			name,
			orgType,
			healthOrganizationParent,
			adminUnit,
			address,
			description,
		} = this.state.healOrganization;
		const { showHealthOrganizationParent, showAdministrativeUnitParent } =
			this.state;

		const listOrganizationType = [
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
			<Dialog
				onClose={handleClose}
				open={open}
				PaperComponent={PaperComponent}
				fullWidth
				maxWidth="sm"
			>
				<DialogTitle
					style={{ cursor: "move" }}
					id="draggable-dialog-title"
				>
					{(id ? t("button.edit") : t("button.add")) +
						" " +
						t("healthOrganization.title")}
				</DialogTitle>

				<ValidatorForm ref="form" onSubmit={this.handleFormSubmit}>
					<DialogContent dividers>
						<Grid className="mb-16" container spacing={2}>
							<Grid item sm={4} xs={12}>
								<TextValidator
									className="w-100 mb-16"
									label={t("healthOrganization.code")}
									name="code"
									size="small"
									value={code}
									onChange={this.handleChange}
								/>
							</Grid>

							<Grid item sm={8} xs={12}>
								<TextValidator
									className="w-100 mb-16"
									label={requiredLabel(
										t("healthOrganization.name")
									)}
									name="name"
									size="small"
									value={name}
									onChange={this.handleChange}
									validators={["required"]}
									errorMessages={[`${t("general.required")}`]}
								/>
							</Grid>

							<Grid item sm={4}>
								<ValidateSelect
									label={t("healthOrganization.type")}
									name="orgType"
									value={orgType}
									onChange={this.handleChange}
									className="w-100 mb-16"
								>
									{listOrganizationType?.map(p => (
										<MenuItem key={p.label} value={p.value}>
											{p.label}
										</MenuItem>
									))}
								</ValidateSelect>
							</Grid>

							<Grid item sm={8} xs={12}>
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
									onClick={() => this.openParentPopup()}
								>
									{t("Select")}
								</Button>
								<TextValidator
									className="w-100 mb-16"
									size="small"
									fullWidth
									InputProps={{
										readOnly: true,
									}}
									label={t(
										"healthOrganization.administrativeUnits"
									)}
									value={
										adminUnit !== null
											? adminUnit?.name
											: ""
									}
								/>

								{showAdministrativeUnitParent && (
									<SelectParentAdministrative
										open={showAdministrativeUnitParent}
										handleSelect={
											this.handleSelectAdministrative
										}
										selectedItem={
											adminUnit !== null ? adminUnit : {}
										}
										handleClose={this.handleDialogClose}
										t={t}
									/>
								)}
							</Grid>

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
									onClick={() =>
										this.openParentPopup(
											"healOrganizationParent"
										)
									}
								>
									{t("Select")}
								</Button>
								<TextValidator
									className="w-100 mb-16"
									size="small"
									fullWidth
									InputProps={{
										readOnly: true,
									}}
									label={
										<span>
											<span
												style={{ color: "red" }}
											></span>
											{t(
												"healthOrganization.managementUnit"
											)}
										</span>
									}
									value={
										healthOrganizationParent !== null
											? healthOrganizationParent?.name
											: ""
									}
								/>

								{showHealthOrganizationParent && (
									<SelectParentPopup
										open={showHealthOrganizationParent}
										handleSelect={this.handleSelectParent}
										selectedItem={
											healthOrganizationParent !== null
												? healthOrganizationParent
												: {}
										}
										handleClose={this.handleDialogClose}
										t={t}
										itemId={this.state.healOrganization?.id}
									/>
								)}
							</Grid>
							<Grid item sm={12} xs={12}>
								<TextValidator
									className="w-100 mb-16"
									label={requiredLabel(
										t("healthOrganization.address")
									)}
									name="address"
									size="small"
									value={address !== null ? address : ""}
									onChange={this.handleChange}
									validators={["required"]}
									errorMessages={[`${t("general.required")}`]}
								/>
							</Grid>
							<Grid item sm={12} xs={12}>
								<TextValidator
									className="w-100 mb-16"
									size="small"
									name="description"
									fullWidth
									onChange={this.handleChange}
									label={t("healthOrganization.description")}
									value={
										description !== null ? description : ""
									}
								/>
							</Grid>
						</Grid>
					</DialogContent>

					<DialogActions>
						<div className="flex flex-middle">
							<Button
								startIcon={<BlockIcon />}
								variant="contained"
								className="mr-12"
								color="secondary"
								onClick={() => this.props.handleClose()}
							>
								{t("general.cancel")}
							</Button>
							<Button
								startIcon={<SaveIcon />}
								className="mr-8"
								variant="contained"
								color="primary"
								type="submit"
							>
								{t("general.save")}
							</Button>
						</div>
					</DialogActions>
				</ValidatorForm>
			</Dialog>
		);
	}
}

export default HealthOrganizationUnitEditorDialog;
