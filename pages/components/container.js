import Highlight from "react-highlight";
import Container from "../../components/container/container";

export default function ContainerPage() {
	return (
		<Container>
			<div className="flex flex-col gap-y-3">
				<div className="text-4xl font-bold">Container</div>
				<p>
					As the pages have many similar style of title padding || margin, this component is made to
					generalize all the style those pages have.
				</p>
				<h3 className="text-xl font-bold">Container</h3>
				<p>This act as a container</p>
				<Highlight className="html rounded-md border-2">{"<Container> ... </Container>"}</Highlight>
				<h3 className="text-xl font-bold">Container.Title</h3>
				<p>This container will have a title. Props:</p>
				<ul className="list-disc px-10">
					<code>
						<li className="pt-1">back: true || false</li>
					</code>
				</ul>
                <p className="font-bold">Code:</p>
				<Highlight className="html rounded-md border-2">
					{"<Container> \n\t<Container.Title>Title</Container.Title> \n</Container>"}
				</Highlight>
                <p className="font-bold">Output:</p>
                <Container.Title>Title</Container.Title>
                <p>Adding a <code>back</code> as seen below, the title now will have a back button on the right side of the title which can be used to go back to previous page</p>
                <p className="font-bold">Code:</p>
                <Highlight className="html rounded-md border-2">
					{"<Container> \n\t<Container.Title back>Title</Container.Title> \n</Container>"}
				</Highlight>
                <p className="font-bold">Output:</p>
                <Container.Title back>Title Back</Container.Title>
				<h3 className="text-xl font-bold">Container.Subtitle</h3>
				<p>
					This will add a subtitle into the container. Props:
				</p>
                <ul className="list-disc px-10">
					<code>
						<li className="pt-1">tab: true || false</li>
					</code>
				</ul>
                <p className="font-bold">Code:</p>
				<Highlight className="html rounded-md border-2">
					{
						"<Container> \n\t<Container.Title>Title</Container.Title> \n\t<Container.Subtitle>subtitle</Container.Subtitle> \n</Container>"
					}
				</Highlight>
                <p className="font-bold">Output:</p>
                <p>
                    Adding a <code>tab</code> as seen below, will align the subtitle to the title if it contains a back button inside
                </p>
                <p className="font-bold">Code:</p>
                <Container.Title>Title</Container.Title>
                <Container.Subtitle>Subtitle here</Container.Subtitle>
                <Highlight className="html rounded-md border-2">
					{
						"<Container> \n\t<Container.Title back>Title</Container.Title> \n\t<Container.Subtitle tab>subtitle</Container.Subtitle> \n</Container>"
					}
				</Highlight>
                <p className="font-bold">Output:</p>
                <Container.Title back>Title</Container.Title>
                <Container.Subtitle tab>Subtitle here</Container.Subtitle>
			</div>
		</Container>
	);
}
