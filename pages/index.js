import Buttons from "../components/buttons/buttons";
import FileIcon from "../public/icons/file.svg";
import { Divider } from "../components/float_dialog/float_dialog";
import Container from "../components/container/container";
import { useSelector } from "react-redux";
import TableComponent from "../components/table/table";
import draft from "../dummy-data/draft";
import { useEffect, useState } from "react";

export default function HomePage() {
    // if the search state is true change the view of the home page
	const searches = useSelector((state) => state.search.search);

	return <>{!searches ? <HomeSection /> : <SearchResult />}</>;
}

const HomeSection = () => {
	return (
		<section className="flex flex-col justify-center items-center w-full h-full">
			<section className="flex flex-col justify-around w-[944px] h-[426px] items-center">
				<FileIcon className="w-[114px] h-[132px]"></FileIcon>
				<h1 className="text-[24px] leading-[30px] font-semibold opacity-50 text-center">
					Choose the record of which data type to be shown by selecting from the side bar,
					<br></br>or drag and drop a document here to be uploaded
				</h1>
				<div className="flex justify-center">
					<Buttons path={"/"} button_description="Choose file manually"></Buttons>
				</div>
				<p className="text-center opacity-50">
					The document to be uploaded must be either PDF, XLSX, JPG, or PNG format.
				</p>
				<section className="flex justify-center items-center">
					<Divider additional_styles={"w-[284px]"}></Divider>
					<h1 className="text-[24px] font-semibold opacity-50 mx-[37px]">or</h1>
					<Divider additional_styles={"w-[284px]"}></Divider>
				</section>
				<section className="flex flex-row gap-x-3">
					<Buttons path={"/"} button_description="Make a new document"></Buttons>
					<Buttons path={"/"} button_description="View drafts"></Buttons>
					<Buttons path={"/"} button_description="Connect with database"></Buttons>
				</section>
			</section>
		</section>
	);
};

const SearchResult = () => {
    const [data, setData] = useState(draft.content);
    const searches = useSelector((state) => state.search.value)
    
    useEffect(() => {
        const name = searches.searchAll.toLocaleLowerCase();
		let temp = draft.content;
		temp = temp.filter((item) => {
			return item.name.toLocaleLowerCase().includes(name);
		});
		console.log("search", temp);
		setData(temp);
    }, [searches])

	return (
		<Container>
			<Container.Title>Search result</Container.Title>
            <TableComponent header={draft.header} content={data} />
		</Container>
	);
};
