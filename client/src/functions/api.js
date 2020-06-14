//dependencies
import axios from 'axios'
import Cookies from 'js-cookie'
//configs
import { AUTH_COOKIE } from '../config/keys'

export const generalPostRequest = async (url, body = {}, method = 'post') => {
    const headers = {
        "Content-Type": "application/json"
    }
    const authCookie = Cookies.get(AUTH_COOKIE)

    if (authCookie)
        headers["x-auth-token"] = authCookie

    try {
        const res = await axios({
            method,
            url,
            headers,
            data: body
        })
        return res.data
    } catch (err) {
        console.log("Error has been occurred in POST request", err.response)
        if (err) return err.response
    }
}

export const generalGetRequest = async (url) => {
    const headers = {
        "Content-Type": "application/json"
    }
    const authCookie = Cookies.get(AUTH_COOKIE)

    if (authCookie)
        headers["x-auth-token"] = authCookie

    try {
        const res = await axios({
            method: "get",
            url,
            headers
        })
        return res.data
    } catch (err) {
        console.log("Error has been occurred in GET request", err.response)
        if (err) return err.response
    }
}
