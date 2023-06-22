import axios from "axios"
import { redirect } from "next/navigation"
import Router, { useRouter } from "next/router"
import { parseCookies } from "nookies"
import { useSelector } from "react-redux"

function TokenExpired(err) {
    console.log(err)
    const code = (err.response && err.response.status) ?? 400
    if(code === 401 || code === 402) {
        Router.push('/login/signin')
        // window.location.href = '/login/signin'
    }
}

const cookie = parseCookies().user_data

async function getProfiles () {
    try{
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_AUTH}/profile/list`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(cookie).access_token}`
            }
        })
        const data = res.data.data
        return data
        console.log(data)
    } catch (err) {
        TokenExpired(err)
        console.log(err, code)
    }
}

async function getProfile (userId) {
    try{
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_AUTH}/profile/${userId}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(cookie).access_token}`
            }
        })
        const data = res.data.data
        return data
        console.log(data)
    } catch (err) {
        TokenExpired(err)
        console.log(err)
    }
}

async function removeProfile (userId) {
    try{
        const res = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_AUTH}/profile/${userId}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(cookie).access_token}`
            }
        })
        const data = res.data.data
        return data
        console.log(data)
    } catch (err) {
        console.log(err)
        TokenExpired(err)
    }
}

async function updateProfile (body) {
    try{
        const res = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_AUTH}/profile`,body, {
            headers: {
                Authorization: `Bearer ${JSON.parse(cookie).access_token}`
            },
            // data: body
        })
        const data = res.data.data
        return data
        console.log(data)
    } catch (err) {
        console.log(err)
        TokenExpired(err)
    }
}

async function addProfile (body) {
    try{
        const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_AUTH}/profile/new`,body, {
            headers: {
                Authorization: `Bearer ${JSON.parse(cookie).access_token}`
            },
            // data: body
        })
        const data = res.data.data
        return data
        console.log(data)
    } catch (err) {
        console.log(err)
        TokenExpired(err)
        return err
    }
}


export {getProfiles, getProfile, removeProfile, updateProfile, addProfile}