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
import { addNew, checkCode, update } from "./SicknessTypeService";
import { Block, Save } from "@material-ui/icons";
toast.configure({
	autoClose: 2000,
	draggable: false,
	limit: 3,
});

class SpecimenTypeDialog extends Component {
	state = {
		id: "",
		name: "",
		code: "",
		description: "",
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
		let { id, name, code, description } = this.state;
		let obj = { code: code };
		let item = {};
		item.id = id;
		item.name = name;
		item.code = code;
		item.description = description;

		checkCode(obj).then(result => {
			if (result.data) {
				//Nếu trả về true là code chưa sử dụng có thể dùng
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
			} else {
				//Nếu trả về false là code đã được sử dụng
				toast.warn("Code bị trùng, vui lòng kiểm tra lại");
			}
		});
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
		let { id, name, code, description } = this.state;
		return (
			<Dialog open={open} fullWidth maxWidth="sm">
				<DialogTitle>
					{id ? t("general.update") : t("general.add")}
				</DialogTitle>
				<ValidatorForm ref="form" onSubmit={this.handleFormSubmit}>
					<DialogContent dividers>
						<Grid container spacing={4}>
							<Grid item lg={6} md={6} sm={12} xs={12}>
								<TextValidator
									className="w-100"
									size="small"
									label={
										<span className="font">
											<span style={{ color: "red" }}>
												{" "}
												*{" "}
											</span>
											{t("sicknessType.code")}
										</span>
									}
									onChange={this.handleChange}
									type="text"
									name="code"
									value={code}
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
											<span style={{ color: "red" }}>
												{" "}
												*{" "}
											</span>
											{t("sicknessType.name")}
										</span>
									}
									onChange={this.handleChange}
									type="text"
									name="name"
									value={name}
									validators={["required", "whitespace"]}
									errorMessages={[
										t("general.required"),
										t("general.invalidCharacter"),
									]}
								/>
							</Grid>
							<Grid item lg={12} md={12} sm={12} xs={12}>
								<TextValidator
									className="w-100"
									size="small"
									label={
										<span className="font">
											<span style={{ color: "red" }}>
												{" "}
												*{" "}
											</span>
											{t("sicknessType.description")}
										</span>
									}
									onChange={this.handleChange}
									type="text"
									name="description"
									value={description}
									validators={["required", "whitespace"]}
									errorMessages={[
										t("general.required"),
										t("general.invalidCharacter"),
									]}
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

export default SpecimenTypeDialog;
