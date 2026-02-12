// Simple QR code SVG generator for a URL
// Uses a minimal approach - generates a QR code pattern as an SVG

const QRCode = ({ url, size = 120 }: { url: string; size?: number }) => {
  // Use a Google Charts API to generate QR code as an image
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}&bgcolor=transparent&color=4a3728&margin=0`;

  return (
    <img
      src={qrUrl}
      alt="QR Code"
      width={size}
      height={size}
      loading="lazy"
      className="mx-auto"
    />
  );
};

export default QRCode;
