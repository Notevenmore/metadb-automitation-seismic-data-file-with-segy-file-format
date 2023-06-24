import Highlight from 'react-highlight';
import Container from '../../components/container/container';

export default function TopBarPage() {
  return (
    <Container>
      <div className="flex flex-col space-y-2">
        <div className="text-4xl font-bold">Sidebar Component</div>
        <ul className="list-disc px-10">
          <code>
            <li className="pt-1">half: true || false</li>
          </code>
        </ul>
        <h3 className="text-xl font-bold">Example</h3>
        <p>
          Half is if you want the navbar to be half the height instead of the
          full
        </p>
        <Highlight className="html rounded-md border-2">
          {'<Sidebar \n\thalf={true} \n/>'}
        </Highlight>
      </div>
    </Container>
  );
}
