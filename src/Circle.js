import React from 'react';

function Circle(props) {
  const styles = {
    circle: {
        position: 'absolute',
        backgroundColor: props.color,
        borderRadius: "50%",
        width:8,
        height:8,
        top: props.x,
        left: props.y
    }
  };
  return <div style={styles.circle}></div>
}

export default Circle;