
import React, { useEffect, useState } from "react";
import Main from "../layout/Main";
import HotelService from "../common/HotelService";
import Parallax from "../common/Parallax";
import RoomCarousel from "../common/RoomCarousel";
import RoomSearch from "../common/RoomSearch";
import { useLocation } from "react-router-dom";
import { api } from "../utils/ApiFunctions";

const Home = () => {
  const location = useLocation();
  const message = location.state?.message;
  const currentUser = localStorage.getItem("userId");

  const [backendStatus, setBackendStatus] = useState("loading");

  useEffect(() => {
    const controller = new AbortController();

    const wakeUpBackend = async () => {
      try {
        await api.get("/api/health", {
          signal: controller.signal,
          timeout: 120000
        });

        setBackendStatus("ready");
      } catch (error) {
        if (
          error.code !== "ERR_CANCELED" &&
          !controller.signal.aborted
        ) {
          console.error("Backend wake-up error:", error);
          setBackendStatus("error");
        }
      }
    };

    wakeUpBackend();

    return () => controller.abort();
  }, []);

  return (
    <section>
      {message && (
        <p className="text-warning px-5">{message}</p>
      )}

      {currentUser && (
        <h6 className="text-success text-center">
          You are logged in as {currentUser}
        </h6>
      )}

      {backendStatus === "loading" && (
        <div
          className="alert alert-info text-center mx-4 mt-3"
          role="status"
        >
          <span
            className="spinner-border spinner-border-sm me-2"
            aria-hidden="true"
          />
          Connecting to our booking service...
          This may take up to a minute.
        </div>
      )}

      {backendStatus === "error" && (
        <div
          className="alert alert-warning text-center mx-4 mt-3"
          role="alert"
        >
          Our booking service is temporarily unavailable.
          Please refresh the page in a moment.
        </div>
      )}

      <Main />

      <section className="container">
        <RoomSearch />

        <RoomCarousel />

        <Parallax />

        <RoomCarousel />

        <HotelService />

        <Parallax />

        <RoomCarousel />
      </section>
    </section>
  );
};

export default Home;
