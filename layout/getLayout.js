import Blank from "./Blank";
import LayoutIcon from "./LayoutIcon";
import LayoutWidget from './LayoutWidget'

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function checkAuth(){
    const user = useSelector((state) => state.user.user)
    const router = useRouter()
    useEffect(() => {
        if(!user.email || user.email === "null") router.push("/login/signin")
    })
}

function getLayoutBlank(page) {
    return(<Blank>{page}</Blank>)
}

function getLayoutIcon(page) {
    return(<LayoutIcon>{page}</LayoutIcon>)
}

function getLayoutWidget(page) {
    return(<LayoutWidget>{page}</LayoutWidget>)
}

export {getLayoutBlank, getLayoutIcon, getLayoutWidget, checkAuth}