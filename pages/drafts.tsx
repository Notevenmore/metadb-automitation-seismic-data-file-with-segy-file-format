import Draft from '../dummy-data/draft';
import TableComponent from '../components/table/table';
import Container from '../components/container';

export default function DraftPage() {
  let selected_rows = [[]];
  return (
    <Container>
      <Container.Title back>Draft</Container.Title>
      <TableComponent
        with_checkbox
        header={Draft.header}
        content={Draft.content}
        setSelectedRows={selected_rows}
      />
    </Container>
  );
}
