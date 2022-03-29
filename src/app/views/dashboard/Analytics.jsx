import {
	Avatar,
	Card,
	CardContent,
	CardHeader,
	Grid,
	Typography,
} from "@material-ui/core";
import {
	AccessibilityNew,
	BugReport,
	Feedback,
	LocationOn,
	Today,
} from "@material-ui/icons";
import { withStyles } from "@material-ui/styles";
import "date-fns";
import { Breadcrumb } from "egret";
import moment from "moment";
import React, { Component } from "react";
import DatePicker from "react-date-picker";
import { Helmet } from "react-helmet";
import { getDashboardAnalytics, getDashboardTotal } from "./DashboardService";
import MultiColumResults from "./MultiColumResults";
import "./style.css";

class Dashboard1 extends Component {
	constructor(props) {
		super(props);

		this.state = {
			investigationsCount: 0,
			locationItemsCount: 0,
			feedbacksCount: 0,
			outbreaksCount: 0,
			dataNotification: [],
			keyDate: Date.now(),
			times: new Date(),
		};
	}

	componentDidMount() {
		this.updatePageData();
		this.updateTotal();
	}

	updateTotal() {
		let searchObject = {};

		searchObject.year = moment(this.state.times).format("yyyy");
		searchObject.month = moment(this.state.times).format("MM");
		getDashboardAnalytics(searchObject).then(({ data }) => {
			this.setState({
				investigationsCount: data.totalDengueLocationItem,
				locationItemsCount: data.totalLocationItem,
				outbreaksCount: data.totalPatient,
				feedbacksCount: data.totalUserFeetback,
			});
		});
	}

	updatePageData = () => {
		const { t } = this.props;

		let month = [
			t("Time.month1"),
			t("Time.month2"),
			t("Time.month3"),
			t("Time.month4"),
			t("Time.month5"),
			t("Time.month6"),
			t("Time.month7"),
			t("Time.month8"),
			t("Time.month9"),
			t("Time.month10"),
			t("Time.month11"),
			t("Time.month12"),
		];
		this.setState({ categories: month });

		let searchObj = {};
		searchObj.year = moment(this.state.times).format("yyyy");

		getDashboardTotal(searchObj).then(({ data }) => {
			let listDoashboard = [...data];
			let totalDengueLocationItem = [];
			let totalLocationItem = [];
			let totalPatient = [];
			let totalUserFeetback = [];

			listDoashboard.forEach(element => {
				totalDengueLocationItem.push(element.totalDengueLocationItem);
				totalLocationItem.push(element.totalLocationItem);
				totalPatient.push(element.totalPatient);
				totalUserFeetback.push(element.totalUserFeetback);
			});

			let series = [
				{
					name: t("Dashboard.numberVotesInvestigated"),
					data: totalLocationItem,
					color: "rgb(0, 161, 157)",
				},
				{
					name: t("Dashboard.numberVectorDisease"),
					data: totalDengueLocationItem,
					color: "rgb(175, 73, 223)",
				},
				{
					name: t("Dashboard.numberPatients"),
					data: totalPatient,
					color: "rgb(224, 93, 93)",
				},
				{
					name: t("Dashboard.userFeedbackNumber"),
					data: totalUserFeetback,
					color: "rgb(213, 213, 62)",
				},
			];

			this.setState({ series });
		});
	};

	onHandleDateChange = date => {
		this.setState(
			{
				times: date,
				series: null,
				categories: null,
				dataNotification: [],
			},
			() => {
				this.updatePageData();
				this.updateTotal();
			}
		);
	};

	componentDidUpdate(prevProps) {
		if (prevProps.t !== this.props.t) {
			this.updatePageData();
		}
	}

	render() {
		let {
			investigationsCount,
			feedbacksCount,
			locationItemsCount,
			outbreaksCount,
			series,
			times,
			categories,
		} = this.state;

		let { t } = this.props;

		let TitlePage = t("homepage");

		return (
			<div className="analytics m-sm-30">
				<Helmet>
					<title>
						{TitlePage} | {"Facility Service"}
					</title>
				</Helmet>
				<div className="mb-sm-30">
					<Breadcrumb routeSegments={[{ name: t("homepage") }]} />
				</div>
				<Grid container spacing={3}>
					<Grid item md={12}>
						<span
							style={{
								fontWeight: "600",
								fontSize: "20px",
								padding: "15px",
								paddingLeft: 0,
							}}
						>
							<span>
								{t("Dashboard.timeToResult")} : {t("month")}
							</span>
							<DatePicker
								onChange={this.onHandleDateChange}
								className="ml-8"
								value={times}
								locale={
									this.props.i18n.language === "vi"
										? "vi-VN"
										: "en-US"
								}
								format="MM/yyyy"
								maxDetail="year"
								closeCalendar
								clearIcon={null}
								calendarClassName="month-picker"
								calendarIcon={<Today />}
							/>
						</span>
					</Grid>
					<Grid item lg={3} md={3} sm={12} xs={12}>
						<Card elevation={2} className="h-100 p-16">
							<CardHeader
								avatar={
									<Avatar
										style={{ backgroundColor: "#00A19D" }}
									>
										<LocationOn color="#fff" />
									</Avatar>
								}
								title={t("Dashboard.numberVotesInvestigated")}
							/>
							<CardContent>
								<Typography variant="h4">
									{locationItemsCount}
								</Typography>
							</CardContent>
						</Card>
					</Grid>
					<Grid item lg={3} md={3} sm={12} xs={12}>
						<Card elevation={2} className="h-100 p-16">
							<CardHeader
								avatar={
									<Avatar
										style={{ backgroundColor: "#af49df" }}
									>
										<BugReport color="#fff" />
									</Avatar>
								}
								title={t("Dashboard.numberVectorDisease")}
							/>
							<CardContent>
								<Typography variant="h4">
									{investigationsCount}
								</Typography>
							</CardContent>
						</Card>
					</Grid>
					<Grid item lg={3} md={3} sm={12} xs={12}>
						<Card elevation={2} className="h-100 p-16">
							<CardHeader
								avatar={
									<Avatar
										style={{ backgroundColor: "#E05D5D" }}
									>
										<AccessibilityNew color="#fff" />
									</Avatar>
								}
								title={t("Dashboard.numberPatients")}
							/>
							<CardContent>
								<Typography variant="h4">
									{outbreaksCount}
								</Typography>
							</CardContent>
						</Card>
					</Grid>
					<Grid item lg={3} md={3} sm={12} xs={12}>
						<Card elevation={2} className="h-100 p-20">
							<CardHeader
								avatar={
									<Avatar
										style={{ backgroundColor: "#d5d53e" }}
									>
										<Feedback color="#fff" />
									</Avatar>
								}
								title={t("Dashboard.userFeedbackNumber")}
							/>
							<CardContent>
								<Typography variant="h4">
									{feedbacksCount}
								</Typography>
							</CardContent>
						</Card>
					</Grid>
					{/* <Grid item sm={12} md={12}>
            <Card elevation={2} className="h-100 p-20">
              <CardContent>
                {dataNotification && dataNotification.length > 0 && (
                  <CountChart
                    categories={dataNotification.map(
                      (item, index) => index + 1
                    )}
                    series={dataNotification}
                  />
                )}
              </CardContent>
            </Card>
          </Grid> */}
					<Grid item sm={12} md={12} lg={12}>
						<Card elevation={2} className="h-100 p-20">
							<CardContent>
								{series &&
									series.length > 0 &&
									categories &&
									categories.length > 0 && (
										<MultiColumResults
											t={t}
											series={series}
											categories={categories}
										/>
									)}
							</CardContent>
						</Card>
					</Grid>
				</Grid>
			</div>
		);
	}
}

export default withStyles({}, { withTheme: true })(Dashboard1);
