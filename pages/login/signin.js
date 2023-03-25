import Input from "../../components/input_form/input";
import Buttons from "../../components/buttons/buttons"
import { getLayoutBlank } from "../../layout/getLayout";
import Link from "next/link";
import Image from "next/image";
import { getAllRoles, getLogin } from "../../services/user";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { setUser } from "../../store/userSlice";

SignInPage.getLayout = getLayoutBlank;

export default function SignInPage() {
    const [Error, setError] = useState("")
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    })
    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const dispatch = useDispatch()
    const router = useRouter()
    const handleSignIn = async () => {
        try {
            await getLogin(loginData.email, loginData.password).then(
                (res) => {
                    const { succeed, data } = res
                    if (succeed) {
                        console.log(data.data)
                        dispatch(setUser(data.data))
                        router.push('/')
                        return;
                    }
                    console.log(data)
                    return;
                }
            )
        } catch (error) {
            setError(String(error))
        }
    }

    return (
        <div className="h-screen flex flex-col-reverse my-10
         md:flex-row md:my-0 items-center justify-center m-auto gap-y-5">
            <div className="w-[589px] px-[50px] flex flex-col gap-y-6">
                <div id="title" className="max-md:text-center">
                    <div className="text-[100px] leading-[100px]">GTNDC</div>
                    <div>Geodwipa Teknika Nusantara Database Conversion</div>
                    <div className="border border-b-[#d9d9d9]"></div>
                </div>
                <div className="max-md:text-center text-[30px]">Sign in</div>
                <form className="flex flex-col gap-y-4 w-full md:pr-10">
                    <Input
                        label="Email"
                        label_loc="above"
                        type="email"
                        name={"email"}
                        placeholder={"E-mail"}
                        value={loginData.email}
                        onChange={(e) => handleChange(e)}
                        required={true}
                        additional_styles="space-y-1 text-[14px]"
                        additional_styles_input="bg-[#ededed]"
                    />
                    <Input
                        label="Password"
                        label_loc="above"
                        type="password"
                        name={"password"}
                        placeholder={"password"}
                        value={loginData.password}
                        onChange={(e) => handleChange(e)}
                        required={true}
                        additional_styles="space-y-1 text-[14px]"
                        additional_styles_input="bg-[#ededed]"
                    />
                    <div className="flex flex-row justify-between items-center text-[12px]">
                        <div className="flex flex-row gap-x-2 items-center">
                            <input type="checkbox" name="rememberMe" />
                            <div>Remember me</div>
                        </div>
                        <div className="text-link">Forgot your password?</div>
                    </div>
                    <div className={`flex items-center space-x-2 fixed top-5 left-[50%] translate-x-[-50%] bg-red-500 text-white px-3 rounded-lg py-2 transition-all ${Error ? "" : "-translate-y-20"}`}>
                        <p>{Error}</p>
                        <Buttons additional_styles="px-1 py-1 text-black" path="" onClick={() => { setError("") }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </Buttons>
                    </div>
                    <div className="flex flex-col max-md:items-center gap-y-3">
                        <Buttons
                            path="" button_description="Sign In"
                            additional_styles="px-12 py-1 mt-4 bg-primary"
                            onClick={handleSignIn}
                        />
                        <div className="flex flex-row gap-x-1 text-[12px]">
                            Don&apos;t have an account?
                            <Link href="/login/signup" className="text-link">Sign up now</Link>
                        </div>
                    </div>
                </form>
            </div>
            <div className="w-[50%] px-[100px] flex flex-row justify-center">
                <div className="min-w-[400px]">
                    <Image src="/images/gtn_logo.png" alt="logo Bumi Siak Pusako" width={400} height={400} />
                </div>
            </div>
        </div>
    );
}
