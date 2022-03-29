import {
	AppBar,
	Button,
	Dialog,
	DialogContent,
	Grid,
	Slide,
	TextField,
	Toolbar,
} from "@material-ui/core";
import { Block, Save } from "@material-ui/icons";
import React, { Component } from "react";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import "../../../styles/views/_dengueLocation.scss";
import DengueMap from "./DengueGoogleMap";
import { addPatient, updatePatient } from "./PatientServices";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const requireLabel = item => {
	return (
		<>
			{item}
			<span style={{ color: "red", fontWeight: "bold" }}>*</span>
		</>
	);
};

class PatientDialog extends Component {
	constructor(props) {
		super(props);
		this.state = {
			code: "",
			name: "",
			address: "",
			latitude: "",
			longitude: "",
			dengueLocation: null,
		};
	}

	componentDidMount() {
		if (this.props.item) {
			this.setState({
				...this.props.item,
			});
		}
		if (this.props.parent) {
			this.setState({
				dengueLocation: this.props.parent,
			});
		}
	}

	handleFormSubmit = () => {
		const { t } = this.props;
		if (this.state.dengueLocation.id) {
			if (this.state.id) {
				updatePatient(this.state)
					.then(() => {
						toast.success(t("general.updateSuccess"));
						this.props.handleOKDialog();
					})
					.catch(() => {
						toast.error(t("general.error"));
						this.props.handleClose();
					});
			} else {
				addPatient(this.state)
					.then(() => {
						toast.success(t("general.updateSuccess"));
						this.props.handleOKDialog();
					})
					.catch(() => {
						toast.error(t("general.error"));
						this.props.handleClose();
					});
			}
		} else {
			this.props.updateTableData(this.state, "patient");
			this.props.handleClose();
		}
	};

	handleChange = event => {
		this.setState({
			[event.target.name]: event.target.value,
		});
	};

	onCloseMap = geo => {
		const { longitude, latitude, itemAddress } = geo;
		this.setState({
			latitude,
			longitude,
			address: itemAddress,
		});
	};

	render() {
		const { t, open, handleClose } = this.props;
		const { code, name, address, latitude, longitude } = this.state;

		return (
			<Dialog
				open={open}
				onClose={() => handleClose()}
				fullScreen
				TransitionComponent={Transition}
			>
				<AppBar position="relative" color="transparent">
					<Toolbar>
						<h4 style={{ flex: "1" }} className="mt-8">
							{t("dengueLocation.caseInformation")}
						</h4>
					</Toolbar>
				</AppBar>

				<DialogContent
					className="flex"
					style={{ alignItems: "flex-start", overflowY: "hidden" }}
				>
					<ValidatorForm
						ref="form"
						onSubmit={this.handleFormSubmit}
						className="w-50 p-30"
					>
						<div>
							<TextValidator
								label={t("general.code")}
								className="w-40 mr-16 mb-16"
								name="code"
								value={code}
								onChange={this.handleChange}
								validators={["required"]}
								errorMessages={t("general.required")}
							/>
							<TextValidator
								label={t("dengueLocation.patientName")}
								className="w-40 mb-16"
								name="name"
								value={name}
								onChange={this.handleChange}
								validators={["required"]}
								errorMessages={t("general.required")}
							/>
						</div>

						<TextValidator
							id="standard-basic"
							name="address"
							label={requireLabel(t("dengueLocation.address"))}
							value={address}
							onChange={this.handleChange}
							className="w-80 mb-16"
							validators={["required"]}
							errorMessages={[t("general.required")]}
						/>

						<div className="mt-30">
							<p style={{ color: "blue", fontWeight: "700" }}>
								{t("dengueLocation.locationInfo")}
							</p>
						</div>

						<div>
							<TextField
								id="standard-basic"
								name="latitude"
								label={t("dengueLocation.latitude")}
								value={latitude}
								onChange={this.handleChange}
								className="w-40 mr-16"
							/>
							<TextField
								id="standard-basic"
								name="longitude"
								label={t("dengueLocation.longitude")}
								value={longitude}
								onChange={this.handleChange}
								className="w-40"
							/>
						</div>

						<Grid container spacing={1}>
							<Grid item sm={4} md={7} lg={7}></Grid>
							<Grid item sm={4} md={3} lg={3} className="mt-30">
								<div className="flex flex-middle">
									<Button
										variant="contained"
										className="mr-12"
										startIcon={<Block />}
										color="secondary"
										onClick={() => this.props.handleClose()}
									>
										{t("general.cancel")}
									</Button>
									<Button
										variant="contained"
										startIcon={<Save />}
										color="primary"
										type="submit"
									>
										{t("general.save")}
									</Button>
								</div>
							</Grid>
						</Grid>
					</ValidatorForm>

					<DengueMap
						item={this.state}
						onGetLocation={this.onCloseMap}
					/>
				</DialogContent>
			</Dialog>
		);
	}
}

export default PatientDialog;
