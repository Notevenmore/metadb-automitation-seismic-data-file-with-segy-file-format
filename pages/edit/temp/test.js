import {useEffect, useState} from 'react';

const Test = () => {
  const [originaldata, setoriginaldata] = useState(
    'ID of the current inseted data is: 32',
  );
  const [data, setdata] = useState('ID of the current inseted data is: 32');
  const [dateTest, setdateTest] = useState('29 December 2023');
  const [originaldate, setoriginaldate] = useState('29 December 2023');
  const [changed, setchanged] = useState(false);
  const [easteregg, seteasteregg] = useState(false);
  const key = 'helloworld';
  const [hehe, sethehe] = useState({
    hello: 1,
    [key]: 2,
    ['hi dunia' + 5 * 3]: 3,
  });

  const reseteverything = e => {
    e.preventDefault();
    setdata(originaldata);
    setdateTest(originaldate);
    setchanged(false);
  };

  const convertDate = e => {
    e.preventDefault();
    const str = data;
    let final = str.split(':');
    setdata(final);
    const input = dateTest;
    const parts = input.split(' ');
    const day = parts[0];
    const month = parts[1];
    const year = parts[2];
    const date = new Date(`${month}-${day}-${year}`);
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}/${date.getFullYear()}`;
    console.log(formattedDate);
    const tests = null;
    setdateTest(formattedDate);
    console.log(eval(tests) || 'hello');
    setchanged(true);
  };

  const saveDoc = async e => {
    e.preventDefault();
    // console.log("trying to PUT")
    // await fetch(`${config["printed_well_report"]["view"]}26`, {
    //     method: "PUT",
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify(initData)
    // }).then(res => {
    //     if (res.status !== 200) {
    //         throw res.statusText || "Something happened while updating (PUT) a record which resulted in failure. Please contact maintainer."
    //     }
    //     console.log("success")
    // })
    seteasteregg(true);
  };

  useEffect(() => {
    console.log(process.env.NEXT_PUBLIC_BACKEND_URL);
  }, []);

  return data ? (
    <div className="space-y-3">
      <p>
        {changed
          ? JSON.stringify(parseInt(data[data.length - 1].trim()))
          : JSON.stringify(data)}
      </p>
      <button
        disabled
        onClick={saveDoc}
        className="p-2 border-black border-2 disabled:opacity-50">
        hehe u no touch touch this button no
      </button>
      {easteregg ? <p>keras kepala amat bang 😭</p> : null}
      <p>{String(dateTest)}</p>
      <button
        onClick={convertDate}
        className="p-2 border-black border-2 disabled:opacity-50"
        disabled={changed}>
        {changed
          ? 'press the button below to do it again'
          : 'but u can touch this one to convert the date above'}
      </button>
      {changed ? (
        <button
          onClick={reseteverything}
          className="p-2 border-black border-2 disabled:opacity-50">
          do it again yay
        </button>
      ) : null}
      <div>
        <p>{JSON.stringify(hehe)}</p>
        <p>{String(hehe['hehe'])}</p>
        <p>
          {JSON.stringify({
            bibliography: {
              workspace: 'http://localhost:8080/api/v1/bibliography-workspace/',
              afe: 'http://localhost:8080/api/v1/bibliography-afe/',
              view: 'http://localhost:8080/api/v1/bibliography/',
              workspace_holder_key: 'bibliography_id',
            },
            printed_well_report: {
              workspace:
                'http://localhost:8080/api/v1/print-well-report-workspace/',
              afe: 'http://localhost:8080/api/v1/print-well-report-workspace-afe/',
              view: 'http://localhost:8080/api/v1/print-well-report/',
              workspace_holder_key: 'print_well_report_id',
            },
            services: {sheets: 'http://localhost:5050'},
          })}
        </p>
      </div>
    </div>
  ) : (
    <p>hehe</p>
  );
};

export async function getServerSideProps(context) {
  const url = JSON.stringify(process.env.ENDPOINTS);
  const hello_h = JSON.parse(url);
  console.log(hello_h);
  console.log(typeof JSON.parse(hello_h));
  // console.log('url link: ' + JSON.parse(url));
  // console.log(typeof url);
  // console.log(typeof JSON.parse(JSON.stringify(url)));
  // console.log(typeof JSON.parse(url));
  // console.log(JSON.stringify(url));
  return {
    props: {url: url}, // will be passed to the page component as props
  };
}

export default Test;
