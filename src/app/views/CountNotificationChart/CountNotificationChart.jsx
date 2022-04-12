import {
	FormControl,
	FormControlLabel,
	FormLabel,
	Radio,
	RadioGroup,
} from "@material-ui/core";
import Highcharts from "highcharts";
import React, { Component } from "react";

export default class CountNotificationChart extends Component {
	constructor(props) {
		super(props);
		let { t } = this.props;
		this.state = {
			categories: [],
			series: [],
			typeView: "month",
		};
	}

	highChartsRender(t) {
		Highcharts.chart("container", {
			chart: {
				type: "spline",
			},
			title: {
				text: t("countChart"),
				style: {
					fontWeight: "700",
					fontFamily: "Arial",
				},
			},
			yAxis: {
				title: {
					text: t("countAlert"),
				},
			},
			xAxis: {
				categories: this.state.categories,
				title: t("time"),
				// min: 0,
				// // softMin: 0,
				// max: 31,
			},
			plotOptions: {
				series: {
					label: {
						connectorAllowed: false,
					},
					pointStart: 0,
				},
			},
			series: [
				{
					name: t("countAlert"),
					data: this.state.series.map(item => item.total),
				},
			],
			responsive: {
				rules: [
					{
						condition: {
							maxWidth: 500,
						},
						chartOptions: {
							legend: {
								layout: "horizontal",
								align: "center",
								verticalAlign: "bottom",
							},
						},
					},
				],
			},
		});
	}

	componentDidMount() {
		const { categories, series, t } = this.props;
		this.setState(
			{
				categories: categories,
				series: series,
			},
			() => {
				this.highChartsRender(t);
			}
		);
	}

	componentDidUpdate() {
		const { t } = this.props;
		this.highChartsRender(t);
	}

	static getDerivedStateFromProps(props, state) {
		if (
			state.categories !== props.categories ||
			state.series !== props.series
		) {
			return {
				categories: props.categories,
				series: props.series,
			};
		}
		return null;
	}

	handleChange = e => {
		const { t } = this.props;

		this.setState(
			{
				typeView: e.target.value,
			},
			() => {
				this.props.updatePageData(this.state.typeView);
				setTimeout(() => {
					this.highChartsRender(t);
				}, 200);
			}
		);
	};

	render() {
		const { typeView } = this.state;
		const { t } = this.props;

		return (
			<div>
				<div>
					<FormControl
						component="fieldset"
						style={{
							flexDirection: "row",
							alignItems: "center",
						}}
					>
						<FormLabel style={{ marginRight: "16px" }}>
							{t("displayData")}
						</FormLabel>
						<RadioGroup
							aria-label="gender"
							row
							name="gender1"
							value={typeView}
							onChange={this.handleChange}
						>
							<FormControlLabel
								value="month"
								control={<Radio />}
								label={t("month")}
							/>
							<FormControlLabel
								value="year"
								control={<Radio />}
								label={t("year")}
							/>
						</RadioGroup>
					</FormControl>
				</div>
				<div id="container" className="pr-24"></div>
			</div>
		);
	}
}
