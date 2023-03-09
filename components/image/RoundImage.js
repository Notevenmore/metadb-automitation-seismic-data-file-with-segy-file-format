export default function RoundImage({ source, size, alt }) {
    return (
        <>
            <img
                className="object-scale-none rounded-full"
                src={source}
                style={size}
                alt="profile"
            />
        </>
    );
}
