import * as api from "../api";
import io from "socket.io-client";

export const socket = io("http://localhost:3001"); // Connect to your WebSocket server

export const uploadVideo = (videoData) => async (dispatch) => {
  try {
    const { fileData, fileOptions } = videoData;
    const { data } = await api.uploadVideo(fileData, fileOptions);
    dispatch({ type: "POST_VIDEO", data });
    socket.emit("videoAdded", data); // Emit 'videoAdded' event to WebSocket server
    dispatch(getAllVideo());
  } catch (error) {
    alert(error.response.data.message);
  }
};

export const getAllVideo = () => async (dispatch) => {
  try {
    const { data } = await api.getVideos();
    dispatch({ type: "FETCH_ALL_VIDEOS", payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const likeVideo = (LikeDate) => async (dispatch) => {
  try {
    const { id, Like } = LikeDate;
    const { data } = await api.likeVideo(id, Like);
    dispatch({ type: "POST_LIKE", payload: data });
    socket.emit("videoAdded", data); // Emit 'videoAdded' event to WebSocket server
    dispatch(getAllVideo());
  } catch (error) {
    console.log(error);
  }
};

export const viewVideo = (ViewDate) => async (dispatch) => {
  try {
    const { id } = ViewDate;
    const { data } = await api.viewsVideo(id);
    dispatch({ type: "POST_VIEWS", data });
    socket.emit("videoAdded", data); // Emit 'videoAdded' event to WebSocket server
    dispatch(getAllVideo());
  } catch (error) {
    console.log(error);
  }
};
