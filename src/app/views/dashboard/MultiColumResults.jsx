import Highcharts from "highcharts";
import moment from "moment";
import React, { Component } from "react";
import { getDashboardAnalytics } from "./DashboardService";

class MultiColumResults extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	highChartsRender(t) {
		Highcharts.chart({
			chart: {
				type: "column",
				renderTo: "atmospheric-r",
			},
			title: {
				text: t("Dashboard.chartTitle"),
				style: {
					fontSize: "18px",
					fontFamily: "Arial",
					fontWeight: "700",
				},
			},
			credits: {
				enabled: false,
			},
			legend: {
				reversed: true,
			},
			xAxis: {
				categories: this.props.categories,
			},
			yAxis: {
				min: 0,
				title: {
					text: "",
				},
			},
			// plotOptions: {
			//   spline: {
			//     dataLabels: {
			//       format: '{point.name}: {point.percentage:.1f} %'
			//     },
			//     innerSize: '70%'
			//   },

			// },

			tooltip: {
				shared: true,
			},
			plotOptions: {},
			series: this.props.series,
		});
	}

	updatePageData = () => {
		let searchObj = {};
		searchObj.year = moment(this.state.year).format("yyyy");
		searchObj.filterType = this.state.typeOption.type;
		getDashboardAnalytics(searchObj).then(({ data }) => {
			let listDoashboard = [...data];
			let totalPatient = [];
			let totalPatientIncident = [];
			let totalImportant = [];
			let totalChange = [];
			listDoashboard.forEach(element => {
				totalPatient.push(element.totalPatient);
				totalPatientIncident.push(element.totalPatientIncident);
				totalImportant.push(element.totalImportant);
				totalChange.push(element.totalChange);
			});

			let series = [
				{
					name: "Tổng số biến cố bất lợi",
					data: totalPatient,
					color: "red",
				},
				{
					name: "Số lượng biến cố nghiêm trọng",
					data: totalPatientIncident,
					color: "blue",
				},
				{
					name: "Số lượng biến cố được xử trí liên quan đến thay đổi phác đồ lao",
					data: totalImportant,
					color: "green",
				},
			];
			console.log(series);
			this.highChartsRender(series);
		});
	};

	componentDidMount() {
		let { t } = this.props;
		this.highChartsRender(t);
	}

	componentDidUpdate() {
		let { t } = this.props;
		this.highChartsRender(t);
	}

	render() {
		return <div id="atmospheric-r"></div>;
	}
}
export default MultiColumResults;
