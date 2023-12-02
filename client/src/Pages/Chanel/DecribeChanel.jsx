import React, { useState } from "react";
import { FaEdit, FaUpload } from "react-icons/fa";
import { BsCameraReelsFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import "./DescribeChanel.css";

function DecribeChanel({ setEditCreateChanelBtn, Cid, setVidUploadPage }) {
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [mediaStream, setMediaStream] = useState(null);
  const [streaming, setStreaming] = useState(false);

  const handleToggleMic = () => {
    if (mediaStream) {
      const audioTracks = mediaStream.getAudioTracks();
      if (audioTracks.length > 0) {
        audioTracks[0].enabled = !micEnabled;
        setMicEnabled((prevMic) => !prevMic);
      }
    }
  };

  const handleToggleVideo = () => {
    if (mediaStream) {
      const videoTracks = mediaStream.getVideoTracks();
      if (videoTracks.length > 0) {
        videoTracks[0].enabled = !videoEnabled;
        setVideoEnabled((prevVideo) => !prevVideo);
      }
    }
  };

  const stopStream = () => {
    setStreaming(false);
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
    }
  };

  const startLivestream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setMediaStream(stream);
      setStreaming(true);
      console.log(stream);
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const chanels = useSelector((state) => state?.chanelReducers);
  const currentChanel = chanels.find((c) => c._id === Cid);
  const CurrentUser = useSelector((state) => state?.currentUserReducer);

  return (
    <div className="container3_chanel">
      <div className="chanel_logo_chanel">
        <b>{currentChanel?.name.charAt(0).toUpperCase()}</b>
      </div>
      <div className="description_chanel">
        <b>{currentChanel?.name}</b>
        <p>{currentChanel?.desc}</p>
      </div>
      {CurrentUser?.result._id === currentChanel?._id && (
        <>
          <p
            className="editbtn_chanel"
            onClick={() => {
              setEditCreateChanelBtn(true);
            }}
          >
            <FaEdit />
            <b>Edit Channel</b>
          </p>
          <p
            className="uploadbtn_chanel"
            onClick={() => setVidUploadPage(true)}
          >
            <FaUpload />
            <b>Upload Video</b>
          </p>
          <p className="steambtn_chanel" onClick={startLivestream}>
            <BsCameraReelsFill />
            <b>Live Stream</b>
          </p>
        </>
      )}
      <div className="live_stream">
        <div className="video_container">
          {streaming && mediaStream && (
            <video
              id="local-video"
              autoPlay
              muted={!micEnabled}
              style={{
                width: "50%",
                height: "auto",
                objectFit: "cover",
                filter: videoEnabled ? "none" : "grayscale(100%)",
              }}
              ref={(videoRef) => {
                if (videoRef && mediaStream) {
                  videoRef.srcObject = mediaStream;
                }
              }}
            ></video>
          )}
        </div>
        <div className="controls">
          {streaming && (
            <>
              <button onClick={handleToggleMic}>
                {micEnabled ? "Mute Mic" : "Unmute Mic"}
              </button>
              <button onClick={handleToggleVideo}>
                {videoEnabled ? "Turn Off Camera" : "Turn On Camera"}
              </button>
              <button onClick={stopStream}>End Stream</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
export default DecribeChanel;
