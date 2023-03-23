import Image from "next/image";
import Buttons from "../../components/buttons/buttons";
import Container from "../../components/container/container";
import { getLayoutBlank } from "../../layout/getLayout";

AccountApprovalPage.getLayout = getLayoutBlank;

export default function AccountApprovalPage() {
	return (
		<Container>
			<div className="full-height flex flex-col items-center justify-center gap-y-[150px]">
				<div className="flex flex-col items-center gap-y-10">
					<div className="text-[128px] leading-[56px]">GTNDC</div>
					<div className="text-[24px] leading-[22px] text-[#737b7d] tracking-[.3px]">
						Geodwipa Teknika Nusantara Database Conversion
					</div>
				</div>
				<div className="text-[24px] leading-[29.5px] flex flex-col items-center text-center justify-center gap-y-5 max-w-[1117px]">
					Please wait while your account is being verified by the admin. You will get notification email
					through email that&apos;s used to make this account when your account has been confirmed and activated by
					the admin.
					<Buttons path="/login/signin" button_description="I understand" additional_styles="bg-primary text-[16px]" />
				</div>
				<div className="flex space-x-10">
					<Image src="/images/gtn_logo.png" width={130} height={66} alt="icon" />
					{/* <Image src="/images/gtn_logo_singleline.png" width={500} height={66} alt="icon" /> */}
				</div>
			</div>
		</Container>
	);
}
