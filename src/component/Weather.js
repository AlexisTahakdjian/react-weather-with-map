import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const StyledDiv = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`

const StyledP = styled.p`
  margin: 0;
`

const StyledButton = styled.button`
  border: none;
  padding: 10px;
  margin-top: 10px;
  border-radius: 5px;
`

const Card = styled.div`
  margin: 20px 10px 10px;
  border: 1px #c6c6c6 solid;
  border-radius: 5px;
  padding: 5px 10px;
  &:first-child {
    margin-left: 0;
  }
  &:last-child{
    margin-right: 0;
  }
`

const TextCard = styled.p`
  margin: 5px 0 0;
  font-size: 10px;
`

const MinSpan = styled.span`
  color: #70757a;
`

class Weather extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null,
			isLoaded: false,
			weather: {},
			openMore: false
		};
	}

	componentDidMount() {
		if ( this.props.lat && this.props.lng ) {
			this.fetchData(this.props.lat, this.props.lng)
		}
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if ( this.props.lat !== prevProps.lat && this.props.lng !== prevProps.lng ) {
			this.fetchData(this.props.lat, this.props.lng)
		}
	}

	fetchData(lat, lng) {
		let weatherKey = process.env.REACT_APP_WEATHER_API
		fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${this.props.lat}&lon=${this.props.lng}&units=metric&lang=fr&appid=${weatherKey}`)
			.then(res => res.json())
			.then(
				(result) => {
					this.setState({
						isLoaded: true,
						weather: result
					});
				},

				(error) => {
					this.setState({
						isLoaded: true,
						error
					});
				}
			)
	}

	openWeather() {
		this.setState(prevState => ({ openMore: !prevState.openMore }))
	}

	render() {
		const { error, isLoaded, weather } = this.state;

		const weekDay = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']

		if ( error ) {
			return <div>Erreur : {error.message}</div>;
		} else if ( !isLoaded ) {
			return <div>Chargement…</div>;
		} else {
			return (
				<>
					<div style={{ display: "flex" }}>
						<p>Actuellement :</p>
						<StyledDiv style={{ display: "flex" }}>
							<img style={{ marginRight: '10px', width: '100%', height: '100%', maxWidth: '100px' }}
							     src={`http://openweathermap.org/img/wn/${weather.current.weather[0].icon}@2x.png`}
							     alt="icon météo"/>
							<div>
								<StyledP>Météo : {weather.current.weather[0].description}</StyledP>
								<StyledP>Température : {weather.current.temp}°C</StyledP>
								<StyledP>Humidité : {weather.current.humidity}%</StyledP>
							</div>
						</StyledDiv>
					</div>
					<StyledButton
						onClick={() => this.openWeather()}>{this.state.openMore ? 'Voir -' : 'Voir +'}</StyledButton>
					{this.state.openMore ? (
						<div style={{ display: "flex" }}>
							{weather.daily.map((day, i) => {
								let date = new Date(day.dt * 1000)
								return (
									<Card key={'Card+'+i}>
										<TextCard>{weekDay[date.getDay()]}</TextCard>
										<img src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
										     alt="icon météo"/>
										<TextCard>Température :</TextCard>
										<TextCard>{day.temp.max}°C <MinSpan>{day.temp.min}°C</MinSpan></TextCard>
										<TextCard>Humidité : {day.humidity}%</TextCard>
									</Card>
								)
							})}
						</div>
					) : <></>}

				</>
			);
		}
	}
}

export default Weather;
