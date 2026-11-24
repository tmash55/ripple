import { qrMatrix } from "@/lib/qr";

/** Server-rendered QR code: pure black on white, with the quiet zone built in. */
export default function QrCode({
  value,
  className,
  label,
}: {
  value: string;
  className?: string;
  label?: string;
}) {
  const { size, quiet, path } = qrMatrix(value);
  const full = size + quiet * 2;
  return (
    <svg
      className={className}
      viewBox={`0 0 ${full} ${full}`}
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      role="img"
      aria-label={label ?? `QR code for ${value}`}
      data-qr-value={value}
    >
      <rect width={full} height={full} fill="#ffffff" />
      <path d={path} fill="#000000" />
    </svg>
  );
}
