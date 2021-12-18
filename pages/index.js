import Head from "next/head";
import { getBudgetsForMonth } from "../lib/lm-api";

export default function Budget({ budgets, total }) {
  return (
    <div className="bg-yellow-300 p-8 font-bold text-gray-800 max-w-lg mx-auto">
      <Head>
        <title>Budget</title>
        <link
          rel="apple-touch-icon"
          sizes="128x128"
          href="/apple-touch-icon.png"
        ></link>
      </Head>
      <h1 className="text-4xl font-black mb-4 text-yellow-600">Budget</h1>
      {!budgets.length ? (
        <p>hmm something is wrong</p>
      ) : (
        <ul>
          {budgets.map((budget, index) => (
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
      )}
      <h3 className="text-2xl font-black my-4 text-yellow-600">Total</h3>
      <li className="mb-2 p-2 rounded shadow-sm bg-yellow-100 flex justify-between">
        Budgeted:
        <span>
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(total.budgeted)}
        </span>
      </li>
      <li className="mb-2 p-2 rounded shadow-sm bg-yellow-100 flex justify-between">
        Spent:
        <span>
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(total.spent)}
        </span>
      </li>
      <li className="mb-2 p-2 rounded shadow-sm bg-yellow-100 flex justify-between">
        {total.spent > total.budgeted
          ? `${new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(total.spent - total.budgeted)} over budget`
          : `${new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(total.budgeted - total.spent)} under budget`}
      </li>
    </div>
  );
}

export async function getStaticProps() {
  const todaysMonth = new Date().getMonth();
  const { budgets, total } = await getBudgetsForMonth();

  return {
    props: {
      budgets,
      total,
    },
    revalidate: 1,
  };
}
