import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	Paper,
} from "@material-ui/core";
import { Block, Save } from "@material-ui/icons";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React, { Component } from "react";
import Draggable from "react-draggable";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { searchByPage } from "../User/UserService";
import { addFeedback, updateFeedback } from "./FeedbackServices";

toast.configure({
	autoClose: 2000,
	draggable: false,
	limit: 3,
});

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

const requireLabel = item => {
	return (
		<>
			{item}
			<span style={{ color: "red", fontWeight: "bold" }}>*</span>
		</>
	);
};

export default class FeedbackDialog extends Component {
	constructor(props) {
		super(props);

		this.state = {
			userList: [],
			user: null,
			feedback: "",
		};
	}

	componentDidMount() {
		if (this.props.item) {
			this.setState({
				...this.props.item,
			});
		}
		this.getAllUser();
	}

	getAllUser = () => {
		searchByPage({
			pageIndex: 1,
			pageSize: 100,
		}).then(({ data }) => this.setState({ userList: data.content }));
	};

	onHandleChange = e => {
		this.setState({
			[e.target.name]: e.target.value,
		});
	};

	onSelectValue = value => {
		this.setState({
			user: value,
		});
	};

	onSubmit = () => {
		const { t } = this.props;
		let { id } = this.state;
		if (id) {
			updateFeedback(this.state)
				.then(() => {
					toast.success(t("general.updateSuccess"));
					this.props.handleOKEditClose();
				})
				.catch(() => toast.error(t("general.error")));
		} else {
			addFeedback(this.state)
				.then(() => {
					toast.success(t("general.addSuccess"));
					this.props.handleOKEditClose();
				})
				.catch(() => toast.error(t("general.error")));
		}
	};

	render() {
		const { open, handleClose, t, item } = this.props;
		const { user, feedback, userList } = this.state;

		return (
			<Dialog
				open={open}
				onClose={handleClose}
				maxWidth="sm"
				fullWidth
				PaperComponent={PaperComponent}
			>
				<DialogTitle>
					{" "}
					{item ? t("general.update") : t("general.add")}{" "}
					{t("feedback.title")}
				</DialogTitle>
				<ValidatorForm ref="form" onSubmit={this.onSubmit}>
					<DialogContent dividers>
						<Grid container spacing={2}>
							<Grid item sm={6} md={6}>
								<Autocomplete
									style={{ width: "100%" }}
									id="combo-box-demo"
									defaultValue={user}
									options={userList}
									getOptionSelected={(option, value) =>
										option.id === value.id
									}
									getOptionLabel={option =>
										option.displayName
									}
									onChange={(event, value) => {
										this.onSelectValue(value);
									}}
									renderInput={params => (
										<TextValidator
											{...params}
											value={user}
											label={requireLabel(
												"Chọn người dùng"
											)}
											fullWidth
											validators={["required"]}
											errorMessages={[
												`${t("general.required")}`,
											]}
										/>
									)}
								/>
							</Grid>
							<Grid item sm={12} md={12}>
								<TextValidator
									className="w-100"
									name="feedback"
									value={feedback}
									label={requireLabel("Thông tin góp ý")}
									onChange={this.onHandleChange}
									validators={["required"]}
									errorMessages={[`${t("general.required")}`]}
								/>
							</Grid>
						</Grid>
					</DialogContent>

					<DialogActions>
						<div className="flex flex-end flex-middle">
							<Button
								variant="contained"
								color="secondary"
								className="mr-12"
								startIcon={<Block />}
								onClick={() => handleClose()}
							>
								{t("Cancel")}
							</Button>
							<Button
								variant="contained"
								className="mr-8"
								startIcon={<Save />}
								color="primary"
								type="submit"
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
