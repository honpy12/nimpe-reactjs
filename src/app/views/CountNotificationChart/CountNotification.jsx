import { Card, CardContent, Grid } from "@material-ui/core";
import { Today } from "@material-ui/icons";
import "date-fns";
import { Breadcrumb } from "egret";
import React, { Component } from "react";
import DatePicker from "react-date-picker";
import { Helmet } from "react-helmet";
import "../dashboard/style.css";
import {
	getCountNotifyByDay,
	getCountNotifyByMonth,
} from "./CountNofiticationService";
import CartCount from "./CountNotificationChart";

class CountNotification extends Component {
	constructor(props) {
		super(props);

		this.state = {
			data: [],
			keyDate: Date.now(),
			times: new Date(),
		};
	}

	componentDidMount() {
		this.updatePageData();
	}

	updatePageData = (typeView = "month") => {
		var d = new Date(this.state.times);
		if (typeView === "month") {
			getCountNotifyByDay(d.getMonth() + 1, d.getFullYear()).then(
				({ data }) => {
					this.setState({
						data,
					});
				}
			);
		} else {
			getCountNotifyByMonth(d.getFullYear()).then(({ data }) =>
				this.setState({
					data,
				})
			);
		}
	};

	onHandleDateChange = date => {
		this.setState(
			{
				times: date,
				series: null,
				categories: null,
				data: [],
			},
			() => {
				this.updatePageData();
			}
		);
	};

	render() {
		let { times, data } = this.state;

		let { t } = this.props;

		return (
			<div className="analytics m-sm-30">
				<Helmet>
					<title>
						{t("manage.countNotification")} |{" "}
						{t("manage.countNotification")}
					</title>
				</Helmet>

				<div className="mb-sm-30">
					<Breadcrumb
						routeSegments={[
							{ name: t("manage.countNotification") },
						]}
					/>
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
								locale="vi-VN"
								format="MM/yyyy"
								maxDetail="year"
								closeCalendar
								clearIcon={null}
								calendarClassName="month-picker"
								calendarIcon={<Today />}
							/>
						</span>
					</Grid>
					<Grid item sm={12} md={12}>
						<Card elevation={2} className="h-100 p-20">
							{data && data.length > 0 && (
								<CartCount
									t={t}
									categories={data.map(
										(item, index) => index + 1
									)}
									series={data}
									updatePageData={this.updatePageData}
								/>
							)}
						</Card>
					</Grid>
				</Grid>
			</div>
		);
	}
}

export default CountNotification;
