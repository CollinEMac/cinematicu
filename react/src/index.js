import React from 'react';
import ReactDOM from 'react-dom';
// import Movie from './components/common/Movie';
import Universe from './components/common/Universe';
import './index.css';

// How to run server: npm start

const App = () => {
  return (
    <div>
      <Universe />
      {/* <Movie /> */}
    </div>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
