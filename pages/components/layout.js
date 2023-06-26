import Highlight from 'react-highlight';
import Container from '../../components/container/container';

export default function LayoutPage() {
  return (
    <Container>
      <div className="flex flex-col gap-y-3">
        <div className="text-4xl font-bold">Layout</div>
        <p>
          For the layout of the component, define it in the Layout folder on the
          root folder. The sidebar and topbar can be used however you want to
          form the layout. For the page to use a different layout than what is
          defined in the <code>_app.js</code> file you can find{' '}
          <code>getLayout</code> file in the Layout folder. Inside the file
          define the function to define the multiple layouts.
        </p>
        <h3 className="text-xl font-bold">getLayout.js</h3>
        <p>
          You can define however much layout you have inside{' '}
          <code>getLayout</code> file.
        </p>
        <Highlight className="html rounded-md border-2">
          {
            "import LayoutIcon from './LayoutIcon' \n\nfunction getLayoutIcon(page) {return (<LayoutIcon>{page}</LayoutIcon>)"
          }
        </Highlight>
        <h3 className="text-xl font-bold">Component.js</h3>
        <p>
          Inside the file where you want a different layout, you need to call
          the function you defined outside of the component function.
        </p>
        <Highlight className="html rounded-md border-2">
          {
            'Component.getLayout = getLayoutIcon; \n\nexport default function Component(){}'
          }
        </Highlight>
        <h3 className="text-xl font-bold">_app.js</h3>
        <p>
          For the app to recognize a different layout you had set for different
          pages, you need to set it as such. In the case below,{' '}
          <code>getLayoutBlank</code> is the default layout you are applying for
          all the pages if there is no <code>Component.getLayout</code> detected
          in any of the pages.
        </p>
        <Highlight className="html rounded-md border-2">
          {
            'const getLayout = Component.getLayout || getLayoutBlank \n\nreturn getLayout(<Component {...pageProps}>)'
          }
        </Highlight>
        <h3 className="text-xl font-bold">Reference</h3>
        <p>
          For reference, go{' '}
          <a
            href="https://nextjs.org/docs/basic-features/layouts"
            target="_blank"
            className="text-link"
            rel="noreferrer">
            here
          </a>
          .
        </p>
      </div>
    </Container>
  );
}
