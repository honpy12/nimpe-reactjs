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
import ValidateSelect from "../Component/ValidateSelect/ValidateSelect";
import {
	addNewAdministrativeUnit,
	checkExists,
	updateAdministrativeUnit,
} from "./AdministrativeUnitService";
import SelectParentAdministrative from "./SelectParentAdministrative";

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

class AdministrativeUnitEditorDialog extends Component {
	constructor(props) {
		super(props);
		this.state = {
			administrative: {
				name: "",
				code: "",
				level: null,
				parent: null,
			},
			shouldOpenSelectParentPopup: false,
		};
	}

	componentDidMount() {
		if (this.props.item) {
			this.setState({
				administrative: this.props.item,
			});
		}
	}

	handleChange = event => {
		this.setState({
			administrative: {
				...this.state.administrative,
				[event.target.name]: event.target.value,
			},
		});
	};

	handleFormSubmit = () => {
		const { t } = this.props;

		if (this.state.administrative.id) {
			updateAdministrativeUnit(this.state.administrative).then(() => {
				toast.success(t("general.updateSuccess"));
				this.props.handleOK();
			});
		} else {
			checkExists(this.state.administrative)
				.then(result => {
					if (result.data === true) {
						toast.warning(t("general.error_exists"));
					} else {
						addNewAdministrativeUnit(
							this.state.administrative
						).then(() => {
							toast.success(t("general.addSuccess"));
							this.props.handleOK();
						});
					}
				})
				.catch(() => toast.error(t("general.error")));
		}
	};

	openParentPopup = () => {
		this.setState({ shouldOpenSelectParentPopup: true });
	};

	handleDialogClose = () => {
		this.setState({ shouldOpenSelectParentPopup: false });
	};

	handleSelectParent = itemParent => {
		const { id } = this.state.administrative;
		if (id) {
			let isCheck = false;
			let parentClone = itemParent;
			if (id === parentClone.id) {
				isCheck = true;
			}
			while (parentClone !== null) {
				if (parentClone.id === id) {
					isCheck = true;
					break;
				} else {
					parentClone = parentClone.administrativeUnitParent;
				}
			}
			if (isCheck) {
				return;
			}
		}
		this.setState({
			administrative: {
				...this.state.administrative,
				parent: itemParent,
			},
		});
		this.setState({ shouldOpenSelectParentPopup: false });
	};

	render() {
		let { open, handleClose, t, i18n } = this.props;
		let { id, name, code, level, parent } = this.state.administrative;

		const administrativeLevel = [
			{
				label: "Cấp 1",
				value: 1,
			},
			{
				label: "Cấp 2",
				value: 2,
			},
			{
				label: "Cấp 3",
				value: 3,
			},
			{
				label: "Cấp 4",
				value: 4,
			},
			{
				label: "Cấp 5",
				value: 5,
			},
			{
				label: "Cấp 6",
				value: 6,
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
					{(id ? t("general.update") : t("general.add")) +
						" " +
						t("administrativeUnit.title")}
				</DialogTitle>

				<ValidatorForm ref="form" onSubmit={this.handleFormSubmit}>
					<DialogContent dividers>
						<Grid className="mb-16" container spacing={2}>
							<Grid item sm={4}>
								<TextValidator
									size="small"
									className="w-100 mb-16"
									label={requiredLabel(
										t("administrativeUnit.code")
									)}
									onChange={this.handleChange}
									type="text"
									name="code"
									value={code}
									validators={["required"]}
									errorMessages={[`${t("general.required")}`]}
								/>
							</Grid>
							<Grid item sm={8}>
								<TextValidator
									size="small"
									className="w-100 mb-16"
									label={requiredLabel(
										t("administrativeUnit.name")
									)}
									onChange={this.handleChange}
									type="text"
									name="name"
									value={name}
									validators={["required"]}
									errorMessages={[`${t("general.required")}`]}
								/>
							</Grid>

							<Grid item sm={4}>
								<ValidateSelect
									label={requiredLabel(
										t("administrativeUnit.level")
									)}
									name="level"
									value={level}
									onChange={this.handleChange}
									className="w-100"
									validators={["required"]}
									errorMessages={[`${t("general.required")}`]}
								>
									{administrativeLevel?.map(p => (
										<MenuItem key={p.value} value={p.value}>
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
									onClick={this.openParentPopup}
								>
									{t("Select")}
								</Button>
								<TextValidator
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
												"administrativeUnit.selectParent"
											)}
										</span>
									}
									value={parent != null ? parent.name : ""}
								/>

								{this.state.shouldOpenSelectParentPopup && (
									<SelectParentAdministrative
										open={
											this.state
												.shouldOpenSelectParentPopup
										}
										handleSelect={this.handleSelectParent}
										selectedItem={
											parent !== null ? parent : {}
										}
										handleClose={this.handleDialogClose}
										t={t}
										i18n={i18n}
										itemId={this.state.administrative?.id}
									/>
								)}
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

export default AdministrativeUnitEditorDialog;
