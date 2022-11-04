import React from "react";
import { Button, makeStyles } from "@material-ui/core";

const vid = require("../../assets/VSERVE_IntroVideo.mp4")

const useStyles = makeStyles({
  root: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    borderRadius: 3,
    border: 0,
    color: 'white',
    padding: '0 30px',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    zIndex: 1,
    marginLeft: '90%',
    height: '3rem',
    display: "absolute",
  },
  video: {
    position: 'fixed',
    right: 0,
    bottom: 0,
    minWidth: '100%',
    minHeight: '100%',
  }

})

const Intro = (props) => {
  const classes = useStyles();
  return (
    <div>
      <Button variant="contained" className={classes.root} onClick={() => {
        props.history.push("/");
      }} >
        Skip Intro
      </Button>
      <video autoPlay muted loop id="myVideo" className={classes.video}>
        <source src={vid} type="video/mp4" />
          Your browser does not support HTML5 video.
      </video>


    </div >
  );




}

export default Intro;
