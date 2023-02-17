import Buttons, { Buttons_Sidebar } from '../components/buttons/buttons'
import Well_sample_core from '../public/icons/well_sample_core.svg'

export default function Home() {
  const tableData = {
    header: ["id", "email", "first_name", "last_name", "avatar"],
    content: [
      {
        "id": 1,
        "email": "george.bluth@reqres.in",
        "first_name": "George",
        "last_name": "Bluth",
        "avatar": "https://reqres.in/img/faces/1-image.jpg"
      },
      {
        "id": 2,
        "email": "janet.weaver@reqres.in",
        "first_name": "Janet",
        "last_name": "Weaver",
        "avatar": "https://reqres.in/img/faces/2-image.jpg"
      }
    ]
  }
  const dropdownItems = ['Demo item 1', 'Demo item 2', 'Demo item 3', 'Demo item 4', 'Demo item 5', 'Demo item 6', 'Demo item 7', 'Demo item 8', 'Demo item 9']
  return (
    <div className="flex flex-col h-screen text-[14.5px]">
      <div className="w-full flex flex-auto">
        <div className='flex flex-col flex-grow overflow-auto'>
          <div className='flex flex-col space-y-2 py-5 px-10'>
            <h2 className='text-4xl font-bold'>Page demo and Component Documentations</h2>
            <br></br>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vulputate mattis tortor sed bibendum. Nunc accumsan velit tortor, vulputate tempor ligula gravida eget. Nunc quam nisl, posuere ut mauris et, lobortis ullamcorper nunc. Mauris fermentum tincidunt porttitor. Nunc ac lacinia lectus, vitae mattis ex. Curabitur eget porttitor diam. Aliquam interdum suscipit urna, a semper dui pellentesque id. Cras justo nibh, cursus et sem sed, interdum pulvinar est. Nunc ut commodo nunc. Etiam ut justo tincidunt, egestas neque at, maximus erat. Maecenas maximus erat lacus, eget ultricies neque pulvinar at. Mauris sagittis tortor vel erat pharetra tempor. Integer facilisis, urna sed consectetur volutpat, justo lectus venenatis risus, laoreet bibendum mi ex vel leo. Duis in nibh dui. Vestibulum pretium at metus quis pretium. Suspendisse enim libero, posuere sed magna ac, placerat placerat mauris.
            </p>
            <br></br>
            <p>
              Press the buttons present in the sidebar or press one of the buttons below to start viewing the detailed documentations of the components
            </p>
            <div className='flex flex-col space-y-2'>
              <Buttons path={'/components/button'} button_description='Buttons documentation'><Well_sample_core className='w-4 h-4' /></Buttons>
              <Buttons path={'/components/table'} button_description='Table documentation'><Well_sample_core className='w-4 h-4' /></Buttons>
              <Buttons path={'/components/input'} button_description='Input form documentation'><Well_sample_core className='w-4 h-4' /></Buttons>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
