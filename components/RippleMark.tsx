/** The Ripple mark — terracotta heart over two sage ripples. */
export default function RippleMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M16 14.8C13 12.2 10.6 10.4 10.6 8.2C10.6 6.5 12 5.2 13.6 5.2C14.6 5.2 15.5 5.7 16 6.5C16.5 5.7 17.4 5.2 18.4 5.2C20 5.2 21.4 6.5 21.4 8.2C21.4 10.4 19 12.2 16 14.8Z"
        fill="#c2704a"
      />
      <ellipse cx="16" cy="20.5" rx="6.5" ry="2.4" fill="none" stroke="#5d7050" strokeWidth="1.8" />
      <ellipse cx="16" cy="21.8" rx="11.5" ry="4.2" fill="none" stroke="#5d7050" strokeWidth="1.4" opacity="0.5" />
    </svg>
  );
}
