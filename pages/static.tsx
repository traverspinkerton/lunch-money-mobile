import { useRouter } from "next/dist/client/router";
import Head from "next/head";
import { useEffect, useState } from "react";
import { BudgetData } from "../lib/lm-api";

export default function Budget() {
  const router = useRouter();
  const [month, setMonth] = useState();
  const [data, setData] = useState<BudgetData | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<boolean>();

  useEffect(() => {
    if (
      !document.cookie
        .split(";")
        .some((item) => item.split("=")[0] === "lm_secret")
    ) {
      router.push("/login");
    }
    const getData = async () => {
      try {
        const resp = await fetch("/api/budgets");
        const freshData = await resp.json();
        setData(freshData);
      } catch (error) {
        setError(true);
      }
      setLoading(false);
    };
    getData();
  }, []);

  if (loading) return <Layout>loading....</Layout>;
  if (error || !data) return <Layout>hmm something is wrong</Layout>;

  return (
    <Layout>
      <form>
        <select name="month" className="rounded w-full mb-4">
          {months.map((month, index) => (
            <option
              key={month}
              label={month}
              value={index}
              selected={index === new Date().getMonth()}
            />
          ))}
        </select>
      </form>
      <ul>
        {data.budgets.map((budget, index) => (
          <li
            className="mb-2 p-2 rounded shadow-sm bg-yellow-100 flex justify-between"
            key={`${budget.category_id}_${String(index)}`}
          >
            {budget.category_name}:{" "}
            <span
              className={
                Number(budget.amount.slice(1)) > 0
                  ? "text-green-500"
                  : "text-red-500"
              }
            >
              {budget.amount}
            </span>
          </li>
        ))}
      </ul>
    </Layout>
  );
}

const Layout: React.FC = ({ children }) => (
  <div className="bg-yellow-300 p-8 font-bold text-gray-800 max-w-lg mx-auto min-h-screen">
    <Head>
      <title>Budget</title>
      <link
        rel="apple-touch-icon"
        sizes="128x128"
        href="/apple-touch-icon.png"
      ></link>
    </Head>
    <h1 className="text-4xl font-black mb-4 text-yellow-600">Budget</h1>
    {children}
  </div>
);

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// export const getStaticProps : GetStaticProps = async ({ req, params }) {
//   if (req.cookies.lm_secret !== process.env.SECRET) {
//     return {
//       redirect: {
//         destination: "/login",
//         permanent: false,
//       },
//     };
//   }

//   const todaysMonth = new Date().getMonth();
//   const { budgets, total } = await getBudgetsForMonth();

//   return {
//     props: {
//       budgets,
//       total,
//     },
//   };
// }
