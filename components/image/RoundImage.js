export default function RoundImage({source, size}) {
  return (
    <img
      className="object-scale-none rounded-full"
      src={source}
      style={size}
      alt="profile"
    />
  );
}
