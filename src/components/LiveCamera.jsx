import { useState, useRef, useEffect } from "react";
import Section from "./Section";
import { BackgroundCircles } from "./design/Hero";
import Button from "./Button";

const LiveCamera = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [currentCamera, setCurrentCamera] = useState(0);
  const parallaxRef = useRef(null);
  const cameras = [1, 2, 3, 4];
  const [activeCameraStreams, setActiveCameraStreams] = useState([]);
  const socketRef = useRef(null);
  const camera2CanvasRef = useRef(null);

  useEffect(() => {
    initCameras();
    return () => {
      stopAllCameraStreams();
      if (socketRef.current) socketRef.current.close();
    };
  }, []);

  const initCameras = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240 },
      });
      setActiveCameraStreams((prev) => ({ ...prev, 0: stream }));
      startWebSocket(stream);
    } catch (err) {
      console.error("Error accessing webcam:", err);
    }
  };

  const startWebSocket = (stream) => {
    socketRef.current = new WebSocket("ws://127.0.0.1:8000/ws/video");
    socketRef.current.binaryType = "arraybuffer";

    socketRef.current.onopen = () => {
      console.log("WebSocket connected");
      sendFramesFromStream(stream);
    };

    socketRef.current.onmessage = (event) => {
      const blob = new Blob([event.data], { type: "image/jpeg" });
      const url = URL.createObjectURL(blob);
      const img = new Image();

      img.onload = () => {
        if (camera2CanvasRef.current) {
          const ctx = camera2CanvasRef.current.getContext("2d");
          ctx.clearRect(
            0,
            0,
            camera2CanvasRef.current.width,
            camera2CanvasRef.current.height
          );
          ctx.drawImage(
            img,
            0,
            0,
            camera2CanvasRef.current.width,
            camera2CanvasRef.current.height
          );
        }
        URL.revokeObjectURL(url);
      };

      img.src = url;
    };

    socketRef.current.onerror = (e) => console.error("WebSocket error:", e);
    socketRef.current.onclose = () => console.warn("WebSocket closed");
  };

  const sendFramesFromStream = (stream) => {
    const video = document.createElement("video");
    video.srcObject = stream;
    video.play();

    const sendFrame = () => {
      if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN)
        return;

      const tmpCanvas = document.createElement("canvas");
      tmpCanvas.width = 320;
      tmpCanvas.height = 240;
      const tmpCtx = tmpCanvas.getContext("2d");
      tmpCtx.drawImage(video, 0, 0);

      tmpCanvas.toBlob(
        (blob) => {
          if (!blob) return;
          blob.arrayBuffer().then((buffer) => {
            socketRef.current.send(buffer);
          });
        },
        "image/jpeg",
        0.7
      );
    };

    // Send frames at ~5 FPS
    const interval = setInterval(sendFrame, 200);
    return () => clearInterval(interval);
  };

  const stopAllCameraStreams = () => {
    Object.values(activeCameraStreams).forEach((stream) => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    });
    setActiveCameraStreams({});
  };

  const switchView = (mode) => {
    setViewMode(mode);
  };

  const handleCameraChange = (index) => {
    setCurrentCamera(index);
  };

  return (
    <Section
      className="pt-[8rem] pb-[2rem] -mt-[1.25rem]"
      crosses
      crossesOffset="lg:translate-y-[2rem]"
      customPaddings
    >
      <div className="container relative" ref={parallaxRef}>
        {/* View Controls */}
        <div className="flex justify-end gap-4 mb-8">
          <Button
            className={viewMode === "grid" ? "bg-n-3/10" : ""}
            onClick={() => switchView("grid")}
          >
            Grid View
          </Button>
          <Button
            className={viewMode === "single" ? "bg-n-3/10" : ""}
            onClick={() => switchView("single")}
          >
            Single View
          </Button>
        </div>

        {/* Grid View */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Camera 1 */}
            <div className="relative p-0.5 rounded-2xl bg-conic-gradient">
              <div className="relative bg-n-8 rounded-[1rem] p-4 h-[300px] overflow-hidden">
                {activeCameraStreams[0] ? (
                  <video
                    className="w-full h-full object-cover"
                    autoPlay
                    playsInline
                    muted
                    ref={(video) => {
                      if (video && !video.srcObject && activeCameraStreams[0]) {
                        video.srcObject = activeCameraStreams[0];
                      }
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 bg-n-10/40 flex items-center justify-center">
                    <p className="text-lg font-bold">Camera 1 (Loading...)</p>
                  </div>
                )}
              </div>
            </div>

            {/* Camera 2 */}
            <div className="relative p-0.5 rounded-2xl bg-conic-gradient">
              <div className="relative bg-n-8 rounded-[1rem] p-4 h-[300px] overflow-hidden">
                <canvas
                  ref={camera2CanvasRef}
                  className="w-full h-full object-cover"
                  width={670}
                  height={380}
                />
                <div className="absolute top-4 left-4">
                  <p className="text-sm font-bold text-color-1">
                    Camera 2 (Processed)
                  </p>
                </div>
              </div>
            </div>

            {/* Remaining cameras */}
            {cameras.slice(2).map((cam) => (
              <div
                key={cam}
                className="relative p-0.5 rounded-2xl bg-conic-gradient"
              >
                <div className="relative bg-n-8 rounded-[1rem] p-4 h-[300px] overflow-hidden">
                  <div className="absolute inset-0 bg-n-10/40 flex items-center justify-center">
                    <p className="text-lg font-bold">Camera {cam}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Single View */}
        {viewMode === "single" && (
          <div className="relative w-[80%] mx-auto">
            <div className="relative p-0.5 rounded-2xl bg-conic-gradient">
              <div className="relative bg-n-8 rounded-[1rem] p-4 h-[500px] overflow-hidden">
                {currentCamera === 0 && activeCameraStreams[0] ? (
                  <video
                    className="w-full h-full object-cover"
                    autoPlay
                    playsInline
                    muted
                    ref={(video) => {
                      if (video && !video.srcObject && activeCameraStreams[0]) {
                        video.srcObject = activeCameraStreams[0];
                      }
                    }}
                  />
                ) : currentCamera === 1 ? (
                  <canvas
                    ref={camera2CanvasRef}
                    className="w-full h-full object-cover"
                    width={670}
                    height={380}
                  />
                ) : (
                  <div className="absolute inset-0 bg-n-10/40 flex items-center justify-center">
                    <p className="text-lg font-bold">
                      Camera {currentCamera + 1}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Camera Navigation */}
            <div className="flex justify-center mt-8 gap-4">
              <Button
                onClick={() =>
                  handleCameraChange(
                    (currentCamera - 1 + cameras.length) % cameras.length
                  )
                }
              >
                Previous
              </Button>
              <div className="flex items-center gap-2">
                {cameras.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all ${
                      currentCamera === index
                        ? "bg-color-1 scale-125"
                        : "bg-n-6"
                    }`}
                    onClick={() => handleCameraChange(index)}
                  />
                ))}
              </div>
              <Button
                onClick={() =>
                  handleCameraChange((currentCamera + 1) % cameras.length)
                }
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
      <BackgroundCircles />
    </Section>
  );
};

export default LiveCamera;
