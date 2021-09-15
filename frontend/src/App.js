import './App.css';
import { useState, useEffect} from 'react';
import ReactMapGL, {Marker, Popup} from 'react-map-gl';
import {Room, Star} from "@material-ui/icons";
import axios from "axios";
import {format} from "timeago.js";
import Register from './Components/Register';
import Login from './Components/Login';

function App() {

  const myStorage = window.localStorage;

  const [currentUser,setCurrentUser] = useState(myStorage.getItem("user"));

  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const [pins,setPins] = useState([])
  const [currentPlaceId, setCurrentPlaceId] = useState(null)
  const [newPlace, setnewPlace] = useState(null)
  const [title, setTitle] = useState(null)
  const [desc, setDesc] = useState(null)
  const [rating, setRating] = useState(null)

  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 46,
    longitude: 17,
    zoom: 4
  });


  useEffect(() => {
    const getPins = async ()=>{
      try{
        const res = await axios.get("/pins");
        setPins(res.data);
      }
      catch(err){
        console.log(err);
      }
    };
      getPins()
  }, []);


  const handleMarkerClick = (id,lat,long) => {
    setCurrentPlaceId(id);
    setViewport({...viewport, latitude:lat,longitude:long})
  }

  const handleAddClick = (e) =>{
    const[long,lat] = e.lngLat;
    setnewPlace({
      lat:lat,
      long:long
    })
  }

  const handleSubmit = async (e) =>{
    e.preventDefault();
    const newPin = {
      username:currentUser,
      title,
      desc,
      rating,
      lat:newPlace.lat,
      long:newPlace.long
    }

    try{
      const res = await axios.post("/pins", newPin);
      setPins([...pins,res.data]);
      setnewPlace(null);
    }
    catch(err){
      console.log(err);
    }
  }



  const handleLogOut = () =>{
    myStorage.removeItem("user");
    setCurrentUser(null);
  }


  return (
   <div className="App">
      <ReactMapGL
      {...viewport}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
      onViewportChange={nextViewport => setViewport(nextViewport)}
      mapStyle="mapbox://styles/hulea/cktbwnchk155a17rjwtpeayc7"
      onDblClick = {handleAddClick}
      transitionDuration="200"
      >
      {pins.map( (p)=>(
        <>
        <Marker
          latitude={p.lat}
          longitude={p.long}
          offsetLeft={-20}
          offsetTop={-10}>
            <Room
              style={{fontSize : viewport.zoom* 5, color:p.username===currentUser ?"crimson":"#8c03fc", cursor:"pointer"}}
              onClick={()=>handleMarkerClick(p._id,p.lat,p.long)}
            ></Room>
        </Marker>

        {p._id === currentPlaceId

          &&

          <Popup
            latitude={p.lat}
            longitude={p.long}
            closeButton={true}
            closeOnClick={false}
            anchor="bottom"
            onClose={() => setCurrentPlaceId(null)}>
               <div className="card">
                  <label>Place</label>
                    <h4 className="place">{p.title}</h4>
                  <label>Review</label>
                    <p className="desc">{p.desc}</p>
                  <label>Rating</label>
                    <div className="stars">
                        {Array(p.rating).fill(<Star classname="star"/>)}
                    </div>
                  <label>Information</label>
                    <span className="username">Created by <b>{p.username}</b></span>
                    <span className="date">{format(p.createdAt)}</span>
                </div>
          </Popup>
        }
          </>
      ))}


        {newPlace && (
          <Popup
          latitude={newPlace.lat}
          longitude={newPlace.long}
          closeButton={true}
          closeOnClick={false}
          anchor="left"
          onClose={() => setnewPlace(null)}
          >
            <div>
              <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input placeholder="Enter a title" onChange={(e) => setTitle(e.target.value)}/>

                <label>Review</label>
                <textarea placeholder="Say something about this place" onChange={(e) => setDesc(e.target.value)}/>

                <label>Rating</label>
                <select onChange={(e) => setRating(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>

                <button className="submitButton" type="submit">Add Pin</button>

              </form>
            </div>

          </Popup>
        )}

            {currentUser ? (<button className="button logout" onClick={handleLogOut}>Log out</button>)
            : (<div className="buttons">
              <button className="button login" onClick={() => setShowLogin(true)}>Log in</button>
              <button className="button register" onClick={() => setShowRegister(true)}>Register</button>
              </div>)
            }

          {showRegister && <Register setShowRegister={setShowRegister}/>}
          {showLogin && <Login setShowLogin={setShowLogin} myStorage={myStorage} setCurrentUser={setCurrentUser} />}

    </ReactMapGL>
   </div>
  );
}

export default App;
