import Draft from "../dummy-data/draft"
import TableComponent from "../components/table/table"
import Container from "../components/container/container"

export default function DraftPage() {
    return(
        <Container>
            <Container.TitleBack>
                Draft
            </Container.TitleBack>
            <TableComponent
                header={Draft.header}
                content={Draft.content}
            />
        </Container>
    )
}