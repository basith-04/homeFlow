const PlaneIcon = ({ size = 20, color = '#3660F9' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21 4 19.5 2.5S18 2 16.5 3.5L13 7 4.8 5.2a.5.5 0 0 0-.5.3l-.9 2.3a.5.5 0 0 0 .1.6L8 11l-2 3H4l-1 1 3 2 2 3 1-1v-2l3-2 2.5 3.5a.5.5 0 0 0 .6.1l2.3-.9a.5.5 0 0 0 .3-.5z" />
  </svg>
);

export default PlaneIcon;
