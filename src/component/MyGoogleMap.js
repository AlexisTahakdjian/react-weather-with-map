import React, { Component } from 'react';

import GoogleMapReact from 'google-map-react';

import styled from 'styled-components';

import AutoComplete from './Autocomplete';
import Marker from './Marker';
import Weather from "./Weather";

const Wrapper = styled.main`
  width: 100%;
  height: 100%;
`;

class MyGoogleMap extends Component {

	state = {
		mapApiLoaded: false,
		mapInstance: null,
		mapApi: null,
		geoCoder: null,
		places: [],
		center: [],
		zoom: 9,
		address: '',
		draggable: true,
		lat: null,
		lng: null,
		isLoaded: false
	};

	componentWillMount() {
		this.setCurrentLocation();
	}

	onMarkerInteraction = (childKey, childProps, mouse) => {
		this.setState({
			draggable: false,
			lat: mouse.lat,
			lng: mouse.lng
		});
	}

	onMarkerInteractionMouseUp = (childKey, childProps, mouse) => {
		this.setState({ draggable: true });
		this._generateAddress();
	}

	_onChange = ({ center, zoom }) => {
		this.setState({
			center: center,
			zoom: zoom,
		});
	}

	_onClick = (value) => {
		this.setState({
			lat: value.lat,
			lng: value.lng
		});
	}

	apiHasLoaded = (map, maps) => {
		this.setState({
			mapApiLoaded: true,
			mapInstance: map,
			mapApi: maps,
		});

		this._generateAddress();
	};

	addPlace = (place) => {
		this.setState({
			places: [place],
			lat: place.geometry.location.lat(),
			lng: place.geometry.location.lng()
		});
		this._generateAddress()
	};

	_generateAddress() {
		const { mapApi } = this.state;

		const geocoder = new mapApi.Geocoder;

		geocoder.geocode({ 'location': { lat: this.state.lat, lng: this.state.lng } }, (results, status) => {

			if (status === 'OK') {
				if (results[0]) {
					this.zoom = 12;
					this.setState({ address: results[0].formatted_address, isLoaded: true });
				} else {
					window.alert('Pas de résultat trouvé');
				}
			} else {
				window.alert('Geocoder failed due to: ' + status);
			}

		});
	}

	// Pour obtenir la localisation
	setCurrentLocation() {
		if ('geolocation' in navigator) {
			navigator.geolocation.getCurrentPosition((position) => {
				this.setState({
					center: [position.coords.latitude, position.coords.longitude],
					lat: position.coords.latitude,
					lng: position.coords.longitude
				});
			});
		}
	}

	render() {
		const {
			mapApiLoaded, mapInstance, mapApi,
		} = this.state;

		let googleKey = process.env.REACT_APP_GOOGLE_KEY;

		return (
			<Wrapper>
				{mapApiLoaded && (
					<div>
						<AutoComplete map={mapInstance} mapApi={mapApi} addplace={this.addPlace} />
					</div>
				)}
				<GoogleMapReact
					center={this.state.center}
					zoom={this.state.zoom}
					draggable={this.state.draggable}
					onChange={this._onChange}
					onChildMouseDown={this.onMarkerInteraction}
					onChildMouseUp={this.onMarkerInteractionMouseUp}
					onChildMouseMove={this.onMarkerInteraction}
					onClick={this._onClick}
					bootstrapURLKeys={{
						key: googleKey,
						libraries: ['places', 'geometry'],
					}}
					yesIWantToUseGoogleMapApiInternals
					onGoogleApiLoaded={({ map, maps }) => this.apiHasLoaded(map, maps)}
				>

					<Marker
						text={this.state.address}
						lat={this.state.lat}
						lng={this.state.lng}
					/>


				</GoogleMapReact>

				<div className="info-wrapper">
					<div className="map-details">Latitude : {this.state.isLoaded ? this.state.lat : 'Chargement...'}, Longitude : {this.state.isLoaded ? this.state.lng : 'Chargement...'}</div>
					<div className="map-details">Adresse : {this.state.isLoaded ? this.state.address : 'Chargement...'}</div>
				</div>

				<Weather lat={this.state.lat} lng={this.state.lng} />
			</Wrapper >
		);
	}
}

export default MyGoogleMap;
