import React, { useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import "./FacialExpression.css";

export default function FacialExpression() {
  const videoRef = useRef();

  const loadModels = async () => {
      const MODEL_URL = "/models";
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
    };
    const startVideo = () => {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch((err) => console.error("Error accessing webcam: ", err));
    };

    async function detectMood(){
      
        const detections = await faceapi.detectAllFaces(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();

        let mostProbableExpression = 0;
        let expressionName = '';

        if(!detections || detections.length === 0) {
          console.log("No face detected");
          return;
        }
        for (const expression in detections[0].expressions) {
          if (
            detections[0].expressions[expression] >mostProbableExpression) {
            mostProbableExpression = detections[0].expressions[expression];
            expressionName = expression;
          }
        }
        console.log(
          // `Most probable expression: ${mostProbableExpression}`
          expressionName
        );
    }

  useEffect(() => {
    loadModels().then(startVideo);
  }, []);
  return (
    <div className="mood-element">
      <video
        ref={videoRef}
        autoPlay
        muted
        className="user-video-feed"
      />
      <button onClick={detectMood}>Detect Mood</button>
    </div>
  );
}
