import { useEffect, useRef, useState } from "react";
import DeliveryModal from "./DeliveryModal";
import { useNavigate } from "react-router-dom";


// Styles
import "./QrStyles.css";

// Qr Scanner
import QrScanner from "qr-scanner";
import QrFrame from "../assets/qr-frame.svg";

interface QrReaderProps {
  openQr: boolean;
  setOpenQr: (value: boolean) => void;
}

const QrReader2: React.FC<QrReaderProps> = ({ openQr, setOpenQr }) => {
 
  // QR States
  const scanner = useRef<QrScanner>();
  const videoEl = useRef<HTMLVideoElement>(null);
  const qrBoxEl = useRef<HTMLDivElement>(null);
  // @ts-ignore
  const [qrOn, setQrOn] = useState<boolean>(true);
  const canvasEl = useRef<HTMLCanvasElement>(null); // New canvas element ref


  // Result
  const [scannedResult, setScannedResult] = useState<string | undefined>("");
  const [capturedImage, setCapturedImage] = useState<string | null>(null); // Store the captured image
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const navigate = useNavigate();

  // Success
  const onScanSuccess = (result: QrScanner.ScanResult) => {
    // 🖨 Print the "result" to browser console.
    console.log(result);
    // ✅ Handle success.
    // 😎 You can do whatever you want with the scanned result.
    setScannedResult(result?.data);

    console.log("aqui0")
    console.log(videoEl.current)
    console.log(canvasEl.current)

    if (videoEl.current && canvasEl.current) {
      console.log("aqui1")
      const video = videoEl.current;
      const canvas = canvasEl.current;
      const context = canvas.getContext("2d");

      // Set canvas size to match the video stream
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw the current video frame onto the canvas
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert the canvas to a base64 image
      const imageData = canvas.toDataURL("image/png");
      console.log("aqui2")
      console.log(imageData)
      console.log("aqui3")

      setCapturedImage(imageData); // Store the captured image

      setOpenQr(false)
      // setIsModalOpen(true);
      navigate("/delivery-validate", {
        state: { scannedResult: result?.data, capturedImage: imageData },
      });
    }
  };

  // Fail
  const onScanFail = (err: string | Error) => {
    // 🖨 Print the "err" to browser console.
    console.log(err);
  };

  useEffect(() => {
    if (videoEl?.current && !scanner.current) {
      // 👉 Instantiate the QR Scanner
      scanner.current = new QrScanner(videoEl?.current, onScanSuccess, {
        onDecodeError: onScanFail,
        // 📷 This is the camera facing mode. In mobile devices, "environment" means back camera and "user" means front camera.
        preferredCamera: "environment",
        // 🖼 This will help us position our "QrFrame.svg" so that user can only scan when qr code is put in between our QrFrame.svg.
        highlightScanRegion: true,
        // 🔥 This will produce a yellow (default color) outline around the qr code that we scan, showing a proof that our qr-scanner is scanning that qr code.
        highlightCodeOutline: true,
        // 📦 A custom div which will pair with "highlightScanRegion" option above 👆. This gives us full control over our scan region.
        overlay: qrBoxEl?.current || undefined,
      });

      // 🚀 Start QR Scanner
      scanner?.current
        ?.start()
        .then(() => setQrOn(true))
        .catch((err) => {
          if (err) setQrOn(false);
        });
    }

    // 🧹 Clean up on unmount.
    // 🚨 This removes the QR Scanner from rendering and using camera when it is closed or removed from the UI.
    return () => {
      if (!videoEl?.current) {
        scanner?.current?.stop();
      }
    };
  }, []);

    // Close modal
    const handleCloseModal = () => {
        setScannedResult("")
        setIsModalOpen(false);
        };

  return (
    <div className="qr-reader">
      {/* QR */}
      <video ref={videoEl}></video>
      <div ref={qrBoxEl} className="qr-box">
        <img
          src={QrFrame}
          alt="Qr Frame"
          width={256}
          height={256}
          className="qr-frame"
        />
      </div>
      {/* Hidden Canvas to Capture Snapshot */}
      <canvas ref={canvasEl} style={{ display: "none" }}></canvas>


      {/* Show Data Result if scan is success */}
      {scannedResult && (<>
        {/* <p
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 99999,
            color: "white",
          }}
        >
          Scanned Result: {scannedResult}
        </p> */}
        {/* Render the imported CustomDialog component */}
        <DeliveryModal
            open={isModalOpen}
            onClose={handleCloseModal}
            scannedResult={scannedResult}
          />
        </>
      )}
    </div>
  );
};

export default QrReader2;