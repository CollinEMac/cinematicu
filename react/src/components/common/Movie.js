import React from 'react';
import { handleResponse } from '../../helpers';
import { MOVIE_API_URL } from '../../config';
import Loading from '../common/Loading';
import Header from '../common/Header';
import './Header.css';
import './Poster.css';
import './Callout.css';

  class Movie extends React.Component {
    constructor() {
      super();

      this.state = {
        loading: false,
        movie: {},
        error: null,
      };
    }

    componentDidMount() {
      this.setState({ loading: true });

      // fetch(`${MOVIE_API_URL}/284054?api_key=b18afce37776748334ce195abf427edf`)
      fetch(`${MOVIE_API_URL}/${this.props.movie_id}?api_key=b18afce37776748334ce195abf427edf`)
        .then(handleResponse)
        .then((data) => {
        this.setState({
            movie: data,
            loading: false,
          });
        })
        .catch((error) => {
          this.setState({
            error: error.errorMessage,
            loading: false,
          });
        });

        // var div = document.getElementById('dragdiv');
        // div.addEventListener('onDragStart',this.onDragStart,false);
        // document.body.addEventListener('onDragOver',this.onDragOver,false);
        // document.body.addEventListener('onDrop',this.onDrop,false);
    }

    render() {
      const { loading, error, movie, } = this.state;

      // render only loading component, if loading state is set to true
      if (loading) {
        return <div className="loading-container"><Loading /></div>
      }

      // render only error message, if error occurred while fetching data
      if (error) {
        return <div className="error">{error}</div>
      }

      var imgUrl = `https://image.tmdb.org/t/p/w600_and_h900_bestv2${movie.poster_path}`

      // just using constants for now, images shoudl be about the same size forever
      const imageWidth = 177;
      const imageHeight = 260;

      var moviesPerRow = Math.floor(window.innerWidth/imageWidth)

      var mod = this.props.sequence % moviesPerRow
      var imageLeft = (imageWidth * mod)

      var imageTop = 90 + (imageHeight*(Math.floor(this.props.sequence/moviesPerRow)))

      function hover(e) {
        var callout = document.getElementById(movie.id);
        callout.style.left=e.pageX + "px";
        callout.style.top=e.pageY + "px";
        callout.style.visibility="visible";
      }

      function unHover(e) {
        var callout = document.getElementById(movie.id);
        callout.style.visibility = "hidden";
      }

      function onDragStart(e){
        console.log('On Drag Start')
        var style = window.getComputedStyle(e.target, null);
        e.dataTransfer.setData("text/plain",
        (parseInt(style.getPropertyValue("left"),10) - e.clientX) + ',' + (parseInt(style.getPropertyValue("top"),10) - e.clientY));
      }

      function onDragOver(e) {
        console.log('On Drag Over')
        e.preventDefault();
        return false;
      }

      function onDrop(e) {
        console.log('On Drop')
        var offset = e.dataTransfer.getData("text/plain").split(',');
        var div = document.getElementById(imgUrl)
        div.style.left = (e.clientX + parseInt(offset[0],10)) + 'px';
        div.style.top = (e.clientY + parseInt(offset[1],10)) + 'px';
        e.preventDefault();
        return false;
      }

      return (
          <div id={imgUrl} draggable="true" onDragStart={onDragStart} onDragOver={onDragOver} onDrop={onDrop}>
          <img className="Poster" src={imgUrl} alt=""
            onMouseEnter={hover}
            onMouseLeave={unHover}
            style={{top:imageTop, left:imageLeft}}
          />

          <div id={movie.id} className="Callout">
            <Header title={movie.title}/>
            <h2>{movie.release_date}</h2>
            <p>{movie.overview}</p>
          </div>
        </div>
      );
    }
  }

export default Movie;
