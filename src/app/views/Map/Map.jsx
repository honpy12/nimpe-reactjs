import "./MapStyle.css";
import { Button } from "@material-ui/core";
import { Fullscreen, Today } from "@material-ui/icons";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { PureComponent } from "react";
import moment from "moment";
import DatePicker from "react-date-picker";
import { Helmet } from "react-helmet";
import ReactMapGL, {
	NavigationControl,
	Popup,
	Marker,
	FlyToInterpolator,
} from "react-map-gl";
import { getListPatient, getListVector } from "./MapServices";
//import {Pin_layer_patient, Pin_layer_vector} from "./Pin_layer";
import Pin_layer_patient from "./Pin_layer_patient";
import Pin_layer_vector from "./Pin_layer_vector";
import Infor from "./Patient_Infor";
import SquareLoading from "../Component/Loading/SquareLoading";

const MAPBOX_TOKEN =
	"pk.eyJ1IjoibWVvMTIzIiwiYSI6ImNrdTI2MTQzZzBoNzMyd3FrNWVpc3U1YjEifQ.zj-vYL4EgQI83LzH8w8n6g";

class DengueMapComponent extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			viewport: {
				longitude: 105.7933994,
				latitude: 21.0282951,
				zoom: 14,
			},
			longitude: 105.7926785,
			latitude: 21.0283643,
			selectedMonth: new Date(),
			fullScreen: false,
			listPatient: [],
			listVector: [],
			patientInfor: null,
			vectorInfor: null,
			loading: true,
		};
	}

	setListPatient = data => {
		this.setState({
			listPatient: data,
		});
	};

	setListVector = data => {
		this.setState({
			listVector: data,
		});
	};

	listPatientError = () => {
		this.setState({
			loading: false,
			listPatient: [],
		});
	};

	listVectorError = () => {
		this.setState({
			loading: false,
			listVector: [],
		});
	};

	pinAboutPatientAndVector = () => {
		this.setState({
			loading: true,
		});
		let searchObject = {};
		const setListPatient = this.setListPatient;
		const setListVector = this.setListVector;
		const listPatientError = this.listPatientError;
		const listVectorError = this.listVectorError;
		searchObject.year = moment(this.state.selectedMonth).format("yyyy");
		searchObject.month = moment(this.state.selectedMonth).format("MM");

		getListPatient(searchObject)
			.then(res => {
				let data = res.data;
				setListPatient(data);
				this.setState({
					loading: false,
				});
			})
			.catch(function (error) {
				listPatientError();
				return Promise.reject(error);
			});
		getListVector(searchObject)
			.then(res => {
				let data = res.data;
				this.setState({
					loading: false,
				});
				setListVector(data);
			})
			.catch(function (error) {
				listVectorError();
				return Promise.reject(error);
			});
	};

	componentDidMount() {
		this.pinAboutPatientAndVector();
	}

	onClosePopup = () => {
		this.setState({ showPopup: false });
	};

	handleDateChange = date => {
		this.setState(
			{
				selectedMonth: date,
			},
			() => this.pinAboutPatientAndVector()
		);
	};

	viewFullScreen = () => {
		const elem = document.getElementById("map-wrapper");
		if (elem.requestFullscreen) {
			elem.requestFullscreen();
			this.setState({
				fullScreen: true,
			});
		} else if (elem.webkitRequestFullscreen) {
			elem.webkitRequestFullscreen();
			this.setState({
				fullScreen: true,
			});
		} else if (elem.msRequestFullscreen) {
			elem.msRequestFullscreen();
			this.setState({
				fullScreen: true,
			});
		}
	};

	exitFullScreen = () => {
		window.document.exitFullscreen().then(success => console.log(success));

		this.setState({
			fullScreen: false,
		});
	};

	Patient_renderPopup() {
		const { patientInfor } = this.state;

		return (
			patientInfor && (
				<Popup
					tipSize={5}
					anchor="top"
					longitude={parseFloat(patientInfor.longitude)}
					latitude={parseFloat(patientInfor.latitude)}
					closeOnClick={false}
					onClose={() => this.setState({ patientInfor: null })}
				>
					<Infor infor={patientInfor} _type="Ca bệnh" />
				</Popup>
			)
		);
	}

	Vector_renderPopup() {
		const { vectorInfor } = this.state;

		return (
			vectorInfor && (
				<Popup
					tipSize={5}
					anchor="top"
					longitude={parseFloat(vectorInfor.longitude)}
					latitude={parseFloat(vectorInfor.latitude)}
					closeOnClick={false}
					onClose={() => this.setState({ vectorInfor: null })}
				>
					<Infor infor={vectorInfor} _type="Vector truyền bệnh" />
				</Popup>
			)
		);
	}

	// metersToPixelsAtMaxZoom = (meters, latitude) =>
	//   meters / 0.075 / Math.cos((latitude * Math.PI) / 180);

	render() {
		const {
			viewport,
			selectedMonth,
			fullScreen,
			listPatient,
			listVector,
			loading,
		} = this.state;

		const { t } = this.props;

		const markersPatient = listPatient.map(patient => (
			<Marker
				key={patient.name}
				longitude={parseFloat(patient.longitude)}
				latitude={parseFloat(patient.latitude)}
			>
				<Pin_layer_patient
					onClick={() => this.setState({ patientInfor: patient })}
				/>
			</Marker>
		));
		const markersVector = listVector.map(vector => (
			<Marker
				key={vector.name}
				longitude={parseFloat(vector.longitude)}
				latitude={parseFloat(vector.latitude)}
			>
				<Pin_layer_vector
					onClick={() => this.setState({ vectorInfor: vector })}
				/>
			</Marker>
		));

		return (
			<div className="flex" id="map-wrapper">
				<Helmet>
					<title>
						{"Bản đồ điều tra SXH"} | {"Facility Service"}
					</title>
				</Helmet>
				<div
					style={{
						position: "absolute",
						top: "0",
						left: "0",
						zIndex: "999",
						backgroundColor: "#fff",
						height: "25vh",
						padding: "30px 20px 20px 20px",
						margin: "5px",
						display: "flex",
						borderRadius: "10px",
						flexDirection: "column",
					}}
				>
					<DatePicker
						onChange={event => this.handleDateChange(event)}
						//onChange={this.handleDateChange}
						value={selectedMonth}
						locale="vi-VN"
						format="M/yyyy"
						maxDetail="year"
						closeCalendar
						clearIcon={null}
						calendarClassName="month-picker"
						calendarIcon={<Today />}
					/>

					<Button
						onClick={
							fullScreen === true
								? this.exitFullScreen
								: this.viewFullScreen
						}
						color={fullScreen ? "secondary" : "primary"}
						variant="contained"
						className="mt-20"
						startIcon={<Fullscreen />}
					>
						{fullScreen === true
							? t("exitFullScreen")
							: t("fullScreen")}
					</Button>
				</div>
				<div
					style={{
						width: "60vw",
						height: "100vh",
						flex: "1",
						position: "relative",
					}}
				>
					{loading && <SquareLoading />}

					<ReactMapGL
						{...viewport}
						width="100%"
						height="100%"
						mapStyle="mapbox://styles/mapbox/streets-v11"
						mapboxApiAccessToken={MAPBOX_TOKEN}
						onViewportChange={viewport =>
							this.setState({ viewport })
						}
						attributionControl={false}
						onClick={this.onMapClick}
						transitionDuration={150}
						transitionInterpolator={new FlyToInterpolator()}
						onLoad={() =>
							this.setState({
								loading: false,
							})
						}
					>
						{markersPatient}
						{markersVector}
						{this.Patient_renderPopup()}
						{this.Vector_renderPopup()}

						<NavigationControl
							style={{
								top: 10,
								right: 10,
							}}
						/>
					</ReactMapGL>
				</div>
			</div>
		);
	}
}

export default DengueMapComponent;
