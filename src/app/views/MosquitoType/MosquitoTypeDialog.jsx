import {
	Button,
	Dialog,
	DialogActions,
	Grid,
	DialogTitle,
	DialogContent,
} from "@material-ui/core";
import React, { Component } from "react";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addNew, checkCode, update } from "./MosquitoTypeService";
import { Block, Save } from "@material-ui/icons";
toast.configure({
	autoClose: 2000,
	draggable: false,
	limit: 3,
});

class MosquitoTypeDialog extends Component {
	state = {
		id: "",
		species: "",
		regnum: "",
		phylum: "",
		classes: "",
		ordo: "",
		familia: "",
		genus: "",
		isExternalOrg: false,
		isActive: false,
		shouldOpenSelectParentPopup: false,
		item: {},
	};
	valueItem = {};
	//------------
	handleChange = (event, source) => {
		// debugger
		event.persist();
		if (source === "isExternalOrg") {
			this.setState({ isExternalOrg: event.target.checked });
			return;
		}
		this.setState({
			[event.target.name]: event.target.value,
		});
	};

	handleFormSubmit = () => {
		let { id, species, regnum, phylum, classes, ordo, familia, genus } = this.state;
		let item = {};
		item.id = id;
		item.species = species;
		item.regnum = regnum;
		item.phylum = phylum;
		item.classes = classes;
		item.ordo = ordo;
		item.familia = familia;
		item.genus = genus;

		if (id) {
			update(item).then(() => {
				this.props.handleOKEditClose();
				toast.success("Cập nhật thành công!");
			});
		} else {
			addNew(item).then(() => {
				this.props.handleOKEditClose();
				toast.success("Thêm mới thành công!");
			});
		}
	};

	handleDialogClose = () => {
		this.setState({ shouldOpenSelectParentPopup: false });
	};

	validateForm(value) {
		let whitespace = new RegExp(/[^\s]+/);
		if (!whitespace.test(value)) {
			return true;
		}
		return false;
	}

	componentDidMount() {
		ValidatorForm.addValidationRule("whitespace", value => {
			if (this.validateForm(value)) {
				return false;
			}
			return true;
		});
	}

	componentWillMount() {
		let { item } = this.props;
		let specimenType;
		if (item.specimenType != null && item.specimenType.length > 0) {
			specimenType = item.specimenType[0];
		}
		this.setState(item, () => {
			this.setState({ specimenType: specimenType });
		});
	}

	componentWillUnmount() {
		ValidatorForm.removeValidationRule("whitespace");
	}

	handleChangeValue = item => {
		this.valueItem = item;
		console.log(this.valueItem);
	};

	render() {
		let { open, t } = this.props;
		let { id, species, regnum, phylum, classes, ordo, familia, genus} = this.state;
		return (
			<Dialog open={open} fullWidth maxWidth="sm">
				<DialogTitle>
					{id ? t("general.update") : t("general.add")}
				</DialogTitle>
				<ValidatorForm ref="form" onSubmit={this.handleFormSubmit}>
					<DialogContent dividers>
						<Grid container spacing={2}>
							<Grid item lg={6} md={6} sm={12} xs={12}>
								<TextValidator
									className="w-100"
									size="small"
									label={
										<span className="font">
											<span style={{ color: "red" }}>*</span>
											{t("mosquitoType.species")}
										</span>
									}
									onChange={this.handleChange}
									type="text"
									name="species"
									value={species}
									validators={["required", "whitespace"]}
									errorMessages={[
										t("general.required"),
										t("general.invalidCharacter"),
									]}
								/>
							</Grid>
							<Grid item lg={6} md={6} sm={12} xs={12}>
								<TextValidator
									className="w-100"
									size="small"
									label={
										<span className="font">
											<span style={{ color: "red" }}>*</span>
											{t("mosquitoType.regnum")}
										</span>
									}
									onChange={this.handleChange}
									type="text"
									name="regnum"
									value={regnum}
									validators={["required", "whitespace"]}
									errorMessages={[
										t("general.required"),
										t("general.invalidCharacter"),
									]}
								/>
							</Grid>
							<Grid item lg={6} md={6} sm={12} xs={12}>
								<TextValidator
									className="w-100"
									size="small"
									label={
										<span className="font">
											<span style={{ color: "red" }}>*</span>
											{t("mosquitoType.phylum")}
										</span>
									}
									onChange={this.handleChange}
									type="text"
									name="phylum"
									value={phylum}
									validators={["required", "whitespace"]}
									errorMessages={[
										t("general.required"),
										t("general.invalidCharacter"),
									]}
								/>
							</Grid>
							<Grid item lg={6} md={6} sm={12} xs={12}>
								<TextValidator
									className="w-100"
									size="small"
									label={
										<span className="font">
											{/* <span style={{ color: "red" }}>*</span> */}
											{t("mosquitoType.classMosquito")}
										</span>
									}
									onChange={this.handleChange}
									type="text"
									name="classes"
									value={ classes }
									// validators={["required", "whitespace"]}
									// errorMessages={[
									// 	t("general.required"),
									// 	t("general.invalidCharacter"),
									// ]}
								/>
							</Grid>
							<Grid item lg={6} md={6} sm={12} xs={12}>
								<TextValidator
									className="w-100"
									size="small"
									label={
										<span className="font">
											{/* <span style={{ color: "red" }}>*</span> */}
											{t("mosquitoType.ordo")}
										</span>
									}
									onChange={this.handleChange}
									type="text"
									name="ordo"
									value={ordo}
									// validators={["required", "whitespace"]}
									// errorMessages={[
									// 	t("general.required"),
									// 	t("general.invalidCharacter"),
									// ]}
								/>
							</Grid>
							<Grid item lg={6} md={6} sm={12} xs={12}>
								<TextValidator
									className="w-100"
									size="small"
									label={
										<span className="font">
											{/* <span style={{ color: "red" }}>*</span> */}
											{t("mosquitoType.familia")}
										</span>
									}
									onChange={this.handleChange}
									type="text"
									name="familia"
									value={familia}
									// validators={["required", "whitespace"]}
									// errorMessages={[
									// 	t("general.required"),
									// 	t("general.invalidCharacter"),
									// ]}
								/>
							</Grid>
							<Grid item lg={12} md={12} sm={12} xs={12}>
								<TextValidator
									className="w-100"
									size="small"
									label={
										<span className="font">
											{/* <span style={{ color: "red" }}>*</span> */}
											{t("mosquitoType.genus")}
										</span>
									}
									onChange={this.handleChange}
									type="text"
									name="genus"
									value={genus}
									// validators={["required", "whitespace"]}
									// errorMessages={[
									// 	t("general.required"),
									// 	t("general.invalidCharacter"),
									// ]}
								/>
							</Grid>
						</Grid>
					</DialogContent>

					<DialogActions style={{ paddingRight: "0px" }}>
						<div className="flex flex-middle">
							<Button
								startIcon={<Block />}
								variant="contained"
								className="mr-12"
								color="secondary"
								onClick={() => this.props.handleClose()}
							>
								{t("general.cancel")}
							</Button>
							<Button
								startIcon={<Save />}
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

export default MosquitoTypeDialog;
