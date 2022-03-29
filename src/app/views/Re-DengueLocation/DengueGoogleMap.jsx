import "mapbox-gl/dist/mapbox-gl.css";
import React, { Component } from "react";
import ReactMapGL, {
	Marker,
	NavigationControl,
	Popup,
	GeolocateControl,
} from "react-map-gl";
import Geolocation from "./geolocate.svg";
import { getAddressDetail } from "./Re-DengueLocationServices";
import Loading from "../Component/Loading/SquareLoading";

const MAPBOX_TOKEN =
	"pk.eyJ1IjoibWVvMTIzIiwiYSI6ImNrdTI2MTQzZzBoNzMyd3FrNWVpc3U1YjEifQ.zj-vYL4EgQI83LzH8w8n6g";

const geoControlStyle = {
	position: "absolute",
	top: 100,
	right: 10,
};

class DengueMapComponent extends Component {
	constructor(props) {
		super(props);

		this.state = {
			viewport: {
				longitude: 105.7933994,
				latitude: 21.0282951,
				zoom: 15,
			},
			longitude: 105.7926785,
			latitude: 21.0283643,
			showPopup: false,
			item: null,
			itemAddress: "",
			loading: true,
		};
	}

	componentDidMount() {
		if (this.props.item?.longitude) {
			const { longitude, latitude } = this.props.item;
			this.setState({
				viewport: {
					...this.state.viewport,
					longitude: Number.parseFloat(longitude),
					latitude: Number.parseFloat(latitude),
				},
				longitude: Number.parseFloat(longitude),
				latitude: Number.parseFloat(latitude),
			});
		} else {
			window.navigator.geolocation.getCurrentPosition(({ coords }) => {
				this.setState({
					viewport: {
						longitude: coords.longitude,
						latitude: coords.latitude,
						zoom: 16,
					},
					longitude: coords.longitude,
					latitude: coords.latitude,
				});
			});
		}
	}

	onMapClick = e => {
		this.setState(
			{
				longitude: e.lngLat[0],
				latitude: e.lngLat[1],
				gMapX: e.center.x,
				gMapY: e.center.y,
				showAddressDetail: true,
			},
			() =>
				getAddressDetail(e.lngLat)
					.then(({ data }) =>
						this.setState({
							itemAddress: data.features[0]?.place_name_vi ?? "",
						})
					)
					.then(() => this.props.onGetLocation(this.state))
		);
	};

	onHandleDrag = e => {
		this.setState(
			{
				longitude: e.lngLat[0],
				latitude: e.lngLat[1],
				gMapX: e.center.x,
				gMapY: e.center.y,
				showAddressDetail: true,
			},
			() => {
				getAddressDetail(e.lngLat)
					.then(({ data }) =>
						this.setState({
							itemAddress: data.features[0]?.place_name_vi ?? "",
						})
					)
					.then(() => this.props.onGetLocation(this.state));
			}
		);
	};

	onMarkerClick = () => {
		this.setState({
			showPopup: true,
		});
	};

	onClosePopup = () => {
		this.setState({ showPopup: false });
	};

	render() {
		const { longitude, latitude, viewport, showPopup, loading } =
			this.state;

		return (
			<div style={{ width: "50%", height: "600px" }}>
				{loading && <Loading />}
				<ReactMapGL
					{...viewport}
					width="100%"
					height="100%"
					mapStyle="mapbox://styles/mapbox/streets-v11"
					mapboxApiAccessToken={MAPBOX_TOKEN}
					onViewportChange={viewport => this.setState({ viewport })}
					attributionControl={false}
					onClick={this.onMapClick}
					onLoad={() => this.setState({ loading: false })}
				>
					<NavigationControl
						style={{
							top: 10,
							right: 10,
						}}
					/>

					<GeolocateControl
						positionOptions={{ enableHighAccuracy: true }}
						trackUserLocation={true}
						auto
						style={geoControlStyle}
					/>

					{this.props.item.longitude !== "" && (
						<Marker
							longitude={longitude}
							latitude={latitude}
							onDragEnd={this.onHandleDrag}
							draggable
							offsetLeft={-20}
							offsetTop={-10}
							onClick={this.onMarkerClick}
						>
							<img src={Geolocation} alt="icon my location" />
						</Marker>
					)}

					{showPopup && (
						<Popup
							longitude={longitude}
							latitude={latitude}
							closeButton={true}
							closeOnClick={true}
							onClose={this.onClosePopup}
							anchor="bottom"
						>
							<strong>
								Lat: {latitude}, Lng: {longitude}
							</strong>
						</Popup>
					)}
				</ReactMapGL>
			</div>
		);
	}
}

export default DengueMapComponent;
