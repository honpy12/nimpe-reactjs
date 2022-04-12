import {
	Button,
	Checkbox,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	FormControlLabel,
	Grid,
	InputLabel,
	MenuItem,
	Select,
} from "@material-ui/core";
import { Block, Save } from "@material-ui/icons";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React, { Component } from "react";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAllRoles, addUser, updateUser } from "./UserService";
import ValidatePicker from "../Component/ValidateSelect/ValidatePicker";

class UserEditorDialog extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isAddNew: true,
			listRole: [],
			roles: [],
			active: true,
			person: {
				firstName: "",
				lastName: "",
				displayName: "",
				email: "",
				birthPlace: "",
				birthDate: new Date(1990, 1, 1),
			},
			changePass: true,
			confirmPassword: "",
			text: "",
			address: "",
			avatar: "",
			username: "",
			password: "",
		};
	}

	componentDidMount() {
		if (this.props.item) {
			this.setState({ ...this.props.item, isAddNew: false });
		}

		// custom rule will have name 'isPasswordMatch'
		ValidatorForm.addValidationRule("isPasswordMatch", value => {
			if (value !== this.state.password) {
				return false;
			}
			return true;
		});

		getAllRoles().then(({ data }) => {
			this.setState({
				listRole: data,
			});
		});
	}

	listGender = [
		{ id: "M", name: "Nam" },
		{ id: "F", name: "Nữ" },
		{ id: "U", name: "Không rõ" },
	];

	handleChange = (event, source) => {
		event.persist();
		if (source === "switch") {
			this.setState({ isActive: event.target.checked });
			return;
		}
		if (source === "changePass") {
			this.setState({ changePass: event.target.checked });
			return;
		}
		if (source === "active") {
			this.setState({ active: event.target.checked });
			return;
		}
		if (source === "displayName") {
			let { person } = this.state;
			person = person ? person : {};
			person.displayName = event.target.value;
			this.setState({ person: person });
			return;
		}
		if (source === "gender") {
			let { person } = this.state;
			person = person ? person : {};
			person.gender = event.target.value;
			this.setState({ person: person });
			return;
		}
		this.setState({
			[event.target.name]: event.target.value,
		});
	};

	handleFormSubmit = () => {
		const { t } = this.props;
		if (this.state.id) {
			updateUser(this.state)
				.then(() => {
					toast.success(t("general.updateSuccess"));
					this.props.handleOKEditClose();
				})
				.catch(() => {
					toast.error(t("general.error"));
					this.props.handleClose();
				});
		} else {
			addUser(this.state)
				.then(() => {
					toast.success(t("general.addSuccess"));
					this.props.handleOKEditClose();
				})
				.catch(() => {
					toast.error(t("general.error"));
					this.props.handleClose();
				});
		}
	};

	selectRoles = rolesSelected => {
		this.setState({ roles: rolesSelected }, function () {});
	};

	handlePersonChange = e => {
		this.setState({
			...this.state,
			person: {
				...this.state.person,
				[e.target.name]: e.target.value,
			},
		});
	};

	handleTextChange = e => {
		this.setState({
			...this.state,
			[e.target.name]: e.target.value,
		});
	};

	handleDateChange = date => {
		this.setState({
			...this.state,
			person: {
				...this.state.person,
				birthDate: date,
			},
		});
	};

	render() {
		let { open, handleClose, t } = this.props;
		let {
			isAddNew,
			listRole,
			roles,
			active,
			person,
			username,
			changePass,
			password,
			confirmPassword,
		} = this.state;

		return (
			<Dialog onClose={handleClose} open={open} maxWidth="sm" fullWidth>
				<DialogTitle>
					{this.props.item ? t("general.update") : t("general.add")}
					<span className="ml-4">{t("userTitle")}</span>
				</DialogTitle>

				<ValidatorForm ref="form" onSubmit={this.handleFormSubmit}>
					<DialogContent dividers>
						<Grid container spacing={3}>
							<Grid item sm={6}>
								<TextValidator
									label={t("user.firstName")}
									className="w-100"
									onChange={this.handlePersonChange}
									type="text"
									name="firstName"
									value={person?.firstName ?? ""}
									validators={["required"]}
									errorMessages={[t("general.required")]}
								/>
							</Grid>
							<Grid item sm={6}>
								<TextValidator
									label={t("user.lastName")}
									className="w-100"
									onChange={this.handlePersonChange}
									type="text"
									name="lastName"
									value={person?.lastName ?? ""}
									validators={["required"]}
									errorMessages={[t("general.required")]}
								/>
							</Grid>

							<Grid item sm={6} xs={12}>
								<TextValidator
									label={t("user.displayName")}
									className="w-100"
									onChange={this.handlePersonChange}
									type="text"
									name="displayName"
									value={person?.displayName ?? ""}
									validators={["required"]}
									errorMessages={[t("general.required")]}
								/>
							</Grid>

							<Grid item sm={6}>
								<FormControl className="w-100">
									<InputLabel htmlFor="gender-simple">
										{t("user.gender")}
									</InputLabel>
									<Select
										value={person?.gender ?? ""}
										onChange={this.handlePersonChange}
										inputProps={{
											name: "gender",
											id: "gender-simple",
										}}
									>
										{this.listGender.map(item => {
											return (
												<MenuItem
													key={item.id}
													value={item.id}
												>
													{item.name}
												</MenuItem>
											);
										})}
									</Select>
								</FormControl>
							</Grid>

							<Grid item sm={6}>
								<TextValidator
									className="w-100"
									label={t("user.address")}
									onChange={this.handlePersonChange}
									type="text"
									name="birthPlace"
									value={person?.birthPlace ?? ""}
								/>
							</Grid>

							<Grid item sm={6} xs={12}>
								<ValidatePicker
									disableToolbar
									className="w-100"
									autoOk
									label={t("user.birthdate")}
									variant="inline"
									format="dd/MM/yyyy"
									id="date-picker-inline"
									value={person?.birthDate || ""}
									onChange={this.handleDateChange}
								/>
							</Grid>

							<Grid item sm={6} xs={12}>
								<TextValidator
									className="w-100"
									label="Email"
									onChange={this.handlePersonChange}
									type="email"
									name="email"
									value={person?.email ?? ""}
									validators={["required", "isEmail"]}
									errorMessages={[
										t("general.required"),
										"Email không hợp lệ",
									]}
								/>
							</Grid>

							<Grid item sm={6} xs={12}>
								<TextValidator
									InputProps={{
										readOnly: !isAddNew,
									}}
									className="w-100"
									label={t("user.username")}
									onChange={this.handleChange}
									type="text"
									name="username"
									value={username}
									validators={["required"]}
									errorMessages={[t("general.required")]}
								/>
							</Grid>

							{isAddNew && (
								<Grid item sm={6} xs={12}>
									<TextValidator
										className="w-100"
										autoComplete="new-password"
										label={t("password")}
										onChange={this.handleChange}
										type="password"
										name="password"
										value={password}
										validators={["required"]}
										errorMessages={[t("general.required")]}
									/>
								</Grid>
							)}

							<Grid
								item
								sm={6}
								xs={12}
								style={{
									display: "flex",
									alignItems: "flex-end",
								}}
							>
								<FormControlLabel
									value={active}
									name="active"
									onChange={active =>
										this.handleChange(active, "active")
									}
									control={<Checkbox checked={active} />}
									label={t("user.active")}
								/>

								{this.state.id && (
									<FormControlLabel
										value={changePass}
										name="changePass"
										onChange={changePass =>
											this.handleChange(
												changePass,
												"changePass"
											)
										}
										control={
											<Checkbox checked={changePass} />
										}
										label={t("user.changePass")}
									/>
								)}
							</Grid>

							{changePass && this.state.id ? (
								<>
									<Grid item sm={6} xs={12}>
										<TextValidator
											className="w-100"
											label={t("password")}
											onChange={this.handleChange}
											name="password"
											type="password"
											value={password}
											validators={["required"]}
											errorMessages={[
												t("general.required"),
											]}
										/>
									</Grid>
									<Grid item sm={6} xs={12}>
										<TextValidator
											className="w-100"
											label={t("re_password")}
											onChange={this.handleChange}
											name="confirmPassword"
											type="password"
											value={confirmPassword}
											validators={[
												"required",
												"isPasswordMatch",
											]}
											errorMessages={[
												t("general.required"),
												t("user.passwordMatchMessage"),
											]}
										/>
									</Grid>
								</>
							) : (
								<div></div>
							)}

							<Grid item sm={12} xs={12}>
								{listRole && (
									<Autocomplete
										multiple
										className="w-100"
										id="combo-box-demo"
										defaultValue={roles}
										options={listRole}
										getOptionSelected={(option, value) =>
											option.id === value.id
										}
										getOptionLabel={option =>
											option.authority
										}
										onChange={(event, value) => {
											this.selectRoles(value);
										}}
										renderInput={params => (
											<TextValidator
												{...params}
												value={roles}
												label={t("user.role")}
												fullWidth
												validators={["required"]}
												errorMessages={[
													t("general.required"),
												]}
											/>
										)}
									/>
								)}
							</Grid>
						</Grid>
					</DialogContent>

					<DialogActions>
						<div className="flex flex-middle">
							<Button
								variant="contained"
								color="secondary"
								className="mr-16"
								startIcon={<Block />}
								onClick={() => this.props.handleClose()}
							>
								{t("general.cancel")}
							</Button>
							<Button
								variant="contained"
								color="primary"
								type="submit"
								startIcon={<Save />}
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

export default UserEditorDialog;
