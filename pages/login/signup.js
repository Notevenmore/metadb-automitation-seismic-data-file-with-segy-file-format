import Input from "../../components/input_form/input";
import Buttons from "../../components/buttons/buttons";
import { getLayoutBlank } from "../../layout/getLayout";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useEffect } from "react";

SignUpPage.getLayout = getLayoutBlank;

export default function SignUpPage({ setTitle }) {
    setTitle("Sign up")
    const user = useSelector((state) => state.user.user)
    const router = useRouter()
    useEffect(() => {
        if (user.email) {
            router.push("/")
        }
    }, [])
    return (
        <div className="md:h-screen flex flex-col-reverse my-10
         md:flex-row md:my-0 items-center justify-center m-auto gap-y-5">
            <div className="px-[50px] flex flex-col gap-y-6">
                <div id="title" className="max-md:text-center">
                    <p className="text-[100px] leading-[100px] font-bold">MetaDB</p>
                    <p className="text-xl">Effectively Cataloging and Managing E&amp;P Physical Assets</p>
                    <div className="border border-b-[#d9d9d9] mt-2"></div>
                </div>
                <div className="max-md:text-center text-[30px] font-bold">Sign up</div>
                <form className="flex flex-col gap-y-4 w-full text-[14px] md:pr-10">
                    <div className="flex flex-row gap-x-4 w-full">
                        <Input
                            label="First Name"
                            label_loc="above"
                            type="text"
                            name={"firstName"}
                            placeholder={"First Name"}
                            required={true}
                            additional_styles="space-y-1 flex-1"
                            additional_styles_label="w-full"
                            additional_styles_input="bg-[#ededed]"
                        />
                        <Input
                            label="Last Name"
                            label_loc="above"
                            type="text"
                            name={"lastName"}
                            placeholder={"Last Name"}
                            required={true}
                            additional_styles="space-y-1 flex-1"
                            additional_styles_label="w-full"
                            additional_styles_input="bg-[#ededed]"
                        />
                    </div>
                    <Input
                        label="Email"
                        label_loc="above"
                        type="email"
                        name={"email"}
                        placeholder={"E-mail"}
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
                        required={true}
                        additional_styles="space-y-1 text-[14px]"
                        additional_styles_input="bg-[#ededed]"
                    />
                    <Input
                        label="Re-enter Password"
                        label_loc="above"
                        type="password"
                        name={"rePassword"}
                        placeholder={"password"}
                        required={true}
                        additional_styles="space-y-1 text-[14px]"
                        additional_styles_input="bg-[#ededed]"
                    />
                    <div className="flex flex-col max-md:items-center gap-y-3">
                        <Buttons
                            path="/login/account-approval"
                            button_description="Sign Up"
                            additional_styles="px-12 py-1 mt-4 bg-primary"
                        />
                        <div className="flex flex-row gap-x-1 text-[12px]">
                            Already have an account?
                            <Link href="/login/signin" className="text-link">
                                Sign in now
                            </Link>
                        </div>
                    </div>

                </form>
            </div>
            <div className="w-[50%] px-[100px] flex flex-row justify-center">
                <div className="min-w-[400px] space-y-3">
                    <Image src="/images/metadbpng.png" alt="MetaDB logo" className="select-none pointer-events-none" width={400} height={400} />
                    <p className="text-center">&copy; Geodwipa Teknika Nusantara 2023</p>
                </div>
            </div>
        </div>
    );
}
