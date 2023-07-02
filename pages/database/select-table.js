import Button from '../../components/button';
import Container from '../../components/container';

export default function SelectTable() {
  return (
    <Container>
      <Container.Title back>Connect with database</Container.Title>
      <Container.Subtitle tab>
        Select a table to use from the list below to map the records in it to
        this app
      </Container.Subtitle>
      <div className="flex flex-row gap-x-3 items-center justify-center">
        <Button
          path="/database/new-document"
          button_description="Next"
          additional_styles="bg-primary"
        />
        <Button path="" button_description="Cancel" additional_styles="" />
      </div>
    </Container>
  );
}
