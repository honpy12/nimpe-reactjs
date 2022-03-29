import Highcharts from "highcharts";
import React, { Component } from "react";

class CountNotification extends Component {
	constructor(props) {
		super(props);
		this.state = {
			category: [],
			series: [],
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
					text: "Số lượng cảnh báo",
				},
			},
			xAxis: {
				categories: this.state.category,
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
					name: "Số lượng",
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
				category: categories,
				series: series,
			},
			() => {
				this.highChartsRender(t);
			}
		);
	}

	render() {
		return <div id="container"></div>;
	}
}
export default CountNotification;
