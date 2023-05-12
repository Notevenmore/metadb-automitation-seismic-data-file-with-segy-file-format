

const Test = () => {
    const get_data_bibliography = async () => {
        const data = await fetch(`http://localhost:9090/api/v1/bibliography`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        }).then(response => {
            return response.json()
        }).then(response => {
            console.log(response)
            return response
        }).catch(err => { throw err })
    }
    get_data_bibliography()
    return (
        <div className="flex flex-col h-screen text-[14.5px]">
            <div className="min-h-[50px] flex items-center">
                Testing playground
            </div>
            <div className="w-full flex h-screen overflow-hidden border border-black">
            </div>
        </div>
    )
}

export default Test