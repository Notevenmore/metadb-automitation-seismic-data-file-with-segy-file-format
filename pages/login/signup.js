import Input from "../../components/input_form/input";
import Buttons from "../../components/buttons/buttons";
import { getLayoutBlank } from "../../layout/getLayout";
import Link from "next/link";

SignUpPage.getLayout = getLayoutBlank;

export default function SignUpPage() {
    return (
        <div className="h-screen flex flex-col-reverse my-10 md:flex-row md:my-0 items-center justify-center m-auto gap-y-10">
            <div className="w-[589px] px-[50px] flex flex-col gap-y-6">
                <div id="title">
                    <div className="text-[100px] leading-[100px]">KEIDC</div>
                    <div>Kangean Energy Indonesia Database Conversion</div>
                    <div className="border border-b-[#d9d9d9]"></div>
                </div>
                <div className="text-[30px]">Sign up</div>
                <form className="flex flex-col gap-y-4 w-full text-[14px] pr-10">
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
                </form>
            </div>
            <div className="w-[50%] px-[100px] flex flex-row justify-center">
                <img
                    src="/images/keidc-big-logo.png"
                    alt="KEIDC"
                    className="w-full lg:w-[250px]"
                />
            </div>
        </div>
    );
}
