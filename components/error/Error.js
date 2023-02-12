export default function Error({code, description, text}) {
    return (
        <>
            <h2>{code} | {description}</h2>
            <p>{text}</p>
        </>
    )
}