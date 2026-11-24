import QRCode from "qrcode";

export type QrMatrix = {
  /** Modules per side, excluding the quiet zone. */
  size: number;
  /** Quiet-zone width in modules (the spec minimum is 4). */
  quiet: number;
  /** One SVG path covering every dark module, in module units, quiet zone included. */
  path: string;
};

/**
 * Builds a QR code as a single SVG path.
 *
 * Error correction Q (~25% recoverable) so a card still scans through
 * lamination glare, a crease, or a scuff.
 */
export function qrMatrix(text: string, quiet = 4): QrMatrix {
  const qr = QRCode.create(text, { errorCorrectionLevel: "Q" });
  const size = qr.modules.size;
  const data = qr.modules.data;
  let path = "";
  for (let y = 0; y < size; y++) {
    let x = 0;
    while (x < size) {
      if (!data[y * size + x]) {
        x++;
        continue;
      }
      // Merge horizontal runs so the path stays small and edges stay crisp.
      let run = 1;
      while (x + run < size && data[y * size + x + run]) run++;
      path += `M${x + quiet} ${y + quiet}h${run}v1h-${run}z`;
      x += run;
    }
  }
  return { size, quiet, path };
}
