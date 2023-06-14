// unimplemented yet
const init_data = async () => {
    if (!router.query.workspace_data) {
        throw "Record data not found, please try again. Additionally, try opening other records if the problem persists. If other records behave the same, please contact maintainer."
    }
    const workspace_data = await fetch(`${config[router.query.form_type]["afe"]}${router.query.workspace_data}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => Promise.all(
        [res.status, res.status !== 200 ? res.text() : res.json()]
    )).then(([status, res]) => {
        if (status !== 200) {
            throw `Service returned with status ${status}: ${res}`
        }
        return res
    })

    const data = await fetch(`${config[router.query.form_type]["workspace"]}${router.query.workspace_data}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => Promise.all(
        [res.status, res.status !== 200 ? res.text() : res.json()]
    )).then(([status, res]) => {
        if (status !== 200) {
            throw `Service returned with status ${status}: ${res}`
        }
        return res
    })

    // if data is not null (workspace is not empty), then get every data details within the workspace.
    // since the 'data' variable above only holds the ids of the data, along with the ppdm guid it's referencing
    // to and the workspace afe number it's referencing to. 
    let final = []
    // let ppdm_guids = []
    if (data) {
        for (const pwr_id of data) {
            const data_details = await fetch(`${config[router.query.form_type]["view"]}${pwr_id.pwr_id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(res => Promise.all(
                [res.status, res.status !== 200 ? res.text() : res.json()]
            )).then(([status, res]) => {
                if (status !== 200) {
                    throw `Service returned with status ${status}: ${res}`
                }
                return res
            })
            final.push(data_details[0])
        }
    }
    return { data: data, data_content: final, workspace_data: workspace_data[0] }
}

module.exports = {

}