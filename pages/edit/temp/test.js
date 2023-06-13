import React, { useEffect, useState } from 'react'
// import config from '../../config'

const Test = () => {
    const [originaldata, setoriginaldata] = useState("ID of the current inseted data is: 32")
    const [data, setdata] = useState("ID of the current inseted data is: 32")
    const [initData, setinitData] = useState({
        "ba_long_name": "batzz",
        "ba_type": "batzz",
        "area_id": "batzz",
        "area_type": "batzz",
        "field_name": "batzz",
        "well_name": "Lorem Ipsum",
        "id": 26,
        "uwi": "batzz",
        "title": "batzz",
        "creator_name": "batzz",
        "create_date": "12-Dec-2023",
        "media_type": "batzz",
        "document_type": "batzz",
        "item_category": "batzz",
        "item_sub_category": "batzz",
        "page_count": 12,
        "remark": "batzz",
        "data_store_name": "batzz",
        "data_store_type": "batzz",
        "source": "batzz",
        "qc_status": "batzz",
        "checked_by_ba_id": "batzz"
    })
    const [dateTest, setdateTest] = useState("12/11/2023")
    const [originaldate, setoriginaldate] = useState("12/11/2023")
    const [changed, setchanged] = useState(false)
    const [easteregg, seteasteregg] = useState(false)

    const reseteverything = (e) => {
        e.preventDefault()
        setdata(originaldata)
        setdateTest(originaldate)
        setchanged(false)
    }

    const convertDate = (e) => {
        e.preventDefault()
        const str = data
        let final = str.split(":")
        setdata(final)
        const input = dateTest;
        const parts = input.split("/");
        const day = parts[0];
        const month = parts[1];
        const year = parts[2];
        const date = new Date(`${month}-${day}-${year}`);
        const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;
        console.log(formattedDate);
        const tests = null
        setdateTest(formattedDate)
        console.log(eval(tests) || "hello")
        setchanged(true)
    }

    const saveDoc = async (e) => {
        e.preventDefault()
        // console.log("trying to PUT")
        // await fetch(`${config["printed_well_report"]["view"]}26`, {
        //     method: "PUT",
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify(initData)
        // }).then(res => {
        //     if (res.status !== 200) {
        //         throw res.statusText || "Something happened while updating (PUT) a record which resulted in failure. Please contact maintainer."
        //     }
        //     console.log("success")
        // })
        seteasteregg(true)
    }

    return (
        data ?
            <div className='space-y-3'>
                <p>{changed ? JSON.stringify(parseInt(data[data.length - 1].trim())) : JSON.stringify(data)}</p>
                <button disabled onClick={saveDoc} className='p-2 border-black border-2 disabled:opacity-50'>
                    hehe u no touch touch this button no
                </button>
                {easteregg ? <p>keras kepala amat bang 😭</p> : null}
                <p>{String(dateTest)}</p>
                <button onClick={convertDate} className='p-2 border-black border-2 disabled:opacity-50' disabled={changed}>
                    {changed ? "press the button below to do it again" : "but u can touch this one to convert the date above"}
                </button>
                {changed ?
                    <button onClick={reseteverything} className='p-2 border-black border-2 disabled:opacity-50'>
                        do it again yay
                    </button> : null}
            </div> : <p>hehe</p>
    )
}

export default Test