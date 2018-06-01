import React from 'react';
import { handleResponse } from '../../helpers';
import { UNIVERSE_API_URL } from '../../config'; // I don't think this will work
import Loading from '../common/Loading';
import Header from '../common/Header';
import Movie from './Movie';
import './Header.css';

  class Universe extends React.Component {
    constructor() {
      super();

      this.state = {
        loading: false,
        universe_title: '',
        movies: [],
        error: null,
      };
    }

    componentDidMount() {
      this.setState({ loading: true });

      fetch(UNIVERSE_API_URL)
      // fetch(`https://api.themoviedb.org/3/movie/284054?api_key=b18afce37776748334ce195abf427edf`) // Testing
        .then(handleResponse)
        .then((data) => {
        this.setState({
            movies: data.movies,
            universe_title: data.universe_title,
            loading: false,
          });
        })
        .catch((error) => {
          console.log(error)
          console.log(error.errorMessage)
          this.setState({
            error: error.errorMessage,
            loading: false,
          });
        });

        this.drawCanvas();
    }

    drawCanvas() {
      window.onload = function() {
        var universeCanvas = document.getElementById('universeCanvas');

        var context = universeCanvas.getContext('2d');
        var images = document.getElementsByTagName("img");

        for (var i=0, max=images.length; i < max; i++) {
          context.drawImage(images[i], 69, 50);
          // Do something with the element here
        }
      }
    }

    render() {
      const { loading, error, movies, universe_title } = this.state;

      // render only loading component, if loading state is set to true
      if (loading) {
        return <div className="loading-container"><Loading /></div>
      }

      // render only error message, if error occurred while fetching data
      if (error) {
        return <div className="error">{error}</div>
      }

      return (
        <div>
          <Header title={universe_title}/>

          <canvas id="universeCanvas" width="2000" height="2000"></canvas>

          <div>
              {movies.map((movie, i) => <Movie movie_id={movie.id} key={i}/>)}
          </div>
        </div>
      );
    }
  }

export default Universe;
