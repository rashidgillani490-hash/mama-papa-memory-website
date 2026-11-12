import QRCode from "qrcode";
import DreamyMemories from "./components/DreamyMemories";

export default async function Home() {
  const siteUrl = "https://mama-papa-memory-website.vercel.app";
  // Generated locally at build time. Family photos never reach a QR/image service.
  const qrDataUrl = await QRCode.toDataURL(siteUrl, {
    width: 280, margin: 3, errorCorrectionLevel: "M",
    color: { dark: "#403938", light: "#fffaf3" },
  });
  return <DreamyMemories siteUrl={siteUrl} qrDataUrl={qrDataUrl} />;
}
